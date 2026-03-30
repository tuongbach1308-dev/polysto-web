import Image from 'next/image'
import Link from 'next/link'
import { getWebSettings } from '@/lib/supabase/settings'

export async function PromoBanner() {
  const settings = await getWebSettings()

  const title = settings.promo_banner_title
  const subtitle = settings.promo_banner_subtitle
  const desc = settings.promo_banner_desc
  const image = settings.promo_banner_image
  const link = settings.promo_banner_link
  const bgImage = settings.promo_banner_bg_image

  // Don't render if no title configured
  if (!title) return null

  return (
    <section className="section-index section_banner_new">
      <div className="container">
        <div
          className="bg-banner"
          style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: '#f5f5f5' }}
        >
          <div className="row-custom" style={{ alignItems: 'center' }}>
            {/* Left: Text + CTA */}
            <div className="col-left" style={{ width: '100%', flex: '0 0 100%', paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}>
              {subtitle && <p className="sub-title">{subtitle}</p>}
              <h3>{title}</h3>
              {desc && <p className="desc">{desc}</p>}
              {link && (
                <Link href={link} className="show-more">
                  Xem ngay
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </Link>
              )}
            </div>

            {/* Right: Product image */}
            {image && (
              <div className="col-right" style={{ width: '100%', flex: '0 0 100%', paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)' }}>
                <div className="banner-product use-effect fadeUp">
                  <Image
                    src={image}
                    alt={title}
                    width={573}
                    height={502}
                    sizes="(max-width: 767px) 100vw, 50vw"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive columns via CSS */}
      <style>{`
        @media (min-width: 992px) {
          .section_banner_new .col-left { width: 50% !important; flex: 0 0 50% !important; }
          .section_banner_new .col-right { width: 50% !important; flex: 0 0 50% !important; }
        }
      `}</style>
    </section>
  )
}
