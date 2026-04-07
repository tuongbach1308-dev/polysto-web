'use client';

import { useState } from 'react';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function BlogPreview() {
  const recentPosts = blogPosts.slice(0, 6);
  const [scrollPos, setScrollPos] = useState(0);

  const scroll = (dir: 'left' | 'right') => {
    const container = document.getElementById('blog-carousel');
    if (!container) return;
    const amount = 400;
    const newPos = dir === 'left' ? scrollPos - amount : scrollPos + amount;
    container.scrollTo({ left: newPos, behavior: 'smooth' });
    setScrollPos(newPos);
  };

  return (
    <section className="bg-navy mt-10">
     <div className="max-w-7xl mx-auto px-4 py-8 lg:py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide">
          Góc công nghệ
        </h2>
        <Link
          href="/goc-cong-nghe"
          className="text-sm text-white/70 font-medium hover:text-white transition-colors flex items-center gap-1"
        >
          Xem tất cả
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Prev */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Next */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div
          id="blog-carousel"
          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
          onScroll={(e) => setScrollPos((e.target as HTMLDivElement).scrollLeft)}
        >
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              href={`/goc-cong-nghe/${post.slug}`}
              className="group shrink-0 w-[320px] lg:w-[380px] rounded-xl overflow-hidden relative"
            >
              {/* Thumbnail */}
              <div className="aspect-[4/3] bg-navy-dark relative overflow-hidden">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />

                {/* Date badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-lg">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </div>

                {/* Text overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-sm lg:text-base leading-snug line-clamp-2 uppercase group-hover:text-white/90 transition-colors">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 text-white/70 text-xs line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
     </div>
      {/* Divider */}
      <hr className="border-white/15" />
    </section>
  );
}
