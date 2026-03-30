import { createServerClient } from '@/lib/supabase/server'
import { CategorySectionClient } from './CategorySectionClient'

interface Props {
  categoryId: string
  categoryName: string
  categorySlug: string
  itemsCount?: number
}

export async function CategorySection({ categoryId, categoryName, categorySlug, itemsCount = 8 }: Props) {
  const supabase = createServerClient()

  // Fetch sub-categories
  const { data: subCategories } = await supabase
    .from('web_catalog_categories')
    .select('id, name, slug')
    .eq('parent_id', categoryId)
    .eq('is_active', true)
    .order('sort_order')

  const tabs = (subCategories || []).map(sc => ({ id: sc.id, name: sc.name, slug: sc.slug }))

  // Fetch products for first sub-category (or parent)
  const defaultCatId = tabs[0]?.id || categoryId
  const { data: products } = await supabase
    .from('web_catalog_products')
    .select('*')
    .eq('category_id', defaultCatId)
    .eq('is_active', true)
    .order('sort_order')
    .limit(itemsCount)

  return (
    <section className="section-index section_product_tab">
      <div className="container">
        <div className="section-title">
          <h2>Sản Phẩm <span>{categoryName}</span></h2>
        </div>

        <CategorySectionClient
          tabs={tabs}
          initialProducts={products || []}
          categorySlug={categorySlug}
          itemsCount={itemsCount}
        />
      </div>
    </section>
  )
}
