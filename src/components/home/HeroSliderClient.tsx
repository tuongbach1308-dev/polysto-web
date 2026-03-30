'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

interface Banner {
  id: string
  title: string
  image_url: string
  image_mobile_url?: string
  link_url?: string
  alt_text?: string
}

interface Props {
  banners: Banner[]
}

export function HeroSliderClient({ banners }: Props) {
  return (
    <section className="section_slider">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        speed={300}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        allowTouchMove={true}
        simulateTouch={true}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            <div className="slide-content-wrapper">
              {banner.link_url ? (
                <Link href={banner.link_url} className="banner-effect">
                  <SlideImage banner={banner} priority={index === 0} />
                </Link>
              ) : (
                <SlideImage banner={banner} priority={index === 0} />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

function SlideImage({ banner, priority }: { banner: Banner; priority: boolean }) {
  // If mobile image exists, use picture element approach via CSS
  if (banner.image_mobile_url) {
    return (
      <>
        {/* Desktop */}
        <Image
          src={banner.image_url}
          alt={banner.alt_text || banner.title || 'Banner'}
          width={1260}
          height={500}
          priority={priority}
          sizes="100vw"
          className="sm-hidden-img"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        {/* Mobile */}
        <Image
          src={banner.image_mobile_url}
          alt={banner.alt_text || banner.title || 'Banner'}
          width={750}
          height={500}
          priority={priority}
          sizes="100vw"
          className="md-hidden-img"
          style={{ width: '100%', height: 'auto', display: 'none' }}
        />
      </>
    )
  }

  return (
    <Image
      src={banner.image_url}
      alt={banner.alt_text || banner.title || 'Banner'}
      width={1260}
      height={500}
      priority={priority}
      sizes="100vw"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  )
}
