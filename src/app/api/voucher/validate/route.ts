import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const body = await request.json();
  const { code, subtotal } = body as { code: string; subtotal: number };

  if (!code || !subtotal) {
    return NextResponse.json({ error: "Mã giảm giá và tổng đơn hàng là bắt buộc" }, { status: 400 });
  }

  const { data: voucher, error } = await supabase
    .from("vouchers")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .single();

  if (error || !voucher) {
    return NextResponse.json({ error: "Mã giảm giá không hợp lệ" }, { status: 400 });
  }

  // Check expiry
  if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
    return NextResponse.json({ error: "Mã giảm giá đã hết hạn" }, { status: 400 });
  }

  // Check start date
  if (voucher.starts_at && new Date(voucher.starts_at) > new Date()) {
    return NextResponse.json({ error: "Mã giảm giá chưa có hiệu lực" }, { status: 400 });
  }

  // Check usage limit
  if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) {
    return NextResponse.json({ error: "Mã giảm giá đã hết lượt sử dụng" }, { status: 400 });
  }

  // Check min order
  if (subtotal < voucher.min_order) {
    const formatted = new Intl.NumberFormat("vi-VN").format(voucher.min_order);
    return NextResponse.json({ error: `Đơn hàng tối thiểu ${formatted}đ` }, { status: 400 });
  }

  // Calculate discount
  let discount = 0;
  if (voucher.type === "percent") {
    discount = Math.round(subtotal * voucher.value / 100);
    if (voucher.max_discount && discount > voucher.max_discount) {
      discount = voucher.max_discount;
    }
  } else {
    discount = voucher.value;
  }

  // Don't let discount exceed subtotal
  if (discount > subtotal) {
    discount = subtotal;
  }

  return NextResponse.json({
    discount,
    voucher_code: voucher.code,
    type: voucher.type,
    value: voucher.value,
  });
}
