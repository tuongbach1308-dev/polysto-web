'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductImageUrl, getProductImageFallback } from '@/lib/utils';

interface Props {
  productName: string;
  category: string;
}

export default function ProductImages({ productName, category }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalImages = 4;

  const imgSrc = getProductImageUrl(category, productName, 800);
  const imgFallback = getProductImageFallback(category, productName);

  return (
    <div>
      {/* Main image with arrows */}
      <div className="relative aspect-square bg-white rounded-xl border border-border overflow-hidden">
        <img src={imgSrc} alt={productName} className="w-full h-full object-contain p-4" onError={(e) => { (e.target as HTMLImageElement).src = imgFallback; }} />

        {/* Prev arrow */}
        <button
          onClick={() => setActiveIndex((activeIndex - 1 + totalImages) % totalImages)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-navy/20 hover:bg-navy/40 text-navy rounded-lg flex items-center justify-center transition-colors"
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
        </button>

        {/* Next arrow */}
        <button
          onClick={() => setActiveIndex((activeIndex + 1) % totalImages)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-navy/80 hover:bg-navy text-white rounded-lg flex items-center justify-center transition-colors"
          aria-label="Ảnh tiếp"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mt-3">
        {Array.from({ length: totalImages }, (_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-20 h-20 rounded-lg bg-white overflow-hidden border-2 transition-colors ${
              i === activeIndex ? 'border-navy' : 'border-transparent hover:border-border'
            }`}
          >
            <img src={imgSrc} alt={`${productName} ${i + 1}`} className="w-full h-full object-contain p-1" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = imgFallback; }} />
          </button>
        ))}
      </div>
    </div>
  );
}
