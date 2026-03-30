import { getBanners } from '@/lib/supabase/banners'
import { HeroSliderClient } from './HeroSliderClient'

export async function HeroSlider() {
  const banners = await getBanners('hero')
  if (!banners.length) return null
  return <HeroSliderClient banners={banners} />
}
