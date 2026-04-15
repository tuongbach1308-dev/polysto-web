import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import JsonLd from "@/components/JsonLd";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://polystore.vn";

async function getSiteSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key, value");
  const map: Record<string, string> = {};
  if (data) {
    for (const row of data) {
      if (typeof row.value === "string") map[row.key] = row.value;
      else if (row.value != null) map[row.key] = JSON.stringify(row.value);
    }
  }
  return map;
}

export default async function StorefrontLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.site_name || "POLY Store",
    url: siteUrl,
    logo: `${siteUrl}/logo.svg`,
    description: settings.site_description || "Apple Authorized Reseller — Chính hãng, Uy tín, Giá tốt",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone ? `+84-${settings.phone.replace(/^0/, "")}` : "+84-815-242-433",
      contactType: "customer service",
      availableLanguage: "Vietnamese",
    },
    sameAs: [settings.facebook, settings.instagram, settings.tiktok, settings.youtube].filter(Boolean),
  };

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingButtons phone={settings.phone} zalo={settings.zalo} />
    </>
  );
}
