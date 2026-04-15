import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { collectDescendants } from "@/lib/categories";
import type { Category } from "@/lib/database.types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * GET /api/products/by-category?id=<category_id>&home=true
 * Returns products belonging to a category and its descendants.
 * If home=true, filters to show_on_home=true only.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const categoryId = searchParams.get("id");
  const homeOnly = searchParams.get("home") === "true";

  if (!categoryId) {
    return NextResponse.json({ products: [] }, { status: 400 });
  }

  // Fetch all categories to walk descendants
  const { data: allCats } = await supabase.from("categories").select("id, parent_id, slug, name");
  if (!allCats) return NextResponse.json({ products: [] });

  const descendantIds = collectDescendants(categoryId, allCats as Category[]);

  // Find product IDs in these categories
  const { data: pcs } = await supabase
    .from("product_categories")
    .select("product_id")
    .in("category_id", descendantIds);

  if (!pcs || pcs.length === 0) return NextResponse.json({ products: [] });

  const productIds = [...new Set(pcs.map((pc) => pc.product_id))];

  // Fetch products
  let query = supabase
    .from("products")
    .select("*")
    .in("id", productIds)
    .in("status", ["active", "out_of_stock"])
    .order("created_at", { ascending: false });

  if (homeOnly) query = query.eq("show_on_home", true);

  const { data: products } = await query;

  return NextResponse.json(
    { products: products || [] },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } }
  );
}
