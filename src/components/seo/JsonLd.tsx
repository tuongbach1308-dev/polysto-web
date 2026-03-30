import type { SettingsMap } from '@/lib/supabase/settings'
import type { CatalogProduct } from '@/lib/supabase/catalog'
import type { ShopProduct } from '@/lib/supabase/shop'
import type { Post } from '@/lib/supabase/posts'

export function LocalBusinessSchema({ settings }: { settings: SettingsMap }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings.site_name || 'POLY Store Bình Thạnh',
    description: settings.site_description || '',
    url: settings.site_url || '',
    telephone: settings.phone || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address || '',
      addressLocality: 'Bình Thạnh',
      addressRegion: 'TP.HCM',
      addressCountry: 'VN',
    },
    openingHours: settings.opening_hours || '',
    image: settings.logo_url || '',
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ProductSchema({ product, baseUrl }: { product: CatalogProduct | ShopProduct; baseUrl: string }) {
  const isShop = 'price' in product
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images?.[0] || product.thumbnail || '',
    description: product.short_description || '',
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: isShop ? {
      '@type': 'Offer',
      price: ((product as ShopProduct).sale_price || (product as ShopProduct).price),
      priceCurrency: 'VND',
      availability: (product as ShopProduct).stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${baseUrl}/shop/${product.slug}`,
    } : {
      '@type': 'AggregateOffer',
      lowPrice: (product as CatalogProduct).price_min,
      highPrice: (product as CatalogProduct).price_max,
      priceCurrency: 'VND',
      url: `${baseUrl}/san-pham/${product.slug}`,
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ArticleSchema({ post, baseUrl }: { post: Post; baseUrl: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.cover_image || '',
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: 'POLY Store Bình Thạnh' },
    publisher: {
      '@type': 'Organization',
      name: 'POLY Store Bình Thạnh',
      logo: { '@type': 'ImageObject', url: `${baseUrl}/images/logo.png` },
    },
    description: post.excerpt || '',
    url: `${baseUrl}/bai-viet/${post.slug}`,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
