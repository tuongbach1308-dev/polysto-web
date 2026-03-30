'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Thumbs, FreeMode } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

interface Props {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)

  if (!images.length) {
    return (
      <div className="gallery-top">
        <div style={{ paddingBottom: '100%', position: 'relative', background: '#f5f5f5', borderRadius: 12 }}>
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', color: '#ccc' }}>📷</span>
        </div>
      </div>
    )
  }

  return (
    <div className="product-gallery">
      {/* Main image */}
      <div className="gallery-top">
        <Swiper
          modules={[Navigation, Thumbs]}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          navigation={true}
          loop={images.length > 1}
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <div className="gallery-main-slide">
                <Image
                  src={img}
                  alt={`${name} - ${i + 1}`}
                  width={600}
                  height={600}
                  priority={i === 0}
                  sizes="(max-width: 991px) 100vw, 40vw"
                  style={{ width: 'auto', maxHeight: '100%', objectFit: 'contain', position: 'absolute', inset: 0, margin: 'auto' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="gallery-thumbs">
          <Swiper
            modules={[Navigation, FreeMode, Thumbs]}
            onSwiper={setThumbsSwiper}
            slidesPerView={5}
            spaceBetween={10}
            freeMode={true}
            watchSlidesProgress={true}
            navigation={true}
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <div className="p-100">
                  <Image
                    src={img}
                    alt={`Thumb ${i + 1}`}
                    width={100}
                    height={100}
                    sizes="100px"
                    style={{ width: 'auto', maxHeight: '100%', objectFit: 'contain', position: 'absolute', inset: 0, margin: 'auto' }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  )
}
