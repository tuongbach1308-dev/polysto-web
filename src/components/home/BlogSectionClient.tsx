'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { BlogCard } from './BlogCard'

import 'swiper/css'
import 'swiper/css/navigation'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  cover_image?: string
  published_at?: string
  created_at: string
}

interface Props {
  posts: Post[]
}

export function BlogSectionClient({ posts }: Props) {
  return (
    <>
      {/* Desktop: Swiper */}
      <div className="blog_swiper sm-hidden">
        <Swiper
          modules={[Navigation]}
          slidesPerView={4}
          spaceBetween={20}
          navigation={true}
          breakpoints={{
            768: { slidesPerView: 3, spaceBetween: 20 },
            992: { slidesPerView: 4, spaceBetween: 20 },
          }}
        >
          {posts.map(post => (
            <SwiperSlide key={post.id}>
              <BlogCard post={post} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="blog_swiper md-hidden">
        <div className="blog-mobile-scroll">
          {posts.map(post => (
            <div key={post.id} className="blog-mobile-item">
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
