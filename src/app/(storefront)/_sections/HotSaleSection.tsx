import { createClient } from "@/lib/supabase/server";
import HotSale from "@/components/HotSale";

export default async function HotSaleSection() {
  const supabase = await createClient();

  const [settingsRes, productsRes] = await Promise.all([
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["hot_sale_enabled", "hot_sale_title", "hot_sale_end"]),
    supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .in("status", ["active", "out_of_stock"])
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const settingsMap = new Map((settingsRes.data || []).map((r) => [r.key, r.value]));
  const config = {
    enabled: String(settingsMap.get("hot_sale_enabled") ?? "true"),
    title: String(settingsMap.get("hot_sale_title") ?? ""),
    end: String(settingsMap.get("hot_sale_end") ?? ""),
  };

  return <HotSale products={productsRes.data || []} config={config} />;
}
