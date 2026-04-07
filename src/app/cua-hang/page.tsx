'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import SupportHighlights from '@/components/ui/SupportHighlights';
import { stores } from '@/data/stores';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

export default function StorePage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Breadcrumbs items={[{ label: 'Hệ thống cửa hàng' }]} />

      {/* Hero */}
      <div className="bg-navy rounded-2xl p-8 lg:p-12 text-center text-white mt-2 mb-8">
        <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="h-8 w-8" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold">Hệ thống cửa hàng POLY Store</h1>
        <p className="mt-2 text-white/70 text-sm lg:text-base">
          2 cơ sở tại Hà Nội và Hồ Chí Minh — Phục vụ từ 8:30 đến 21:30 mỗi ngày
        </p>
      </div>

      {/* Mobile tab switcher */}
      <div className="md:hidden flex bg-bg-gray rounded-lg p-1 mb-6">
        {stores.map((store, i) => (
          <button
            key={store.id}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-2.5 rounded-md text-xs font-medium transition-all ${
              activeTab === i
                ? 'bg-white shadow-sm text-navy'
                : 'text-text-muted'
            }`}
          >
            {store.name}
          </button>
        ))}
      </div>

      {/* Store cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {stores.map((store, i) => (
          <div
            key={store.id}
            className={`bg-white rounded-xl border border-border overflow-hidden ${
              activeTab !== i ? 'hidden md:block' : ''
            }`}
          >
            {/* Google Maps iframe */}
            <div className="aspect-[16/9] bg-bg-gray">
              <iframe
                src={store.embedUrl}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Bản đồ ${store.name}`}
              />
            </div>

            {/* Store info */}
            <div className="p-5 lg:p-6">
              <h2 className="text-lg font-bold text-text-dark mb-4">{store.name}</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-navy/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-navy" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Địa chỉ</p>
                    <p className="text-text-dark font-medium">{store.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-navy/10 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="h-4 w-4 text-navy" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Hotline tư vấn</p>
                    <a href={`tel:${store.phone}`} className="text-navy font-semibold hover:underline">
                      {store.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-navy/10 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-navy" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Giờ mở cửa</p>
                    <p className="text-text-dark font-medium">{store.hours} (Tất cả các ngày)</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                <a
                  href={store.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-navy text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-navy-dark transition-colors"
                >
                  <Navigation className="h-4 w-4" />
                  Chỉ đường
                </a>
                <a
                  href={`tel:${store.phone}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-navy text-navy px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-navy/5 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Gọi điện
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Support highlights */}
      <div className="mt-10">
        <SupportHighlights />
      </div>
    </div>
  );
}
