'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import type { Product, Condition } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  title: string;
  products: Product[];
  viewAllHref: string;
}

const conditionFilters: { key: Condition | 'all'; label: string }[] = [
  { key: 'nguyen-seal', label: 'Nguyên Seal' },
  { key: 'open-box', label: 'Open Box' },
  { key: 'no-box', label: 'No Box' },
];

export default function ProductCarousel({ title, products, viewAllHref }: Props) {
  const [activeFilter, setActiveFilter] = useState<Condition | 'all'>('all');
  const trackRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);

  const filteredProducts = activeFilter === 'all'
    ? products
    : products.filter((p) => p.condition === activeFilter);

  // Measure card width on mount and resize
  useEffect(() => {
    function measure() {
      if (trackRef.current) {
        const firstCard = trackRef.current.querySelector<HTMLElement>('[data-card]');
        if (firstCard) setCardWidth(firstCard.offsetWidth);
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [filteredProducts]);

  const scrollBy = useCallback((dir: 'left' | 'right') => {
    if (!trackRef.current || !cardWidth) return;
    const gap = 16;
    const amount = cardWidth + gap;
    trackRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  }, [cardWidth]);

  const handleFilterChange = (key: Condition | 'all') => {
    setActiveFilter(activeFilter === key ? 'all' : key);
    // Reset scroll to start
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  };

  return (
    <section>
      {/* Header bar */}
      <div className="bg-white border border-border rounded-lg px-4 lg:px-6 py-3 flex items-center justify-between gap-4 mb-4">
        <h2 className="text-text-dark font-bold text-sm md:text-base lg:text-lg uppercase tracking-wide whitespace-nowrap">
          {title}
        </h2>
        <div className="flex items-center gap-2 lg:gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-1 lg:gap-3">
            {conditionFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`text-xs lg:text-sm font-medium px-2.5 lg:px-3 py-1 rounded-full transition-colors whitespace-nowrap ${
                  activeFilter === filter.key
                    ? 'bg-navy text-white'
                    : 'text-text-muted hover:text-navy hover:bg-navy/5'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 bg-navy text-white text-xs lg:text-sm font-medium px-3 lg:px-4 py-1.5 lg:py-2 rounded-md hover:bg-navy-dark transition-colors whitespace-nowrap"
          >
            Xem tất cả
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* Carousel - scroll 1 card at a time */}
      <div className="relative">
        {/* Left arrow */}
        {filteredProducts.length > 5 && (
          <button
            onClick={() => scrollBy('left')}
            className="absolute left-0 top-[38%] -translate-y-1/2 z-10 w-8 h-8 lg:w-9 lg:h-9 bg-navy/90 text-white rounded-r-lg flex items-center justify-center shadow-md hover:bg-navy transition-colors"
            aria-label="Trước"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
          </button>
        )}

        {/* Right arrow */}
        {filteredProducts.length > 5 && (
          <button
            onClick={() => scrollBy('right')}
            className="absolute right-0 top-[38%] -translate-y-1/2 z-10 w-8 h-8 lg:w-9 lg:h-9 bg-navy/90 text-white rounded-l-lg flex items-center justify-center shadow-md hover:bg-navy transition-colors"
            aria-label="Tiếp"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        )}

        {/* Scroll track - cards take exactly 1/5 of container width */}
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                data-card
                className="w-[calc((100%-64px)/5)] min-w-[calc((100%-64px)/5)] shrink-0
                  max-lg:w-[calc((100%-48px)/4)] max-lg:min-w-[calc((100%-48px)/4)]
                  max-md:w-[calc((100%-32px)/3)] max-md:min-w-[calc((100%-32px)/3)]
                  max-sm:w-[calc((100%-16px)/2)] max-sm:min-w-[calc((100%-16px)/2)]"
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8 text-text-muted text-sm">
              Không có sản phẩm nào.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
