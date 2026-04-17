import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export default async function LatestPostsSection() {
  const supabase = await createClient();
  const { data: latestPosts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(4);

  if (!latestPosts || latestPosts.length === 0) return null;

  return (
    <section className="bg-brand-800 py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">
            Góc Công Nghệ
          </h2>
          <Link href="/tin-tuc" className="text-sm text-white/70 hover:text-white transition-colors">
            Xem tất cả →
          </Link>
        </div>
        <div className="border-t border-white/20 mb-5" />

        <div className="flex gap-4 overflow-x-auto lg:grid lg:grid-cols-4 lg:overflow-visible" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {latestPosts.slice(0, 4).map((post: Record<string, unknown>) => (
            <Link key={post.id as string} href={`/tin-tuc/${post.slug}`} className="group block flex-shrink-0 w-[260px] sm:w-[280px] lg:w-auto">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                {(post.thumbnail as string) ? (
                  <Image
                    src={post.thumbnail as string}
                    alt={post.title as string}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 260px, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-700 flex items-center justify-center">
                    <span className="text-white/30 text-4xl font-black">POLY</span>
                  </div>
                )}

                <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                  {formatDate(post.created_at as string)}
                </span>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10">
                  <h3 className="text-white text-sm font-bold leading-tight line-clamp-2 group-hover:text-brand-300 transition-colors">
                    {post.title as string}
                  </h3>
                  {(() => {
                    const desc = (post.excerpt as string) || ((post.content as string) ? (post.content as string).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().substring(0, 100) : "");
                    return desc ? <p className="text-white/60 text-xs mt-1 line-clamp-2 leading-relaxed">{desc}...</p> : null;
                  })()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
