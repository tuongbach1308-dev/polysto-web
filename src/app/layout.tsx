import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Quicksand } from "next/font/google";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { buildOrganizationJsonLd, buildWebsiteJsonLd, SITE_URL, SITE_NAME } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "vietnamese"] });
const quicksand = Quicksand({ variable: "--font-quicksand", subsets: ["latin", "vietnamese"], weight: ["700"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Apple Authorized Reseller | Chính hãng, Uy tín, Giá tốt`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "POLY Store - Chuyên cung cấp sản phẩm Apple chính hãng: MacBook, iPad, AirPods, Phụ kiện. Bảo hành 12 tháng 1 đổi 1. Freeship toàn quốc. Trả góp 0%.",
  keywords: ["Apple", "MacBook", "iPad", "AirPods", "POLY Store", "chính hãng", "giá tốt", "bảo hành", "trả góp"],
  authors: [{ name: SITE_NAME }],
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Apple Authorized Reseller`,
    description: "Chuyên cung cấp sản phẩm Apple chính hãng: MacBook, iPad, AirPods. Bảo hành uy tín, giá tốt nhất.",
    images: [{ url: "/logo.svg", width: 512, height: 512, alt: `${SITE_NAME} Logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Apple Authorized Reseller`,
    description: "Chuyên cung cấp sản phẩm Apple chính hãng. Bảo hành uy tín, giá tốt nhất.",
    images: ["/logo.svg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function fetchOrgSettings() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["social", "phone", "email", "address"]);

    const map: Record<string, unknown> = {};
    for (const row of data || []) {
      map[row.key] = row.value;
    }

    const unwrap = (v: unknown): string | undefined => {
      if (v == null) return undefined;
      if (typeof v === "string") return v;
      if (typeof v === "object" && v !== null && "value" in (v as Record<string, unknown>)) {
        const inner = (v as Record<string, unknown>).value;
        return typeof inner === "string" ? inner : undefined;
      }
      return undefined;
    };

    return {
      phone: unwrap(map.phone),
      email: unwrap(map.email),
      address: unwrap(map.address),
      social: (map.social && typeof map.social === "object" ? (map.social as Record<string, string>) : undefined),
    };
  } catch {
    return {};
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await fetchOrgSettings();
  const orgJsonLd = buildOrganizationJsonLd(settings);
  const siteJsonLd = buildWebsiteJsonLd();

  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  return (
    <html lang="vi" className={`${inter.variable} ${quicksand.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
        <JsonLd data={orgJsonLd} />
        <JsonLd data={siteJsonLd} />
        {children}
        {ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}');
              `}
            </Script>
          </>
        )}
        {fbPixelId && (
          <Script id="fb-pixel-init" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
              document,'script','https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
