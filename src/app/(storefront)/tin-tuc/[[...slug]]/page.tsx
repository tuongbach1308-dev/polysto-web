import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home, Eye, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import PostTOC from "@/components/PostTOC";
import JsonLd from "@/components/JsonLd";
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildPostMetadata } from "@/lib/seo";
import type { Post } from "@/lib/database.types";
import { Newspaper, MessageCircleQuestion, MonitorSmartphone, ThumbsUp, Lightbulb, Tag, Users } from "lucide-react";

export const revalidate = 60;

interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
}

type PostRow = Record<string, unknown>;

const SIDEBAR_ICONS: Record<string, typeof Newspaper> = {
  "tin-cong-nghe": Newspaper,
  "tu-van": MessageCircleQuestion,
  "tren-tay": MonitorSmartphone,
  "danh-gia": ThumbsUp,
  "thu-thuat": Lightbulb,
  "san-pham-moi": Newspaper,
  "concept": Newspaper,
  "khuyen-mai": Tag,
  "tuyen-dung": Users,
};

async function resolvePostCategoryChain(slugs: string[]): Promise<PostCategory[]> {
  const supabase = await createClient();
  const chain: PostCategory[] = [];
  for (const s of slugs) {
    const { data } = await supabase.from("post_categories").select("*").eq("slug", s).single();
    if (!data) return chain;
    chain.push(data);
  }
  return chain;
}

async function findPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("status", "published").single();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug: slugPath = [] } = await params;

  if (slugPath.length === 0) {
    return {
      title: "Góc Công Nghệ - Tin tức Apple",
      description: "Tin tức công nghệ, đánh giá, trên tay, tư vấn mua sắm sản phẩm Apple. Cập nhật mỗi ngày tại POLY Store.",
      alternates: { canonical: "/tin-tuc" },
    };
  }

  const post = await findPost(slugPath[slugPath.length - 1]);
  if (post) return buildPostMetadata({ post: post as Post, url: `/tin-tuc/${slugPath.join("/")}` });

  const chain = await resolvePostCategoryChain(slugPath);
  const cat = chain[chain.length - 1];
  if (cat) return { title: `${cat.name} - Góc Công Nghệ`, description: cat.description || `Bài viết về ${cat.name} tại POLY Store`, alternates: { canonical: `/tin-tuc/${slugPath.join("/")}` } };

  return { title: "Tin tức" };
}

export default async function BlogCatchAllPage({ params, searchParams }: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const { slug: slugPath = [] } = await params;
  const sp = await searchParams;

  // ── Post detail ──
  if (slugPath.length > 0) {
    const post = await findPost(slugPath[slugPath.length - 1]);
    if (post) return renderPostDetail(post, slugPath);
  }

  // ── Category or main listing ──
  const chain = await resolvePostCategoryChain(slugPath);
  const activeCat = chain.length > 0 ? chain[chain.length - 1] : null;
  if (slugPath.length > 0 && !activeCat) notFound();

  const { data: allPostCats } = await supabase.from("post_categories").select("*").order("sort_order");

  if (activeCat) {
    return renderCategoryListing(supabase, activeCat, allPostCats || [], sp);
  }
  return renderMainListing(supabase, allPostCats || [], sp);
}

// ════════════════════════════════════════════════════════════
// RENDER: Main Blog Listing (/tin-tuc) — Magazine style
// ════════════════════════════════════════════════════════════
async function renderMainListing(
  supabase: Awaited<ReturnType<typeof createClient>>,
  allPostCats: PostCategory[],
  sp: { page?: string }
) {
  const page = Math.max(1, parseInt(sp.page || "1"));
  const childCats = allPostCats.filter((c) => c.parent_id !== null);

  // Page 1: magazine layout (featured + most viewed + per-category sections)
  // Page 2+: simple grid with pagination
  if (page === 1) {
    // Featured: latest 4 posts
    const { data: featured } = await supabase.from("posts").select("id, title, slug, thumbnail, excerpt, created_at, view_count, reading_time, tags")
      .eq("status", "published").order("created_at", { ascending: false }).limit(4);

    // Most viewed (all time, excluding featured)
    const featuredIds = (featured || []).map((p) => p.id);
    const { data: mostViewed } = await supabase.from("posts").select("id, title, slug, thumbnail, created_at, view_count")
      .eq("status", "published").order("view_count", { ascending: false }).limit(10);
    const filteredMostViewed = (mostViewed || []).filter((p) => !featuredIds.includes(p.id)).slice(0, 6);

    // Per-category sections: fetch 3 latest posts per child category
    const catSections: { cat: PostCategory; posts: PostRow[] }[] = [];
    for (const cat of childCats) {
      const { data: ppcs } = await supabase.from("post_post_categories").select("post_id").eq("category_id", cat.id);
      if (!ppcs?.length) continue;
      const { data: catPosts } = await supabase.from("posts")
        .select("id, title, slug, thumbnail, excerpt, created_at, view_count, reading_time")
        .eq("status", "published").in("id", ppcs.map((p) => p.post_id))
        .order("created_at", { ascending: false }).limit(3);
      if (catPosts?.length) catSections.push({ cat, posts: catPosts });
    }

    // Total for pagination
    const { count: totalCount } = await supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published");
    const perPage = 15;
    const totalPages = Math.ceil((totalCount || 0) / perPage);

    return (
      <div className="bg-surface min-h-screen">
        <JsonLd data={buildBreadcrumbJsonLd([{ name: "Trang chủ", url: "/" }, { name: "Tin tức", url: "/tin-tuc" }])} />
        <div className="max-w-[1200px] mx-auto px-4 py-5 space-y-10">

          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 font-heading">Góc Công Nghệ</h1>
            <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức" }]} />
          </div>

          {/* Category tabs — scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            <Link href="/tin-tuc" className="px-4 py-2 rounded-lg text-sm font-semibold bg-brand-600 text-white flex-shrink-0">Tất cả</Link>
            {childCats.map((c) => (
              <Link key={c.id} href={`/tin-tuc/${c.slug}`}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors flex-shrink-0 whitespace-nowrap">
                {c.name}
              </Link>
            ))}
          </div>

          {/* ── Featured Hero ── */}
          {featured && featured.length > 0 && (
            <section>
              <SectionTitle title="Chủ đề hot" color="red" />
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Main feature */}
                <Link href={`/tin-tuc/${featured[0].slug}`} className="lg:col-span-3 group block relative min-h-[300px] lg:min-h-[380px] rounded-xl overflow-hidden bg-gray-100">
                  {featured[0].thumbnail ? <img src={featured[0].thumbnail} alt={featured[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="absolute inset-0 bg-brand-800" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                    {featured[0].tags?.[0] && <span className="inline-block text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded mb-2">{featured[0].tags[0]}</span>}
                    <h2 className="text-white text-xl lg:text-2xl font-bold leading-tight line-clamp-3 group-hover:text-brand-300 transition-colors">{featured[0].title}</h2>
                    <div className="flex items-center gap-3 mt-2 text-white/60 text-xs">
                      <span>{formatDate(featured[0].created_at)}</span>
                      {featured[0].reading_time && <span className="flex items-center gap-1"><Clock size={11} /> {featured[0].reading_time} phút đọc</span>}
                    </div>
                  </div>
                </Link>
                {/* Side features */}
                <div className="lg:col-span-2 grid grid-cols-1 gap-3">
                  {featured.slice(1, 4).map((post) => (
                    <Link key={post.id} href={`/tin-tuc/${post.slug}`} className="group flex gap-3">
                      <div className="w-[120px] lg:w-[140px] flex-shrink-0 aspect-[16/10] rounded-lg overflow-hidden bg-gray-100">
                        {post.thumbnail ? <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full bg-brand-700" />}
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                        <h3 className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">{post.title}</h3>
                        <p className="text-[11px] text-gray-400 mt-1.5">{formatDate(post.created_at)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Most Viewed ── */}
          {filteredMostViewed.length > 0 && (
            <section>
              <SectionTitle title="Xem nhiều nhất" color="orange" />
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMostViewed.map((post, i) => (
                  <Link key={post.id} href={`/tin-tuc/${post.slug}`} className="group flex gap-3 items-start">
                    <span className="text-3xl font-black text-gray-200 group-hover:text-brand-300 transition-colors leading-none flex-shrink-0 w-8">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">{post.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                        <span>{formatDate(post.created_at)}</span>
                        {post.view_count > 0 && <span className="flex items-center gap-0.5"><Eye size={10} /> {post.view_count}</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Per-category sections ── */}
          {catSections.map(({ cat, posts }) => (
            <section key={cat.id}>
              <div className="flex items-center justify-between mb-4">
                <SectionTitle title={cat.name} />
                <Link href={`/tin-tuc/${cat.slug}`} className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
                  Xem tất cả <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => <PostCard key={post.id as string} post={post} />)}
              </div>
            </section>
          ))}

          {/* Pagination */}
          {totalPages > 1 && <SmartPagination currentPage={page} totalPages={totalPages} basePath="/tin-tuc" />}
        </div>
      </div>
    );
  }

  // ── Page 2+: simple paginated grid ──
  const perPage = 15;
  const { data: posts, count: totalCount } = await supabase.from("posts")
    .select("id, title, slug, thumbnail, excerpt, created_at, view_count, reading_time", { count: "exact" })
    .eq("status", "published").order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  const totalPages = Math.ceil((totalCount || 0) / perPage);

  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-5 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Tin tức — Trang {page}</h1>
          <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức", href: "/tin-tuc" }, { label: `Trang ${page}` }]} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(posts || []).map((post) => <PostCard key={post.id} post={post} />)}
        </div>

        {totalPages > 1 && <SmartPagination currentPage={page} totalPages={totalPages} basePath="/tin-tuc" />}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// RENDER: Category Listing (/tin-tuc/[category-slug])
// ════════════════════════════════════════════════════════════
async function renderCategoryListing(
  supabase: Awaited<ReturnType<typeof createClient>>,
  activeCat: PostCategory,
  allPostCats: PostCategory[],
  sp: { page?: string }
) {
  const childCats = allPostCats.filter((c) => c.parent_id !== null);
  const page = Math.max(1, parseInt(sp.page || "1"));
  const perPage = 12;

  // Get post IDs in this category
  const { data: ppcs } = await supabase.from("post_post_categories").select("post_id").eq("category_id", activeCat.id);
  const postIds = ppcs?.map((p) => p.post_id) || [];

  let posts: PostRow[] = [];
  let totalCount = 0;
  if (postIds.length > 0) {
    const { data, count } = await supabase.from("posts")
      .select("id, title, slug, thumbnail, excerpt, created_at, view_count, reading_time", { count: "exact" })
      .eq("status", "published").in("id", postIds)
      .order("created_at", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);
    posts = data || [];
    totalCount = count || 0;
  }

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div className="bg-surface min-h-screen">
      <JsonLd data={buildBreadcrumbJsonLd([{ name: "Trang chủ", url: "/" }, { name: "Tin tức", url: "/tin-tuc" }, { name: activeCat.name, url: `/tin-tuc/${activeCat.slug}` }])} />
      <div className="max-w-[1200px] mx-auto px-4 py-5 space-y-6">

        {/* Header */}
        <div>
          <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức", href: "/tin-tuc" }, { label: activeCat.name }]} />
          <h1 className="text-2xl font-bold text-gray-900 font-heading mt-3">{activeCat.name}</h1>
          {activeCat.description && <p className="text-sm text-gray-500 mt-1">{activeCat.description}</p>}
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <Link href="/tin-tuc" className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors flex-shrink-0">Tất cả</Link>
          {childCats.map((c) => (
            <Link key={c.id} href={`/tin-tuc/${c.slug}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 whitespace-nowrap transition-colors ${
                c.id === activeCat.id
                  ? "bg-brand-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600"
              }`}>
              {c.name}
            </Link>
          ))}
        </div>

        {/* Posts grid — 3 per row */}
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Chưa có bài viết nào trong danh mục này.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => <PostCard key={post.id as string} post={post} />)}
          </div>
        )}

        {totalPages > 1 && <SmartPagination currentPage={page} totalPages={totalPages} basePath={`/tin-tuc/${activeCat.slug}`} />}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// RENDER: Post Detail
// ════════════════════════════════════════════════════════════
async function renderPostDetail(post: PostRow, slugPath: string[]) {
  const supabase = await createClient();

  // Related posts
  const { data: relatedPosts } = await supabase.from("posts")
    .select("id, title, slug, thumbnail, created_at, reading_time")
    .eq("status", "published").neq("slug", post.slug as string)
    .order("created_at", { ascending: false }).limit(3);

  // Sidebar categories
  const { data: allPostCats } = await supabase.from("post_categories").select("*").order("sort_order");
  const sidebarCats = (allPostCats || []).filter((c: PostCategory) => c.parent_id !== null);

  // Post's category
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
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-20 space-y-6">
              <nav className="space-y-0.5">
                {sidebarCats.map((cat: PostCategory) => {
                  const Icon = SIDEBAR_ICONS[cat.slug] || Newspaper;
                  const active = postCat?.id === cat.id;
                  return (
                    <Link key={cat.id} href={`/tin-tuc/${cat.slug}`}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active ? "bg-brand-50 text-brand-600" : "hover:bg-gray-50"}`}>
                      <Icon size={16} className={`flex-shrink-0 ${active ? "text-brand-600" : "text-gray-400 group-hover:text-brand-500"}`} />
                      <span className={`text-sm ${active ? "font-semibold text-brand-600" : "text-gray-600 group-hover:text-gray-800"}`}>{cat.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-gray-200 pt-4"><PostTOC /></div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
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

            {/* Related posts — 3 per row */}
            {relatedPosts && relatedPosts.length > 0 && (
              <div className="mt-10">
                <SectionTitle title="Bài viết liên quan" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedPosts.map((p) => (
                    <Link key={p.id} href={`/tin-tuc/${p.slug}`} className="group block">
                      <div className="aspect-[16/10] rounded-lg overflow-hidden bg-gray-100 mb-2.5">
                        {p.thumbnail ? <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full bg-brand-700 flex items-center justify-center"><span className="text-white/30 text-lg font-black">POLY</span></div>}
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

// ════ Shared Components ════

function PostCard({ post }: { post: PostRow }) {
  return (
    <Link href={`/tin-tuc/${post.slug}`} className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-gray-100 transition-all duration-300">
      <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
        {(post.thumbnail as string)
          ? <img src={post.thumbnail as string} alt={post.title as string} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full bg-brand-700 flex items-center justify-center"><span className="text-white/20 text-2xl font-black">POLY</span></div>}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">{post.title as string}</h3>
        {(post.excerpt as string) && <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">{(post.excerpt as string).slice(0, 120)}</p>}
        <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-400">
          <span>{formatDate(post.created_at as string)}</span>
          {(post.reading_time as number) > 0 && <span className="flex items-center gap-0.5"><Clock size={10} /> {post.reading_time as number} phút</span>}
        </div>
      </div>
    </Link>
  );
}

function SectionTitle({ title, color }: { title: string; color?: "red" | "orange" | "green" }) {
  const barColors = { red: "bg-red-500", orange: "bg-orange-500", green: "bg-brand-500" };
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className={`w-1 h-5 rounded-full ${barColors[color || "green"]}`} />
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

function SmartPagination({ currentPage, totalPages, basePath }: { currentPage: number; totalPages: number; basePath: string }) {
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const href = (p: number) => `${basePath}${p > 1 ? `?page=${p}` : ""}`;

  return (
    <div className="flex items-center justify-center gap-1.5 pt-4">
      {currentPage > 1 && (
        <Link href={href(currentPage - 1)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors">
          <ChevronLeft size={16} />
        </Link>
      )}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
        ) : (
          <Link key={p} href={href(p)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              p === currentPage ? "bg-brand-600 text-white shadow-sm" : "border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600"
            }`}>
            {p}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={href(currentPage + 1)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors">
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}
