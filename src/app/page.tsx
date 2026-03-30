import { Fragment } from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { HeroSlider } from '@/components/home/HeroSlider'
import { SubBanners } from '@/components/home/SubBanners'
import { CategoryStrip } from '@/components/home/CategoryStrip'
import { CategorySection } from '@/components/home/CategorySection'
import { FeaturesStrip } from '@/components/home/FeaturesStrip'
import { FlashSale } from '@/components/home/FlashSale'

export const revalidate = 60

export default async function HomePage() {
  const supabase = createServerClient()

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

      {/* Category sections + Features strip after 2nd category */}
      {homeCategories?.map((cat, index) => (
        <Fragment key={cat.id}>
          <CategorySection
            categoryId={cat.id}
            categoryName={cat.name}
            categorySlug={cat.slug}
            itemsCount={8}
          />
          {index === 1 && <FeaturesStrip />}
        </Fragment>
      ))}

      <FlashSale />
    </>
  )
}
