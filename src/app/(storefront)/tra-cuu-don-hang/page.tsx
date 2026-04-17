"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatDate } from "@/lib/format";
import type { Order } from "@/lib/database.types";
import { Search, Package, ShieldCheck, RefreshCw, CreditCard, Gift, ChevronRight } from "lucide-react";

const STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
  shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
};

const POLICIES = [
  { label: "Chính sách ưu đãi", href: "/chinh-sach/uu-dai", icon: Gift },
  { label: "Chính sách bảo hành", href: "/chinh-sach/bao-hanh", icon: ShieldCheck },
  { label: "Chính sách đổi trả", href: "/chinh-sach/doi-tra", icon: RefreshCw },
  { label: "Chính sách trả góp", href: "/chinh-sach/tra-gop", icon: CreditCard },
];

export default function OrderTrackingPage() {
  const supabase = createClient();
  const [q, setQ] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault(); if (!q.trim()) return;
    setLoading(true); setNotFound(false); setOrder(null);
    const { data } = await supabase.from("orders").select("*").or(`order_number.eq.${q.trim()},customer_phone.eq.${q.trim()}`).order("created_at", { ascending: false }).limit(1).single();
    setLoading(false);
    data ? setOrder(data) : setNotFound(true);
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* ── Hero section ── */}
      <div style={{ background: "linear-gradient(180deg, #155e35 0%, #1f8f4e 100%)" }}>
        <div className="max-w-[1200px] mx-auto px-4 pt-10 pb-14 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Chính sách & Tra cứu bảo hành</h1>
          <p className="text-sm text-white/60 mb-8">Tra cứu đơn hàng, bảo hành và các chính sách tại POLY Store</p>

          {/* Policy links */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {POLICIES.map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors"
              >
                <p.icon size={16} className="text-white/70 group-hover:text-white" />
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search card — overlapping hero ── */}
      <div className="max-w-[1200px] mx-auto px-4 -mt-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Tra cứu bảo hành</h2>
          <p className="text-sm text-gray-400 text-center mb-6">
            Nhập số điện thoại, mã đơn hàng hoặc số seri/imei để tra cứu
          </p>

          <form onSubmit={search} className="max-w-[560px] mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Nhập số điện thoại, mã đơn hoặc số seri/imei"
                  className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-500 transition-colors"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary px-8">
                {loading ? "..." : "Tra cứu"}
              </button>
            </div>
          </form>

          {/* Not found */}
          {notFound && (
            <div className="text-center py-10 mt-4">
              <Package className="mx-auto text-gray-200 mb-3" size={48} />
              <p className="text-sm text-gray-500">Không tìm thấy đơn hàng hoặc thông tin bảo hành.</p>
              <p className="text-xs text-gray-400 mt-1">Vui lòng kiểm tra lại thông tin hoặc <Link href="/lien-he" className="text-brand-500 hover:underline">liên hệ chúng tôi</Link></p>
            </div>
          )}

          {/* Order result */}
          {order && (
            <div className="mt-6 max-w-[700px] mx-auto">
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="p-5 border-b border-gray-200 flex justify-between items-start">
                  <div>
                    <p className="text-xs text-gray-400">Mã đơn hàng</p>
                    <p className="text-base font-bold text-brand-600">{order.order_number}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-xs font-medium ${STATUS[order.status]?.color}`}>
                    {STATUS[order.status]?.label}
                  </span>
                </div>
                <div className="p-5 border-b border-gray-100 text-sm space-y-1">
                  <p><span className="text-gray-400">Người nhận:</span> {order.customer_name}</p>
                  <p><span className="text-gray-400">SĐT:</span> {order.customer_phone}</p>
                  {order.customer_address && <p><span className="text-gray-400">Địa chỉ:</span> {order.customer_address}</p>}
                </div>
                <div className="p-5 divide-y divide-gray-100 text-sm">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="py-2 flex justify-between">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-gray-400">x{item.quantity}{item.variant && ` · ${item.variant}`}</p>
                      </div>
                      <p className="font-medium text-brand-600">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className="pt-3 flex justify-between text-base font-bold">
                    <span>Tổng</span>
                    <span className="text-brand-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
