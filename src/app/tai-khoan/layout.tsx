'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { LayoutDashboard, Package, UserCog, LogOut } from 'lucide-react';

const navItems = [
  { href: '/tai-khoan', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/tai-khoan/don-hang', label: 'Đơn hàng của tôi', icon: Package },
  { href: '/tai-khoan/thong-tin', label: 'Thông tin cá nhân', icon: UserCog },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) router.push('/dang-nhap');
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Breadcrumbs items={[{ label: 'Tài khoản' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 mt-4">
        {/* Sidebar */}
        <aside className="border border-border rounded-xl overflow-hidden h-fit lg:sticky lg:top-24">
          {/* User info */}
          <div className="p-5 border-b border-border bg-bg-gray">
            <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <p className="mt-2 text-sm font-semibold text-text-dark">{user.name}</p>
            <p className="text-xs text-text-muted">{user.email}</p>
          </div>

          {/* Nav */}
          <nav className="p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-navy text-white'
                      : 'text-text-muted hover:bg-bg-gray hover:text-text-dark'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => { logout(); router.push('/'); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-discount-red hover:bg-discount-red/5 transition-colors w-full"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
