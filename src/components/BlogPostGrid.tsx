"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Clock, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/format";

interface PostItem {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  excerpt: string | null;
  created_at: string;
  view_count: number;
  reading_time: number | null;
  tags: string[] | null;
}

interface BlogPostGridProps {
  initialPosts: PostItem[];
  initialHasMore: boolean;
  categorySlug?: string;
  /** "grid" = 3-column (categories), "two-column" = left list + right sticky sidebar */
  layout?: "grid" | "two-column";
  /** Categories for the right sidebar (two-column layout only) */
  sidebarCategories?: { name: string; slug: string }[];
}

export default function BlogPostGrid({ initialPosts, initialHasMore, categorySlug, layout = "grid", sidebarCategories }: BlogPostGridProps) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const limit = layout === "two-column" ? 10 : 9;
      const params = new URLSearchParams({ page: String(nextPage), limit: String(limit) });
      if (categorySlug) params.set("category", categorySlug);

      const res = await fetch(`/api/posts?${params}`);
      const data = await res.json();

      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, categorySlug, layout]);

  if (posts.length === 0) {
    return <div className="text-center py-20 text-gray-400">Chưa có bài viết nào.</div>;
  }

  if (layout === "two-column") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Tin tức mới nhất — load more here */}
        <div className="lg:col-span-2">
          <div className="space-y-5">
            {posts.map((post) => (
              <Link key={post.id} href={`/tin-tuc/${post.slug}`} className="group flex gap-4 pb-5 border-b border-gray-100 last:border-0">
                <div className="w-[140px] sm:w-[180px] flex-shrink-0 aspect-[16/10] rounded-lg overflow-hidden bg-gray-100">
                  {post.thumbnail
                    ? <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    : <div className="w-full h-full bg-brand-700 flex items-center justify-center"><span className="text-white/20 font-black">POLY</span></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">{post.title}</h3>
                  {post.excerpt && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed hidden sm:block">{post.excerpt.slice(0, 130)}</p>}
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400">
                    <span>{formatDate(post.created_at)}</span>
                    {post.reading_time && post.reading_time > 0 && <span className="flex items-center gap-0.5"><Clock size={10} /> {post.reading_time} phút</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button onClick={loadMore} disabled={loading}
                className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-brand-300 hover:text-brand-600 transition-colors disabled:opacity-60">
                {loading ? (<><Loader2 size={16} className="animate-spin" /> Đang tải...</>) : "Xem thêm bài viết"}
              </button>
            </div>
          )}
        </div>

        {/* Right: Sticky sidebar — categories + featured tags */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky space-y-6" style={{ top: "var(--sticky-offset)" }}>
            {/* Góc Chọn & Mua */}
            {sidebarCategories && sidebarCategories.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-brand-500 rounded-full" />
                  Góc Chọn & Mua
                </h3>
                <div className="space-y-1">
                  {sidebarCategories.map((c) => (
                    <Link key={c.slug} href={`/tin-tuc/${c.slug}`}
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Xu hướng */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-orange-500 rounded-full" />
                Xu hướng
              </h3>
              <div className="space-y-3">
                {posts.slice(0, 5).map((post) => (
                  <Link key={`trend-${post.id}`} href={`/tin-tuc/${post.slug}`} className="group flex gap-2.5">
                    <div className="w-[60px] flex-shrink-0 aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {post.thumbnail
                        ? <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                        : <div className="w-full h-full bg-brand-700" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[12px] font-medium text-gray-700 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">{post.title}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(post.created_at)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: 3-column grid
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => <PostCard key={post.id} post={post} />)}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button onClick={loadMore} disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-brand-300 hover:text-brand-600 transition-colors disabled:opacity-60">
            {loading ? (<><Loader2 size={16} className="animate-spin" /> Đang tải...</>) : "Xem thêm bài viết"}
          </button>
        </div>
      )}
    </div>
  );
}

function PostCard({ post }: { post: PostItem }) {
  return (
    <Link href={`/tin-tuc/${post.slug}`} className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300">
      <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
        {post.thumbnail
          ? <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          : <div className="w-full h-full bg-brand-700 flex items-center justify-center"><span className="text-white/20 text-2xl font-black">POLY</span></div>}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">{post.title}</h3>
        {post.excerpt && <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{post.excerpt.slice(0, 120)}</p>}
        <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-400">
          <span>{formatDate(post.created_at)}</span>
          {post.reading_time && post.reading_time > 0 && <span className="flex items-center gap-0.5"><Clock size={10} /> {post.reading_time} phút</span>}
        </div>
      </div>
    </Link>
  );
}
