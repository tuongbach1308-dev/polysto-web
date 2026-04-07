'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRICE_TABS = [
  { label: 'Dưới 5 triệu', min: 0, max: 5000000 },
  { label: '5 - 10 triệu', min: 5000000, max: 10000000 },
  { label: '10 - 20 triệu', min: 10000000, max: 20000000 },
  { label: '20 - 40 triệu', min: 20000000, max: 40000000 },
  { label: 'Trên 40 triệu', min: 40000000, max: Infinity },
];

export default function PriceRangeProducts() {
  const [activeTab, setActiveTab] = useState(1);
  const trackRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);

  const filtered = useMemo(() => {
    const range = PRICE_TABS[activeTab];
    return products
      .filter((p) => p.price >= range.min && p.price < range.max && p.inStock)
      .slice(0, 10);
  }, [activeTab]);

  useEffect(() => {
    function measure() {
      if (trackRef.current) {
        const card = trackRef.current.querySelector<HTMLElement>('[data-card]');
        if (card) setCardWidth(card.offsetWidth);
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [filtered]);

  // Reset scroll when tab changes
  useEffect(() => {
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  }, [activeTab]);

  const scrollBy = useCallback((dir: 'left' | 'right') => {
    if (!trackRef.current || !cardWidth) return;
    trackRef.current.scrollBy({ left: dir === 'left' ? -(cardWidth + 16) : cardWidth + 16, behavior: 'smooth' });
  }, [cardWidth]);

  return (
    <section>
      {/* Header bar */}
      <div className="bg-navy rounded-t-xl px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-price-orange" />
          <h2 className="text-white font-bold text-sm lg:text-base uppercase tracking-wide whitespace-nowrap">
            Sản phẩm theo tầm giá
          </h2>
        </div>
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-1 bg-white text-text-dark text-xs lg:text-sm font-medium px-3 lg:px-4 py-1.5 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap shrink-0"
        >
          Xem tất cả
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Price tabs */}
      <div className="bg-bg-gray border-x border-border px-4 lg:px-6 py-2.5 flex gap-2 overflow-x-auto scrollbar-hide">
        {PRICE_TABS.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={cn(
              'shrink-0 px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
              activeTab === i
                ? 'bg-navy text-white'
                : 'bg-white text-text-muted border border-border hover:border-navy/30 hover:text-text-dark'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Product carousel */}
      <div className="relative border border-t-0 border-border rounded-b-xl bg-white p-4 lg:p-5">
        {filtered.length > 5 && (
          <>
            <button
              onClick={() => scrollBy('left')}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-navy/90 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-navy transition-colors"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button
              onClick={() => scrollBy('right')}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-navy/90 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-navy transition-colors"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </>
        )}

        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <div
                key={product.id}
                data-card
                className="w-[calc((100%-64px)/5)] min-w-[calc((100%-64px)/5)]
                  max-lg:w-[calc((100%-48px)/4)] max-lg:min-w-[calc((100%-48px)/4)]
                  max-md:w-[calc((100%-32px)/3)] max-md:min-w-[calc((100%-32px)/3)]
                  max-sm:w-[calc((100%-16px)/2)] max-sm:min-w-[calc((100%-16px)/2)]
                  shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-12 text-text-muted text-sm">
              Không có sản phẩm nào trong khoảng giá này.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
