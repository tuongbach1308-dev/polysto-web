import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts } from '@/lib/supabase/posts';
import { mapPostToBlogPost } from '@/lib/adapters';
import { getBlogPostBySlug, getRelatedBlogPosts, blogPosts as staticPosts } from '@/data/blog-posts';
import BlogPostClient from './BlogPostClient';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supaPost = await getPostBySlug(slug);
  const post = supaPost ? mapPostToBlogPost(supaPost) : getBlogPostBySlug(slug);
  if (!post) return { title: 'Bài viết không tồn tại' };
  return {
    title: `${post.title} | POLY Store`,
    description: post.excerpt?.slice(0, 160),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // Try Supabase first, fall back to static
  const supaPost = await getPostBySlug(slug);
  const post = supaPost ? mapPostToBlogPost(supaPost) : getBlogPostBySlug(slug);

  if (!post) return notFound();

  // Get related + recent posts
  let related: ReturnType<typeof getRelatedBlogPosts> = [];
  let recentPosts: typeof staticPosts = [];

  if (supaPost) {
    const [supaRelated, supaRecent] = await Promise.all([
      getPosts({ category: supaPost.category, limit: 4 }),
      getPosts({ limit: 6 }),
    ]);
    related = supaRelated.filter(p => p.id !== supaPost.id).slice(0, 3).map(mapPostToBlogPost);
    recentPosts = supaRecent.filter(p => p.id !== supaPost.id).slice(0, 5).map(mapPostToBlogPost);
  }

  if (!related?.length) related = getRelatedBlogPosts(post.id);
  if (!recentPosts?.length) recentPosts = staticPosts.filter(p => p.id !== post.id).slice(0, 5);

  return <BlogPostClient post={post} related={related} recentPosts={recentPosts} />;
}
