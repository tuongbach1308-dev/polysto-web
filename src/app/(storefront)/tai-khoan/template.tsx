"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LayoutDashboard, Package, UserCircle, Heart, MapPin, Ticket, LogOut } from "lucide-react";
import { getUserProfile, signOut } from "@/lib/auth";

const MENU = [
  { label: "Tổng quan", href: "/tai-khoan", icon: LayoutDashboard },
  { label: "Đơn hàng của tôi", href: "/tai-khoan/don-hang", icon: Package },
  { label: "Thông tin cá nhân", href: "/tai-khoan/thong-tin", icon: UserCircle },
  { label: "Sản phẩm yêu thích", href: "/tai-khoan/yeu-thich", icon: Heart },
  { label: "Voucher của tôi", href: "/tai-khoan/voucher", icon: Ticket },
  { label: "Địa chỉ giao hàng", href: "/tai-khoan/dia-chi", icon: MapPin },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<{ full_name?: string; email?: string; phone?: string } | null>(null);

  useEffect(() => {
    getUserProfile().then(setProfile);
  }, []);

  const displayName = profile?.full_name || profile?.email?.split("@")[0] || "Khách hàng";
  const displayEmail = profile?.email || profile?.phone || "";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden sticky" style={{ top: "var(--sticky-offset)" }}>
            {/* User info */}
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-600 text-lg font-bold">{initial}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                  <p className="text-xs text-gray-400 truncate">{displayEmail}</p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <nav className="py-2">
              {MENU.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors border-l-2 ${
                      active
                        ? "border-brand-500 bg-brand-50 text-brand-600 font-semibold"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <item.icon size={18} className={active ? "text-brand-500" : "text-gray-400"} />
                    {item.label}
                  </Link>
                );
              })}

              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={() => signOut().then(() => window.location.href = "/")}
                  className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-400 hover:text-red-500 transition-colors w-full"
                >
                  <LogOut size={18} />
                  Đăng xuất
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}
