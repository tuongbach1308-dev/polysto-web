import { createServerClient } from './server'

export interface Post {
  id: string; title: string; slug: string; excerpt?: string; content: string
  cover_image?: string; category: string; tags: string[]; author: string
  status: string; is_featured: boolean; view_count: number
  meta_title?: string; meta_description?: string
  published_at?: string; created_at: string; updated_at: string
}

export async function getPosts(opts?: { category?: string; featured?: boolean; limit?: number }) {
  const supabase = createServerClient()
  let query = supabase.from('web_posts').select('*').eq('status', 'published')
  if (opts?.category) query = query.eq('category', opts.category)
  if (opts?.featured) query = query.eq('is_featured', true)
  query = query.order('published_at', { ascending: false })
  if (opts?.limit) query = query.limit(opts.limit)
  const { data } = await query
  return (data || []) as Post[]
}

export async function getPostBySlug(slug: string) {
  const supabase = createServerClient()
  const { data } = await supabase.from('web_posts').select('*').eq('slug', slug).eq('status', 'published').single()
  return data as Post | null
}
