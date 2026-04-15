import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/database.types";

interface Props {
  productTitle: string;
}

export default async function RelatedPosts({ productTitle }: Props) {
  const keywords = productTitle
    .split(/[\s|]+/)
    .filter((w: string) => w.length > 3)
    .slice(0, 3);

  if (keywords.length === 0) return null;

  const supabase = await createClient();
  const orFilter = keywords.map((kw: string) => `title.ilike.%${kw}%`).join(",");
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .or(orFilter)
    .limit(3);

  if (!posts || posts.length === 0) return null;

  return (
    <section className="px-4 pb-8">
      <h2 className="text-base font-bold text-gray-900 mb-4">Bài viết liên quan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(posts as Post[]).map((post) => (
          <Link key={post.id} href={`/tin-tuc/${post.slug}`} className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
              {post.thumbnail ? (
                <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, 33vw" />
              ) : (
                <div className="w-full h-full bg-brand-700 flex items-center justify-center">
                  <span className="text-white/30 text-lg font-black">POLY</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="text-[13px] font-semibold text-gray-700 line-clamp-2 leading-snug group-hover:text-brand-600 transition-colors">{post.title}</h3>
              <p className="text-[11px] text-gray-400 mt-1.5">{formatDate(post.created_at)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
