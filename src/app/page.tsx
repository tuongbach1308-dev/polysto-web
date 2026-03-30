import { HeroSlider } from '@/components/home/HeroSlider'
import { SubBanners } from '@/components/home/SubBanners'

export const revalidate = 60

export default async function HomePage() {
  return (
    <>
      <HeroSlider />
      <SubBanners />
      {/* Các sections tiếp theo — Prompt 5+ */}
    </>
  )
}
