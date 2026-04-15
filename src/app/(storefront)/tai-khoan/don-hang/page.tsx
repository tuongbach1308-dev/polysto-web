"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { RefreshCw, Eye, PackageOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/lib/database.types";

const STATUS_TABS = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ xử lý", value: "pending" },
  { label: "Đang giao", value: "shipping" },
  { label: "Đã giao", value: "delivered" },
  { label: "Đã hủy", value: "cancelled" },
];

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
  shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
};

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }

      let query = supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (activeTab !== "all") {
        query = query.eq("status", activeTab);
      }

      query.then(({ data }) => {
        setOrders((data || []) as Order[]);
        setLoading(false);
      });
    });
  }, [activeTab]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-900">Đơn hàng của tôi</h1>

      {/* Filter tabs */}
      <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => { setActiveTab(t.value); setLoading(true); }}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
              activeTab === t.value ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Order list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center">
          <PackageOpen size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Không có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = statusMap[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };
            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-brand-600">{order.order_number}</span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${s.color}`}>{s.label}</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString("vi-VN")}</span>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-50">
                  {order.items.map((item, i) => (
                    <div key={i} className="px-5 py-3 flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain p-1" />
                        ) : (
                          <span className="text-[10px] text-gray-300">IMG</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.title}</p>
                        <div className="flex gap-2 mt-0.5">
                          {item.variant && <span className="text-xs text-gray-400">{item.variant}</span>}
                          {item.color && <span className="text-xs text-gray-400">· {item.color}</span>}
                          <span className="text-xs text-gray-400">· x{item.quantity}</span>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-700 whitespace-nowrap">{formatPrice(item.price)}</p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Link href={`/tra-cuu-don-hang?q=${order.order_number}`} className="flex items-center gap-1 text-xs text-brand-500 font-medium hover:text-brand-600 transition-colors">
                      <Eye size={13} /> Xem chi tiết
                    </Link>
                    <button className="flex items-center gap-1 text-xs text-gray-400 font-medium hover:text-brand-500 transition-colors ml-3">
                      <RefreshCw size={13} /> Mua lại
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">Tổng: </span>
                    <span className="text-sm font-bold text-brand-600">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
