import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { ChevronRight, Home, Eye, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import PostTOC from "@/components/PostTOC";
import JsonLd from "@/components/JsonLd";
import BlogPostGrid from "@/components/BlogPostGrid";
import MostViewedSwiper from "@/components/MostViewedSwiper";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildPostMetadata } from "@/lib/seo";
import type { Post } from "@/lib/database.types";
import { Newspaper, MessageCircleQuestion, MonitorSmartphone, ThumbsUp, Lightbulb, Tag, Users } from "lucide-react";

export const revalidate = 60;

interface PostCategory { id: string; name: string; slug: string; description: string | null; parent_id: string | null; sort_order: number }
type PostRow = Record<string, unknown>;
const POST_FIELDS = "id, title, slug, thumbnail, excerpt, created_at, view_count, reading_time, tags";

const SIDEBAR_ICONS: Record<string, typeof Newspaper> = {
  "tin-cong-nghe": Newspaper, "tu-van": MessageCircleQuestion, "tren-tay": MonitorSmartphone,
  "danh-gia": ThumbsUp, "thu-thuat": Lightbulb, "khuyen-mai": Tag, "tuyen-dung": Users,
};

async function resolveCategory(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("post_categories").select("*").eq("slug", slug).single();
  return data as PostCategory | null;
}

async function findPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("status", "published").single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug: slugPath = [] } = await params;
  if (slugPath.length === 0) return { title: "Góc Công Nghệ - Tin tức Apple", description: "Tin tức công nghệ, đánh giá, trên tay sản phẩm Apple tại POLY Store.", alternates: { canonical: "/tin-tuc" } };

  const post = await findPost(slugPath[slugPath.length - 1]);
  if (post) return buildPostMetadata({ post: post as Post, url: `/tin-tuc/${slugPath.join("/")}` });

  const cat = await resolveCategory(slugPath[0]);
  if (cat) return { title: `${cat.name} - Góc Công Nghệ`, description: cat.description || `Bài viết về ${cat.name} tại POLY Store`, alternates: { canonical: `/tin-tuc/${slugPath.join("/")}` } };
  return { title: "Tin tức" };
}

export default async function BlogCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const supabase = await createClient();
  const { slug: slugPath = [] } = await params;

  // ── Post detail ──
  if (slugPath.length > 0) {
    const post = await findPost(slugPath[slugPath.length - 1]);
    if (post) return renderPostDetail(post, slugPath);
  }

  // ── Categories sidebar (shared) ──
  const { data: allPostCats } = await supabase.from("post_categories").select("*").order("sort_order");
  const childCats = (allPostCats || []).filter((c: PostCategory) => c.parent_id !== null);

  // ── Category listing ──
  if (slugPath.length > 0) {
    const activeCat = await resolveCategory(slugPath[0]);
    if (!activeCat) notFound();
    return renderCategoryListing(supabase, activeCat, childCats);
  }

  // ── Main listing (magazine) ──
  return renderMainListing(supabase, childCats);
}

// ════════════════════════════════════════════════════════════
// SIDEBAR (shared by all listing/detail views)
// ════════════════════════════════════════════════════════════
function Sidebar({ categories, activeCatId }: { categories: PostCategory[]; activeCatId?: string }) {
  return (
    <aside className="hidden lg:block lg:col-span-1">
      <div className="sticky space-y-1" style={{ top: "var(--sticky-offset)" }}>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Danh mục</h3>
        <Link href="/tin-tuc" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${!activeCatId ? "bg-brand-50 text-brand-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
          <Newspaper size={15} className={!activeCatId ? "text-brand-500" : "text-gray-400"} />
          Tất cả
        </Link>
        {categories.map((cat) => {
          const Icon = SIDEBAR_ICONS[cat.slug] || Newspaper;
          const active = cat.id === activeCatId;
          return (
            <Link key={cat.id} href={`/tin-tuc/${cat.slug}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-brand-50 text-brand-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
              <Icon size={15} className={active ? "text-brand-500" : "text-gray-400"} />
              {cat.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN LISTING (/tin-tuc) — Magazine layout
// ════════════════════════════════════════════════════════════
async function renderMainListing(supabase: Awaited<ReturnType<typeof createClient>>, childCats: PostCategory[]) {
  // Featured: latest 4
  const { data: featured } = await supabase.from("posts").select(POST_FIELDS).eq("status", "published").order("created_at", { ascending: false }).limit(4);
  const featuredIds = (featured || []).map((p) => p.id);

  // Most viewed (exclude featured, max 10)
  const { data: mostViewedRaw } = await supabase.from("posts").select("id, title, slug, thumbnail, created_at, view_count, reading_time").eq("status", "published").order("view_count", { ascending: false }).limit(14);
  const mostViewed = (mostViewedRaw || []).filter((p) => !featuredIds.includes(p.id)).slice(0, 10);

  // Latest posts for 2-column "load more" (skip first 4 featured)
  const PER_PAGE = 10;
  const { data: latestPosts, count: totalCount } = await supabase.from("posts")
    .select(POST_FIELDS, { count: "exact" }).eq("status", "published")
    .order("created_at", { ascending: false }).range(4, 4 + PER_PAGE - 1);

  const hasMore = (4 + PER_PAGE) < (totalCount || 0);

  // Category icons for banner
  const CAT_ICONS: Record<string, string> = {
    "tin-cong-nghe": "📱", "danh-gia": "⭐", "tren-tay": "🤳",
    "tu-van": "💡", "thu-thuat": "🔧", "khuyen-mai": "🎁",
  };

  return (
    <div className="bg-surface min-h-screen">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Trang chủ", url: "/" }, { name: "Tin tức", url: "/tin-tuc" }])} />
      <div className="max-w-[1200px] mx-auto px-4 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Sidebar categories={childCats} />

          <div className="lg:col-span-3 space-y-8">
            <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức" }]} />

            {/* ── Category banner — 1 dòng 6 cards ── */}
            <section className="flex gap-3 overflow-x-auto lg:grid lg:grid-cols-6 lg:overflow-visible -mt-3" style={{ scrollbarWidth: "none" }}>
              {childCats.map((c) => (
                <Link key={c.id} href={`/tin-tuc/${c.slug}`}
                  className="group flex-shrink-0 w-[100px] lg:w-auto flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-white border border-gray-100 hover:border-brand-300 hover:shadow-md transition-all text-center">
                  <span className="text-2xl">{CAT_ICONS[c.slug] || "📄"}</span>
                  <span className="text-[11px] font-semibold text-gray-700 group-hover:text-brand-600 transition-colors leading-tight">{c.name}</span>
                </Link>
              ))}
            </section>

            {/* ── Nổi bật nhất (was "Chủ đề hot") ── */}
            {featured && featured.length > 0 && (
              <section>
                <SectionTitle title="Nổi bật nhất" color="red" />
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  <Link href={`/tin-tuc/${featured[0].slug}`} className="lg:col-span-3 group relative min-h-[260px] lg:min-h-[340px] rounded-xl overflow-hidden bg-gray-100 block">
                    {featured[0].thumbnail ? <img src={featured[0].thumbnail} alt={featured[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="absolute inset-0 bg-brand-800" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      {featured[0].tags?.[0] && <span className="inline-block text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded mb-2">{featured[0].tags[0]}</span>}
                      <h2 className="text-white text-lg lg:text-xl font-bold leading-tight line-clamp-3 group-hover:text-brand-300 transition-colors">{featured[0].title}</h2>
                      <p className="text-white/60 text-xs mt-2">{formatDate(featured[0].created_at)}</p>
                    </div>
                  </Link>
                  <div className="lg:col-span-2 grid grid-cols-1 gap-3">
                    {featured.slice(1, 4).map((p) => (
                      <Link key={p.id} href={`/tin-tuc/${p.slug}`} className="group flex gap-3">
                        <div className="w-[110px] lg:w-[130px] flex-shrink-0 aspect-[16/10] rounded-lg overflow-hidden bg-gray-100">
                          {p.thumbnail ? <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" /> : <div className="w-full h-full bg-brand-700" />}
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <h3 className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">{p.title}</h3>
                          <p className="text-[11px] text-gray-400 mt-1.5">{formatDate(p.created_at)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── Xem nhiều nhất — Swiper horizontal ── */}
            {mostViewed.length > 0 && (
              <section>
                <SectionTitle title="Xem nhiều nhất" color="orange" />
                <MostViewedSwiper posts={mostViewed} />
              </section>
            )}

            {/* ── Tin tức mới nhất — left list + right sticky sidebar ── */}
            <section>
              <SectionTitle title="Tin tức mới nhất" />
              <BlogPostGrid
                initialPosts={latestPosts || []}
                initialHasMore={hasMore}
                layout="two-column"
                sidebarCategories={childCats.map(c => ({ name: c.name, slug: c.slug }))}
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// CATEGORY LISTING (/tin-tuc/[slug]) — Sidebar + 3-col grid + load more
// ════════════════════════════════════════════════════════════
async function renderCategoryListing(supabase: Awaited<ReturnType<typeof createClient>>, activeCat: PostCategory, childCats: PostCategory[]) {
  const { data: ppcs } = await supabase.from("post_post_categories").select("post_id").eq("category_id", activeCat.id);
  const postIds = ppcs?.map((p) => p.post_id) || [];

  let posts: PostRow[] = [];
  let hasMore = false;
  const PER_PAGE = 9;

  if (postIds.length > 0) {
    const { data, count } = await supabase.from("posts")
      .select(POST_FIELDS, { count: "exact" }).eq("status", "published").in("id", postIds)
      .order("created_at", { ascending: false }).range(0, PER_PAGE - 1);
    posts = data || [];
    hasMore = PER_PAGE < (count || 0);
  }

  return (
    <div className="bg-surface min-h-screen">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Trang chủ", url: "/" }, { name: "Tin tức", url: "/tin-tuc" }, { name: activeCat.name, url: `/tin-tuc/${activeCat.slug}` }])} />
      <div className="max-w-[1200px] mx-auto px-4 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Sidebar categories={childCats} activeCatId={activeCat.id} />

          <div className="lg:col-span-3 space-y-6">
            <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức", href: "/tin-tuc" }, { label: activeCat.name }]} />

            {/* Mobile category pills */}
            <div className="flex gap-2 overflow-x-auto lg:hidden" style={{ scrollbarWidth: "none" }}>
              <Link href="/tin-tuc" className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white border border-gray-200 text-gray-600 flex-shrink-0">Tất cả</Link>
              {childCats.map((c) => (
                <Link key={c.id} href={`/tin-tuc/${c.slug}`}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 whitespace-nowrap ${c.id === activeCat.id ? "bg-brand-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
                  {c.name}
                </Link>
              ))}
            </div>

            {/* Category header */}
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-heading">{activeCat.name}</h1>
              {activeCat.description && <p className="text-sm text-gray-500 mt-1">{activeCat.description}</p>}
            </div>

            {/* Posts grid + load more */}
            <BlogPostGrid initialPosts={posts as any[]} initialHasMore={hasMore} categorySlug={activeCat.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// POST DETAIL — Sidebar categories + TOC
// ════════════════════════════════════════════════════════════
async function renderPostDetail(post: PostRow, slugPath: string[]) {
  const supabase = await createClient();

  const { data: allPostCats } = await supabase.from("post_categories").select("*").order("sort_order");
  const childCats = (allPostCats || []).filter((c: PostCategory) => c.parent_id !== null);

  const { data: relatedPosts } = await supabase.from("posts")
    .select("id, title, slug, thumbnail, created_at, reading_time")
    .eq("status", "published").neq("slug", post.slug as string)
    .order("created_at", { ascending: false }).limit(3);

  const { data: postCatLinks } = await supabase.from("post_post_categories").select("category_id").eq("post_id", post.id as string).limit(1);
  let postCat: PostCategory | null = null;
  if (postCatLinks?.[0]) {
    const { data } = await supabase.from("post_categories").select("*").eq("id", postCatLinks[0].category_id).single();
    postCat = data;
  }

  const breadcrumbItems = [{ name: "Trang chủ", url: "/" }, { name: "Tin tức", url: "/tin-tuc" }];
  if (postCat) breadcrumbItems.push({ name: postCat.name, url: `/tin-tuc/${postCat.slug}` });
  breadcrumbItems.push({ name: post.title as string, url: `/tin-tuc/${slugPath.join("/")}` });

  return (
    <div className="bg-surface min-h-screen">
      <JsonLd data={buildArticleJsonLd({ post: post as unknown as Post, url: `/tin-tuc/${slugPath.join("/")}` })} />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
      <div className="max-w-[1200px] mx-auto px-4 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar: categories + TOC */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky space-y-5" style={{ top: "var(--sticky-offset)" }}>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Danh mục</h3>
                {childCats.map((cat: PostCategory) => {
                  const Icon = SIDEBAR_ICONS[cat.slug] || Newspaper;
                  const active = postCat?.id === cat.id;
                  return (
                    <Link key={cat.id} href={`/tin-tuc/${cat.slug}`}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-brand-50 text-brand-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
                      <Icon size={15} className={active ? "text-brand-500" : "text-gray-400"} />
                      {cat.name}
                    </Link>
                  );
                })}
              </div>
              <div className="border-t border-gray-200 pt-4">
                <PostTOC />
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            <Breadcrumb items={[
              { label: "Trang chủ", href: "/" },
              { label: "Tin tức", href: "/tin-tuc" },
              ...(postCat ? [{ label: postCat.name, href: `/tin-tuc/${postCat.slug}` }] : []),
              { label: post.title as string },
            ]} />

            {(post.thumbnail as string) && (
              <div className="rounded-xl overflow-hidden mt-4">
                <img src={post.thumbnail as string} alt={post.title as string} className="w-full aspect-[2/1] object-cover" />
              </div>
            )}

            <div className={`bg-white rounded-xl border border-gray-200 px-5 md:px-8 py-6 ${post.thumbnail ? "-mt-12 relative z-10 mx-2 md:mx-4" : "mt-4"}`}>
              {(post.tags as string[])?.[0] && (
                <span className="inline-block text-[10px] font-bold text-white bg-brand-500 px-2.5 py-0.5 rounded-md mb-3">{(post.tags as string[])[0]}</span>
              )}
              <article>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{post.title as string}</h1>
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-600 text-sm font-bold">{((post.author as string) || "P").charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-600">{post.author as string}</p>
                    <p className="text-xs text-gray-400">{formatDate(post.created_at as string)}{(post.reading_time as number) ? ` · ${post.reading_time} phút đọc` : ""}</p>
                  </div>
                </div>
                {(post.content as string) && <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content as string }} />}
              </article>
              {(post.tags as string[])?.length > 0 && (
                <div className="mt-8 pt-5 border-t border-gray-100 flex flex-wrap gap-2">
                  {(post.tags as string[]).map((tag: string) => (
                    <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-md">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {relatedPosts && relatedPosts.length > 0 && (
              <div className="mt-10">
                <SectionTitle title="Bài viết liên quan" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedPosts.map((p) => (
                    <Link key={p.id} href={`/tin-tuc/${p.slug}`} className="group block">
                      <div className="aspect-[16/10] rounded-lg overflow-hidden bg-gray-100 mb-2.5">
                        {p.thumbnail ? <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" /> : <div className="w-full h-full bg-brand-700 flex items-center justify-center"><span className="text-white/30 text-lg font-black">POLY</span></div>}
                      </div>
                      <h4 className="text-[13px] font-semibold text-gray-700 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">{p.title}</h4>
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

// ════ Shared ════

function SectionTitle({ title, color }: { title: string; color?: "red" | "orange" | "green" }) {
  const c = { red: "bg-red-500", orange: "bg-orange-500", green: "bg-brand-500" };
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className={`w-1 h-5 rounded-full ${c[color || "green"]}`} />
      <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
    </div>
  );
}

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[12px] overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5 flex-shrink-0">
          {i > 0 && <ChevronRight size={11} className="text-gray-300" />}
          {item.href ? (
            <Link href={item.href} className="text-gray-400 hover:text-brand-600 transition-colors flex items-center gap-1">
              {i === 0 && <Home size={11} />} {item.label}
            </Link>
          ) : (
            <span className="text-gray-600 font-medium truncate max-w-[250px]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
