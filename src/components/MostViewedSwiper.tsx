"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { Eye, Clock } from "lucide-react";
import { formatDate } from "@/lib/format";

interface PostItem {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  created_at: string;
  view_count: number;
  reading_time?: number | null;
}

export default function MostViewedSwiper({ posts }: { posts: PostItem[] }) {
  if (!posts.length) return null;

  return (
    <Swiper
      modules={[FreeMode]}
      slidesPerView={1.5}
      spaceBetween={12}
      freeMode={{ enabled: true, sticky: false }}
      breakpoints={{
        480: { slidesPerView: 2.3 },
        768: { slidesPerView: 3.5, spaceBetween: 14 },
        1024: { slidesPerView: 4.5, spaceBetween: 16 },
      }}
      className="!overflow-visible"
    >
      {posts.map((post) => (
        <SwiperSlide key={post.id}>
          <Link href={`/tin-tuc/${post.slug}`} className="group block">
            <div className="aspect-[16/10] rounded-lg overflow-hidden bg-gray-100 mb-2.5">
              {post.thumbnail
                ? <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                : <div className="w-full h-full bg-brand-700 flex items-center justify-center"><span className="text-white/20 text-lg font-black">POLY</span></div>}
            </div>
            <h3 className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">{post.title}</h3>
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400">
              <span>{formatDate(post.created_at)}</span>
              {post.view_count > 0 && <span className="flex items-center gap-0.5"><Eye size={10} /> {post.view_count}</span>}
              {post.reading_time && <span className="flex items-center gap-0.5"><Clock size={10} /> {post.reading_time}p</span>}
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
