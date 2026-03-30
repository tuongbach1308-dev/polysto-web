import Image from 'next/image'
import Link from 'next/link'
import { formatVND } from '@/lib/utils'

interface Props {
  product: {
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
  }
  variant: 'catalog' | 'shop'
}

export function ProductCard({ product, variant }: Props) {
  const href = variant === 'catalog' ? `/san-pham/${product.slug}` : `/shop/${product.slug}`
  const thumb = product.thumbnail || product.images?.[0]

  return (
    <div className="item_product_main">
      <div className="product-action">
        {/* Badge */}
        {product.badge && <span className="badge-sale-card">{product.badge}</span>}

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
        </div>

        {/* Info */}
        <div className="product-info">
          <h3 className="product-name line-clamp line-clamp-2">
            <Link href={href}>{product.name}</Link>
          </h3>

          <div className="product-price-cart">
            <div className="price-box">
              {variant === 'catalog' ? (
                <CatalogPrice priceMin={product.price_min} priceMax={product.price_max} />
              ) : (
                <ShopPrice price={product.price} salePrice={product.sale_price} />
              )}
            </div>
          </div>

          {/* Condition note */}
          {variant === 'catalog' && product.condition_note && (
            <div className="promotion-content">
              <div className="line-clamp-2-new">
                <p style={{ margin: 0 }}>{product.condition_note}</p>
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
