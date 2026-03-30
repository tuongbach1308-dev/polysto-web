import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/supabase/posts'
import { getSettings } from '@/lib/supabase/settings'
import { formatDate } from '@/lib/utils'
import { ArticleSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || '',
    openGraph: { images: post.cover_image ? [{ url: post.cover_image }] : [] },
  }
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const settings = await getSettings()
  const baseUrl = settings.site_url || ''

  return (
    <article className="container-page py-8 max-w-4xl mx-auto">
      <ArticleSchema post={post} baseUrl={baseUrl} />
      <BreadcrumbSchema items={[
        { name: 'Trang chủ', url: baseUrl },
        { name: 'Blog', url: `${baseUrl}/bai-viet` },
        { name: post.title, url: `${baseUrl}/bai-viet/${post.slug}` },
      ]} />

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded">{post.category}</span>
        {post.published_at && <span className="text-sm text-slate-400">{formatDate(post.published_at)}</span>}
        <span className="text-sm text-slate-400">• {post.author}</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">{post.title}</h1>

      {post.cover_image && (
        <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-8">
          <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority sizes="100vw" />
        </div>
      )}

      <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      {post.tags?.length > 0 && (
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-100">
          <span className="text-sm text-slate-400">Tags:</span>
          {post.tags.map(tag => (
            <span key={tag} className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
      )}
    </article>
  )
}
