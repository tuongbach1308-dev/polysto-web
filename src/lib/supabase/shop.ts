import { createServerClient } from './server'
import type { CatalogCategory } from './catalog'

export interface ShopProduct {
  id: string; category_id?: string; name: string; slug: string; brand?: string
  images: string[]; thumbnail?: string; short_description?: string; description?: string
  price: number; sale_price?: number; stock: number; sku?: string
  specs: Record<string, string>; is_featured: boolean; is_active: boolean
  sort_order: number; view_count: number; meta_title?: string; meta_description?: string
  created_at: string; updated_at: string
  category?: CatalogCategory
}

export async function getShopProducts(opts?: { categoryId?: string; featured?: boolean; limit?: number }) {
  const supabase = createServerClient()
  let query = supabase.from('web_shop_products').select('*, category:web_catalog_categories(id,name,slug)').eq('is_active', true)
  if (opts?.categoryId) query = query.eq('category_id', opts.categoryId)
  if (opts?.featured) query = query.eq('is_featured', true)
  query = query.order('sort_order').order('created_at', { ascending: false })
  if (opts?.limit) query = query.limit(opts.limit)
  const { data } = await query
  return (data || []) as ShopProduct[]
}

export async function getShopProductBySlug(slug: string) {
  const supabase = createServerClient()
  const { data } = await supabase.from('web_shop_products').select('*, category:web_catalog_categories(id,name,slug)').eq('slug', slug).eq('is_active', true).single()
  return data as ShopProduct | null
}
