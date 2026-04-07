'use client';

import { useState } from 'react';
import Link from 'next/link';
import { blogPosts, getBlogPosts } from '@/data/blog-posts';
import { blogCategoryLabels } from '@/types/blog';
import type { BlogPost } from '@/types/blog';
import Pagination from '@/components/product/Pagination';

// Hot topics
const hotTopics = ['iPad Pro M4', 'MacBook Air M3', 'AirPods Pro 2', 'Apple Pencil', 'iPad Mini 7', 'Trả góp 0%'];

function PostMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex items-center gap-2 text-xs text-text-muted">
      <span className="font-medium text-navy">{post.author}</span>
      <span>-</span>
      <span>{post.publishedAt}</span>
    </div>
  );
}

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [newsPage, setNewsPage] = useState(1);
  const perPage = 6;

  const featured = blogPosts[0];
  const sidebarFeatured = blogPosts.slice(1, 4);
  const weeklyPopular = blogPosts.slice(0, 6);

  const newsCategory = activeTab === 'all' ? undefined : activeTab;
  const { posts: newsPosts, total: newsTotal } = getBlogPosts(newsCategory, newsPage, perPage);
  const newsTotalPages = Math.ceil(newsTotal / perPage);

  const tipsPosts = blogPosts.filter(p => p.category === 'phu-kien' || p.category === 'ipad').slice(0, 5);

  const tabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'tin-tuc', label: 'Tin tức' },
    { key: 'ipad', label: 'iPad' },
    { key: 'macbook', label: 'Macbook' },
    { key: 'phu-kien', label: 'Phụ kiện' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* CHỦ ĐỀ HOT */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-text-dark uppercase tracking-wide mb-3">Chủ đề hot</h2>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {hotTopics.map((topic) => (
            <span key={topic} className="shrink-0 px-3 py-1.5 bg-bg-gray border border-border rounded-full text-xs text-text-muted hover:text-navy hover:border-navy cursor-pointer transition-colors">
              #{topic}
            </span>
          ))}
        </div>
      </section>

      {/* NỔI BẬT NHẤT - 1 big left + 3 small right */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-text-dark uppercase tracking-wide mb-4">Nổi bật nhất</h2>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
          {/* Big featured - text overlaid on image */}
          <Link href={`/goc-cong-nghe/${featured.slug}`} className="group relative block bg-bg-gray rounded-lg overflow-hidden lg:row-span-3">
            <div className="w-full h-full min-h-[280px] lg:min-h-0 flex items-center justify-center">
              <img src={featured.thumbnail} alt={featured.title} className="w-full h-full object-cover" />
            </div>
            {/* Gradient overlay + text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
              <span className="self-start bg-navy text-white text-[10px] font-medium px-2 py-0.5 rounded mb-2">
                {blogCategoryLabels[featured.category]}
              </span>
              <h3 className="text-lg font-bold text-white group-hover:opacity-90 line-clamp-2">
                {featured.title}
              </h3>
              <p className="text-sm text-white/70 mt-1 line-clamp-2">{featured.excerpt}</p>
              <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                <span className="font-medium text-white/80">{featured.author}</span>
                <span>-</span>
                <span>{featured.publishedAt}</span>
              </div>
            </div>
          </Link>

          {/* 3 small sidebar */}
          {sidebarFeatured.map((post) => (
            <Link key={post.id} href={`/goc-cong-nghe/${post.slug}`} className="group flex gap-3 bg-white border border-border rounded-lg p-3 items-center">
              <div className="w-24 h-16 shrink-0 bg-bg-gray rounded flex items-center justify-center">
                <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover rounded" loading="lazy" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-text-dark group-hover:text-navy transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h4>
                <div className="mt-1"><PostMeta post={post} /></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* XEM NHIỀU TUẦN QUA - 6 items grid */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-text-dark uppercase tracking-wide mb-4">Xem nhiều tuần qua</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {weeklyPopular.map((post) => (
            <Link key={post.id} href={`/goc-cong-nghe/${post.slug}`} className="group block bg-white border border-border rounded-lg overflow-hidden">
              <div className="aspect-[4/3] bg-bg-gray flex items-center justify-center">
                <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-2">
                <h4 className="text-xs font-medium text-text-dark group-hover:text-navy transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h4>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-text-muted">
                  <span>{post.author}</span> - <span>{post.publishedAt}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TIN TỨC MỚI NHẤT + GÓC CHỌN & MUA - 2 columns */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

          {/* Left - Tin tức mới nhất */}
          <div id="news-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-text-dark uppercase tracking-wide">Tin tức mới nhất</h2>
              {/* Tabs */}
              <div className="flex gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setNewsPage(1); }}
                    className={`px-2.5 py-1 text-xs rounded transition-colors ${
                      activeTab === tab.key
                        ? 'bg-navy text-white'
                        : 'text-text-muted hover:text-text-dark'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* News list */}
            <div className="space-y-4">
              {newsPosts.map((post) => (
                <Link key={post.id} href={`/goc-cong-nghe/${post.slug}`} className="group flex gap-4 pb-4 border-b border-border last:border-0">
                  <div className="w-36 h-24 shrink-0 bg-bg-gray rounded-lg flex items-center justify-center">
                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-text-dark group-hover:text-navy transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-text-muted mt-1 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-2"><PostMeta post={post} /></div>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination currentPage={newsPage} totalPages={newsTotalPages} onPageChange={setNewsPage} scrollTargetId="news-section" />
          </div>

          {/* Right - Góc chọn & mua */}
          <div>
            <h2 className="text-sm font-bold text-text-dark uppercase tracking-wide mb-4">Góc Chọn & Mua</h2>
            <div className="space-y-3">
              {tipsPosts.map((post) => (
                <Link key={post.id} href={`/goc-cong-nghe/${post.slug}`} className="group flex gap-3 items-start">
                  <div className="w-20 h-14 shrink-0 bg-bg-gray rounded flex items-center justify-center">
                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover rounded" loading="lazy" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-text-dark group-hover:text-navy transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h4>
                    <span className="text-[10px] text-text-muted mt-0.5 block">{post.publishedAt}</span>
                  </div>
                </Link>
              ))}
              <Link href="/goc-cong-nghe" className="text-xs text-navy font-medium link-hover block mt-2">
                Xem thêm →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
