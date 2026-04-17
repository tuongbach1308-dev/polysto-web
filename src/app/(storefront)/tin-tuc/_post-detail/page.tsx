import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import PostTOC from "@/components/PostTOC";
import JsonLd from "@/components/JsonLd";
import { Newspaper, MessageCircleQuestion, MonitorSmartphone, ThumbsUp, Lightbulb, Tag, Users } from "lucide-react";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://polystore.vn";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const supabase = await createClient();
  const { slug } = await params;
  const { data: post } = await supabase.from("posts").select("title, excerpt, content, thumbnail, meta_description").eq("slug", slug).single();
  if (!post) return { title: "Bài viết không tồn tại" };
  const desc = post.meta_description || post.excerpt || (post.content ? post.content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().substring(0, 160) : null) || `Đọc bài viết "${post.title}" tại POLY Store`;
  return {
    title: post.title,
    description: desc,
    alternates: { canonical: `/tin-tuc/${slug}` },
    openGraph: {
      title: post.title,
      description: desc,
      url: `/tin-tuc/${slug}`,
      type: "article",
      images: post.thumbnail ? [{ url: post.thumbnail }] : undefined,
    },
  };
}

const BLOG_CATEGORIES = [
  { label: "Tin công nghệ", href: "/tin-tuc?cat=tin-cong-nghe", icon: Newspaper, hasChildren: true },
  { label: "Tư vấn", href: "/tin-tuc?cat=tu-van", icon: MessageCircleQuestion, hasChildren: true },
  { label: "Trên tay", href: "/tin-tuc?cat=tren-tay", icon: MonitorSmartphone, hasChildren: true },
  { label: "Đánh giá", href: "/tin-tuc?cat=danh-gia", icon: ThumbsUp, hasChildren: true },
  { label: "Thủ thuật - Hỏi đáp", href: "/tin-tuc?cat=thu-thuat", icon: Lightbulb, hasChildren: true },
  { label: "Khuyến mãi", href: "/tin-tuc?cat=khuyen-mai", icon: Tag },
  { label: "Tuyển dụng", href: "/tin-tuc?cat=tuyen-dung", icon: Users },
];

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient();
  const { slug } = await params;
  const { data: post } = await supabase.from("posts").select("*").eq("slug", slug).single();
  if (!post) notFound();

  const { data: relatedPosts } = await supabase
    .from("posts")
    .select("id, title, slug, thumbnail, created_at")
    .eq("status", "published")
    .neq("slug", slug)
    .order("created_at", { ascending: false })
    .limit(4);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.thumbnail || undefined,
    author: { "@type": "Person", name: post.author },
    datePublished: post.created_at,
    dateModified: post.updated_at,
    publisher: { "@type": "Organization", name: "POLY Store", logo: { "@type": "ImageObject", url: `${siteUrl}/logo.svg` } },
    description: post.excerpt || undefined,
  };

  return (
    <div className="bg-surface min-h-screen">
      <JsonLd data={articleJsonLd} />
      <div className="max-w-[1200px] mx-auto px-4 py-4">

        {/* ── Layout: sidebar + content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* ══ Sidebar — sticky ══ */}
          <aside className="hidden lg:block lg:col-span-1 order-2 lg:order-1">
            <div className="sticky space-y-6" style={{ top: "var(--sticky-offset)" }}>
              {/* Blog category nav */}
              <nav className="space-y-0.5">
                {BLOG_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-brand-50 transition-colors"
                  >
                    <cat.icon size={18} className="text-gray-400 group-hover:text-brand-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700 group-hover:text-brand-600 flex-1 transition-colors">
                      {cat.label}
                    </span>
                    {cat.hasChildren && (
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-400" />
                    )}
                  </Link>
                ))}
              </nav>

              {/* TOC — below categories */}
              <div className="border-t border-gray-200 pt-4">
                <PostTOC />
              </div>
            </div>
          </aside>

          {/* ══ Main content column ══ */}
          <div className="lg:col-span-3 order-1 lg:order-2">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
              <Link href="/" className="hover:text-brand-600 transition-colors">Trang chủ</Link>
              <ChevronRight size={12} />
              <Link href="/tin-tuc" className="hover:text-brand-600 transition-colors">Góc Công Nghệ</Link>
              {post.tags?.[0] && (
                <>
                  <ChevronRight size={12} />
                  <span className="text-gray-500">{post.tags[0]}</span>
                </>
              )}
            </nav>

            {/* ── Hero image — only in content column ── */}
            {post.thumbnail && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>
            )}

            {/* ── Content card — overlaps hero image ── */}
            <div className={`bg-white rounded-lg border border-gray-200 px-6 md:px-8 py-6 ${post.thumbnail ? "-mt-16 relative z-10 mx-4" : "mt-0"}`}>

              {/* Tag badge */}
              {post.tags?.[0] && (
                <span className="inline-block text-xs font-semibold text-white bg-brand-500 px-3 py-1 rounded mb-4">
                  {post.tags[0]}
                </span>
              )}

              <article>
                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
                  {post.title}
                </h1>

                {/* Author + date */}
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-600 text-sm font-bold">
                      {post.author?.charAt(0)?.toUpperCase() || "P"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-600">{post.author}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      Ngày cập nhật: {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>

                {/* Excerpt — bold intro */}
                {post.excerpt && (
                  <p className="text-[15px] text-gray-700 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                )}

                {/* Body */}
                {post.content && (
                  <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
              </article>

              {/* Tags footer */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Related posts — bottom */}
            {relatedPosts && relatedPosts.length > 0 && (
              <div className="mt-10">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Bài viết liên quan</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedPosts.map((p) => (
                    <Link key={p.id} href={`/tin-tuc/${p.slug}`} className="group block">
                      <div className="aspect-[16/10] rounded-lg overflow-hidden bg-gray-100 mb-2">
                        {p.thumbnail ? (
                          <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full bg-brand-700 flex items-center justify-center">
                            <span className="text-white/30 text-lg font-black">POLY</span>
                          </div>
                        )}
                      </div>
                      <h4 className="text-[13px] font-medium text-gray-700 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1">{formatDate(p.created_at)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
