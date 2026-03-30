import type { MetadataRoute } from 'next'
import { getCatalogProducts } from '@/lib/supabase/catalog'
import { getShopProducts } from '@/lib/supabase/shop'
import { getPosts } from '@/lib/supabase/posts'
import { getPages } from '@/lib/supabase/pages'
import { getCategories } from '@/lib/supabase/catalog'
import { getSettings } from '@/lib/supabase/settings'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings()
  const baseUrl = settings.site_url || 'https://polystore.vn'

  const [catalogProducts, shopProducts, posts, pages, categories] = await Promise.all([
    getCatalogProducts(),
    getShopProducts(),
    getPosts(),
    getPages(),
    getCategories(),
  ])

  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/san-pham`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/bai-viet`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/bao-hanh`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Categories
  for (const cat of categories) {
    entries.push({ url: `${baseUrl}/danh-muc/${cat.slug}`, changeFrequency: 'weekly', priority: 0.7 })
  }

  // Catalog products
  for (const p of catalogProducts) {
    entries.push({ url: `${baseUrl}/san-pham/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: 'weekly', priority: 0.8 })
  }

  // Shop products
  for (const p of shopProducts) {
    entries.push({ url: `${baseUrl}/shop/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: 'weekly', priority: 0.8 })
  }

  // Posts
  for (const p of posts) {
    entries.push({ url: `${baseUrl}/bai-viet/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: 'monthly', priority: 0.7 })
  }

  // CMS pages
  for (const p of pages) {
    entries.push({ url: `${baseUrl}/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: 'monthly', priority: 0.5 })
  }

  return entries
}
