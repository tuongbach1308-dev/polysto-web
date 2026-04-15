import { createClient } from "@/lib/supabase/server";
import ProductCarousel from "@/components/ProductCarousel";
import type { Product } from "@/lib/database.types";

interface Props {
  productId: string;
  leafCategoryId: string | null;
}

export default async function RelatedProducts({ productId, leafCategoryId }: Props) {
  if (!leafCategoryId) return null;

  const supabase = await createClient();
  const { data: relPc } = await supabase
    .from("product_categories")
    .select("product_id")
    .eq("category_id", leafCategoryId);

  if (!relPc?.length) return null;

  const ids = relPc
    .map((r: { product_id: string }) => r.product_id)
    .filter((id: string) => id !== productId);

  if (ids.length === 0) return null;

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("id", ids)
    .in("status", ["active", "out_of_stock"])
    .limit(10);

  if (!products || products.length === 0) return null;

  return <ProductCarousel products={products as Product[]} title="Sản phẩm liên quan" />;
}
