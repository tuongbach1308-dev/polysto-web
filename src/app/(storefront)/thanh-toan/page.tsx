"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCart, getCartTotal, clearCart, getCheckoutItems } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type { OrderItem } from "@/lib/database.types";
import StepIndicator from "@/components/StepIndicator";

export default function CheckoutPage() {
  const supabase = createClient();
  const router = useRouter();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", payment: "cod" as "cod" | "bank_transfer" | "qr", notes: "" });

  useEffect(() => {
    const checkout = getCheckoutItems();
    const c = checkout.length > 0 ? checkout : getCart();
    if (!c.length) router.push("/gio-hang");
    setCart(c);
  }, [router]);

  const total = getCartTotal(cart);
  const ship = total >= 5000000 ? 0 : 30000;

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const { data, error } = await supabase.from("orders").insert({
      customer_name: form.name, customer_phone: form.phone, customer_email: form.email || null,
      customer_address: form.address, items: cart as unknown as Record<string, unknown>[],
      subtotal: total, shipping_fee: ship, total: total + ship, payment_method: form.payment, notes: form.notes || null,
    }).select().single();
    setLoading(false);
    if (error) { alert("Có lỗi xảy ra."); return; }
    clearCart();
    router.push(form.payment === "qr" ? `/thanh-toan/qr?order=${data.order_number}` : `/thanh-toan/thanh-cong?order=${data?.order_number}`);
  }

  const Input = ({ label, required, ...props }: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}{required && " *"}</label>
      <input {...props} required={required} className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 transition-colors" />
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <StepIndicator steps={["Giỏ hàng", "Đặt hàng", "Hoàn tất"]} currentStep={1} />
      <h1 className="text-xl font-bold text-gray-900 mt-4 mb-6">Thông tin đặt hàng</h1>
      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900">Người nhận</h2>
            <Input label="Họ và tên" required placeholder="Nguyễn Văn A" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Số điện thoại" required type="tel" placeholder="0xxx xxx xxx" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="Email" type="email" placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Địa chỉ *</label>
              <textarea required rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 transition-colors" placeholder="Số nhà, đường, quận/huyện, tỉnh/TP" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900">Thanh toán</h2>
            {[{ v: "cod", l: "Thanh toán khi nhận hàng (COD)" }, { v: "bank_transfer", l: "Chuyển khoản ngân hàng" }, { v: "qr", l: "QR Code" }].map((m) => (
              <label key={m.v} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${form.payment === m.v ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:bg-gray-50"}`}>
                <input type="radio" name="pay" value={m.v} checked={form.payment === m.v} onChange={(e) => setForm({ ...form, payment: e.target.value as typeof form.payment })} className="accent-brand-500" />
                <span className="text-sm font-medium">{m.l}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 p-5 sticky" style={{ top: "var(--sticky-offset)" }}>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Đơn hàng ({cart.length})</h2>
            <div className="divide-y divide-gray-100 text-sm max-h-[300px] overflow-y-auto">
              {cart.map((item, i) => (
                <div key={i} className="py-2.5 flex justify-between gap-2">
                  <div className="flex-1 min-w-0"><p className="font-medium line-clamp-1">{item.title}</p><p className="text-xs text-gray-400">x{item.quantity}{item.variant && ` · ${item.variant}`}</p></div>
                  <p className="font-medium text-brand-600 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-3 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Tạm tính</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Vận chuyển</span><span>{ship === 0 ? "Miễn phí" : formatPrice(ship)}</span></div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100"><span>Tổng</span><span className="text-brand-600">{formatPrice(total + ship)}</span></div>
            </div>
            <button type="submit" disabled={loading} className="mt-4 w-full btn-primary py-3">{loading ? "Đang xử lý..." : "Đặt hàng"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
