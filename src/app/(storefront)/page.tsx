import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ServiceBadges from "@/components/ServiceBadges";
import HeroSlider from "@/components/HeroSlider";
import PromoBanner from "@/components/PromoBanner";
import CustomerGallery from "@/components/CustomerGallery";
import HotSale from "@/components/HotSale";
import CategorySection, { type SubCategory } from "@/components/CategorySection";
import type { Category, Product, Brand } from "@/lib/database.types";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "POLY Store - Apple Authorized Reseller | MacBook, iPad, AirPods Chính Hãng",
  description: "Mua MacBook, iPad, AirPods, Phụ kiện Apple chính hãng giá tốt nhất. Bảo hành 12 tháng 1 đổi 1. Freeship toàn quốc. Trả góp 0%.",
  alternates: { canonical: "/" },
};

const CATEGORY_CARDS = [
  { label: "iPad", href: "/san-pham?category=ipad", img: "/categories/ipad.svg" },
  { label: "MacBook", href: "/san-pham?category=macbook", img: "/categories/macbook.svg" },
  { label: "Âm thanh", href: "/san-pham?category=am-thanh", img: "/categories/am-thanh.svg" },
  { label: "Phụ kiện", href: "/san-pham?category=phu-kien", img: "/categories/phu-kien.svg" },
];

interface CategoryGroup {
  brandName: string;
  categoryName: string;
  categoryHref: string;
  subcategories: SubCategory[];
}

export default async function HomePage() {
  const supabase = await createClient();

  // Settings
  const { data: settingsRows } = await supabase.from("site_settings").select("key, value")
    .in("key", ["hero_banners", "promo_banners", "homepage_categories", "homepage_badges", "categories_per_row", "hot_sale_enabled", "hot_sale_title", "hot_sale_end"]);
  const settingsMap = new Map((settingsRows || []).map((r) => [r.key, r.value]));
  const heroBanners = Array.isArray(settingsMap.get("hero_banners")) ? settingsMap.get("hero_banners") : undefined;
  const promoBanners = Array.isArray(settingsMap.get("promo_banners")) ? settingsMap.get("promo_banners") : undefined;
  const settingsCategories = Array.isArray(settingsMap.get("homepage_categories")) ? settingsMap.get("homepage_categories") as { label: string; img: string; href: string }[] : null;
  const settingsBadges = Array.isArray(settingsMap.get("homepage_badges")) ? settingsMap.get("homepage_badges") as { title: string; desc: string }[] : null;
  const categoriesPerRow = parseInt(String(settingsMap.get("categories_per_row") ?? "4")) || 4;
  const hotSaleConfig = {
    enabled: String(settingsMap.get("hot_sale_enabled") ?? "true"),
    title: String(settingsMap.get("hot_sale_title") ?? ""),
    end: String(settingsMap.get("hot_sale_end") ?? ""),
  };

  // Products shown on homepage (per-category carousels) — include out_of_stock so card renders as sold-out
  const { data: homeProductsRaw } = await supabase
    .from("products").select("*").eq("show_on_home", true).in("status", ["active", "out_of_stock"])
    .order("created_at", { ascending: false });

  // Hot Sale block uses is_featured only
  const { data: hotSaleProducts } = await supabase
    .from("products").select("*").eq("is_featured", true).in("status", ["active", "out_of_stock"])
    .order("created_at", { ascending: false }).limit(12);

  const { data: latestPosts } = await supabase
    .from("posts").select("*").eq("status", "published")
    .order("created_at", { ascending: false }).limit(4);

  const { data: categoriesRaw } = await supabase.from("categories").select("*").eq("is_active", true).order("sort_order");
  const { data: productCategories } = await supabase.from("product_categories").select("product_id, category_id");
  const { data: brandsRaw } = await supabase.from("brands").select("*");

  const homeProducts: Product[] = homeProductsRaw || [];
  const hotSale = hotSaleProducts || [];
  const categories: Category[] = categoriesRaw || [];
  const brands: Brand[] = brandsRaw || [];

  // ── Build category sections: brand → parent category (depth 1) → subcategories (depth 2+) → products ──
  const byId = new Map<string, Category>(categories.map((c) => [c.id, c]));
  const childrenMap = new Map<string, Category[]>();
  for (const c of categories) {
    const pid = c.parent_id || "__root__";
    if (!childrenMap.has(pid)) childrenMap.set(pid, []);
    childrenMap.get(pid)!.push(c);
  }
  // Map: productId → Set<categoryId>
  const productCats = new Map<string, Set<string>>();
  for (const pc of productCategories || []) {
    if (!productCats.has(pc.product_id)) productCats.set(pc.product_id, new Set());
    productCats.get(pc.product_id)!.add(pc.category_id);
  }

  // Walk from a category down to collect all descendant ids
  function collectDescendants(catId: string): Set<string> {
    const all = new Set<string>([catId]);
    const stack = [catId];
    while (stack.length) {
      const cur = stack.pop()!;
      for (const child of childrenMap.get(cur) || []) {
        if (!all.has(child.id)) { all.add(child.id); stack.push(child.id); }
      }
    }
    return all;
  }

  // Build full path slug from root → category
  function buildPath(catId: string): string {
    const chain: string[] = [];
    let cur: Category | undefined = byId.get(catId);
    while (cur) {
      chain.unshift(cur.slug);
      cur = cur.parent_id ? byId.get(cur.parent_id) : undefined;
    }
    return `/san-pham/${chain.join("/")}`;
  }

  // Build one section per (brand root → depth-1 category).
  // For each depth-1 category, subcategories = its direct children; products of each child = homeProducts mapped (including its descendants).
  const sections: CategoryGroup[] = [];
  for (const brand of brands) {
    // Find root category with slug matching brand slug (e.g. "apple")
    const brandRootCat = categories.find((c) => !c.parent_id && c.slug === brand.slug);
    const depthOne = brandRootCat ? (childrenMap.get(brandRootCat.id) || []) : [];
    for (const parentCat of depthOne) {
      const directChildren = childrenMap.get(parentCat.id) || [];
      // Leaves to use as tabs — if parent has no children, use parent itself
      const tabCats = directChildren.length > 0 ? directChildren : [parentCat];
      const subs: SubCategory[] = tabCats.map((sub) => {
        const descendantIds = collectDescendants(sub.id);
        const prods = homeProducts.filter((p) => {
          const cids = productCats.get(p.id);
          if (!cids) return false;
          for (const cid of cids) if (descendantIds.has(cid)) return true;
          return false;
        });
        return { id: sub.id, name: sub.name, href: buildPath(sub.id), products: prods };
      }).filter((s) => s.products.length > 0);

      if (subs.length === 0) continue;
      sections.push({
        brandName: brand.name,
        categoryName: parentCat.name,
        categoryHref: buildPath(parentCat.id),
        subcategories: subs,
      });
    }
  }

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero banner */}
      <HeroSlider banners={heroBanners} />

      {/* Promo banners */}
      <PromoBanner products={homeProducts} banners={promoBanners} />

      {/* Category quick links — scroll on mobile, grid on desktop */}
      {(() => {
        const cats = settingsCategories && settingsCategories.length > 0 ? settingsCategories : CATEGORY_CARDS;
        return (
          <div className="max-w-[1200px] mx-auto px-4 pt-5 pb-4">
            <div className="flex gap-3 overflow-x-auto lg:gap-4 lg:overflow-visible" style={{ scrollbarWidth: "none", msOverflowStyle: "none", display: "flex" }}>
              <div className="hidden lg:grid lg:gap-4 w-full" style={{ gridTemplateColumns: `repeat(${categoriesPerRow}, 1fr)` }}>
                {cats.map((c) => (
                  <Link key={c.label} href={c.href}
                    className="group relative bg-white border border-gray-200 rounded-lg p-4 lg:p-5 flex flex-col items-center gap-2 lg:gap-3 overflow-hidden transition-all duration-300 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/50 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-50/0 to-brand-50/0 group-hover:from-brand-50/60 group-hover:to-brand-50/30 transition-all duration-300" />
                    <div className="relative w-[70px] h-[50px] lg:w-[90px] lg:h-[70px] flex items-center justify-center">
                      {c.img && <img src={c.img} alt={c.label} className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110" />}
                    </div>
                    <span className="relative text-xs lg:text-sm font-semibold text-gray-700 group-hover:text-brand-600 transition-colors duration-300">{c.label}</span>
                  </Link>
                ))}
              </div>
              {/* Mobile: horizontal scroll */}
              <div className="flex gap-3 lg:hidden">
                {cats.map((c) => (
                  <Link key={c.label} href={c.href}
                    className="group relative bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center gap-2 overflow-hidden transition-all duration-300 hover:border-brand-300 flex-shrink-0 w-[120px]">
                    <div className="relative w-[70px] h-[50px] flex items-center justify-center">
                      {c.img && <img src={c.img} alt={c.label} className="max-w-full max-h-full object-contain" />}
                    </div>
                    <span className="relative text-xs font-semibold text-gray-700">{c.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Hot Sale */}
      <HotSale products={hotSale} config={hotSaleConfig} />

      {/* Per-category sections (brand → parent cat → subcategory tabs) — group 1 */}
      {sections.slice(0, 2).map((s) => (
        <CategorySection
          key={`${s.brandName}-${s.categoryName}`}
          brandName={s.brandName}
          categoryName={s.categoryName}
          categoryHref={s.categoryHref}
          subcategories={s.subcategories}
        />
      ))}

      {/* Services — giữa 2 nhóm sản phẩm */}
      <ServiceBadges badges={settingsBadges || undefined} />

      {/* Per-category sections — group 2 */}
      {sections.slice(2).map((s) => (
        <CategorySection
          key={`${s.brandName}-${s.categoryName}`}
          brandName={s.brandName}
          categoryName={s.categoryName}
          categoryHref={s.categoryHref}
          subcategories={s.subcategories}
        />
      ))}

      {/* ── Cảm ơn khách hàng ── */}
      <CustomerGallery />

      {/* ── Góc Công Nghệ — dark green section ── */}
      {latestPosts && latestPosts.length > 0 && (
        <section className="bg-brand-800 py-8">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                Góc Công Nghệ
              </h2>
              <Link href="/tin-tuc" className="text-sm text-white/70 hover:text-white transition-colors">
                Xem tất cả →
              </Link>
            </div>
            <div className="border-t border-white/20 mb-5" />

            <div className="flex gap-4 overflow-x-auto lg:grid lg:grid-cols-4 lg:overflow-visible" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {latestPosts.slice(0, 4).map((post: Record<string, unknown>) => (
                <Link key={post.id as string} href={`/tin-tuc/${post.slug}`} className="group block flex-shrink-0 w-[260px] sm:w-[280px] lg:w-auto">
                  {/* Card */}
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                    {/* Image or placeholder */}
                    {(post.thumbnail as string) ? (
                      <img
                        src={post.thumbnail as string}
                        alt={post.title as string}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-brand-700 flex items-center justify-center">
                        <span className="text-white/30 text-4xl font-black">POLY</span>
                      </div>
                    )}

                    {/* Date badge */}
                    <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                      {formatDate(post.created_at as string)}
                    </span>

                    {/* Bottom gradient overlay with text */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10">
                      <h3 className="text-white text-sm font-bold leading-tight line-clamp-2 group-hover:text-brand-300 transition-colors">
                        {post.title as string}
                      </h3>
                      {(post.excerpt as string) && (
                        <p className="text-white/60 text-xs mt-1 line-clamp-2 leading-relaxed">
                          {(post.excerpt as string).substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}


      {homeProducts.length === 0 && (
        <div className="max-w-[1200px] mx-auto px-4 py-20 text-center text-gray-400">
          <p className="text-lg">Chưa có sản phẩm nào được bật &quot;Hiện ở trang chủ&quot;.</p>
        </div>
      )}
    </div>
  );
}
