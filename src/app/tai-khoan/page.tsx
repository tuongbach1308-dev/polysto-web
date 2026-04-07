'use client';

import { useAuth } from '@/hooks/useAuth';
import { Package, Clock, CheckCircle } from 'lucide-react';

export default function AccountDashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Tổng đơn hàng', value: '0', icon: Package, color: 'text-navy bg-navy/10' },
    { label: 'Đang xử lý', value: '0', icon: Clock, color: 'text-price-orange bg-price-orange/10' },
    { label: 'Hoàn thành', value: '0', icon: CheckCircle, color: 'text-navy bg-navy/10' },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-text-dark">
        Xin chào, {user?.name}!
      </h1>
      <p className="text-sm text-text-muted mt-1">Quản lý tài khoản và đơn hàng của bạn</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="border border-border rounded-xl p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-dark">{s.value}</p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick info */}
      <div className="mt-8 border border-border rounded-xl p-6">
        <h2 className="text-sm font-bold text-text-dark uppercase mb-4">Thông tin tài khoản</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-muted">Họ và tên:</span>
            <span className="ml-2 font-medium text-text-dark">{user?.name}</span>
          </div>
          <div>
            <span className="text-text-muted">Email:</span>
            <span className="ml-2 font-medium text-text-dark">{user?.email}</span>
          </div>
          <div>
            <span className="text-text-muted">Số điện thoại:</span>
            <span className="ml-2 font-medium text-text-dark">{user?.phone}</span>
          </div>
          <div>
            <span className="text-text-muted">Ngày tham gia:</span>
            <span className="ml-2 font-medium text-text-dark">{user?.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
