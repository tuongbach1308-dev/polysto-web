"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, Heart, MapPin, Ticket, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getUserProfile } from "@/lib/auth";
import { getWishlist } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/lib/database.types";

export default function AccountDashboard() {
  const [profile, setProfile] = useState<{ full_name?: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    getUserProfile().then(setProfile);
    setWishlistCount(getWishlist().length);

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)
        .then(({ data, count }) => {
          if (data) setOrders(data as Order[]);
          if (count !== null) setOrderCount(count);
        });

      // Get total order count
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .then(({ count }) => {
          if (count !== null) setOrderCount(count);
        });
    });
  }, []);

  const displayName = profile?.full_name || "Khách hàng";

  const STATS = [
    { label: "Đơn hàng", value: String(orderCount), icon: Package, href: "/tai-khoan/don-hang", color: "bg-blue-50 text-blue-600" },
    { label: "Yêu thích", value: String(wishlistCount), icon: Heart, href: "/tai-khoan/yeu-thich", color: "bg-pink-50 text-pink-600" },
    { label: "Địa chỉ", value: "0", icon: MapPin, href: "/tai-khoan/dia-chi", color: "bg-green-50 text-green-600" },
    { label: "Voucher", value: "0", icon: Ticket, href: "/tai-khoan/voucher", color: "bg-orange-50 text-orange-600" },
  ];

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-700" },
    confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700" },
    shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-700" },
    delivered: { label: "Đã giao", color: "bg-green-100 text-green-700" },
    cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h1 className="text-lg font-bold text-gray-900">Xin chào, {displayName}!</h1>
        <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản và theo dõi đơn hàng của bạn tại đây.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5 group-hover:text-brand-600 transition-colors">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Đơn hàng gần đây</h2>
          <Link href="/tai-khoan/don-hang" className="text-xs text-brand-500 font-medium hover:text-brand-600 flex items-center gap-0.5">
            Xem tất cả <ChevronRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              Chưa có đơn hàng nào
            </div>
          ) : (
            orders.map((order) => {
              const s = statusMap[order.status] || { label: order.status, color: "bg-gray-100 text-gray-700" };
              const firstItem = order.items[0];
              return (
                <div key={order.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-brand-600">{order.order_number}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${s.color}`}>{s.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {firstItem?.title || "Sản phẩm"} · {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-800 whitespace-nowrap">{formatPrice(order.total)}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
