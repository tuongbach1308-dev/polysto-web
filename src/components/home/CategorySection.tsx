'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ProductCard } from './ProductCard'

interface Category {
  id: string; name: string; slug: string
  children?: { id: string; name: string; slug: string }[]
}

interface CatalogProduct {
  id: string; name: string; slug: string; thumbnail?: string; images?: string[]
  price_min: number; price_max: number; condition_note?: string; badge?: string
  short_description?: string; category_id?: string
}

interface Props {
  category: Category
  products: CatalogProduct[]
  showSubTabs?: boolean
  showViewAll?: boolean
  layout?: string
  itemsCount?: number
}

export function CategorySection({ category, products, showSubTabs = true, showViewAll = true, layout = 'grid-4', itemsCount = 8 }: Props) {
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const children = category.children || []

  // Filter products by sub-category tab
  const filtered = activeTab
    ? products.filter(p => p.category_id === activeTab)
    : products

  const displayed = filtered.slice(0, itemsCount)

  // Grid columns based on layout
  const gridCols = layout === 'grid-3'
    ? 'grid-cols-2 xs:grid-cols-3 lg:grid-cols-3'
    : layout === 'grid-2'
    ? 'grid-cols-2'
    : 'grid-cols-2 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

  return (
    <section className="category-section py-[15px]">
      <div className="poly-container">
        {/* Section title with glass morphism */}
        <div className="section-title mb-[15px]">
          <h2>{category.name}</h2>

          <div className="flex items-center gap-[10px]">
            {/* Sub-category tabs */}
            {showSubTabs && children.length > 0 && (
              <div className="hidden lg:flex items-center gap-[6px]">
                <button
                  onClick={() => setActiveTab(null)}
                  className={`tab-underline text-[1.3rem] font-semibold px-[8px] py-[4px] transition-colors ${
                    activeTab === null ? 'text-dark active' : 'text-price-old hover:text-dark'
                  }`}
                >
                  Tất cả
                </button>
                {children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => setActiveTab(child.id)}
                    className={`tab-underline text-[1.3rem] font-semibold px-[8px] py-[4px] transition-colors ${
                      activeTab === child.id ? 'text-dark active' : 'text-price-old hover:text-dark'
                    }`}
                  >
                    {child.name}
                  </button>
                ))}
              </div>
            )}

            {showViewAll && (
              <Link
                href={`/danh-muc/${category.slug}`}
                className="text-[1.3rem] font-semibold text-brand hover:text-brand-dark transition-colors whitespace-nowrap"
              >
                Xem tất cả →
              </Link>
            )}
          </div>
        </div>

        {/* Mobile sub-tabs as pills */}
        {showSubTabs && children.length > 0 && (
          <div className="lg:hidden flex gap-[8px] overflow-x-auto no-scrollbar mb-[12px] pb-[4px]">
            <button
              onClick={() => setActiveTab(null)}
              className={`shrink-0 text-[1.2rem] font-semibold px-[14px] py-[6px] rounded-pill border transition-colors ${
                activeTab === null
                  ? 'bg-dark text-white border-dark'
                  : 'bg-white text-dark border-border hover:border-dark'
              }`}
            >
              Tất cả
            </button>
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setActiveTab(child.id)}
                className={`shrink-0 text-[1.2rem] font-semibold px-[14px] py-[6px] rounded-pill border transition-colors ${
                  activeTab === child.id
                    ? 'bg-dark text-white border-dark'
                    : 'bg-white text-dark border-border hover:border-dark'
                }`}
              >
                {child.name}
              </button>
            ))}
          </div>
        )}

        {/* Product grid */}
        {displayed.length > 0 ? (
          <div className={`grid ${gridCols} gap-[10px] xs:gap-[14px]`}>
            {displayed.map(product => (
              <ProductCard key={product.id} variant="catalog" product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-[40px] text-price-old text-[1.4rem]">
            Chưa có sản phẩm trong danh mục này
          </div>
        )}
      </div>
    </section>
  )
}
