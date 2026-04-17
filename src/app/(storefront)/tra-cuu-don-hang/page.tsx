"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/format";
import { Search, Package, ShieldCheck, RefreshCw, CreditCard, Gift, CheckCircle, AlertCircle, Clock } from "lucide-react";

const STATUS: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
  shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-700" },
  completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
};

const WARRANTY_STATUS: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  active: { label: "Còn bảo hành", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle },
  claimed: { label: "Đã bảo hành", color: "text-orange-600 bg-orange-50 border-orange-200", icon: AlertCircle },
  expired: { label: "Hết hạn", color: "text-gray-500 bg-gray-50 border-gray-200", icon: Clock },
  voided: { label: "Đã hủy", color: "text-red-500 bg-red-50 border-red-200", icon: AlertCircle },
};

const POLICIES = [
  { label: "Chính sách ưu đãi", href: "/chinh-sach/uu-dai", icon: Gift },
  { label: "Chính sách bảo hành", href: "/chinh-sach/bao-hanh", icon: ShieldCheck },
  { label: "Chính sách đổi trả", href: "/chinh-sach/doi-tra", icon: RefreshCw },
  { label: "Chính sách trả góp", href: "/chinh-sach/tra-gop", icon: CreditCard },
];

interface LookupResult {
  webOrder: Record<string, unknown> | null;
  warranty: Record<string, unknown> | null;
  warrantyClaims: Record<string, unknown>[];
  adminOrder: {
    id: string;
    customer_name: string;
    customer_phone: string;
    status: string;
    sale_date: string;
    items: {
      seri: string | null;
      product_name: string;
      product_type: string;
      sell_price: number;
      warranty_months: number;
      condition: string | null;
      capacity: string | null;
      color: string | null;
    }[];
  } | null;
}

export default function OrderTrackingPage() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true); setNotFound(false); setResult(null);

    try {
      const res = await fetch(`/api/lookup?q=${encodeURIComponent(q.trim())}`);
      const data: LookupResult = await res.json();

      if (!data.webOrder && !data.warranty && !data.adminOrder) {
        setNotFound(true);
      } else {
        setResult(data);
      }
    } catch {
      setNotFound(true);
    }
    setLoading(false);
  }

  const webOrder = result?.webOrder;
  const warranty = result?.warranty;
  const claims = result?.warrantyClaims || [];
  const adminOrder = result?.adminOrder;

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, #155e35 0%, #1f8f4e 100%)" }}>
        <div className="max-w-[1200px] mx-auto px-4 pt-10 pb-14 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Chính sách & Tra cứu bảo hành</h1>
          <p className="text-sm text-white/60 mb-8">Tra cứu đơn hàng, bảo hành và các chính sách tại POLY Store</p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {POLICIES.map((p) => (
              <Link key={p.label} href={p.href}
                className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors">
                <p.icon size={16} className="text-white/70 group-hover:text-white" />
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Search card */}
      <div className="max-w-[1200px] mx-auto px-4 -mt-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Tra cứu bảo hành</h2>
          <p className="text-sm text-gray-400 text-center mb-6">
            Nhập số seri/IMEI, số điện thoại hoặc mã đơn hàng
          </p>

          <form onSubmit={search} className="max-w-[560px] mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Số seri/IMEI, số điện thoại, mã đơn hàng..."
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

          {/* Results */}
          {result && (
            <div className="mt-6 max-w-[700px] mx-auto space-y-6">

              {/* Warranty result */}
              {warranty && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-brand-700 px-5 py-3 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-white" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">Thông tin bảo hành</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    {/* Status badge */}
                    {(() => {
                      const ws = WARRANTY_STATUS[warranty.status as string] || WARRANTY_STATUS.active;
                      const Icon = ws.icon;
                      return (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium ${ws.color}`}>
                          <Icon size={14} /> {ws.label}
                        </div>
                      );
                    })()}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div><p className="text-xs text-gray-400">Sản phẩm</p><p className="font-medium">{warranty.product_name as string}</p></div>
                      <div><p className="text-xs text-gray-400">Số seri</p><p className="font-medium font-mono">{warranty.seri as string}</p></div>
                      <div><p className="text-xs text-gray-400">Khách hàng</p><p className="font-medium">{warranty.customer_name as string}</p></div>
                      <div><p className="text-xs text-gray-400">SĐT</p><p className="font-medium">{warranty.customer_phone as string}</p></div>
                      <div><p className="text-xs text-gray-400">Ngày mua</p><p className="font-medium">{formatDate(warranty.sale_date as string)}</p></div>
                      <div><p className="text-xs text-gray-400">Bảo hành đến</p><p className="font-medium">{formatDate(warranty.warranty_end as string)}</p></div>
                      <div><p className="text-xs text-gray-400">Thời hạn</p><p className="font-medium">{warranty.warranty_months as number} tháng</p></div>
                    </div>

                    {/* Warranty claims */}
                    {claims.length > 0 && (
                      <div className="border-t border-gray-100 pt-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Lịch sử bảo hành</h4>
                        <div className="space-y-2">
                          {claims.map((claim, i) => (
                            <div key={i} className="bg-gray-50 rounded-md p-3 text-sm">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-gray-700">Lần {claim.claim_number as number || i + 1}</span>
                                <span className="text-xs text-gray-400">{formatDate(claim.claim_date as string)}</span>
                              </div>
                              {claim.claim_issue ? <p className="text-xs text-gray-500">Lỗi: {String(claim.claim_issue)}</p> : null}
                              {claim.claim_solution ? <p className="text-xs text-gray-500">Xử lý: {String(claim.claim_solution)}</p> : null}
                              {claim.claim_status ? (
                                <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                                  {claim.claim_status === "returned_customer" ? "Đã trả máy" : claim.claim_status === "sent_vendor" ? "Đang sửa chữa" : String(claim.claim_status)}
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Admin order result (from polysto-app) */}
              {adminOrder && !warranty && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-brand-700 px-5 py-3 flex items-center gap-2">
                    <Package size={16} className="text-white" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">Đơn hàng</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-400">Mã đơn hàng</p>
                        <p className="text-base font-bold text-brand-600 uppercase">{adminOrder.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-medium ${STATUS[adminOrder.status]?.color || "bg-gray-100 text-gray-600"}`}>
                        {STATUS[adminOrder.status]?.label || adminOrder.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-xs text-gray-400">Khách hàng</p><p className="font-medium">{adminOrder.customer_name}</p></div>
                      <div><p className="text-xs text-gray-400">Ngày mua</p><p className="font-medium">{formatDate(adminOrder.sale_date)}</p></div>
                    </div>

                    {/* Items */}
                    <div className="border-t border-gray-100 pt-3 space-y-2">
                      {adminOrder.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-start text-sm py-1.5">
                          <div>
                            <p className="font-medium">{item.product_name}</p>
                            <div className="flex gap-2 mt-0.5 text-xs text-gray-400">
                              {item.condition && <span>{item.condition}</span>}
                              {item.capacity && <span>{item.capacity}</span>}
                              {item.color && <span>{item.color}</span>}
                            </div>
                            {item.seri && <p className="text-xs text-gray-400 mt-0.5 font-mono">Seri: {item.seri}</p>}
                            {item.warranty_months > 0 && <p className="text-xs text-brand-500 mt-0.5">BH {item.warranty_months} tháng</p>}
                          </div>
                          <p className="font-medium text-brand-600 whitespace-nowrap">{formatPrice(item.sell_price * 1000)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Web order result */}
              {webOrder && (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="bg-brand-700 px-5 py-3 flex items-center gap-2">
                    <Package size={16} className="text-white" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">Đơn hàng online</h3>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-xs text-gray-400">Mã đơn hàng</p>
                        <p className="text-base font-bold text-brand-600">{webOrder.order_number as string}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(webOrder.created_at as string)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-xs font-medium ${STATUS[webOrder.status as string]?.color}`}>
                        {STATUS[webOrder.status as string]?.label}
                      </span>
                    </div>
                    <div className="text-sm space-y-1 mb-3">
                      <p><span className="text-gray-400">Người nhận:</span> {String(webOrder.customer_name)}</p>
                      <p><span className="text-gray-400">SĐT:</span> {String(webOrder.customer_phone)}</p>
                      {webOrder.customer_address ? <p><span className="text-gray-400">Địa chỉ:</span> {String(webOrder.customer_address)}</p> : null}
                    </div>
                    <div className="divide-y divide-gray-100 text-sm">
                      {((webOrder.items as Record<string, unknown>[]) || []).map((item, i) => (
                        <div key={i} className="py-2 flex justify-between">
                          <div>
                            <p className="font-medium">{String(item.title)}</p>
                            <p className="text-xs text-gray-400">x{Number(item.quantity)}{item.variant ? ` · ${String(item.variant)}` : ""}</p>
                          </div>
                          <p className="font-medium text-brand-600">{formatPrice((item.price as number) * (item.quantity as number))}</p>
                        </div>
                      ))}
                      <div className="pt-3 flex justify-between text-base font-bold">
                        <span>Tổng</span>
                        <span className="text-brand-600">{formatPrice(webOrder.total as number)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
