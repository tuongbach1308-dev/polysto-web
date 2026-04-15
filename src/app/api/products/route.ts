import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PER_PAGE = 12;

/**
 * GET /api/products?categoryIds=id1,id2&price=100000-500000&sort=price-asc&page=2&limit=12&q=search&condition=seal,likenew
 * Returns paginated products for client-side pagination.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || String(PER_PAGE))));
  const categoryIdsParam = searchParams.get("categoryIds") || "";
  const priceRange = searchParams.get("price") || "";
  const sortParam = searchParams.get("sort") || "newest";
  const searchQuery = searchParams.get("q") || "";
  const conditionParam = searchParams.get("condition") || "";

  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .in("status", ["active", "out_of_stock"]);

  // Category filter
  if (categoryIdsParam) {
    const ids = categoryIdsParam.split(",").filter(Boolean);
    if (ids.length > 0) {
      // Find product IDs in these categories
      const { data: pcs } = await supabase
        .from("product_categories")
        .select("product_id")
        .in("category_id", ids);

      if (!pcs || pcs.length === 0) {
        return NextResponse.json({ products: [], total: 0, page });
      }
      const productIds = [...new Set(pcs.map((pc) => pc.product_id))];
      query = query.in("id", productIds);
    }
  }

  // Price filter
  if (priceRange) {
    const [min, max] = priceRange.split("-").map(Number);
    if (min) query = query.gte("price", min);
    if (max) query = query.lte("price", max);
  }

  // Search
  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  // Condition filter
  if (conditionParam) {
    const conditions = conditionParam.split(",").filter(Boolean);
    if (conditions.length > 0) {
      query = query.in("condition", conditions);
    }
  }

  // Sort — sold-out items always sink to bottom
  const sortMap: Record<string, { col: string; asc: boolean }> = {
    "price-asc": { col: "price", asc: true },
    "price-desc": { col: "price", asc: false },
    newest: { col: "created_at", asc: false },
  };
  const sort = sortMap[sortParam] || sortMap.newest;
  query = query.order("status", { ascending: true }).order(sort.col, { ascending: sort.asc });

  // Pagination
  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1);

  const { data: products, count } = await query;

  return NextResponse.json(
    { products: products || [], total: count || 0, page },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
  );
}
