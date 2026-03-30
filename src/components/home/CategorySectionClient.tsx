'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { SubCategoryTabs } from './SubCategoryTabs'
import { ProductCard } from '@/components/product/ProductCard'

interface Tab {
  id: string
  name: string
  slug: string
}

interface Props {
  tabs: Tab[]
  initialProducts: any[]
  categorySlug: string
  itemsCount: number
}

export function CategorySectionClient({ tabs, initialProducts, categorySlug, itemsCount }: Props) {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || '')
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState(false)

  const handleTabChange = useCallback(async (tabId: string) => {
    if (tabId === activeTabId) return
    setActiveTabId(tabId)
    setLoading(true)
    try {
      const res = await fetch(`/api/products?category_id=${tabId}&limit=${itemsCount}`)
      const data = await res.json()
      setProducts(data.products || [])
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [activeTabId, itemsCount])

  return (
    <div className="tab_big">
      {/* Sub-category tabs */}
      {tabs.length > 1 && (
        <SubCategoryTabs tabs={tabs} activeTabId={activeTabId} onTabChange={handleTabChange} />
      )}

      {/* Product grid */}
      <div className="tab-content current" style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        {products.length > 0 ? (
          <div className="row-custom product-grid-row">
            {products.map((product: any) => (
              <div key={product.id} className="product-col">
                <ProductCard product={product} variant="catalog" />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999', fontSize: '1.4rem' }}>
            Chưa có sản phẩm
          </div>
        )}

        {/* View more */}
        <div className="view-more">
          <Link href={`/danh-muc/${categorySlug}`}>
            Xem tất cả
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
