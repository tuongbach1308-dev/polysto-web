import { createServerClient } from './server'

export interface WebPage {
  id: string; title: string; slug: string; content: string; template: string
  show_in_header: boolean; show_in_footer: boolean; sort_order: number; is_active: boolean
  meta_title?: string; meta_description?: string; og_image?: string
  created_at: string; updated_at: string
}

export async function getPages() {
  const supabase = createServerClient()
  const { data } = await supabase.from('web_pages').select('*').eq('is_active', true).order('sort_order')
  return (data || []) as WebPage[]
}

export async function getPageBySlug(slug: string) {
  const supabase = createServerClient()
  const { data } = await supabase.from('web_pages').select('*').eq('slug', slug).eq('is_active', true).single()
  return data as WebPage | null
}
