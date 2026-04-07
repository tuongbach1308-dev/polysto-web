import Link from 'next/link';
import type { BlogPost } from '@/types/blog';
import { blogCategoryLabels } from '@/types/blog';

interface Props {
  post: BlogPost;
}

export default function BlogCard({ post }: Props) {
  return (
    <Link
      href={`/goc-cong-nghe/${post.slug}`}
      className="group block bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[16/10] bg-bg-gray overflow-hidden">
        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
      </div>
      <div className="p-4">
        <span className="text-xs text-navy font-medium">
          {blogCategoryLabels[post.category] || post.category}
        </span>
        <h3 className="mt-1 text-sm font-medium text-text-dark line-clamp-2 group-hover:text-navy transition-colors">
          {post.title}
        </h3>
        <p className="mt-1 text-xs text-text-muted line-clamp-2">{post.excerpt}</p>
        <p className="mt-2 text-xs text-text-muted">{post.publishedAt}</p>
      </div>
    </Link>
  );
}
