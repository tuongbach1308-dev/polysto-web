import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
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

/** Resolve post_category chain from slugs (flat — no parent hierarchy in URL) */
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

/** Check if slug is a post */
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

  // Check post
  const post = await findPost(slugPath[slugPath.length - 1]);
  if (post) {
    return buildPostMetadata({ post: post as Post, url: `/tin-tuc/${slugPath.join("/")}` });
  }

  // Category
  const chain = await resolvePostCategoryChain(slugPath);
  const cat = chain[chain.length - 1];
  if (cat) {
    return {
      title: `${cat.name} - Góc Công Nghệ`,
      description: cat.description || `Bài viết về ${cat.name} tại POLY Store`,
      alternates: { canonical: `/tin-tuc/${slugPath.join("/")}` },
    };
  }

  return { title: "Tin tức" };
}

export default async function BlogCatchAllPage({ params, searchParams }: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const { slug: slugPath = [] } = await params;
  const sp = await searchParams;

  // ════ Check if last slug is a post ════
  if (slugPath.length > 0) {
    const post = await findPost(slugPath[slugPath.length - 1]);
    if (post) {
      return renderPostDetail(post, slugPath);
    }
  }

  // ════ Category listing ════
  const chain = await resolvePostCategoryChain(slugPath);
  const activeCat = chain.length > 0 ? chain[chain.length - 1] : null;

  if (slugPath.length > 0 && !activeCat) notFound();

  // Fetch all post categories for sidebar
  const { data: allPostCats } = await supabase.from("post_categories").select("*").order("sort_order");

  // Fetch children
  const { data: childCats } = activeCat
    ? await supabase.from("post_categories").select("*").eq("parent_id", activeCat.id).order("sort_order")
    : { data: [] as PostCategory[] };

  // Fetch posts
  let postsQuery = supabase.from("posts").select("*", { count: "exact" }).eq("status", "published");

  if (activeCat) {
    // Get post IDs in this category
    const { data: ppcs } = await supabase.from("post_post_categories").select("post_id").eq("category_id", activeCat.id);
    if (ppcs?.length) {
      postsQuery = postsQuery.in("id", ppcs.map((p: { post_id: string }) => p.post_id));
    } else {
      // No posts in category — return empty
      return activeCat
        ? renderCategoryListing([], 0, activeCat, allPostCats || [], sp)
        : renderListing([], 0, allPostCats || [], sp);
    }
  }

  postsQuery = postsQuery.order("created_at", { ascending: false });

  const page = Math.max(1, parseInt(sp.page || "1"));
  const perPage = 12;
  postsQuery = postsQuery.range((page - 1) * perPage, page * perPage - 1);

  const { data: posts, count } = await postsQuery;

  return activeCat
    ? renderCategoryListing(posts || [], count || 0, activeCat, allPostCats || [], sp)
    : renderListing(posts || [], count || 0, allPostCats || [], sp);
}

// ════════════════════════════════════════
// RENDER: Post Detail
// ════════════════════════════════════════
async function renderPostDetail(post: Record<string, unknown>, slugPath: string[]) {
  const supabase = await createClient();
  const { data: relatedPosts } = await supabase
    .from("posts").select("id, title, slug, thumbnail, created_at")
    .eq("status", "published").neq("slug", post.slug as string)
    .order("created_at", { ascending: false }).limit(4);

  // Fetch all post categories for sidebar
  const { data: allPostCats } = await supabase.from("post_categories").select("*").order("sort_order");
  const sidebarCats = (allPostCats || []).filter((c: PostCategory) => c.parent_id !== null);

  const articleJsonLd = buildArticleJsonLd({
    post: post as unknown as Post,
    url: `/tin-tuc/${slugPath.join("/")}`,
  });
  // Build breadcrumb — look up post's category from DB
  const { data: postCatLinks } = await supabase
    .from("post_post_categories").select("category_id").eq("post_id", post.id as string).limit(1);
  let postCat: PostCategory | null = null;
  if (postCatLinks?.[0]) {
    const { data } = await supabase.from("post_categories").select("*").eq("id", postCatLinks[0].category_id).single();
    postCat = data;
  }
  const postBreadcrumbItems: { name: string; url: string }[] = [
    { name: "Trang chủ", url: "/" },
    { name: "Tin tức", url: "/tin-tuc" },
  ];
  if (postCat) {
    postBreadcrumbItems.push({ name: postCat.name, url: `/tin-tuc/${postCat.slug}` });
  }
  postBreadcrumbItems.push({ name: post.title as string, url: `/tin-tuc/${slugPath.join("/")}` });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(postBreadcrumbItems);

  return (
    <div className="bg-surface min-h-screen">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-[120px] space-y-6">
              <nav className="space-y-0.5">
                {sidebarCats.map((cat: PostCategory) => {
                  const Icon = SIDEBAR_ICONS[cat.slug] || Newspaper;
                  return (
                    <Link key={cat.id} href={`/tin-tuc/${buildPostCatPath(cat)}`}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-brand-50 transition-colors">
                      <Icon size={18} className="text-gray-400 group-hover:text-brand-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700 group-hover:text-brand-600 flex-1 transition-colors">{cat.name}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="border-t border-gray-200 pt-4"><PostTOC /></div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <nav className="flex items-center gap-1.5 text-[13px] mb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              <Link href="/" className="text-brand-600 hover:text-brand-700 flex-shrink-0 flex items-center gap-1"><Home size={13} /> Trang chủ</Link>
              <span className="text-gray-300 flex-shrink-0">/</span>
              <Link href="/tin-tuc" className="text-brand-600 hover:text-brand-700 flex-shrink-0">Tin tức</Link>
              {postCat && (
                <span className="contents">
                  <span className="text-gray-300 flex-shrink-0">/</span>
                  <Link href={`/tin-tuc/${postCat.slug}`} className="text-brand-600 hover:text-brand-700 flex-shrink-0">{postCat.name}</Link>
                </span>
              )}
              <span className="text-gray-300 flex-shrink-0">/</span>
              <span className="text-gray-500 truncate max-w-[350px]">{post.title as string}</span>
            </nav>

            {(post.thumbnail as string) && (
              <div className="rounded-lg overflow-hidden">
                <img src={post.thumbnail as string} alt={post.title as string} className="w-full aspect-[16/9] object-cover" />
              </div>
            )}

            <div className={`bg-white rounded-lg border border-gray-200 px-6 md:px-8 py-6 ${post.thumbnail ? "-mt-16 relative z-10 mx-4" : "mt-0"}`}>
              {(post.tags as string[])?.[0] && (
                <span className="inline-block text-xs font-semibold text-white bg-brand-500 px-3 py-1 rounded mb-4">{(post.tags as string[])[0]}</span>
              )}
              <article>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{post.title as string}</h1>
                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-600 text-sm font-bold">{((post.author as string) || "P").charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-brand-600">{post.author as string}</p>
                    <p className="text-xs text-gray-400">Ngày cập nhật: {formatDate(post.created_at as string)}</p>
                  </div>
                </div>
                {(post.excerpt as string) && <p className="text-[15px] text-gray-700 leading-relaxed mb-6">{post.excerpt as string}</p>}
                {(post.content as string) && <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content as string }} />}
              </article>
              {(post.tags as string[])?.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {(post.tags as string[]).map((tag: string) => (
                      <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {relatedPosts && relatedPosts.length > 0 && (
              <div className="mt-10">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">Bài viết liên quan</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {relatedPosts.map((p) => (
                    <Link key={p.id} href={`/tin-tuc/${p.slug}`} className="group block">
                      <div className="aspect-[16/10] rounded-lg overflow-hidden bg-gray-100 mb-2">
                        {p.thumbnail ? <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full bg-brand-700 flex items-center justify-center"><span className="text-white/30 text-lg font-black">POLY</span></div>}
                      </div>
                      <h4 className="text-[13px] font-medium text-gray-700 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">{p.title}</h4>
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

// ════════════════════════════════════════
// RENDER: Main Blog Listing (/tin-tuc)
// ════════════════════════════════════════
function renderListing(
  posts: Record<string, unknown>[],
  totalCount: number,
  allPostCats: PostCategory[],
  sp: { page?: string }
) {
  const sidebarCats = allPostCats.filter((c) => c.parent_id !== null);
  const page = Math.max(1, parseInt(sp.page || "1"));
  const perPage = 12;
  const totalPages = Math.ceil(totalCount / perPage);

  const featured = posts[0] || null;
  const sideFeatures = posts.slice(1, 4);
  const rest = posts.slice(4);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Trang chủ", url: "/" },
    { name: "Tin tức", url: "/tin-tuc" },
  ]);

  return (
    <div className="bg-surface min-h-screen">
      <JsonLd data={breadcrumbJsonLd} />
      <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-8">

        {/* Title + Breadcrumb */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-xl font-bold text-gray-900">Tin tức</h1>
          <nav className="flex items-center gap-1.5 text-[13px]">
            <Link href="/" className="text-brand-600 hover:text-brand-700 flex items-center gap-1"><Home size={13} /> Trang chủ</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500">Tin tức</span>
          </nav>
        </div>

        {/* Category pills */}
        {sidebarCats.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {sidebarCats.map((c) => (
              <Link key={c.id} href={`/tin-tuc/${c.slug}`}
                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {/* Featured + posts */}
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">Chưa có bài viết nào.</div>
        ) : (
          <>
            {featured && (
              <section>
                <SectionTitle title="Nổi bật nhất" />
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                  <Link href={`/tin-tuc/${featured.slug}`} className="lg:col-span-3 group block">
                    <div className="relative h-full min-h-[280px] rounded-lg overflow-hidden bg-gray-100">
                      {(featured.thumbnail as string) ? <img src={featured.thumbnail as string} alt={featured.title as string} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full bg-brand-700 flex items-center justify-center"><span className="text-white/30 text-5xl font-black">POLY</span></div>}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16">
                        <span className="text-[10px] text-white/60 mb-1 block">{formatDate(featured.created_at as string)}</span>
                        <h2 className="text-white text-lg font-bold leading-tight line-clamp-2 group-hover:text-brand-300 transition-colors">{featured.title as string}</h2>
                      </div>
                    </div>
                  </Link>
                  <div className="lg:col-span-2 flex flex-col gap-3">
                    {sideFeatures.map((post) => (
                      <Link key={post.id as string} href={`/tin-tuc/${post.slug}`} className="group flex gap-3 flex-1">
                        <div className="w-[130px] flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          {(post.thumbnail as string) ? <img src={post.thumbnail as string} alt={post.title as string} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full bg-brand-700 flex items-center justify-center"><span className="text-white/30 text-sm font-black">POLY</span></div>}
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">{post.title as string}</h3>
                          <p className="text-[11px] text-gray-400 mt-1.5">{formatDate(post.created_at as string)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section>
                <SectionTitle title="Tin tức mới nhất" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((post) => <PostCard key={post.id as string} post={post} />)}
                </div>
              </section>
            )}

            {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} basePath="/tin-tuc" />}
          </>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// RENDER: Category Listing (/tin-tuc/[slug])
// ════════════════════════════════════════
function renderCategoryListing(
  posts: Record<string, unknown>[],
  totalCount: number,
  activeCat: PostCategory,
  allPostCats: PostCategory[],
  sp: { page?: string }
) {
  const sidebarCats = allPostCats.filter((c) => c.parent_id !== null);
  const page = Math.max(1, parseInt(sp.page || "1"));
  const perPage = 12;
  const totalPages = Math.ceil(totalCount / perPage);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Trang chủ", url: "/" },
    { name: "Tin tức", url: "/tin-tuc" },
    { name: activeCat.name, url: `/tin-tuc/${activeCat.slug}` },
  ]);

  return (
    <div className="bg-surface min-h-screen">
      <JsonLd data={breadcrumbJsonLd} />
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-[120px] space-y-6">
              <nav className="space-y-0.5">
                {sidebarCats.map((cat) => {
                  const Icon = SIDEBAR_ICONS[cat.slug] || Newspaper;
                  const isActive = cat.id === activeCat.id;
                  return (
                    <Link key={cat.id} href={`/tin-tuc/${cat.slug}`}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${isActive ? "bg-brand-50 text-brand-600" : "hover:bg-brand-50"}`}>
                      <Icon size={18} className={`flex-shrink-0 ${isActive ? "text-brand-600" : "text-gray-400 group-hover:text-brand-600"}`} />
                      <span className={`text-sm flex-1 transition-colors ${isActive ? "font-semibold text-brand-600" : "text-gray-700 group-hover:text-brand-600"}`}>{cat.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[13px] mb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              <Link href="/" className="text-brand-600 hover:text-brand-700 flex-shrink-0 flex items-center gap-1"><Home size={13} /> Trang chủ</Link>
              <span className="text-gray-300 flex-shrink-0">/</span>
              <Link href="/tin-tuc" className="text-brand-600 hover:text-brand-700 flex-shrink-0">Tin tức</Link>
              <span className="text-gray-300 flex-shrink-0">/</span>
              <span className="text-gray-500">{activeCat.name}</span>
            </nav>

            {/* Title */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-900">{activeCat.name}</h1>
              {activeCat.description && <p className="text-sm text-gray-500 mt-1">{activeCat.description}</p>}
            </div>

            {/* Mobile category pills */}
            <div className="flex gap-2 overflow-x-auto mb-6 lg:hidden" style={{ scrollbarWidth: "none" }}>
              {sidebarCats.map((c) => (
                <Link key={c.id} href={`/tin-tuc/${c.slug}`}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${c.id === activeCat.id ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-brand-50 hover:text-brand-600"}`}>
                  {c.name}
                </Link>
              ))}
            </div>

            {/* Posts grid */}
            {posts.length === 0 ? (
              <div className="text-center py-16 text-gray-400">Chưa có bài viết nào trong danh mục này.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {posts.map((post) => <PostCard key={post.id as string} post={post} />)}
              </div>
            )}

            {totalPages > 1 && <div className="mt-8"><Pagination currentPage={page} totalPages={totalPages} basePath={`/tin-tuc/${activeCat.slug}`} /></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════ Helpers ════
function buildPostCatPath(cat: PostCategory): string {
  return cat.slug;
}

function PostCard({ post }: { post: Record<string, unknown> }) {
  return (
    <Link href={`/tin-tuc/${post.slug}`} className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-[16/10] bg-gray-100">
        {(post.thumbnail as string) ? <img src={post.thumbnail as string} alt={post.title as string} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full bg-brand-700 flex items-center justify-center"><span className="text-white/30 text-2xl font-black">POLY</span></div>}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-brand-600 transition-colors">{post.title as string}</h3>
        {(post.excerpt as string) && <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{post.excerpt as string}</p>}
        <p className="text-[11px] text-gray-400 mt-2">{formatDate(post.created_at as string)}</p>
      </div>
    </Link>
  );
}

function Pagination({ currentPage, totalPages, basePath }: { currentPage: number; totalPages: number; basePath: string }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link key={p} href={`${basePath}${p > 1 ? `?page=${p}` : ""}`}
          className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${p === currentPage ? "bg-brand-600 text-white" : "border border-gray-200 text-gray-600 hover:border-brand-300"}`}>
          {p}
        </Link>
      ))}
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-1 h-5 bg-brand-500 rounded-full" />
      <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{title}</h2>
    </div>
  );
}
