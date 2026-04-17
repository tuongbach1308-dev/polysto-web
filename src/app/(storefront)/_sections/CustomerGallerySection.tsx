import { createClient } from "@/lib/supabase/server";
import CustomerGallery from "@/components/CustomerGallery";

interface CustomerPhoto {
  url: string;
  alt: string;
}

export default async function CustomerGallerySection() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "customer_gallery")
    .single();

  const images: CustomerPhoto[] = Array.isArray(data?.value) ? data.value : [];

  return <CustomerGallery images={images} />;
}
