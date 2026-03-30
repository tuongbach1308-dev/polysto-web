import { createServerClient } from '@/lib/supabase/server'
import { HeroSlider } from '@/components/home/HeroSlider'
import { SubBanners } from '@/components/home/SubBanners'
import { CategoryStrip } from '@/components/home/CategoryStrip'
import { CategorySection } from '@/components/home/CategorySection'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createServerClient()

  // Fetch parent categories that show on homepage
  const { data: homeCategories } = await supabase
    .from('web_catalog_categories')
    .select('id, name, slug')
    .is('parent_id', null)
    .eq('is_active', true)
    .eq('show_on_homepage', true)
    .order('sort_order')

  return (
    <>
      <HeroSlider />
      <SubBanners />
      <CategoryStrip />

      {/* Render 1 section per parent category */}
      {homeCategories?.map(cat => (
        <CategorySection
          key={cat.id}
          categoryId={cat.id}
          categoryName={cat.name}
          categorySlug={cat.slug}
          itemsCount={8}
        />
      ))}
    </>
  )
}
