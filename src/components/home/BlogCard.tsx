import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  cover_image?: string
  published_at?: string
  created_at: string
}

export function BlogCard({ post }: { post: Post }) {
  return (
    <div className="item-blog">
      {/* Thumbnail — 1:1 */}
      <Link href={`/bai-viet/${post.slug}`} className="thumb">
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={post.title}
            width={300}
            height={300}
            sizes="(max-width: 767px) 50vw, 25vw"
            style={{ width: 'auto', maxHeight: '100%', objectFit: 'contain', position: 'absolute', inset: 0, margin: 'auto' }}
          />
        ) : (
          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: '#ccc', background: '#f5f5f5' }}>📰</span>
        )}
      </Link>

      {/* Content */}
      <div className="block-content">
        <h3>
          <Link href={`/bai-viet/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.excerpt && (
          <p className="justify">{post.excerpt}</p>
        )}
        <p className="time-post">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          <span>{formatDate(post.published_at || post.created_at)}</span>
        </p>
      </div>
    </div>
  )
}
