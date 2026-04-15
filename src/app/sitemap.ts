import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = SITE_URL;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/san-pham`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/tin-tuc`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/gioi-thieu`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/lien-he`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/cua-hang`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/tra-cuu-don-hang`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  // Dynamic: categories (path-based SEO URLs) — only active
  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, parent_id, updated_at, image_url, is_active")
    .eq("is_active", true)
    .order("sort_order");

  type CatRow = { id: string; slug: string; parent_id: string | null; updated_at: string; image_url?: string | null };

  function buildCategoryPaths(cats: CatRow[] | null): { url: string; lastModified: Date; images: string[] }[] {
    if (!cats) return [];
    const paths: { url: string; lastModified: Date; images: string[] }[] = [];

    function walk(parentId: string | null, prefix: string) {
      const children = cats!.filter((c) => c.parent_id === parentId);
      for (const c of children) {
        const path = `${prefix}/${c.slug}`;
        paths.push({
          url: `${baseUrl}/san-pham${path}`,
          lastModified: new Date(c.updated_at),
          images: c.image_url ? [c.image_url] : [],
        });
        walk(c.id, path);
      }
    }
    walk(null, "");
    return paths;
  }

  const categoryPages: MetadataRoute.Sitemap = buildCategoryPaths(categories as CatRow[] | null).map((p) => ({
    url: p.url,
    lastModified: p.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.7,
    images: p.images.length ? p.images : undefined,
  }));

  // Dynamic: products — only active, with thumbnail for image sitemap
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at, thumbnail")
    .eq("status", "active");

  const productPages: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `${baseUrl}/san-pham/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    images: p.thumbnail ? [p.thumbnail] : undefined,
  }));

  // Dynamic: post categories
  const { data: postCats } = await supabase
    .from("post_categories")
    .select("id, slug, parent_id, created_at")
    .order("sort_order");
  const postCatPages: MetadataRoute.Sitemap = buildCategoryPaths(
    postCats?.map((c) => ({ id: c.id, slug: c.slug, parent_id: c.parent_id, updated_at: c.created_at, image_url: null })) || null
  ).map((p) => ({
    url: p.url.replace("/san-pham", "/tin-tuc"),
    lastModified: p.lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Dynamic: posts
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at, thumbnail")
    .eq("status", "published");

  const postPages: MetadataRoute.Sitemap = (posts || []).map((p) => ({
    url: `${baseUrl}/tin-tuc/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    images: p.thumbnail ? [p.thumbnail] : undefined,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...postCatPages, ...postPages];
}
