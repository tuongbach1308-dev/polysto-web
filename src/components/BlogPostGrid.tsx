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
  /** Total posts available */
  total?: number;
}

export default function BlogPostGrid({ initialPosts, initialHasMore, categorySlug }: BlogPostGridProps) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({ page: String(nextPage), limit: "9" });
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
  }, [loading, hasMore, page, categorySlug]);

  if (posts.length === 0) {
    return <div className="text-center py-20 text-gray-400">Chưa có bài viết nào.</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-brand-300 hover:text-brand-600 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Đang tải...
              </>
            ) : (
              "Xem thêm bài viết"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

/** Skeleton for loading state */
export function BlogPostGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="aspect-[16/10] bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-2.5">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
            <div className="h-3 bg-gray-100 animate-pulse rounded w-1/2 mt-3" />
          </div>
        </div>
      ))}
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
