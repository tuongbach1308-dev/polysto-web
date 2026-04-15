import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import CategorySection, { type SubCategory } from "@/components/CategorySection";
import type { Category, Product, Brand } from "@/lib/database.types";

interface CategoryGroup {
  brandName: string;
  categoryName: string;
  categoryHref: string;
  subcategories: SubCategory[];
}

/** Cached data fetching — shared across group=1 and group=2 calls within the same request */
const getCategorySectionsData = cache(async () => {
  const supabase = await createClient();

  const [productsRes, categoriesRes, productCatsRes, brandsRes] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("show_on_home", true)
      .in("status", ["active", "out_of_stock"])
      .order("created_at", { ascending: false }),
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("product_categories").select("product_id, category_id"),
    supabase.from("brands").select("*"),
  ]);

  const homeProducts: Product[] = productsRes.data || [];
  const categories: Category[] = categoriesRes.data || [];
  const brands: Brand[] = brandsRes.data || [];

  // Build maps
  const childrenMap = new Map<string, Category[]>();
  for (const c of categories) {
    const pid = c.parent_id || "__root__";
    if (!childrenMap.has(pid)) childrenMap.set(pid, []);
    childrenMap.get(pid)!.push(c);
  }

  const productCats = new Map<string, Set<string>>();
  for (const pc of productCatsRes.data || []) {
    if (!productCats.has(pc.product_id)) productCats.set(pc.product_id, new Set());
    productCats.get(pc.product_id)!.add(pc.category_id);
  }

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

  function buildPath(catId: string): string {
    const byId = new Map<string, Category>(categories.map((c) => [c.id, c]));
    const chain: string[] = [];
    let cur: Category | undefined = byId.get(catId);
    while (cur) {
      chain.unshift(cur.slug);
      cur = cur.parent_id ? byId.get(cur.parent_id) : undefined;
    }
    return `/san-pham/${chain.join("/")}`;
  }

  // Build sections
  const sections: CategoryGroup[] = [];
  for (const brand of brands) {
    const brandRootCat = categories.find((c) => !c.parent_id && c.slug === brand.slug);
    const depthOne = brandRootCat ? (childrenMap.get(brandRootCat.id) || []) : [];
    for (const parentCat of depthOne) {
      const directChildren = childrenMap.get(parentCat.id) || [];
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

  return { sections, homeProducts };
});

export default async function CategorySectionsGroup({ group }: { group: 1 | 2 }) {
  const { sections, homeProducts } = await getCategorySectionsData();

  const slice = group === 1 ? sections.slice(0, 2) : sections.slice(2);

  if (slice.length === 0 && group === 1 && homeProducts.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center text-gray-400">
        <p className="text-lg">Chưa có sản phẩm nào được bật &quot;Hiện ở trang chủ&quot;.</p>
      </div>
    );
  }

  return (
    <>
      {slice.map((s) => (
        <CategorySection
          key={`${s.brandName}-${s.categoryName}`}
          brandName={s.brandName}
          categoryName={s.categoryName}
          categoryHref={s.categoryHref}
          subcategories={s.subcategories}
        />
      ))}
    </>
  );
}
