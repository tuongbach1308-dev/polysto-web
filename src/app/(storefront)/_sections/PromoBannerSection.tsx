import { createClient } from "@/lib/supabase/server";
import PromoBanner from "@/components/PromoBanner";
import type { Product } from "@/lib/database.types";

export default async function PromoBannerSection() {
  const supabase = await createClient();

  const [settingsRes, productsRes] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "promo_banners").single(),
    supabase
      .from("products")
      .select("*")
      .eq("show_on_home", true)
      .in("status", ["active", "out_of_stock"])
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const banners = Array.isArray(settingsRes.data?.value) ? settingsRes.data.value : undefined;
  const products: Product[] = productsRes.data || [];

  return <PromoBanner products={products} banners={banners} />;
}
