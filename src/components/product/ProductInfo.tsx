'use client';

import { useState } from 'react';
import type { Product } from '@/types/product';
import { formatPrice, getDiscountPercent } from '@/lib/utils';
import { conditionLabels } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import { Check, Minus, Plus, ShoppingCart } from 'lucide-react';

interface Props {
  product: Product;
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

export default function ProductInfo({ product }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedStorage, setSelectedStorage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  const discount = product.originalPrice
    ? getDiscountPercent(product.price, product.originalPrice)
    : 0;

  const storageOptions = getStorageOptions(product);
  const colorOptions = getColorOptions(product);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity,
      condition: conditionLabels[product.condition],
    });
  };

  return (
    <div>
      {/* Product name */}
      <h1 className="text-xl lg:text-2xl font-bold text-text-dark leading-tight">
        {product.name}
      </h1>

      {/* Brand + stock status */}
      <div className="mt-2 flex items-center gap-2 text-sm text-text-muted">
        <span>Thương hiệu: <span className="font-medium text-text-dark">Apple</span></span>
        <span className="text-border">|</span>
        <span>Tình trạng: {product.inStock
          ? <span className="font-semibold text-navy">Còn hàng</span>
          : <span className="font-semibold text-discount-red">Hết hàng</span>
        }</span>
      </div>

      {/* Divider */}
      <hr className="my-4 border-border" />

      {/* Price bar with hover flip */}
      <div className="group relative rounded-xl overflow-hidden h-14 lg:h-16 cursor-pointer">
        {/* Default state — orange bg */}
        <div className="absolute inset-0 bg-price-orange flex items-center px-5 gap-4 transition-opacity duration-300 group-hover:opacity-0">
          <span className="text-white font-bold text-2xl lg:text-[28px] leading-none">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-white/60 text-sm line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-navy text-white text-sm font-bold px-3 py-1 rounded-lg ml-auto">
              -{discount}%
            </span>
          )}
        </div>
        {/* Hover state — navy-green bg */}
        {product.originalPrice && (
          <div className="absolute inset-0 bg-navy flex items-center px-5 gap-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="text-white font-bold text-2xl lg:text-[28px] leading-none">
              {formatPrice(product.price)}
            </span>
            <span className="bg-price-orange text-white text-sm font-bold px-4 py-1.5 rounded-lg ml-auto whitespace-nowrap">
              Tiết kiệm {formatPrice(product.originalPrice - product.price)}
            </span>
          </div>
        )}
      </div>

      {/* Color selector */}
      {colorOptions.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-text-dark mb-2.5">Màu sắc:</p>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((opt, i) => (
              <button
                key={opt}
                onClick={() => setSelectedColor(i)}
                className={`relative px-4 py-2 text-sm border rounded-lg transition-all ${
                  selectedColor === i
                    ? 'border-navy text-navy font-semibold bg-white shadow-sm'
                    : 'border-border text-text-muted hover:border-navy/40 bg-white'
                }`}
              >
                {opt}
                {selectedColor === i && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-navy rounded-full flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Storage selector */}
      {storageOptions.length > 1 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-text-dark mb-2.5">Dung lượng:</p>
          <div className="flex flex-wrap gap-2">
            {storageOptions.map((opt, i) => (
              <button
                key={opt}
                onClick={() => setSelectedStorage(i)}
                className={`relative px-4 py-2 text-sm border rounded-lg transition-all ${
                  selectedStorage === i
                    ? 'border-navy text-navy font-semibold bg-white shadow-sm'
                    : 'border-border text-text-muted hover:border-navy/40 bg-white'
                }`}
              >
                {opt}
                {selectedStorage === i && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-navy rounded-full flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm font-semibold text-text-dark">Số lượng:</span>
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-9 h-9 flex items-center justify-center text-text-dark text-base font-medium hover:bg-bg-gray transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="w-9 h-9 flex items-center justify-center text-sm font-bold border-x border-border bg-white">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-9 h-9 flex items-center justify-center text-text-dark text-base font-medium hover:bg-bg-gray transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex items-stretch gap-3">
        {/* MUA NGAY */}
        <button
          disabled={!product.inStock}
          className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-colors ${
            product.inStock
              ? 'bg-navy hover:bg-navy-dark text-white cursor-pointer'
              : 'bg-navy/30 text-white/50 cursor-not-allowed'
          }`}
        >
          <span className="text-base">MUA NGAY</span>
          <span className="text-[11px] font-normal normal-case tracking-normal mt-0.5 opacity-80">
            Giao tận nơi hoặc nhận tại cửa hàng
          </span>
        </button>

        {/* Thêm vào giỏ */}
        <button
          onClick={product.inStock ? handleAddToCart : undefined}
          disabled={!product.inStock}
          className={`flex flex-col items-center justify-center px-5 py-3 rounded-xl border-2 transition-colors ${
            product.inStock
              ? 'border-border text-text-muted hover:border-navy hover:text-navy cursor-pointer'
              : 'border-border/50 text-text-muted/30 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="h-6 w-6" strokeWidth={1.5} />
          <span className="text-[11px] font-medium mt-1">Thêm vào giỏ</span>
        </button>
      </div>
    </div>
  );
}
