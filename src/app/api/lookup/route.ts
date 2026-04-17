import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/lookup?q=<phone|order_number|seri>
 *
 * Searches across:
 * 1. Website orders (polysto-web DB) — by order_number or customer_phone
 * 2. Admin warranty (polysto-app DB) — by seri
 * 3. Admin orders (polysto-app DB) — by customer_phone or seri in order_items
 *
 * Returns: { webOrder, warranty, adminOrder }
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

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  const admin = getAdminSupabase();

  // Search website orders
  const { data: webOrder } = await webSupabase
    .from("orders")
    .select("*")
    .or(`order_number.eq.${q},customer_phone.eq.${q}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Search admin warranty by seri
  let warranty = null;
  let warrantyClaims: unknown[] = [];
  if (admin) {
    const { data: w } = await admin
      .from("warranty")
      .select("id, seri, product_name, product_type, customer_name, customer_phone, warranty_months, warranty_end, status, sale_date, sell_price")
      .eq("seri", q)
      .maybeSingle();

    if (w) {
      warranty = w;
      // Fetch claims for this warranty
      const { data: claims } = await admin
        .from("warranty_claims")
        .select("id, claim_number, claim_date, claim_issue, claim_solution, claim_status, completed_at")
        .eq("warranty_id", w.id)
        .order("claim_date", { ascending: false });
      warrantyClaims = claims || [];
    }
  }

  // Search admin orders by phone or seri (if no warranty found by seri, try order_items)
  let adminOrder = null;
  if (admin && !warranty) {
    // Try by phone
    const { data: orderByPhone } = await admin
      .from("orders")
      .select("id, customer_name, customer_phone, status, total_amount, sale_date, created_at, order_items(id, seri, product_name, product_type, sell_price, warranty_months, condition, capacity, color)")
      .eq("customer_phone", q)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orderByPhone) {
      adminOrder = orderByPhone;
    } else {
      // Try by seri in order_items
      const { data: itemBySeri } = await admin
        .from("order_items")
        .select("order_id, seri, product_name, product_type, sell_price, warranty_months, condition, capacity, color")
        .eq("seri", q)
        .limit(1)
        .maybeSingle();

      if (itemBySeri) {
        const { data: order } = await admin
          .from("orders")
          .select("id, customer_name, customer_phone, status, total_amount, sale_date, created_at, order_items(id, seri, product_name, product_type, sell_price, warranty_months, condition, capacity, color)")
          .eq("id", itemBySeri.order_id)
          .maybeSingle();
        if (order) adminOrder = order;
      }
    }
  }

  // Clean admin order data — remove sensitive fields
  let cleanAdminOrder = null;
  if (adminOrder) {
    cleanAdminOrder = {
      id: adminOrder.id,
      customer_name: adminOrder.customer_name,
      customer_phone: adminOrder.customer_phone,
      status: adminOrder.status,
      sale_date: adminOrder.sale_date || adminOrder.created_at,
      items: ((adminOrder as Record<string, unknown>).order_items as Record<string, unknown>[] || []).map((item: Record<string, unknown>) => ({
        seri: item.seri,
        product_name: item.product_name,
        product_type: item.product_type,
        sell_price: item.sell_price,
        warranty_months: item.warranty_months,
        condition: item.condition,
        capacity: item.capacity,
        color: item.color,
      })),
    };
  }

  return NextResponse.json({
    webOrder: webOrder || null,
    warranty: warranty || null,
    warrantyClaims,
    adminOrder: cleanAdminOrder,
  });
}
