import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/posts?page=2&limit=9&category=tin-cong-nghe
 * Returns paginated posts for infinite scroll / load more.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(30, Math.max(1, parseInt(searchParams.get("limit") || "9")));
  const categorySlug = searchParams.get("category") || "";

  let postIds: string[] | null = null;

  // Filter by category if provided
  if (categorySlug) {
    const { data: cat } = await supabase.from("post_categories").select("id").eq("slug", categorySlug).single();
    if (!cat) return NextResponse.json({ posts: [], hasMore: false });

    const { data: ppcs } = await supabase.from("post_post_categories").select("post_id").eq("category_id", cat.id);
    postIds = ppcs?.map((p) => p.post_id) || [];
    if (postIds.length === 0) return NextResponse.json({ posts: [], hasMore: false });
  }

  let query = supabase
    .from("posts")
    .select("id, title, slug, thumbnail, excerpt, created_at, view_count, reading_time, tags", { count: "exact" })
    .eq("status", "published");

  if (postIds) query = query.in("id", postIds);

  const { data: posts, count } = await query
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  const total = count || 0;
  const hasMore = page * limit < total;

  return NextResponse.json({ posts: posts || [], hasMore, total, page });
}
