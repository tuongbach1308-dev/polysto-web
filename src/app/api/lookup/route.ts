import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/lookup
 * Body: { q: string }
 *
 * Security:
 * - POST to avoid logging sensitive data in URL
 * - Rate limited (10 req/min per IP)
 * - Input validated (min 4 chars, alphanumeric + space/dash)
 * - Sensitive fields stripped (cost_price, sell_price, admin_notes)
 * - Phone numbers partially masked in response
 */

const webSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getAdminSupabase() {
  const url = process.env.ADMIN_SUPABASE_URL;
  const key = process.env.ADMIN_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// ── Rate limiting (in-memory, per IP, 10 req/min) ──
const rateMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateMap) {
    if (now > entry.resetAt) rateMap.delete(ip);
  }
}, 300_000);

/** Mask phone: 0815242433 → 0815***433 */
function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const clean = phone.replace(/\s/g, "");
  if (clean.length < 7) return "***";
  return clean.slice(0, 4) + "***" + clean.slice(-3);
}

/** Validate input: min 4 chars, only alphanumeric + space/dash/plus */
function isValidQuery(q: string): boolean {
  if (q.length < 4 || q.length > 50) return false;
  return /^[a-zA-Z0-9\s\-+]+$/.test(q);
}

export async function POST(request: NextRequest) {
  // Rate limit
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Quá nhiều yêu cầu, vui lòng thử lại sau." }, { status: 429 });
  }

  // Parse body
  let q: string;
  try {
    const body = await request.json();
    q = String(body.q || "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Validate
  if (!q || !isValidQuery(q)) {
    return NextResponse.json({ error: "Vui lòng nhập ít nhất 4 ký tự." }, { status: 400 });
  }

  const admin = getAdminSupabase();

  // ── Search website orders (safe fields only) ──
  const { data: rawWebOrder } = await webSupabase
    .from("orders")
    .select("order_number, customer_name, customer_phone, customer_address, items, subtotal, shipping_fee, total, status, payment_method, created_at")
    .or(`order_number.eq.${q},customer_phone.eq.${q}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const webOrder = rawWebOrder ? {
    ...rawWebOrder,
    customer_phone: maskPhone(rawWebOrder.customer_phone),
  } : null;

  // ── Search admin warranty by seri ──
  let warranty = null;
  let warrantyClaims: Record<string, unknown>[] = [];
  if (admin) {
    const { data: w } = await admin
      .from("warranty")
      .select("id, seri, product_name, product_type, customer_name, customer_phone, warranty_months, warranty_end, status, sale_date")
      .eq("seri", q)
      .maybeSingle();

    if (w) {
      warranty = {
        ...w,
        customer_phone: maskPhone(w.customer_phone),
      };
      const { data: claims } = await admin
        .from("warranty_claims")
        .select("claim_number, claim_date, claim_issue, claim_solution, claim_status, completed_at")
        .eq("warranty_id", w.id)
        .order("claim_date", { ascending: false });
      warrantyClaims = (claims || []) as Record<string, unknown>[];
    }
  }

  // ── Search admin orders by phone or seri ──
  let cleanAdminOrder = null;
  if (admin && !warranty) {
    const adminOrderFields = "id, customer_name, customer_phone, status, sale_date, created_at, order_items(seri, product_name, product_type, warranty_months, bao_test, pin_warranty, condition, capacity, color)";

    let rawOrder = null;

    // Try by phone
    const { data: orderByPhone } = await admin
      .from("orders")
      .select(adminOrderFields)
      .eq("customer_phone", q)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orderByPhone) {
      rawOrder = orderByPhone;
    } else {
      // Try by seri in order_items
      const { data: itemBySeri } = await admin
        .from("order_items")
        .select("order_id")
        .eq("seri", q)
        .limit(1)
        .maybeSingle();

      if (itemBySeri) {
        const { data: order } = await admin
          .from("orders")
          .select(adminOrderFields)
          .eq("id", itemBySeri.order_id)
          .maybeSingle();
        if (order) rawOrder = order;
      }
    }

    if (rawOrder) {
      cleanAdminOrder = {
        id: rawOrder.id,
        customer_name: rawOrder.customer_name,
        customer_phone: maskPhone(rawOrder.customer_phone),
        status: rawOrder.status,
        sale_date: rawOrder.sale_date || rawOrder.created_at,
        items: ((rawOrder as Record<string, unknown>).order_items as Record<string, unknown>[] || []).map((item: Record<string, unknown>) => ({
          seri: item.seri,
          product_name: item.product_name,
          product_type: item.product_type,
          warranty_months: item.warranty_months,
          bao_test: item.bao_test,
          pin_warranty: item.pin_warranty,
          condition: item.condition,
          capacity: item.capacity,
          color: item.color,
        })),
      };
    }
  }

  return NextResponse.json({
    webOrder,
    warranty,
    warrantyClaims,
    adminOrder: cleanAdminOrder,
  });
}
