import { createServerClient } from './server'

export interface CatalogCategory {
  id: string; name: string; slug: string; description?: string; image_url?: string
  parent_id?: string; icon_url?: string; show_on_homepage?: boolean
  sort_order: number; is_active: boolean; meta_title?: string; meta_description?: string
}

export interface CatalogProduct {
  id: string; category_id?: string; name: string; slug: string; brand?: string
  images: string[]; thumbnail?: string; short_description?: string; description?: string
  price_min: number; price_max: number; specs: Record<string, string>
  condition_note?: string; is_featured: boolean; is_active: boolean; sort_order: number
  view_count: number; meta_title?: string; meta_description?: string
  created_at: string; updated_at: string
  category?: CatalogCategory
}

export async function getCategories() {
  const supabase = createServerClient()
  const { data } = await supabase.from('web_catalog_categories').select('*').eq('is_active', true).order('sort_order')
  return (data || []) as CatalogCategory[]
}

export async function getCatalogProducts(opts?: { categoryId?: string; featured?: boolean; limit?: number }) {
  const supabase = createServerClient()
  let query = supabase.from('web_catalog_products').select('*, category:web_catalog_categories(id,name,slug)').eq('is_active', true)
  if (opts?.categoryId) query = query.eq('category_id', opts.categoryId)
  if (opts?.featured) query = query.eq('is_featured', true)
  query = query.order('sort_order').order('created_at', { ascending: false })
  if (opts?.limit) query = query.limit(opts.limit)
  const { data } = await query
  return (data || []) as CatalogProduct[]
}

export async function getCatalogProductBySlug(slug: string) {
  const supabase = createServerClient()
  const { data } = await supabase.from('web_catalog_products').select('*, category:web_catalog_categories(id,name,slug)').eq('slug', slug).eq('is_active', true).single()
  return data as CatalogProduct | null
}

export async function getCategoryBySlug(slug: string) {
  const supabase = createServerClient()
  const { data } = await supabase.from('web_catalog_categories').select('*').eq('slug', slug).eq('is_active', true).single()
  return data as CatalogCategory | null
}

export async function getCategoriesHierarchical() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('web_catalog_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  const all = (data || []) as CatalogCategory[]
  const roots = all.filter(c => !c.parent_id)
  return roots.map(root => ({
    ...root,
    children: all.filter(c => c.parent_id === root.id),
  }))
}
