'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Loader2, CheckCircle, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<{ id: string; order_number: string } | null>(null);
  const [error, setError] = useState('');

  const shippingFee = totalPrice >= 300000 ? 0 : 30000;
  const total = totalPrice + shippingFee;

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    shipping_address: '',
    customer_note: '',
    payment_method: 'cod',
  });

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.customer_phone.trim() || !form.shipping_address.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    if (items.length === 0) {
      setError('Giỏ hàng trống');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(item => ({
            name: item.name,
            qty: item.quantity,
            price: item.price,
            image: item.image,
            condition: item.condition,
          })),
          subtotal: totalPrice,
          shipping_fee: shippingFee,
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi đặt hàng');
      setOrderResult(data);
      clearCart();
    } catch (err: any) {
      setError(err.message || 'Lỗi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (orderResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-text-dark">Đặt hàng thành công!</h1>
        <p className="mt-2 text-text-muted">Cảm ơn bạn đã mua hàng tại POLY Store</p>
        <div className="mt-6 bg-white rounded-xl border border-border p-6 text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted">Mã đơn hàng</p>
              <p className="font-bold text-navy text-lg uppercase">{orderResult.order_number}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-navy/30" />
          </div>
          <p className="mt-4 text-sm text-text-muted">
            Chúng tôi sẽ liên hệ xác nhận đơn hàng qua số điện thoại của bạn.
            Bạn có thể tra cứu đơn hàng bằng mã trên.
          </p>
        </div>
        <div className="flex gap-3 justify-center mt-8">
          <Link href="/tra-cuu-don-hang" className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-dark transition-colors">
            Tra cứu đơn hàng
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 border border-border text-text-dark px-6 py-3 rounded-lg font-medium hover:bg-bg-gray transition-colors">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="mt-4 text-2xl font-bold text-text-dark">Giỏ hàng trống</h1>
        <p className="mt-2 text-text-muted">Vui lòng thêm sản phẩm trước khi thanh toán.</p>
        <Link href="/" className="inline-block mt-6 bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-dark transition-colors">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Breadcrumbs items={[{ label: 'Giỏ hàng', href: '/gio-hang' }, { label: 'Thanh toán' }]} />

      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.back()} className="text-text-muted hover:text-text-dark transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-text-dark">Thanh toán</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          {/* Left — Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border p-5">
              <h2 className="font-semibold text-text-dark mb-4">Thông tin giao hàng</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-text-muted mb-1 block">Họ tên *</label>
                    <Input value={form.customer_name} onChange={e => updateField('customer_name', e.target.value)} placeholder="Nguyễn Văn A" required />
                  </div>
                  <div>
                    <label className="text-sm text-text-muted mb-1 block">Số điện thoại *</label>
                    <Input type="tel" value={form.customer_phone} onChange={e => updateField('customer_phone', e.target.value)} placeholder="0912345678" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-text-muted mb-1 block">Email</label>
                  <Input type="email" value={form.customer_email} onChange={e => updateField('customer_email', e.target.value)} placeholder="email@example.com" />
                </div>
                <div>
                  <label className="text-sm text-text-muted mb-1 block">Địa chỉ giao hàng *</label>
                  <Textarea value={form.shipping_address} onChange={e => updateField('shipping_address', e.target.value)} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" rows={3} />
                </div>
                <div>
                  <label className="text-sm text-text-muted mb-1 block">Ghi chú</label>
                  <Textarea value={form.customer_note} onChange={e => updateField('customer_note', e.target.value)} placeholder="Ghi chú cho đơn hàng (tùy chọn)" rows={2} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-5">
              <h2 className="font-semibold text-text-dark mb-4">Phương thức thanh toán</h2>
              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.payment_method === 'cod' ? 'border-navy bg-navy/5' : 'border-border hover:border-navy/30'}`}>
                  <input type="radio" name="payment" value="cod" checked={form.payment_method === 'cod'} onChange={() => updateField('payment_method', 'cod')} className="accent-navy" />
                  <div>
                    <p className="text-sm font-medium text-text-dark">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-xs text-text-muted">Thanh toán trực tiếp cho nhân viên giao hàng</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.payment_method === 'bank_transfer' ? 'border-navy bg-navy/5' : 'border-border hover:border-navy/30'}`}>
                  <input type="radio" name="payment" value="bank_transfer" checked={form.payment_method === 'bank_transfer'} onChange={() => updateField('payment_method', 'bank_transfer')} className="accent-navy" />
                  <div>
                    <p className="text-sm font-medium text-text-dark">Chuyển khoản ngân hàng</p>
                    <p className="text-xs text-text-muted">Chuyển khoản trước khi giao hàng</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right — Order summary */}
          <div className="bg-white rounded-xl border border-border p-5 h-fit sticky top-24">
            <h2 className="font-semibold text-text-dark mb-4">Đơn hàng ({items.length} sản phẩm)</h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {items.map(item => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-bg-gray rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-dark font-medium truncate">{item.name}</p>
                    <p className="text-xs text-text-muted">x{item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-text-dark shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-text-muted">Tạm tính</span><span>{formatPrice(totalPrice)}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Phí vận chuyển</span><span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span></div>
              <div className="flex justify-between font-semibold text-text-dark pt-2 border-t border-border">
                <span>Tổng cộng</span>
                <span className="text-xl text-navy">{formatPrice(total)}</span>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-discount-red">{error}</p>}

            <Button type="submit" size="lg" className="w-full mt-4" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Đặt hàng
            </Button>

            <p className="mt-3 text-xs text-text-muted text-center">
              Bằng việc đặt hàng, bạn đồng ý với chính sách mua hàng của POLY Store
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
