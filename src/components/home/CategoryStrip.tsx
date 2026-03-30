import { createServerClient } from '@/lib/supabase/server'
import { CategoryStripClient } from './CategoryStripClient'

export async function CategoryStrip() {
  const supabase = createServerClient()
  const { data: categories } = await supabase
    .from('web_catalog_categories')
    .select('id, name, slug, icon_url')
    .is('parent_id', null)
    .eq('is_active', true)
    .eq('show_on_homepage', true)
    .order('sort_order')

  if (!categories?.length) return null

  return (
    <section className="section-index section_category">
      <div className="container">
        <CategoryStripClient categories={categories} />
      </div>
    </section>
  )
}
