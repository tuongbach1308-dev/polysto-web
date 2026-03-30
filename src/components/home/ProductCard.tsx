import Image from 'next/image'
import Link from 'next/link'
import { formatVND } from '@/lib/utils'

interface CatalogProduct {
  id: string; name: string; slug: string; thumbnail?: string; images?: string[]
  price_min: number; price_max: number; condition_note?: string; badge?: string
  short_description?: string
}

interface ShopProduct {
  id: string; name: string; slug: string; thumbnail?: string; images?: string[]
  price: number; sale_price?: number; stock: number; badge?: string
  short_description?: string; installment_text?: string
}

type Props =
  | { variant: 'catalog'; product: CatalogProduct }
  | { variant: 'shop'; product: ShopProduct }

export function ProductCard(props: Props) {
  const { variant, product } = props
  const href = variant === 'catalog' ? `/san-pham/${product.slug}` : `/shop/${product.slug}`
  const thumb = product.thumbnail || product.images?.[0]
  const badge = product.badge

  return (
    <Link href={href} className="product-card group block relative">
      {/* Badge */}
      {badge && <span className="badge-sale">{badge}</span>}

      {/* Thumbnail */}
      <div className="product-thumb relative aspect-square rounded-[8px] overflow-hidden bg-surface">
        {thumb ? (
          <Image
            src={thumb}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 480px) 45vw, (max-width: 991px) 30vw, 22vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[4rem] text-border">
            📷
          </div>
        )}

        {/* Action buttons (desktop hover reveal) */}
        <div className="absolute top-[8px] right-[8px] flex flex-col gap-[4px]">
          <button className="action-btn w-[32px] h-[32px] bg-white rounded-full shadow-card flex items-center justify-center text-dark hover:text-brand transition-colors">
            <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
        </div>

        {/* Shop: out of stock overlay */}
        {variant === 'shop' && (props.product as ShopProduct).stock <= 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-[1.3rem] font-bold text-price bg-white/90 px-[12px] py-[4px] rounded-pill">Hết hàng</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-[8px] pb-[4px]">
        <h3 className="text-[1.4rem] font-semibold text-dark leading-[1.4] line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-[6px]">
          {variant === 'catalog' ? (
            <CatalogPrice product={props.product as CatalogProduct} />
          ) : (
            <ShopPrice product={props.product as ShopProduct} />
          )}
        </div>

        {/* Condition note / installment */}
        {variant === 'catalog' && (props.product as CatalogProduct).condition_note && (
          <p className="text-[1.2rem] text-price-old mt-[4px] line-clamp-1">
            {(props.product as CatalogProduct).condition_note}
          </p>
        )}
        {variant === 'shop' && (props.product as ShopProduct).installment_text && (
          <div className="promo-content-card mt-[6px]">
            <span dangerouslySetInnerHTML={{ __html: (props.product as ShopProduct).installment_text || '' }} />
          </div>
        )}
      </div>
    </Link>
  )
}

function CatalogPrice({ product }: { product: CatalogProduct }) {
  if (product.price_min === product.price_max) {
    return <span className="price-sale">{formatVND(product.price_min)}đ</span>
  }
  return (
    <span className="price-sale text-[1.5rem]">
      {formatVND(product.price_min)}đ - {formatVND(product.price_max)}đ
    </span>
  )
}

function ShopPrice({ product }: { product: ShopProduct }) {
  if (product.sale_price && product.sale_price < product.price) {
    const discount = Math.round((1 - product.sale_price / product.price) * 100)
    return (
      <div className="flex items-center gap-[8px] flex-wrap">
        <span className="price-sale">{formatVND(product.sale_price)}đ</span>
        <span className="price-old">{formatVND(product.price)}đ</span>
        <span className="inline-block bg-price text-white text-[1.1rem] font-bold px-[6px] py-[1px] rounded-[4px]">
          -{discount}%
        </span>
      </div>
    )
  }
  return <span className="price-sale">{formatVND(product.price)}đ</span>
}
