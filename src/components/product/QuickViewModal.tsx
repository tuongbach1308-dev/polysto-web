'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';
import { formatPrice, getDiscountPercent, getProductImageUrl, getProductImageFallback } from '@/lib/utils';
import { conditionLabels } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import { ChevronLeft, ChevronRight, Check, Minus, Plus, ShoppingCart } from 'lucide-react';

interface Props {
  product: Product;
  open: boolean;
  onClose: () => void;
}

function getStorageOptions(product: Product): string[] {
  const storage = product.specs['Bộ nhớ'] || product.specs['SSD'];
  if (!storage) return [];
  if (product.category === 'ipad') {
    if (storage.includes('64')) return ['64GB', '128GB', '256GB'];
    if (storage.includes('128')) return ['128GB', '256GB'];
    if (storage.includes('256')) return ['256GB', '512GB', '2TB'];
    if (storage.includes('512')) return ['256GB', '512GB', '2TB'];
  }
  if (product.category === 'macbook') {
    if (storage.includes('256')) return ['256GB', '512GB', '1TB'];
    if (storage.includes('512')) return ['512GB', '1TB'];
  }
  return [storage];
}

function getColorOptions(product: Product): string[] {
  if (product.model === 'iPad Mini') return ['Tím', 'Xanh Dương', 'Xám', 'Trắng Vàng'];
  if (product.model === 'iPad Air') return ['Xám', 'Xanh Dương', 'Tím', 'Ánh Sao'];
  if (product.model === 'iPad Pro') return ['Xám', 'Bạc'];
  if (product.model === 'iPad Gen') return ['Xám', 'Bạc', 'Xanh', 'Vàng'];
  if (product.category === 'macbook') return ['Xám', 'Bạc', 'Đen Không Gian', 'Ánh Sao'];
  if (product.category === 'am-thanh') return ['Trắng', 'Đen'];
  return [];
}

export default function QuickViewModal({ product, open, onClose }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeThumb, setActiveThumb] = useState(0);

  const discount = product.originalPrice
    ? getDiscountPercent(product.price, product.originalPrice)
    : 0;

  const storageOptions = getStorageOptions(product);
  const colorOptions = getColorOptions(product);

  const imgSrc = getProductImageUrl(product.category, product.name);
  const imgFallback = getProductImageFallback(product.category, product.name);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity,
      condition: conditionLabels[product.condition],
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-[850px] w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="grid grid-cols-1 sm:grid-cols-[360px_1fr]">
          {/* Left - Image gallery */}
          <div className="p-5 flex flex-col">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <img src={imgSrc} alt={product.name} className="w-full h-full object-contain p-4" onError={(e) => { (e.target as HTMLImageElement).src = imgFallback; }} />
              <button
                onClick={() => setActiveThumb((activeThumb - 1 + 4) % 4)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-300/70 hover:bg-gray-400/70 text-text-dark rounded-lg flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
              </button>
              <button
                onClick={() => setActiveThumb((activeThumb + 1) % 4)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-navy/80 hover:bg-navy text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`w-14 h-14 rounded-lg bg-white overflow-hidden border-2 transition-colors ${
                    i === activeThumb ? 'border-navy' : 'border-transparent hover:border-border'
                  }`}
                >
                  <img src={imgSrc} alt={`${product.name} ${i + 1}`} className="w-full h-full object-contain p-1" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = imgFallback; }} />
                </button>
              ))}
            </div>
          </div>

          {/* Right - Product info */}
          <div className="p-5 sm:pl-0 flex flex-col">
            <h2 className="text-base font-bold text-text-dark leading-snug">{product.name}</h2>

            {/* Brand + stock */}
            <div className="mt-1.5 flex items-center gap-2 text-xs text-text-muted">
              <span>Thương hiệu: <span className="font-medium text-text-dark">Apple</span></span>
              <span className="text-border">|</span>
              <span>Tình trạng: {product.inStock
                ? <span className="font-semibold text-navy">Còn hàng</span>
                : <span className="font-semibold text-discount-red">Hết hàng</span>
              }</span>
            </div>

            {/* Price bar with hover flip */}
            <div className="group relative rounded-lg overflow-hidden h-11 mt-3 cursor-pointer">
              {/* Default — orange */}
              <div className="absolute inset-0 bg-price-orange flex items-center px-4 gap-3 transition-opacity duration-300 group-hover:opacity-0">
                <span className="text-white font-bold text-lg leading-none">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-white/60 text-xs line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-navy text-white text-xs font-bold px-2 py-0.5 rounded ml-auto">
                    -{discount}%
                  </span>
                )}
              </div>
              {/* Hover — green */}
              {product.originalPrice && (
                <div className="absolute inset-0 bg-navy flex items-center px-4 gap-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-white font-bold text-lg leading-none">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-price-orange text-white text-xs font-bold px-3 py-1 rounded ml-auto whitespace-nowrap">
                    Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Color */}
            {colorOptions.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-text-dark mb-1.5">Màu sắc:</p>
                <div className="flex flex-wrap gap-1.5">
                  {colorOptions.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedColor(i)}
                      className={`relative px-3 py-1.5 text-xs border rounded-lg transition-colors ${
                        selectedColor === i
                          ? 'border-navy text-navy font-medium'
                          : 'border-border text-text-muted hover:border-navy/40'
                      }`}
                    >
                      {opt}
                      {selectedColor === i && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-navy rounded-full flex items-center justify-center">
                          <Check className="h-2 w-2 text-white" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage */}
            {storageOptions.length > 1 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-text-dark mb-1.5">Dung lượng:</p>
                <div className="flex flex-wrap gap-1.5">
                  {storageOptions.map((opt, i) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedStorage(i)}
                      className={`relative px-3 py-1.5 text-xs border rounded-lg transition-colors ${
                        selectedStorage === i
                          ? 'border-navy text-navy font-medium'
                          : 'border-border text-text-muted hover:border-navy/40'
                      }`}
                    >
                      {opt}
                      {selectedStorage === i && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-navy rounded-full flex items-center justify-center">
                          <Check className="h-2 w-2 text-white" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-semibold text-text-dark">Số lượng:</span>
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center text-text-dark text-base font-medium hover:bg-bg-gray transition-colors"><Minus size={16} /></button>
                <span className="w-8 h-8 flex items-center justify-center text-xs font-semibold border-x border-border">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center text-text-dark text-base font-medium hover:bg-bg-gray transition-colors"><Plus size={16} /></button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex items-stretch gap-2">
              {/* MUA NGAY */}
              <button
                disabled={!product.inStock}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-colors ${
                  product.inStock
                    ? 'bg-navy hover:bg-navy-dark text-white cursor-pointer'
                    : 'bg-navy/30 text-white/50 cursor-not-allowed'
                }`}
              >
                <span>MUA NGAY</span>
                <span className="text-[10px] font-normal normal-case tracking-normal mt-0.5 opacity-80">
                  Giao tận nơi hoặc nhận tại cửa hàng
                </span>
              </button>

              {/* Thêm vào giỏ */}
              <button
                onClick={product.inStock ? handleAddToCart : undefined}
                disabled={!product.inStock}
                className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-xl border-2 transition-colors ${
                  product.inStock
                    ? 'border-border text-text-muted hover:border-navy hover:text-navy cursor-pointer'
                    : 'border-border/50 text-text-muted/30 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-[10px] font-medium mt-0.5">Thêm vào giỏ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Close */}
        <div className="px-4 pb-4 flex justify-center">
          <button onClick={onClose} className="px-8 py-2 border border-border rounded-lg text-sm font-medium text-text-muted hover:bg-bg-gray transition-colors">
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
}
