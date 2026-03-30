import Image from 'next/image'
import Link from 'next/link'
import { getBanners } from '@/lib/supabase/banners'

export async function SubBanners() {
  const banners = await getBanners('sub_banner')
  if (!banners.length) return null

  const largeBanner = banners[0]
  const smallBanners = banners.slice(1, 3)

  return (
    <section className="section-index section_3_banner">
      <div className="container">
        <div className="row-custom">
          {/* Left: Large banner (8/12) */}
          <div className="banner_large_wrapper" style={{ width: '100%', flex: '0 0 100%' }}>
            <BannerItem banner={largeBanner} sizes="(max-width: 991px) 100vw, 66vw" />
          </div>

          {/* Right: 2 small banners (4/12) */}
          {smallBanners.length > 0 && (
            <div className="banner_small_col" style={{ width: '100%', flex: '0 0 100%' }}>
              <div className="small_banners_wrapper">
                {smallBanners.map(banner => (
                  <BannerItem key={banner.id} banner={banner} sizes="(max-width: 991px) 50vw, 33vw" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive column widths handled in globals.css section 24 */}
    </section>
  )
}

interface BannerItemProps {
  banner: {
    id: string
    title: string
    image_url: string
    link_url?: string
    alt_text?: string
  }
  sizes: string
}

function BannerItem({ banner, sizes }: BannerItemProps) {
  const img = (
    <Image
      src={banner.image_url}
      alt={banner.alt_text || banner.title || 'Banner'}
      width={800}
      height={450}
      sizes={sizes}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )

  if (banner.link_url) {
    return (
      <div className="three_banner">
        <Link href={banner.link_url} className="banner-effect">
          {img}
        </Link>
      </div>
    )
  }

  return (
    <div className="three_banner">
      <div style={{ borderRadius: 12, overflow: 'hidden', height: '100%', width: '100%' }}>
        {img}
      </div>
    </div>
  )
}
