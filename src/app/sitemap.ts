import type { MetadataRoute } from 'next'
import { createServerClient } from '@/lib/supabase/server'
import { getWebSettings } from '@/lib/supabase/settings'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getWebSettings()
  const baseUrl = settings.site_url || 'https://polystorevn.com'
  const supabase = createServerClient()

  const [categories, catalogProducts, shopProducts, posts, pages] = await Promise.all([
    supabase.from('web_catalog_categories').select('slug, updated_at').eq('is_active', true),
    supabase.from('web_catalog_products').select('slug, updated_at').eq('is_active', true),
    supabase.from('web_shop_products').select('slug, updated_at').eq('is_active', true),
    supabase.from('web_posts').select('slug, updated_at').eq('status', 'published'),
    supabase.from('web_pages').select('slug, updated_at').eq('is_active', true),
  ])

  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/san-pham`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/bai-viet`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/bao-hanh`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  for (const c of categories.data || []) {
    entries.push({ url: `${baseUrl}/danh-muc/${c.slug}`, lastModified: new Date(c.updated_at), changeFrequency: 'weekly', priority: 0.7 })
  }
  for (const p of catalogProducts.data || []) {
    entries.push({ url: `${baseUrl}/san-pham/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: 'weekly', priority: 0.8 })
  }
  for (const p of shopProducts.data || []) {
    entries.push({ url: `${baseUrl}/shop/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: 'weekly', priority: 0.8 })
  }
  for (const p of posts.data || []) {
    entries.push({ url: `${baseUrl}/bai-viet/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: 'monthly', priority: 0.7 })
  }
  for (const p of pages.data || []) {
    entries.push({ url: `${baseUrl}/${p.slug}`, lastModified: new Date(p.updated_at), changeFrequency: 'monthly', priority: 0.5 })
  }

  return entries
}
