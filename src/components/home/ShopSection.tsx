import Link from 'next/link'
import { ProductCard } from './ProductCard'

interface ShopProduct {
  id: string; name: string; slug: string; thumbnail?: string; images?: string[]
  price: number; sale_price?: number; stock: number; badge?: string
  short_description?: string; installment_text?: string
}

interface Props {
  products: ShopProduct[]
  title?: string
  itemsCount?: number
}

export function ShopSection({ products, title = 'Hàng Newseal — Giá tốt', itemsCount = 10 }: Props) {
  if (products.length === 0) return null
  const displayed = products.slice(0, itemsCount)

  return (
    <section className="shop-section py-[15px]">
      <div className="poly-container">
        <div className="section-title mb-[15px]">
          <h2>{title}</h2>
          <Link href="/shop" className="text-[1.3rem] font-semibold text-brand hover:text-brand-dark transition-colors">
            Xem tất cả →
          </Link>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[10px] xs:gap-[14px]">
          {displayed.map(product => (
            <ProductCard key={product.id} variant="shop" product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
