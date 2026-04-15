import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ContactPageClient from "@/components/ContactPageClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Liên hệ - POLY Store",
  description: "Liên hệ POLY Store — Hotline, email, địa chỉ, giờ làm việc.",
  alternates: { canonical: "/lien-he" },
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase.from("site_settings").select("key, value").in("key", ["page_contact", "phone", "email"]);
  const map = new Map((rows || []).map((r) => [r.key, r.value]));

  // page_contact is the dedicated contact page settings
  const pageContact = map.get("page_contact") as { phone: string; email: string; address: string; hours_weekday: string; hours_weekend: string } | null;

  // Fallback: use header phone/email if page_contact fields are empty
  const headerPhone = typeof map.get("phone") === "string" ? map.get("phone") as string : "";
  const headerEmail = typeof map.get("email") === "string" ? map.get("email") as string : "";

  const contact = {
    phone: pageContact?.phone || headerPhone || "",
    email: pageContact?.email || headerEmail || "",
    address: pageContact?.address || "",
    hours_weekday: pageContact?.hours_weekday || "",
    hours_weekend: pageContact?.hours_weekend || "",
  };

  return <ContactPageClient contact={contact} />;
}
