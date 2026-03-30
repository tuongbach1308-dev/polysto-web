import { createServerClient } from './server'

export interface Banner {
  id: string; title: string; subtitle?: string; image_url: string
  image_mobile_url?: string; link_url?: string; link_text?: string
  position: string; sort_order: number; is_active: boolean
  start_date?: string; end_date?: string
}

export async function getBanners(position?: string) {
  const supabase = createServerClient()
  const now = new Date().toISOString()
  let query = supabase.from('web_banners').select('*').eq('is_active', true)
  if (position) query = query.eq('position', position)
  // Filter by date range
  query = query.or(`start_date.is.null,start_date.lte.${now}`)
  query = query.or(`end_date.is.null,end_date.gte.${now}`)
  query = query.order('sort_order')
  const { data } = await query
  return (data || []) as Banner[]
}
