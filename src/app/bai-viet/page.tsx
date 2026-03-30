import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPosts } from '@/lib/supabase/posts'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Blog' }
export const revalidate = 60

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <Link key={post.id} href={`/bai-viet/${post.slug}`} className="card group hover:shadow-lg transition-shadow">
            {post.cover_image && (
              <div className="aspect-[16/10] relative overflow-hidden">
                <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width:768px) 100vw, 33vw" />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">{post.category}</span>
                {post.published_at && <span className="text-xs text-slate-400">{formatDate(post.published_at)}</span>}
              </div>
              <h2 className="font-semibold text-slate-800 line-clamp-2 mb-1">{post.title}</h2>
              {post.excerpt && <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>}
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && <p className="text-center text-slate-400 py-16">Chưa có bài viết nào.</p>}
    </div>
  )
}
