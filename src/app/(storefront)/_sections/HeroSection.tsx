import { createClient } from "@/lib/supabase/server";
import HeroSlider from "@/components/HeroSlider";

export default async function HeroSection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "hero_banners")
    .single();

  const banners = Array.isArray(data?.value) ? data.value : undefined;

  return <HeroSlider banners={banners} />;
}
