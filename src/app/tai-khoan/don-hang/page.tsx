'use client';

import { Package } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-text-dark">Đơn hàng của tôi</h1>
      <p className="text-sm text-text-muted mt-1">Theo dõi và quản lý đơn hàng</p>

      {/* Empty state */}
      <div className="mt-8 border border-border rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-bg-gray rounded-full flex items-center justify-center mx-auto">
          <Package className="h-8 w-8 text-text-muted" />
        </div>
        <p className="mt-4 text-sm font-medium text-text-dark">Bạn chưa có đơn hàng nào</p>
        <p className="mt-1 text-xs text-text-muted">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi</p>
      </div>
    </div>
  );
}
