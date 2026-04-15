// ═══════════════════════════════════════════════════════════════
// SEO helpers — JSON-LD builders + metadata builders
// All functions are pure & framework-agnostic.
// ═══════════════════════════════════════════════════════════════

import type { Metadata } from "next";
import type { Brand, Category, Post, Product } from "@/lib/database.types";
import { getDisplayPrice, getSchemaAvailability, CONDITION_SCHEMA } from "@/lib/products";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://polystore.vn";
export const SITE_NAME = "POLY Store";
export const DEFAULT_OG_IMAGE = "/logo.svg";

interface BreadcrumbItem {
  name: string;
  url: string;
}

// ─────────────────────────────────────────
// JSON-LD BUILDERS
// ─────────────────────────────────────────

/** Organization schema (used in root layout) */
export function buildOrganizationJsonLd(settings?: {
  phone?: string;
  email?: string;
  address?: string;
  social?: Record<string, string>;
}) {
  const social = settings?.social || {};
  const sameAs = Object.values(social).filter(Boolean) as string[];

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: "POLY",
    url: SITE_URL,
    logo: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    description: "Apple Authorized Reseller — Chính hãng, Uy tín, Giá tốt",
    contactPoint: settings?.phone
      ? [
          {
            "@type": "ContactPoint",
            telephone: `+84-${settings.phone.replace(/^0/, "")}`,
            contactType: "customer service",
            availableLanguage: ["Vietnamese"],
            areaServed: "VN",
          },
        ]
      : undefined,
    address: settings?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.address,
          addressCountry: "VN",
        }
      : undefined,
    email: settings?.email,
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

/** Website schema with SearchAction */
export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "vi-VN",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/san-pham?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Breadcrumb list (use on every page that has breadcrumbs) */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/** Product detail page */
export function buildProductJsonLd(opts: {
  product: Product;
  brand?: Brand | null;
  categoryName?: string;
  images: string[];
  url: string;
}) {
  const { product, brand, categoryName, images, url } = opts;
  const price = getDisplayPrice(product);
  const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;
  const priceValidUntil = product.sale_ends_at
    ? new Date(product.sale_ends_at).toISOString().split("T")[0]
    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.meta_description || `${product.title} chính hãng tại POLY Store`,
    image: images.length > 0 ? images.map((img) => (img.startsWith("http") ? img : `${SITE_URL}${img}`)) : undefined,
    sku: product.sku || undefined,
    gtin13: product.barcode || undefined,
    brand: brand
      ? {
          "@type": "Brand",
          name: brand.name,
        }
      : {
          "@type": "Brand",
          name: "Apple",
        },
    category: categoryName,
    offers: {
      "@type": "Offer",
      url: fullUrl,
      priceCurrency: "VND",
      price: price,
      priceValidUntil,
      availability: getSchemaAvailability(product.status),
      itemCondition: CONDITION_SCHEMA[product.condition] || "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  };
}

/** Article (blog post) */
export function buildArticleJsonLd(opts: {
  post: Post;
  url: string;
  authorName?: string;
}) {
  const { post, url } = opts;
  const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.meta_description || undefined,
    image: post.thumbnail ? [post.thumbnail.startsWith("http") ? post.thumbnail : `${SITE_URL}${post.thumbnail}`] : undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Organization",
      name: opts.authorName || post.author || SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": fullUrl,
    },
    keywords: post.tags?.join(", ") || undefined,
    wordCount: post.content ? post.content.replace(/<[^>]*>/g, "").split(/\s+/).length : undefined,
  };
}

/** Category collection page */
export function buildCollectionJsonLd(opts: {
  category: Category;
  url: string;
  products: { id: string; title: string; slug: string; thumbnail: string | null; price: number }[];
}) {
  const { category, url, products } = opts;
  const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.meta_title || `${category.name} chính hãng`,
    description: category.meta_description || category.description || `Mua ${category.name} chính hãng tại POLY Store`,
    url: fullUrl,
    inLanguage: "vi-VN",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.title,
          url: `${SITE_URL}/san-pham/${p.slug}`,
          image: p.thumbnail ? (p.thumbnail.startsWith("http") ? p.thumbnail : `${SITE_URL}${p.thumbnail}`) : undefined,
          offers: {
            "@type": "Offer",
            priceCurrency: "VND",
            price: p.price,
          },
        },
      })),
    },
  };
}

// ─────────────────────────────────────────
// CLIENT-SAFE AUTO-GENERATION HELPERS
// (used by SeoPanel in admin forms)
// ─────────────────────────────────────────

// ─────────────────────────────────────────
// METADATA BUILDERS
// ─────────────────────────────────────────

/** Build metadata for product detail page */
export function buildProductMetadata(opts: { product: Product; url: string; categoryName?: string }): Metadata {
  const { product, url, categoryName } = opts;
  const title = product.meta_title || `${product.title}${categoryName ? ` - ${categoryName}` : ""} chính hãng`;
  const description =
    product.meta_description ||
    product.description ||
    `Mua ${product.title} chính hãng giá tốt tại POLY Store. Bảo hành ${product.warranty_months} tháng 1 đổi 1.`;
  const image = product.og_image || product.thumbnail || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_URL}${url}`,
      siteName: SITE_NAME,
      locale: "vi_VN",
      images: [{ url: image, alt: product.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/** Build metadata for category landing page */
export function buildCategoryMetadata(opts: { category: Category; url: string }): Metadata {
  const { category, url } = opts;
  const title = category.meta_title || `${category.name} chính hãng`;
  const description =
    category.meta_description ||
    category.description ||
    `Mua ${category.name} Apple chính hãng giá tốt tại POLY Store. Bảo hành 12 tháng 1 đổi 1.`;
  const image = category.banner_url || category.image_url || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_URL}${url}`,
      siteName: SITE_NAME,
      locale: "vi_VN",
      images: [{ url: image, alt: category.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/** Build metadata for blog post detail */
export function buildPostMetadata(opts: { post: Post; url: string }): Metadata {
  const { post, url } = opts;
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || post.title;
  const image = post.og_image || post.thumbnail || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_URL}${url}`,
      siteName: SITE_NAME,
      locale: "vi_VN",
      images: [{ url: image, alt: post.title }],
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author || SITE_NAME],
      tags: post.tags || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
