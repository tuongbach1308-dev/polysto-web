'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { ProductCard } from './ProductCard'

import 'swiper/css'
import 'swiper/css/navigation'

interface Props {
  products: any[]
  variant: 'catalog' | 'shop'
}

export function ProductRelated({ products, variant }: Props) {
  if (!products.length) return null

  return (
    <section className="section-index">
      <div className="section-title">
        <h2>Sản phẩm <span>liên quan</span></h2>
      </div>

      <div className="swiper_product_related">
        <Swiper
          modules={[Navigation]}
          slidesPerView={5}
          spaceBetween={20}
          navigation={true}
          breakpoints={{
            0: { slidesPerView: 2, spaceBetween: 14 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            992: { slidesPerView: 4, spaceBetween: 20 },
            1200: { slidesPerView: 5, spaceBetween: 20 },
          }}
        >
          {products.map(p => (
            <SwiperSlide key={p.id}>
              <ProductCard product={p} variant={variant} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
