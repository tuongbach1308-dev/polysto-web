'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

interface Banner {
  id: string
  title: string
  subtitle?: string
  image_url: string
  image_mobile_url?: string
  link_url?: string
  link_text?: string
}

interface Props {
  banners: Banner[]
  settings: Record<string, string>
}

export function HeroSlider({ banners, settings }: Props) {
  if (banners.length === 0) return null

  const autoplay = settings.slider_autoplay !== 'false'
  const speed = parseInt(settings.slider_speed || '5000', 10)
  const showDots = settings.slider_show_dots !== 'false'
  const showArrows = settings.slider_show_arrows !== 'false'

  return (
    <section className="hero-slider relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={banners.length > 1}
        autoplay={autoplay ? { delay: speed, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
        pagination={showDots ? { clickable: true, dynamicBullets: true } : false}
        navigation={showArrows && banners.length > 1}
        speed={600}
        className="hero-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            {banner.link_url ? (
              <Link href={banner.link_url} className="block banner-shine">
                <BannerImage banner={banner} />
              </Link>
            ) : (
              <div className="banner-shine">
                <BannerImage banner={banner} />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .hero-swiper {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
        }
        .hero-swiper .swiper-slide {
          position: relative;
        }
        .hero-swiper .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #fff;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #7bb842;
          width: 24px;
          border-radius: 5px;
        }
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: #fff;
          width: 40px;
          height: 40px;
          background: rgba(0,0,0,0.3);
          border-radius: 50%;
          transition: background 0.3s ease;
        }
        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover {
          background: rgba(0,0,0,0.6);
        }
        .hero-swiper .swiper-button-next::after,
        .hero-swiper .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }
        @media (max-width: 767px) {
          .hero-swiper {
            border-radius: 0;
          }
          .hero-swiper .swiper-button-next,
          .hero-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </section>
  )
}

function BannerImage({ banner }: { banner: Banner }) {
  return (
    <>
      {/* Desktop image */}
      <div className="hidden md:block relative aspect-[1349/450]">
        <Image
          src={banner.image_url}
          alt={banner.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      {/* Mobile image */}
      <div className="md:hidden relative aspect-[750/500]">
        <Image
          src={banner.image_mobile_url || banner.image_url}
          alt={banner.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
    </>
  )
}
