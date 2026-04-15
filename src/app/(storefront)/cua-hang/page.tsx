import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import StorePageClient from "@/components/StorePageClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cửa hàng POLY Store",
  description: "Hệ thống cửa hàng POLY Store — Địa chỉ, hotline, giờ mở cửa, bản đồ.",
  alternates: { canonical: "/cua-hang" },
};

export default async function StorePage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "page_stores").single();
  const stores = Array.isArray(data?.value) ? data.value as { name: string; address: string; hotline: string; phone2: string; hours: string; mapEmbed: string; images?: string[] }[] : null;
  return <StorePageClient stores={stores} />;
}
