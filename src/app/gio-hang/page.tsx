'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Button from '@/components/ui/Button';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumbs items={[{ label: 'Giỏ hàng' }]} />
        <div className="text-center py-16">
          <span className="text-6xl">🛒</span>
          <h1 className="mt-4 text-2xl font-bold text-text-dark">Giỏ hàng trống</h1>
          <p className="mt-2 text-text-muted">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          <Link
            href="/"
            className="inline-block mt-6 bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-dark transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Breadcrumbs items={[{ label: 'Giỏ hàng' }]} />

      <h1 className="text-2xl font-bold text-text-dark mb-6">Giỏ hàng ({items.length} sản phẩm)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 bg-white rounded-xl border border-border p-4">
              {/* Image placeholder */}
              <div className="w-20 h-20 shrink-0 bg-bg-gray rounded-lg flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-text-dark line-clamp-1">{item.name}</h3>
                <p className="text-xs text-text-muted mt-0.5">{item.condition}</p>
                <p className="text-sm font-bold text-navy mt-1">{formatPrice(item.price)}</p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded border border-border flex items-center justify-center text-sm hover:bg-bg-gray"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-8 h-8 rounded border border-border flex items-center justify-center text-sm hover:bg-bg-gray"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.productId)}
                className="text-text-muted hover:text-discount-red transition-colors p-1"
                aria-label="Xóa"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-discount-red link-hover"
          >
            Xóa tất cả
          </button>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl border border-border p-5 h-fit sticky top-24">
          <h2 className="font-semibold text-text-dark mb-4">Tóm tắt đơn hàng</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Tạm tính</span>
              <span className="font-medium">{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Phí vận chuyển</span>
              <span className="font-medium text-green-600">{totalPrice >= 300000 ? 'Miễn phí' : formatPrice(30000)}</span>
            </div>
          </div>

          <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
            <span className="font-semibold text-text-dark">Tổng cộng</span>
            <span className="text-xl font-bold text-navy">
              {formatPrice(totalPrice + (totalPrice >= 300000 ? 0 : 30000))}
            </span>
          </div>

          <Link href="/gio-hang/thanh-toan">
            <Button size="lg" className="w-full mt-4">
              Thanh toán
            </Button>
          </Link>

          <p className="mt-3 text-xs text-text-muted text-center">
            Miễn phí vận chuyển cho đơn hàng từ 300.000đ
          </p>
        </div>
      </div>
    </div>
  );
}
