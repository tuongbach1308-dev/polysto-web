'use client';

import Link from 'next/link';
import type { Banner } from '@/data/banners';
import { banners as staticBanners } from '@/data/banners';
import { useCarousel } from '@/hooks/useCarousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  banners?: Banner[];
}

export default function HeroCarousel({ banners: propBanners }: Props) {
  const banners = propBanners?.length ? propBanners : staticBanners;
  const { current, next, prev, goTo } = useCarousel(banners.length);

  return (
    <div className="space-y-4">
      {/* Main carousel */}
      <div className="relative overflow-hidden rounded-2xl group">
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`min-w-full bg-gradient-to-r ${banner.bgColor} flex items-center relative overflow-hidden`}
            >
              {/* Background image */}
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 w-full relative z-10 flex items-center justify-between gap-8">
                <div className="max-w-lg">
                  <h2 className="text-2xl md:text-4xl font-bold text-text-dark mb-3">
                    {banner.title}
                  </h2>
                  <p className="text-base md:text-lg text-text-muted mb-6">
                    {banner.subtitle}
                  </p>
                  <Link
                    href={banner.href}
                    className="inline-block bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-dark transition-colors"
                  >
                    {banner.cta}
                  </Link>
                </div>
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="hidden md:block w-[280px] lg:w-[350px] h-auto rounded-xl object-cover shadow-lg"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Arrows — hidden by default, show on hover */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all shadow opacity-0 group-hover:opacity-100"
          aria-label="Slide trước"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-all shadow opacity-0 group-hover:opacity-100"
          aria-label="Slide tiếp"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all ${
                i === current ? 'bg-navy w-6 h-2.5' : 'bg-white/60 w-2.5 h-2.5'
              }`}
              aria-label={`Đi đến slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Sub banners — 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/san-pham/ipad"
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-100 to-purple-50 p-6 lg:p-8 flex items-center min-h-[140px] group/sub hover:shadow-lg transition-shadow"
        >
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-text-dark">iPad Air 7</h3>
            <p className="text-sm text-text-muted mt-1">Giá chỉ từ 13.990.000đ</p>
            <span className="inline-block mt-3 text-xs font-medium bg-navy text-white px-3 py-1.5 rounded-md group-hover/sub:bg-navy-dark transition-colors">
              Mua ngay
            </span>
          </div>
          <span className="absolute right-6 bottom-4 text-6xl opacity-20">📱</span>
        </Link>

        <Link
          href="/san-pham/macbook"
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-sky-50 to-blue-100 p-6 lg:p-8 flex items-center min-h-[140px] group/sub hover:shadow-lg transition-shadow"
        >
          <div>
            <h3 className="text-lg lg:text-xl font-bold text-text-dark">MacBook Air M4</h3>
            <p className="text-sm text-text-muted mt-1">Bảo hành 12 tháng — Trả góp 0%</p>
            <span className="inline-block mt-3 text-xs font-medium bg-navy text-white px-3 py-1.5 rounded-md group-hover/sub:bg-navy-dark transition-colors">
              Khám phá
            </span>
          </div>
          <span className="absolute right-6 bottom-4 text-6xl opacity-20">💻</span>
        </Link>
      </div>
    </div>
  );
}
