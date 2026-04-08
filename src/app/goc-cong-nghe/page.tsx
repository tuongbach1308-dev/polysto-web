import { getPosts } from '@/lib/supabase/posts';
import { mapPostToBlogPost } from '@/lib/adapters';
import { blogPosts as staticPosts } from '@/data/blog-posts';
import BlogPageClient from './BlogPageClient';

export default async function BlogPage() {
  const supaPosts = await getPosts();
  const posts = supaPosts.length ? supaPosts.map(mapPostToBlogPost) : staticPosts;

  return <BlogPageClient posts={posts} />;
}
