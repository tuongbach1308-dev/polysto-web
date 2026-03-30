'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import Link from 'next/link'
import { FlashSaleCountdown } from './FlashSaleCountdown'
import { ProductCard } from '@/components/product/ProductCard'

import 'swiper/css'
import 'swiper/css/navigation'

interface Props {
  title: string
  label: string
  endDate: string
  products: any[]
}

export function FlashSaleClient({ title, label, endDate, products }: Props) {
  return (
    <div className="block-sale">
      {/* Header: Title + Countdown */}
      <div className="block-title">
        <h2>
          <Link href={`/danh-muc/${label}`} title={title}>
            {title}
          </Link>
          <span style={{ marginLeft: 5, position: 'relative', bottom: 5, fontSize: '4rem', lineHeight: 1 }}>🔥</span>
        </h2>
        <div className="count-down">
          <FlashSaleCountdown endDate={endDate} />
        </div>
      </div>

      {/* Products */}
      <div className="block-product-sale">
        <div className="swiper_sale">
          <Swiper
            modules={[Navigation]}
            slidesPerView={5}
            spaceBetween={20}
            navigation={true}
            breakpoints={{
              0: { slidesPerView: 2, spaceBetween: 14 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              992: { slidesPerView: 4, spaceBetween: 20 },
              1200: { slidesPerView: 5, spaceBetween: 20 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="product-flash-sale">
                  <div className="box-product-sale">
                    <ProductCard product={product} variant="catalog" />
                  </div>
                  <SoldBar percent={product.sold_percent || 0} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* View more */}
        <div className="view-more">
          <Link href={`/danh-muc/${label}`}>
            Xem tất cả
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

function SoldBar({ percent }: { percent: number }) {
  if (percent <= 0) return null

  return (
    <div className="productcount">
      <div className={`countitem visible ${percent >= 100 ? 'sold-out' : ''}`}>
        <div className="fire">
          <svg width="25" height="25" viewBox="0 0 16 16">
            <defs>
              <linearGradient id="fire-grad" x1="50%" x2="50%" y1="36.31%" y2="88.973%">
                <stop offset="0%" stopColor="#FDD835" />
                <stop offset="100%" stopColor="#FFB500" />
              </linearGradient>
            </defs>
            <g fill="none" fillRule="evenodd">
              <path d="M0 0H16V16H0z" />
              <path
                fill="url(#fire-grad)"
                stroke="#FF424E"
                strokeWidth="1.1"
                d="M9.636 6.506S10.34 2.667 7.454 1c-.087 1.334-.786 2.571-1.923 3.401-1.234 1-3.555 3.249-3.53 5.646-.017 2.091 1.253 4.01 3.277 4.953.072-.935.549-1.804 1.324-2.41.656-.466 1.082-1.155 1.182-1.912 1.729.846 2.847 2.469 2.944 4.27v.012c1.909-.807 3.165-2.533 3.251-4.467.205-2.254-1.134-5.316-2.321-6.317-.448.923-1.144 1.725-2.022 2.33z"
                transform="rotate(4 8 8)"
              />
            </g>
          </svg>
        </div>
        <span className="a-center">Đã bán <b>{percent}%</b></span>
        <div className="countdown" style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
    </div>
  )
}
