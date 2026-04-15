import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import type { Product, Post, Category } from "@/lib/database.types";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductGrid from "@/components/ProductGrid";
import JsonLd from "@/components/JsonLd";
import { SkeletonBox, SkeletonProductCard } from "@/components/Skeleton";
import { buildProductJsonLd, buildBreadcrumbJsonLd, buildCollectionJsonLd, buildProductMetadata, buildCategoryMetadata } from "@/lib/seo";
import RelatedProducts from "./_components/RelatedProducts";

export const revalidate = 60;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://polystore.vn";
const PER_PAGE = 12;

/** Resolve category chain from slug path */
async function resolveCategoryChain(slugs: string[]): Promise<Category[]> {
  const supabase = await createClient();
  const chain: Category[] = [];
  let parentId: string | null = null;

  for (const s of slugs) {
    let query = supabase.from("categories").select("*").eq("slug", s);
    if (parentId) query = query.eq("parent_id", parentId);
    else query = query.is("parent_id", null);

    const { data } = await query.single();
    if (!data) return chain; // break if not found
    chain.push(data);
    parentId = data.id;
  }
  return chain;
}

/** Check if slug is a product */
async function findProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*").eq("slug", slug).in("status", ["active", "out_of_stock"]).single();
  return data;
}

/** Walk up parent_id to build ancestor chain (root → leaf) for a category id */
async function getCategoryAncestors(catId: string): Promise<Category[]> {
  const supabase = await createClient();
  const { data: all } = await supabase.from("categories").select("*");
  if (!all) return [];
  const byId = new Map<string, Category>(all.map((c: Category) => [c.id, c]));
  const chain: Category[] = [];
  let cur: Category | undefined = byId.get(catId);
  while (cur) {
    chain.unshift(cur);
    cur = cur.parent_id ? byId.get(cur.parent_id) : undefined;
  }
  return chain;
}

/** Get primary category chain for a product (first associated category, walked up to root) */
async function getProductCategoryChain(productId: string): Promise<Category[]> {
  const supabase = await createClient();
  const { data: pc } = await supabase.from("product_categories").select("category_id").eq("product_id", productId).limit(1);
  if (!pc?.length) return [];
  return getCategoryAncestors(pc[0].category_id);
}


export async function generateMetadata({ params }: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
  const { slug: slugPath = [] } = await params;

  if (slugPath.length === 0) {
    return {
      title: "Tất cả sản phẩm Apple chính hãng",
      description: "Mua MacBook, iPad, AirPods, Phụ kiện Apple chính hãng giá tốt. Bảo hành 12 tháng. Freeship toàn quốc.",
      alternates: { canonical: "/san-pham" },
    };
  }

  // Check if last slug is a product
  const product = await findProduct(slugPath[slugPath.length - 1]);
  if (product) {
    return buildProductMetadata({
      product,
      url: `/san-pham/${product.slug}`,
    });
  }

  // Category
  const chain = await resolveCategoryChain(slugPath);
  const cat = chain[chain.length - 1];
  if (cat) {
    return buildCategoryMetadata({
      category: cat,
      url: `/san-pham/${slugPath.join("/")}`,
    });
  }

  return { title: "Sản phẩm" };
}

export default async function ProductPage({ params, searchParams }: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ price?: string; sort?: string; page?: string; condition?: string; q?: string }>;
}) {
  const supabase = await createClient();
  const { slug: slugPath = [] } = await params;
  const sp = await searchParams;

  // ════ Check if last slug is a product ════
  if (slugPath.length > 0) {
    const product = await findProduct(slugPath[slugPath.length - 1]);
    if (product) {
      // Canonical is the short URL `/san-pham/<slug>`.
      // If user lands on a deep URL like /san-pham/apple/ipad/<slug>, redirect to short.
      const canonicalPath = `/san-pham/${product.slug}`;
      const currentPath = `/san-pham/${slugPath.join("/")}`;
      if (currentPath !== canonicalPath) {
        redirect(canonicalPath);
      }

      // Build full category chain (root → leaf) for breadcrumb display only
      const catChain = await getProductCategoryChain(product.id);

      // Fetch variants + product images + brand
      const { data: variants } = await supabase.from("product_variants").select("*").eq("product_id", product.id).order("sort_order");
      const { data: productImages } = await supabase.from("product_images").select("*").eq("product_id", product.id).order("sort_order");
      const { data: brand } = product.brand_id
        ? await supabase.from("brands").select("*").eq("id", product.brand_id).maybeSingle()
        : { data: null };

      const leafCat = catChain.length > 0 ? catChain[catChain.length - 1] : null;

      // Related posts — displayed in specs sidebar column
      let relatedPosts: Post[] = [];
      const keywords = product.title.split(/[\s|]+/).filter((w: string) => w.length > 3).slice(0, 3);
      if (keywords.length > 0) {
        const orFilter = keywords.map((kw: string) => `title.ilike.%${kw}%`).join(",");
        const { data: posts } = await supabase.from("posts").select("*").eq("status", "published").or(orFilter).limit(5);
        if (posts?.length) relatedPosts = posts as Post[];
      }

      // Build breadcrumb links: Thương hiệu → danh mục cha → ... → danh mục lá
      // If root category slug matches brand slug, drop it to avoid duplication.
      const brandLink = brand
        ? [{ name: brand.name, href: `/san-pham/${brand.slug}` }]
        : [];
      const catLinks = catChain
        .map((c, i) => ({
          orig: c,
          href: `/san-pham/${catChain.slice(0, i + 1).map((x) => x.slug).join("/")}`,
        }))
        .filter(({ orig }, i) => !(i === 0 && brand && orig.slug === brand.slug))
        .map(({ orig, href }) => ({ name: orig.name, href }));
      const categoryChain = [...brandLink, ...catLinks];

      const galleryUrls = (productImages && productImages.length > 0)
        ? productImages.map((img: { url: string }) => img.url)
        : (product.thumbnail ? [product.thumbnail] : []);

      const productJsonLd = buildProductJsonLd({
        product,
        brand: brand || null,
        categoryName: leafCat?.name || "",
        images: galleryUrls,
        url: canonicalPath,
      });

      const productBreadcrumb = buildBreadcrumbJsonLd([
        { name: "Trang chủ", url: "/" },
        { name: "Sản phẩm", url: "/san-pham" },
        ...categoryChain.map((c) => ({ name: c.name, url: c.href })),
        { name: product.title, url: canonicalPath },
      ]);

      return (
        <div className="bg-surface min-h-screen">
          <JsonLd data={productJsonLd} />
          <JsonLd data={productBreadcrumb} />
          {/* Core product detail — loads first */}
          <ProductDetailClient product={product} variants={variants || []} productImages={productImages || []} relatedProducts={[]} relatedPosts={relatedPosts} categoryChain={categoryChain} brandName={brand?.name || null} conditionLabel={product.condition ? ({ seal: "Nguyên Seal", openbox: "Open Box", new_nobox: "New Nobox", likenew: "Like New", old: "Cũ" } as Record<string, string>)[product.condition] || null : null} />

          {/* Related products — streams after core detail loads */}
          <div className="max-w-[1200px] mx-auto">
            <Suspense fallback={
              <div className="px-4 py-6">
                <SkeletonBox className="h-5 w-40 mb-4" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {Array.from({ length: 5 }).map((_, i) => <SkeletonProductCard key={i} />)}
                </div>
              </div>
            }>
              <RelatedProducts productId={product.id} leafCategoryId={leafCat?.id || null} />
            </Suspense>

          </div>
        </div>
      );
    }
  }

  // ════ Category listing ════
  const chain = await resolveCategoryChain(slugPath);
  const activeCategory = chain.length > 0 ? chain[chain.length - 1] : null;

  // If slugPath provided but no category found => 404
  if (slugPath.length > 0 && !activeCategory) notFound();

  // Fetch all categories for sidebar
  const { data: allCategories } = await supabase.from("categories").select("*").order("sort_order");

  // Fetch children of active category
  const { data: childCategories } = activeCategory
    ? await supabase.from("categories").select("*").eq("parent_id", activeCategory.id).order("sort_order")
    : { data: [] as Category[] };

  // Get product IDs for category (including ALL descendants recursively)
  let categoryIds: string[] = [];
  if (activeCategory) {
    // Fetch all categories once, then walk the tree in memory
    const { data: allCats } = await supabase.from("categories").select("id, parent_id");
    const cats = allCats || [];
    function collectDescendants(parentId: string, out: string[]) {
      for (const c of cats) {
        if (c.parent_id === parentId) {
          out.push(c.id);
          collectDescendants(c.id, out);
        }
      }
    }
    categoryIds = [activeCategory.id];
    collectDescendants(activeCategory.id, categoryIds);
  }

  let productIds: string[] | null = null;
  if (categoryIds.length > 0) {
    const { data: pcs } = await supabase.from("product_categories").select("product_id").in("category_id", categoryIds);
    if (pcs) productIds = pcs.map((pc: { product_id: string }) => pc.product_id);
  }

  // Build product query
  let query = supabase.from("products").select("*", { count: "exact" }).in("status", ["active", "out_of_stock"]);

  if (productIds !== null) {
    if (productIds.length === 0) {
      // No products in category
      return renderListing([], 0, activeCategory, chain, childCategories || [], allCategories || [], slugPath, sp, categoryIds);
    }
    query = query.in("id", productIds);
  }

  // Price filter
  if (sp.price) {
    const [min, max] = sp.price.split("-").map(Number);
    if (min) query = query.gte("price", min);
    if (max) query = query.lte("price", max);
  }

  // Search
  if (sp.q) {
    query = query.ilike("title", `%${sp.q}%`);
  }

  // Sort
  const sortMap: Record<string, { col: string; asc: boolean }> = {
    "price-asc": { col: "price", asc: true },
    "price-desc": { col: "price", asc: false },
    newest: { col: "created_at", asc: false },
  };
  const sort = sortMap[sp.sort || ""] || { col: "created_at", asc: false };
  // Sold-out items sink to the bottom so in-stock products show first
  query = query.order("status", { ascending: true }).order(sort.col, { ascending: sort.asc });

  // Pagination
  const page = Math.max(1, parseInt(sp.page || "1"));
  const offset = (page - 1) * PER_PAGE;
  query = query.range(offset, offset + PER_PAGE - 1);

  const { data: products, count } = await query;

  return renderListing(products || [], count || 0, activeCategory, chain, childCategories || [], allCategories || [], slugPath, sp, categoryIds);
}

function renderListing(
  products: Product[],
  totalCount: number,
  activeCategory: Category | null,
  chain: Category[],
  childCategories: Category[],
  allCategories: Category[],
  slugPath: string[],
  sp: { price?: string; sort?: string; page?: string; condition?: string; q?: string },
  categoryIds?: string[]
) {
  const basePath = `/san-pham${slugPath.length > 0 ? "/" + slugPath.join("/") : ""}`;

  // Breadcrumb JSON-LD
  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
    { "@type": "ListItem", position: 2, name: "Sản phẩm", item: `${siteUrl}/san-pham` },
    ...chain.map((c, i) => ({
      "@type": "ListItem",
      position: i + 3,
      name: c.name,
      item: `${siteUrl}/san-pham/${slugPath.slice(0, i + 1).join("/")}`,
    })),
  ];

  // Condition filter (uses product.condition field directly)
  let filtered = products;
  if (sp.condition) {
    const conditions = sp.condition.split(",");
    filtered = products.filter((p) => conditions.includes(p.condition));
  }

  // Siblings for sub-pills (if we're at a child level)
  let siblingCategories = childCategories;
  if (childCategories.length === 0 && chain.length >= 2) {
    // At leaf level — show siblings (same parent)
    const parentId = chain[chain.length - 1].parent_id;
    siblingCategories = allCategories.filter((c) => c.parent_id === parentId);
  }

  return (
    <div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: breadcrumbItems }} />

      {/* Breadcrumb */}
      <nav className="mb-4">
        <ol className="flex items-center gap-1.5 text-[13px] overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <li className="flex-shrink-0"><Link href="/" className="text-brand-600 hover:text-brand-700 flex items-center gap-1"><Home size={13} /> Trang chủ</Link></li>
          <li className="flex-shrink-0 text-gray-300">/</li>
          <li className="flex-shrink-0">
            {chain.length > 0
              ? <Link href="/san-pham" className="text-brand-600 hover:text-brand-700">Sản phẩm</Link>
              : <span className="text-gray-500">Sản phẩm</span>
            }
          </li>
          {chain.map((c, i) => (
            <span key={c.id} className="contents">
              <li className="flex-shrink-0 text-gray-300">/</li>
              <li className="flex-shrink-0">
                {i < chain.length - 1
                  ? <Link href={`/san-pham/${slugPath.slice(0, i + 1).join("/")}`} className="text-brand-600 hover:text-brand-700">{c.name}</Link>
                  : <span className="text-gray-500">{c.name}</span>
                }
              </li>
            </span>
          ))}
        </ol>
      </nav>

      {/* Category banner */}
      {activeCategory?.banner_url ? (
        <div className="mb-5 relative rounded-xl overflow-hidden h-[160px] sm:h-[200px]">
          <img
            src={activeCategory.banner_url}
            alt={activeCategory.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="relative h-full flex flex-col justify-center px-6 sm:px-10 text-white max-w-[600px]">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{activeCategory.name}</h1>
            {activeCategory.description && (
              <p className="text-sm sm:text-base text-white/80 line-clamp-2">{activeCategory.description}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-5 rounded-xl bg-gradient-to-r from-brand-700 to-brand-500 px-6 py-6 text-white">
          <div className="flex items-center gap-3">
            {activeCategory?.image_url && (
              <img src={activeCategory.image_url} alt={activeCategory.name} className="w-12 h-12 rounded-lg bg-white/10 object-cover" />
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                {activeCategory ? activeCategory.name : "Tất cả sản phẩm Apple"}
              </h1>
              {activeCategory?.description && (
                <p className="text-sm text-white/80 mt-0.5">{activeCategory.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-category pills */}
      {(childCategories.length > 0 || siblingCategories.length > 0) && (
        <div className="flex gap-2 mb-5 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {(childCategories.length > 0 ? childCategories : siblingCategories).map((c) => {
            const isActive = activeCategory?.id === c.id;
            let childPath: string;
            if (childCategories.length > 0) {
              childPath = `${basePath}/${c.slug}`;
            } else {
              childPath = `/san-pham/${slugPath.slice(0, -1).join("/")}${slugPath.length > 1 ? "/" : ""}${c.slug}`;
            }
            return (
              <Link key={c.id} href={childPath}
                className={`px-4 py-2.5 min-h-[44px] flex items-center rounded-md text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${isActive ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {c.name}
              </Link>
            );
          })}
        </div>
      )}

      {/* Product grid — sidebar + mobile filter handled by layout */}
      <ProductGrid
        products={filtered}
        totalCount={sp.condition ? filtered.length : totalCount}
        currentPage={parseInt(sp.page || "1")}
        perPage={PER_PAGE}
        basePath={basePath}
        currentSort={sp.sort}
        searchParams={sp}
        categoryIds={categoryIds}
      />
    </div>
  );
}
