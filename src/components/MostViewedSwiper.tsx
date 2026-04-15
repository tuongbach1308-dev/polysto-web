"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { Eye, Clock, ChevronLeft, ChevronRight } from "lucide-react";
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
  const swiperRef = useRef<SwiperType | null>(null);

  if (!posts.length) return null;

  return (
    <div className="relative group/swiper">
      <Swiper
        modules={[Navigation]}
        onSwiper={(s) => { swiperRef.current = s; }}
        slidesPerView={1.5}
        spaceBetween={12}
        breakpoints={{
          480: { slidesPerView: 2.3 },
          768: { slidesPerView: 3.5, spaceBetween: 14 },
          1024: { slidesPerView: 4, spaceBetween: 16 },
        }}
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id}>
            <Link href={`/tin-tuc/${post.slug}`} className="group block">
              <div className="aspect-[16/10] rounded-lg overflow-hidden bg-gray-100 mb-2.5 relative">
                {post.thumbnail
                  ? <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 480px) 66vw, (max-width: 768px) 43vw, 25vw" />
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

      {/* Prev/Next buttons */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-0 top-[25%] -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-brand-600 hover:border-brand-300 transition-all opacity-0 group-hover/swiper:opacity-100"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-0 top-[25%] translate-x-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-brand-600 hover:border-brand-300 transition-all opacity-0 group-hover/swiper:opacity-100"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
