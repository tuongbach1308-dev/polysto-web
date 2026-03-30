import { createServerClient } from '@/lib/supabase/server'
import { BlogSectionClient } from './BlogSectionClient'

export async function BlogSection() {
  const supabase = createServerClient()
  const { data: posts } = await supabase
    .from('web_posts')
    .select('id, title, slug, excerpt, cover_image, published_at, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(8)

  if (!posts?.length) return null

  return (
    <section className="section-index section_blog">
      <div className="container">
        <div className="section-title">
          <h2>Tin Tức <span>Công Nghệ</span></h2>
        </div>
        <BlogSectionClient posts={posts} />
      </div>
    </section>
  )
}
