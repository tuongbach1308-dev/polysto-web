'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Category {
  id: string
  name: string
  slug: string
  icon_url?: string
}

interface Props {
  categories: Category[]
}

export function CategoryStripClient({ categories }: Props) {
  return (
    <>
      {/* Desktop: Swiper */}
      <div className="swiper_category sm-hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={5}
          spaceBetween={20}
          navigation={true}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 4, spaceBetween: 15 },
            992: { slidesPerView: 5, spaceBetween: 20 },
          }}
        >
          {categories.map(cat => (
            <SwiperSlide key={cat.id}>
              <CateItem category={cat} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile: 3-col flex wrap grid */}
      <div className="swiper_category md-hidden">
        <div className="cate-mobile-grid">
          {categories.map(cat => (
            <div key={cat.id} className="cate-mobile-item">
              <CateItem category={cat} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function CateItem({ category }: { category: Category }) {
  return (
    <Link href={`/danh-muc/${category.slug}`} className="cate-item">
      <div className="box-cate">
        <div className="cate-image">
          {category.icon_url ? (
            <Image
              src={category.icon_url}
              alt={category.name}
              width={100}
              height={100}
              sizes="100px"
              style={{ width: '100%', height: 'auto' }}
            />
          ) : (
            <div style={{ width: 100, height: 100, background: '#e5e5e5', borderRadius: 8 }} />
          )}
        </div>
        <p className="cate-name">{category.name}</p>
      </div>
    </Link>
  )
}
