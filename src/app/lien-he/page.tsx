'use client';

import { useState } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import SupportHighlights from '@/components/ui/SupportHighlights';
import Accordion from '@/components/ui/Accordion';
import { STORES, HOTLINE_HN, HOTLINE_HCM, EMAIL, SOCIAL_LINKS } from '@/lib/constants';
import { stores } from '@/data/stores';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

const supportCategories = [
  { value: 'tu-van', label: 'Tư vấn mua hàng' },
  { value: 'bao-hanh', label: 'Bảo hành' },
  { value: 'doi-tra', label: 'Đổi trả' },
  { value: 'khieu-nai', label: 'Khiếu nại' },
  { value: 'khac', label: 'Khác' },
];

const faqItems = [
  {
    question: 'POLY Store có bán hàng online không?',
    answer:
      'Có! Bạn có thể đặt hàng trực tiếp trên website hoặc qua Shopee, Facebook. Đơn hàng sẽ được giao tận nơi trên toàn quốc.',
  },
  {
    question: 'Sản phẩm có được bảo hành không?',
    answer:
      'Tất cả sản phẩm tại POLY Store đều được bảo hành theo chính sách của hãng. Riêng sản phẩm Nguyên Seal được bảo hành 12 tháng tại Apple.',
  },
  {
    question: 'Có hỗ trợ trả góp không?',
    answer:
      'POLY Store hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng của các ngân hàng: Visa, Mastercard, và qua Kredivo.',
  },
  {
    question: 'Tôi có thể đến xem sản phẩm trực tiếp không?',
    answer:
      'Rất hoan nghênh! Bạn có thể đến trực tiếp 2 cơ sở của chúng tôi tại Hà Nội và TP.HCM để trải nghiệm sản phẩm. Giờ mở cửa: 8:30 - 21:30 tất cả các ngày.',
  },
  {
    question: 'Chính sách đổi trả như thế nào?',
    answer:
      'Đổi trả miễn phí trong 7 ngày. Sản phẩm cần còn nguyên tình trạng, đầy đủ phụ kiện và hộp. Liên hệ hotline để được hướng dẫn.',
  },
];

const quickContacts = [
  {
    icon: Phone,
    title: 'Gọi điện',
    desc: 'Tư vấn & đặt hàng nhanh',
    content: (
      <div className="flex flex-col gap-1">
        <a href={`tel:${HOTLINE_HN}`} className="text-navy font-semibold hover:underline">
          {HOTLINE_HN} (HN)
        </a>
        <a href={`tel:${HOTLINE_HCM}`} className="text-navy font-semibold hover:underline">
          {HOTLINE_HCM} (HCM)
        </a>
      </div>
    ),
  },
  {
    icon: Mail,
    title: 'Email',
    desc: 'Phản hồi trong 24h',
    content: (
      <a href={`mailto:${EMAIL}`} className="text-navy font-semibold hover:underline">
        {EMAIL}
      </a>
    ),
  },
  {
    icon: MapPin,
    title: 'Cửa hàng',
    desc: '2 cơ sở trên toàn quốc',
    content: (
      <Link href="/cua-hang" className="inline-flex items-center gap-1 text-navy font-semibold hover:underline">
        Xem hệ thống cửa hàng
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    ),
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Breadcrumbs items={[{ label: 'Liên hệ' }]} />

      {/* Hero */}
      <div className="bg-navy rounded-2xl p-8 lg:p-12 text-white mt-2 mb-8">
        <div className="text-center">
          <h1 className="text-2xl lg:text-3xl font-bold">Liên hệ với POLY Store</h1>
          <p className="mt-2 text-white/70 text-sm lg:text-base max-w-lg mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Liên hệ qua bất kỳ kênh nào bên dưới!
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2 text-white/80">
            <Phone className="h-4 w-4" />
            <span>{HOTLINE_HN}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Mail className="h-4 w-4" />
            <span>{EMAIL}</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Clock className="h-4 w-4" />
            <span>8:30 - 21:30</span>
          </div>
        </div>
      </div>

      {/* Quick contact cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {quickContacts.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-border p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-semibold text-text-dark">{item.title}</h3>
              <p className="text-xs text-text-muted mt-1 mb-3">{item.desc}</p>
              <div className="text-sm">{item.content}</div>
            </div>
          );
        })}
      </div>

      {/* Main content: form + map/stores */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
        {/* Contact form */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-navy/10 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-navy" />
            </div>
            <h2 className="text-lg font-semibold text-text-dark">Gửi yêu cầu hỗ trợ</h2>
          </div>
          <p className="text-sm text-text-muted mb-6 ml-[52px]">
            Để lại thông tin, POLY Store sẽ liên hệ bạn ngay!
          </p>

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-navy" />
              </div>
              <p className="font-semibold text-text-dark text-lg">Gửi yêu cầu thành công!</p>
              <p className="mt-2 text-sm text-text-muted max-w-sm mx-auto">
                Nhân viên POLY Store sẽ liên hệ bạn trong thời gian sớm nhất.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-5">
                Gửi yêu cầu khác
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="name" label="Họ và tên *" placeholder="Nhập họ và tên" required />
                <Input id="phone" label="Số điện thoại *" placeholder="Nhập số điện thoại" type="tel" required />
              </div>
              <Input id="email" label="Email" placeholder="Nhập email (không bắt buộc)" type="email" />
              <Select id="category" label="Danh mục hỗ trợ *" options={supportCategories} required />
              <Textarea id="message" label="Nội dung *" placeholder="Nhập nội dung cần hỗ trợ" required />
              <Button type="submit" size="lg" className="w-full">
                Gửi yêu cầu hỗ trợ
              </Button>
            </form>
          )}
        </div>

        {/* Map + store info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Map */}
          <div className="bg-white rounded-xl border border-border overflow-hidden">
            <iframe
              src={stores[0].embedUrl}
              className="w-full aspect-[4/3] border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ POLY Store"
            />
          </div>

          {/* Store info cards */}
          {Object.values(STORES).map((store) => (
            <div key={store.name} className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-text-dark mb-3">{store.name}</h3>
              <div className="space-y-2.5 text-sm text-text-muted">
                <p className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-navy" />
                  {store.address}
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-navy" />
                  <a href={`tel:${store.phone}`} className="text-navy font-medium hover:underline">
                    {store.phone}
                  </a>
                </p>
                <p className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 shrink-0 text-navy" />
                  {store.hours}
                </p>
              </div>
              <a
                href={store.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-navy font-medium hover:underline"
              >
                Chỉ đường trên Google Maps
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Social media */}
      <div className="text-center mb-10">
        <h2 className="text-lg font-bold text-text-dark mb-4">Kết nối với chúng tôi</h2>
        <div className="flex items-center justify-center gap-3">
          <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-navy/10 hover:bg-navy hover:text-white text-navy flex items-center justify-center transition-colors" aria-label="Facebook">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-navy/10 hover:bg-navy hover:text-white text-navy flex items-center justify-center transition-colors" aria-label="Instagram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-navy/10 hover:bg-navy hover:text-white text-navy flex items-center justify-center transition-colors" aria-label="TikTok">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
          </a>
          <a href={SOCIAL_LINKS.shopee} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-navy/10 hover:bg-navy hover:text-white text-navy flex items-center justify-center transition-colors" aria-label="Shopee">
            <span className="text-base">🛒</span>
          </a>
          <a href={SOCIAL_LINKS.threads} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-navy/10 hover:bg-navy hover:text-white text-navy flex items-center justify-center transition-colors" aria-label="Threads">
            <span className="text-sm font-bold">@</span>
          </a>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mb-10">
        <h2 className="text-lg font-bold text-text-dark mb-4 text-center">Câu hỏi thường gặp</h2>
        <Accordion items={faqItems} />
      </div>

      {/* Support highlights */}
      <SupportHighlights />
    </div>
  );
}
