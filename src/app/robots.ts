import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://polystore.vn";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/tai-khoan/", "/thanh-toan/", "/gio-hang/", "/dang-nhap/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
