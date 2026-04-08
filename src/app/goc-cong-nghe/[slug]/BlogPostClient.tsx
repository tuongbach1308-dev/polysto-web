'use client';

import Link from 'next/link';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import BlogCard from '@/components/blog/BlogCard';
import type { BlogPost } from '@/types/blog';
import { blogCategoryLabels } from '@/types/blog';
import { Calendar, User, Clock, ChevronRight, Tag } from 'lucide-react';

interface Props {
  post: BlogPost;
  related: BlogPost[];
  recentPosts: BlogPost[];
}

export default function BlogPostClient({ post, related, recentPosts }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Breadcrumbs
        items={[
          { label: 'Góc công nghệ', href: '/goc-cong-nghe' },
          { label: post.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mt-6">
        {/* Main content */}
        <article>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 bg-navy/10 text-navy text-xs font-semibold px-3 py-1 rounded-full">
              <Tag className="h-3 w-3" />
              {blogCategoryLabels[post.category] || post.category}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-text-dark leading-tight">{post.title}</h1>

          <div className="flex items-center gap-4 mt-3 text-sm text-text-muted">
            <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{post.author}</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.publishedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />3 phút đọc</span>
          </div>

          <div className="mt-6 aspect-[16/9] bg-bg-gray rounded-xl overflow-hidden">
            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
          </div>

          <p className="mt-6 text-base text-text-muted leading-relaxed italic border-l-4 border-navy pl-4">{post.excerpt}</p>

          <div
            className="mt-6 prose prose-base max-w-none prose-headings:text-text-dark prose-headings:font-bold prose-p:text-text-muted prose-p:leading-relaxed prose-a:text-navy prose-li:text-text-muted prose-strong:text-text-dark"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-muted font-medium">Tags:</span>
              <span className="text-xs bg-bg-gray text-text-muted px-2.5 py-1 rounded-full">{blogCategoryLabels[post.category] || post.category}</span>
              <span className="text-xs bg-bg-gray text-text-muted px-2.5 py-1 rounded-full">Apple</span>
            </div>
            <Link href="/goc-cong-nghe" className="text-sm text-navy font-medium link-hover flex items-center gap-1">
              Tất cả bài viết <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-navy px-4 py-3">
              <h3 className="text-sm font-bold text-white uppercase">Bài viết mới nhất</h3>
            </div>
            <div className="divide-y divide-border">
              {recentPosts.map((p, i) => (
                <Link key={p.id} href={`/goc-cong-nghe/${p.slug}`} className="flex items-start gap-3 p-3 hover:bg-bg-gray transition-colors">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-navy/10 text-navy text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-text-dark line-clamp-2 leading-snug">{p.title}</h4>
                    <p className="text-xs text-text-muted mt-1">{p.publishedAt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            <div className="bg-bg-gray px-4 py-3">
              <h3 className="text-sm font-bold text-text-dark uppercase">Danh mục</h3>
            </div>
            <div className="p-3 space-y-1">
              {Object.entries(blogCategoryLabels).map(([key, label]) => (
                <Link key={key} href={`/goc-cong-nghe?tab=${key}`} className="flex items-center justify-between py-2 px-2 text-sm text-text-muted hover:text-navy hover:bg-bg-gray rounded-lg transition-colors">
                  <span>{label}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-text-dark uppercase mb-4">Bài viết liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
