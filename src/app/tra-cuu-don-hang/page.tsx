'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SupportHighlights from '@/components/ui/SupportHighlights';
import Accordion from '@/components/ui/Accordion';
import { HOTLINE_HN, HOTLINE_HCM, STORES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import {
  Package,
  Search,
  ClipboardList,
  Cog,
  Truck,
  CheckCircle,
  SearchX,
  Phone,
  MapPin,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-react';

interface OrderResult {
  id: string;
  order_number: string;
  status: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: string;
  payment_status: string;
  items: Array<{ name: string; qty: number; price: number; image?: string }>;
  subtotal: number;
  shipping_fee: number;
  total: number;
  created_at: string;
  updated_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const STATUS_STEPS = ['pending', 'confirmed', 'shipping', 'completed'];

const timelineIcons = [ClipboardList, Cog, Truck, CheckCircle];

const faqItems = [
  { question: 'Làm sao để biết mã đơn hàng?', answer: 'Mã đơn hàng được gửi qua SMS hoặc email sau khi bạn đặt hàng thành công. Bạn cũng có thể tìm mã đơn hàng trong mục "Đơn hàng" khi đăng nhập tài khoản.' },
  { question: 'Thời gian giao hàng là bao lâu?', answer: 'Đơn hàng nội thành Hà Nội và TP.HCM sẽ được giao trong 1-2 ngày. Các tỉnh thành khác từ 3-5 ngày làm việc.' },
  { question: 'Tôi có thể thay đổi địa chỉ giao hàng không?', answer: 'Bạn có thể thay đổi địa chỉ giao hàng khi đơn hàng ở trạng thái "Đang xử lý". Vui lòng liên hệ hotline để được hỗ trợ.' },
  { question: 'Làm sao để hủy đơn hàng?', answer: 'Đơn hàng có thể hủy khi chưa được giao cho đơn vị vận chuyển. Liên hệ hotline hoặc chat trực tiếp để yêu cầu hủy.' },
  { question: 'Chính sách đổi trả như thế nào?', answer: 'POLY Store hỗ trợ đổi trả miễn phí trong vòng 7 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên seal hoặc đúng tình trạng như mô tả.' },
];

export default function OrderTrackingPage() {
  const [searchType, setSearchType] = useState<'order' | 'phone'>('order');
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders?q=${encodeURIComponent(searchValue.trim())}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    const idx = STATUS_STEPS.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Breadcrumbs items={[{ label: 'Tra cứu đơn hàng' }]} />

      {/* Hero */}
      <div className="bg-navy rounded-2xl p-8 lg:p-12 text-center text-white mt-2 mb-8">
        <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold">Tra cứu đơn hàng</h1>
        <p className="mt-2 text-white/70 text-sm lg:text-base max-w-md mx-auto">
          Nhập mã đơn hàng hoặc số điện thoại để kiểm tra trạng thái giao hàng
        </p>
      </div>

      {/* Search section */}
      <div className="max-w-2xl mx-auto">
        <div className="flex bg-bg-gray rounded-lg p-1 mb-5">
          <button onClick={() => { setSearchType('order'); setSearched(false); setSearchValue(''); setOrders([]); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${searchType === 'order' ? 'bg-white shadow-sm text-navy' : 'text-text-muted hover:text-text-dark'}`}>
            <Package className="h-4 w-4" />Mã đơn hàng
          </button>
          <button onClick={() => { setSearchType('phone'); setSearched(false); setSearchValue(''); setOrders([]); }} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${searchType === 'phone' ? 'bg-white shadow-sm text-navy' : 'text-text-muted hover:text-text-dark'}`}>
            <Phone className="h-4 w-4" />Số điện thoại
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder={searchType === 'order' ? 'Nhập mã đơn hàng (VD: WEB-20260408-001)...' : 'Nhập số điện thoại đặt hàng...'}
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value); setSearched(false); }}
              type={searchType === 'phone' ? 'tel' : 'text'}
            />
          </div>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
            Tra cứu
          </Button>
        </form>

        {/* Results */}
        {searched && !loading && orders.length > 0 && orders.map(order => {
          const currentStep = order.status === 'cancelled' ? -1 : getStepIndex(order.status);
          const isCancelled = order.status === 'cancelled';

          return (
            <div key={order.id} className="mt-8 bg-white rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-text-muted">Mã đơn hàng</p>
                  <p className="font-bold text-text-dark uppercase">{order.order_number}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  isCancelled ? 'bg-red-50 text-red-600' : 'bg-navy/10 text-navy'
                }`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

              {/* Timeline */}
              {!isCancelled && (
                <div className="hidden md:flex items-start justify-between relative">
                  <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-border" />
                  <div className="absolute top-5 left-[10%] h-0.5 bg-navy transition-all" style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 80}%` }} />
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentStep;
                    const Icon = timelineIcons[i];
                    return (
                      <div key={i} className="flex flex-col items-center relative z-10 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${done ? 'bg-navy text-white' : 'bg-bg-gray text-text-muted border border-border'}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className={`mt-2 text-xs font-medium ${done ? 'text-navy' : 'text-text-muted'}`}>{STATUS_LABELS[step]}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {isCancelled && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Đơn hàng đã bị hủy</span>
                </div>
              )}

              {/* Order details */}
              <div className="mt-6 pt-5 border-t border-border">
                <div className="space-y-2 mb-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-text-dark">{item.name} x{item.qty}</span>
                      <span className="text-text-muted">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><p className="text-text-muted text-xs">Ngày đặt</p><p className="font-medium text-text-dark">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p></div>
                  <div><p className="text-text-muted text-xs">Thanh toán</p><p className="font-medium text-text-dark">{order.payment_method === 'cod' ? 'COD' : 'Chuyển khoản'}</p></div>
                  <div><p className="text-text-muted text-xs">Phí ship</p><p className="font-medium text-text-dark">{formatPrice(order.shipping_fee)}</p></div>
                  <div><p className="text-text-muted text-xs">Tổng tiền</p><p className="font-medium text-price-orange">{formatPrice(order.total)}</p></div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Not found */}
        {searched && !loading && orders.length === 0 && (
          <div className="mt-8 bg-white rounded-xl border border-border p-8 text-center">
            <div className="w-14 h-14 bg-bg-gray rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchX className="h-7 w-7 text-text-muted" />
            </div>
            <p className="font-semibold text-text-dark">Không tìm thấy đơn hàng</p>
            <p className="mt-1 text-sm text-text-muted max-w-sm mx-auto">
              Vui lòng kiểm tra lại thông tin hoặc liên hệ hotline để được hỗ trợ
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <a href={`tel:${HOTLINE_HN}`} className="inline-flex items-center gap-1.5 text-sm text-navy font-medium hover:underline"><Phone className="h-3.5 w-3.5" />{HOTLINE_HN}</a>
              <span className="text-border">|</span>
              <a href={`tel:${HOTLINE_HCM}`} className="inline-flex items-center gap-1.5 text-sm text-navy font-medium hover:underline"><Phone className="h-3.5 w-3.5" />{HOTLINE_HCM}</a>
            </div>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-12">
        <h2 className="text-lg font-bold text-text-dark mb-4">Câu hỏi thường gặp</h2>
        <Accordion items={faqItems} />
      </div>

      {/* Contact cards */}
      <div className="max-w-2xl mx-auto mt-10">
        <h2 className="text-lg font-bold text-text-dark mb-4">Liên hệ hỗ trợ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(STORES).map((store) => (
            <div key={store.name} className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-text-dark mb-3">{store.name}</h3>
              <div className="space-y-2.5 text-sm text-text-muted">
                <p className="flex items-start gap-2.5"><MapPin className="h-4 w-4 shrink-0 mt-0.5 text-navy" />{store.address}</p>
                <p className="flex items-center gap-2.5"><Phone className="h-4 w-4 shrink-0 text-navy" /><a href={`tel:${store.phone}`} className="text-navy font-medium hover:underline">{store.phone}</a></p>
                <p className="flex items-center gap-2.5"><Clock className="h-4 w-4 shrink-0 text-navy" />{store.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10"><SupportHighlights /></div>
    </div>
  );
}
