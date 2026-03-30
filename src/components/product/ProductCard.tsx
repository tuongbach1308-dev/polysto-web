'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatVND } from '@/lib/utils'
import { addToCart } from '@/lib/cart/store'

interface ProductData {
  id: string
  name: string
  slug: string
  thumbnail?: string
  images?: string[]
  price_min?: number
  price_max?: number
  price?: number
  sale_price?: number
  condition_note?: string
  badge?: string
  short_description?: string
  stock?: number
  is_flash_sale?: boolean
  sold_percent?: number
}

interface Props {
  product: ProductData
  variant: 'catalog' | 'shop' | 'flash-sale'
}

export function ProductCard({ product, variant }: Props) {
  const isCatalog = variant === 'catalog'
  const isShop = variant === 'shop' || variant === 'flash-sale'
  const href = isCatalog ? `/san-pham/${product.slug}` : `/shop/${product.slug}`
  const thumb = product.thumbnail || product.images?.[0]
  const outOfStock = isShop && product.stock !== undefined && product.stock <= 0

  const handleAddCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (outOfStock) return
    addToCart({
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price || product.price_min || 0,
      image: thumb,
    })
  }

  // Calculate discount percent for flash-sale badge
  const discountPercent = product.sale_price && product.price && product.sale_price < product.price
    ? Math.round((1 - product.sale_price / product.price) * 100)
    : 0

  return (
    <div className="item_product_main">
      <div className="product-action">
        {/* Flash sale / discount badge */}
        {variant === 'flash-sale' && discountPercent > 0 && (
          <span className="flash-sale">Giảm {discountPercent}%</span>
        )}
        {product.badge && variant !== 'flash-sale' && (
          <span className="flash-sale">{product.badge}</span>
        )}
        {outOfStock && <span className="flash-sale tag-soldout">Hết hàng</span>}

        {/* Thumbnail */}
        <div className="product-thumbnail">
          <Link href={href} className="image_thumb scale_hover">
            {thumb ? (
              <Image
                src={thumb}
                alt={product.name}
                width={300}
                height={300}
                sizes="(max-width: 767px) 50vw, 25vw"
                style={{ width: 'auto', maxHeight: '100%', objectFit: 'contain', position: 'absolute', inset: 0, margin: 'auto' }}
              />
            ) : (
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#ccc' }}>📷</span>
            )}
          </Link>

          {/* Action buttons (desktop hover reveal) */}
          <div className="action-button">
            <Link href={href} className="btn-circle" title="Xem nhanh">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            </Link>
            {isShop && (
              <button type="button" className="btn-circle" title="Thêm giỏ hàng" onClick={handleAddCart}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="product-info">
          <h3 className="product-name line-clamp line-clamp-2">
            <Link href={href}>{product.name}</Link>
          </h3>

          <div className="product-price-cart">
            <div className="price-box">
              {isCatalog ? (
                <CatalogPrice priceMin={product.price_min} priceMax={product.price_max} />
              ) : (
                <ShopPrice price={product.price} salePrice={product.sale_price} />
              )}
            </div>

            {/* Add to cart button (shop/flash-sale only) */}
            {isShop && (
              <div className="product-button">
                <button
                  type="button"
                  className={outOfStock ? 'disable' : 'add_to_cart'}
                  onClick={handleAddCart}
                  disabled={outOfStock}
                  aria-label="Thêm giỏ hàng"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
                </button>
              </div>
            )}
          </div>

          {/* Promotion / condition note */}
          {product.condition_note && (
            <div className="promotion-content">
              <div className="line-clamp-2-new">
                <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: product.condition_note }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CatalogPrice({ priceMin, priceMax }: { priceMin?: number; priceMax?: number }) {
  if (!priceMin) return <span className="price">Liên hệ</span>
  if (priceMin === priceMax || !priceMax) {
    return <span className="price">{formatVND(priceMin)}đ</span>
  }
  return <span className="price">{formatVND(priceMin)}đ - {formatVND(priceMax)}đ</span>
}

function ShopPrice({ price, salePrice }: { price?: number; salePrice?: number }) {
  if (!price) return <span className="price">Liên hệ</span>
  if (salePrice && salePrice < price) {
    return (
      <>
        <span className="compare-price">{formatVND(price)}đ</span>
        <span className="price">{formatVND(salePrice)}đ</span>
      </>
    )
  }
  return <span className="price">{formatVND(price)}đ</span>
}
