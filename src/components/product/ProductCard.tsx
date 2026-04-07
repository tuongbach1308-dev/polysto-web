'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types/product';
import { conditionLabels } from '@/types/product';
import { formatPrice, getDiscountPercent, getProductImageUrl, getProductImageFallback } from '@/lib/utils';
import QuickViewModal from './QuickViewModal';
import { ShoppingCart } from 'lucide-react';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [quickView, setQuickView] = useState(false);

  const discount = product.originalPrice
    ? getDiscountPercent(product.price, product.originalPrice)
    : 0;

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickView(true);
  };

  const imgSrc = getProductImageUrl(product.category, product.name);
  const imgFallback = getProductImageFallback(product.category, product.name);

  return (
    <>
      <Link
        href={`/san-pham/${product.category}/${product.slug}`}
        className="group block bg-white rounded-xl border border-border hover:shadow-lg transition-all overflow-hidden"
      >
        {/* Image area */}
        <div className="relative aspect-square bg-white overflow-hidden">
          <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <img
              src={imgSrc}
              alt={product.name}
              className="w-full h-full object-contain p-2"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = imgFallback; }}
            />
          </div>

          {/* Discount badge - top left */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-discount-red text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
              -{discount}%
            </span>
          )}

          {/* Condition badge - top right */}
          <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-text-dark text-[10px] font-medium px-2 py-0.5 rounded-md border border-border/50">
            {conditionLabels[product.condition]}
          </span>

          {/* Hết hàng overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-sm font-bold bg-black/50 px-3 py-1 rounded-lg">Hết hàng</span>
            </div>
          )}


        </div>

        <hr className="border-border/50" />

        {/* Info */}
        <div className="p-3">
          <h3 className="text-sm font-medium text-text-dark line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-navy transition-colors">
            {product.name}
          </h3>

          {/* Price box */}
          <div
            className="mt-3 bg-bg-gray hover:bg-navy rounded-xl px-3 py-2.5 transition-colors duration-200 cursor-pointer group/price"
            onClick={handleOpenQuickView}
          >
            <div className="flex items-center justify-between">
              <span className="text-price-orange group-hover/price:text-white font-bold text-base transition-colors duration-200">
                {formatPrice(product.price)}
              </span>
              <ShoppingCart className="h-5 w-5 text-navy group-hover/price:text-white transition-colors duration-200" />
            </div>
            {product.originalPrice && (
              <span className="text-text-muted group-hover/price:text-white/60 text-xs line-through block mt-0.5 transition-colors duration-200">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <QuickViewModal product={product} open={quickView} onClose={() => setQuickView(false)} />
    </>
  );
}
