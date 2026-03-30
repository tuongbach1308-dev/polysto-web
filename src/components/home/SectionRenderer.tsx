import { createServerClient } from '@/lib/supabase/server'
import { HeroSlider } from './HeroSlider'
import { SubBanners } from './SubBanners'
import { CategoryStrip } from './CategoryStrip'
import { CategorySection } from './CategorySection'
import { FeaturesStrip } from './FeaturesStrip'
import { FlashSale } from './FlashSale'
import { BlogSection } from './BlogSection'
import { CustomerGallery } from './CustomerGallery'
import { PromoBanner } from './PromoBanner'

interface HomepageSection {
  id: string
  section_type: string
  title?: string
  category_id?: string
  config: Record<string, any>
  sort_order: number
  is_active: boolean
}

export async function SectionRenderer() {
  const supabase = createServerClient()
  const { data: sections } = await supabase
    .from('web_homepage_sections')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (!sections?.length) return null

  // For category_products sections, we need category info
  const categoryIds = sections
    .filter(s => s.section_type === 'category_products' && (s.category_id || s.config?.category_id))
    .map(s => s.category_id || s.config?.category_id)
    .filter(Boolean)

  let categoryMap: Record<string, { id: string; name: string; slug: string }> = {}
  if (categoryIds.length > 0) {
    const { data: cats } = await supabase
      .from('web_catalog_categories')
      .select('id, name, slug')
      .in('id', categoryIds)
    cats?.forEach(c => { categoryMap[c.id] = c })
  }

  return (
    <>
      {sections.map((section: HomepageSection) => {
        switch (section.section_type) {
          case 'hero_banner':
            return <HeroSlider key={section.id} />

          case 'sub_banners':
            return <SubBanners key={section.id} />

          case 'category_strip':
            return <CategoryStrip key={section.id} />

          case 'category_products': {
            const catId = section.category_id || section.config?.category_id
            if (!catId) return null
            const cat = categoryMap[catId]
            if (!cat) return null
            return (
              <CategorySection
                key={section.id}
                categoryId={cat.id}
                categoryName={section.title || cat.name}
                categorySlug={cat.slug}
                itemsCount={section.config?.items_count || 8}
              />
            )
          }

          case 'features':
            return <FeaturesStrip key={section.id} />

          case 'flash_sale':
            return <FlashSale key={section.id} />

          case 'blog_posts':
            return <BlogSection key={section.id} />

          case 'customer_gallery':
            return <CustomerGallery key={section.id} />

          case 'promo_banner':
            return <PromoBanner key={section.id} />

          case 'custom_html':
            if (!section.config?.custom_html) return null
            return (
              <section key={section.id} className="section-index">
                <div className="container" dangerouslySetInnerHTML={{ __html: section.config.custom_html }} />
              </section>
            )

          default:
            return null
        }
      })}
    </>
  )
}
