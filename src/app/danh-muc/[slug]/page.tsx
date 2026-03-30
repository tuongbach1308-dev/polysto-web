import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getCategoryBySlug } from '@/lib/supabase/catalog'
import { ProductCard } from '@/components/product/ProductCard'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { Pagination } from '@/components/shared/Pagination'

export const revalidate = 60
const PER_PAGE = 12

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug)
  if (!category) return {}
  return {
    title: category.meta_title || category.name,
    description: category.meta_description || category.description || '',
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { page?: string }
}) {
  const category = await getCategoryBySlug(params.slug)
  if (!category) notFound()

  const supabase = createServerClient()
  const page = Math.max(1, parseInt(searchParams.page || '1', 10))
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  // Fetch sub-categories
  const { data: subCategories } = await supabase
    .from('web_catalog_categories')
    .select('id, name, slug')
    .eq('parent_id', category.id)
    .eq('is_active', true)
    .order('sort_order')

  // Fetch products with count
  const { data: products, count } = await supabase
    .from('web_catalog_products')
    .select('*', { count: 'exact' })
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('sort_order')
    .range(from, to)

  const totalPages = Math.ceil((count || 0) / PER_PAGE)
  const subs = subCategories || []

  return (
    <>
      <Breadcrumb items={[
        { label: 'Sản phẩm', href: '/san-pham' },
        { label: category.name },
      ]} />

      <section className="section-index section_product_tab">
        <div className="container">
          {/* Section title */}
          <div className="section-title">
            <h2>{category.name}</h2>
          </div>

          {/* Sub-category tabs */}
          {subs.length > 0 && (
            <div className="tab_big">
              <div className="tab_ul">
                <ul>
                  <li className={!searchParams.page ? 'current' : ''}>
                    <Link href={`/danh-muc/${category.slug}`}>
                      <span>Tất cả</span>
                    </Link>
                  </li>
                  {subs.map(sub => (
                    <li key={sub.id}>
                      <Link href={`/danh-muc/${sub.slug}`}>
                        <span>{sub.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Product grid */}
          {(products && products.length > 0) ? (
            <div className="row-custom product-grid-row product-grid-wrap">
              {products.map((product: any) => (
                <div key={product.id} className="product-col">
                  <ProductCard product={product} variant="catalog" />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999', fontSize: '1.4rem' }}>
              Chưa có sản phẩm nào trong danh mục này.
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={`/danh-muc/${params.slug}`}
          />
        </div>
      </section>
    </>
  )
}
