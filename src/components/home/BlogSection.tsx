'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

import 'swiper/css'
import 'swiper/css/navigation'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  cover_image?: string
  category: string
  published_at?: string
  created_at: string
}

interface Props {
  posts: Post[]
  title?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  'tin-tuc': 'Tin tức',
  'huong-dan': 'Hướng dẫn',
  'khuyen-mai': 'Khuyến mãi',
  'meo-hay': 'Mẹo hay',
}

export function BlogSection({ posts, title = 'Tin tức & Mẹo hay' }: Props) {
  if (posts.length === 0) return null

  return (
    <section className="blog-section py-[20px]">
      <div className="poly-container">
        <div className="section-title mb-[15px]">
          <h2>{title}</h2>
          <Link href="/bai-viet" className="text-[1.3rem] font-semibold text-brand hover:text-brand-dark transition-colors">
            Xem tất cả →
          </Link>
        </div>

        {/* Desktop: Swiper 4 slides */}
        <div className="hidden md:block">
          <Swiper
            modules={[Navigation]}
            navigation
            slidesPerView={4}
            spaceBetween={16}
            breakpoints={{
              768: { slidesPerView: 2, spaceBetween: 12 },
              992: { slidesPerView: 3, spaceBetween: 14 },
              1200: { slidesPerView: 4, spaceBetween: 16 },
            }}
            className="blog-swiper"
          >
            {posts.map(post => (
              <SwiperSlide key={post.id}>
                <BlogCard post={post} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden flex gap-[10px] overflow-x-auto no-scrollbar pb-[4px]">
          {posts.slice(0, 6).map(post => (
            <div key={post.id} className="shrink-0 w-[80%] xs:w-[60%]">
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .blog-swiper .swiper-button-next,
        .blog-swiper .swiper-button-prev {
          color: #141414;
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          top: 40%;
        }
        .blog-swiper .swiper-button-next::after,
        .blog-swiper .swiper-button-prev::after {
          font-size: 14px;
          font-weight: bold;
        }
      `}</style>
    </section>
  )
}

function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/bai-viet/${post.slug}`} className="blog-card block bg-white overflow-hidden group h-full">
      <div className="relative aspect-[16/10] overflow-hidden">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 767px) 80vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-surface flex items-center justify-center text-[3rem] text-border">📰</div>
        )}
        <span className="absolute top-[8px] left-[8px] bg-brand text-white text-[1.1rem] font-bold px-[8px] py-[2px] rounded-[4px]">
          {CATEGORY_LABELS[post.category] || post.category}
        </span>
      </div>
      <div className="p-[12px]">
        <h3 className="text-[1.4rem] font-bold text-dark leading-[1.4] line-clamp-2 min-h-[40px] group-hover:text-brand transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-[1.2rem] text-price-old mt-[6px] line-clamp-2">{post.excerpt}</p>
        )}
        <time className="text-[1.1rem] text-price-old mt-[8px] block">
          {formatDate(post.published_at || post.created_at)}
        </time>
      </div>
    </Link>
  )
}
