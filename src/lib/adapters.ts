import type { Product, Category, Condition } from '@/types/product'
import type { BlogPost } from '@/types/blog'
import type { CatalogProduct, CatalogCategory } from './supabase/catalog'
import type { ShopProduct } from './supabase/shop'
import type { Post } from './supabase/posts'
import type { Banner as SupaBanner } from './supabase/banners'
import type { Store as SupaStore, CustomerGalleryItem } from './supabase/homepage'
import type { Banner as LocalBanner } from '@/data/banners'
import type { Store as LocalStore } from '@/data/stores'
import type { Testimonial } from '@/data/testimonials'

// --- Condition mapping ---
function parseCondition(note?: string): Condition {
  if (!note) return 'nguyen-seal'
  const lower = note.toLowerCase()
  if (lower.includes('open') || lower.includes('mở hộp')) return 'open-box'
  if (lower.includes('no box') || lower.includes('không hộp') || lower.includes('no-box')) return 'no-box'
  return 'nguyen-seal'
}

// --- Product adapters ---
export function mapCatalogToProduct(cp: CatalogProduct): Product {
  return {
    id: cp.id,
    name: cp.name,
    slug: cp.slug,
    category: cp.category?.slug || '',
    model: cp.brand || '',
    price: cp.price_min,
    originalPrice: cp.price_max > cp.price_min ? cp.price_max : undefined,
    condition: parseCondition(cp.condition_note),
    images: cp.images?.length ? cp.images : [cp.thumbnail || '/images/products/placeholder.svg'],
    specs: cp.specs || {},
    description: cp.short_description || cp.description || '',
    inStock: true,
  }
}

export function mapShopToProduct(sp: ShopProduct): Product {
  return {
    id: sp.id,
    name: sp.name,
    slug: sp.slug,
    category: sp.category?.slug || '',
    model: sp.brand || '',
    price: sp.sale_price || sp.price,
    originalPrice: sp.sale_price ? sp.price : undefined,
    condition: 'nguyen-seal',
    images: sp.images?.length ? sp.images : [sp.thumbnail || '/images/products/placeholder.svg'],
    specs: sp.specs || {},
    description: sp.short_description || sp.description || '',
    inStock: sp.stock > 0,
  }
}

// --- Category adapter ---
export function mapSupaCategory(cat: CatalogCategory, products: Product[]): Category {
  const models = [...new Set(products.filter(p => p.category === cat.slug).map(p => p.model).filter(Boolean))]
  return {
    name: cat.name,
    slug: cat.slug,
    models,
    image: cat.image_url || cat.icon_url || `/images/products/${cat.slug}-placeholder.svg`,
  }
}

// --- Blog adapter ---
export function mapPostToBlogPost(p: Post): BlogPost {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt || '',
    content: p.content,
    thumbnail: p.cover_image || '',
    category: p.category as BlogPost['category'],
    publishedAt: p.published_at || p.created_at,
    author: p.author,
  }
}

// --- Banner adapter ---
export function mapBanner(b: SupaBanner): LocalBanner {
  return {
    id: b.id,
    title: b.title,
    subtitle: b.subtitle || '',
    image: b.image_url,
    cta: b.link_text || 'Xem ngay',
    href: b.link_url || '#',
    bgColor: 'from-green-50 to-emerald-100',
  }
}

// --- Store adapter ---
export function mapStore(s: SupaStore): LocalStore {
  return {
    id: s.id,
    name: s.name,
    address: s.address,
    phone: s.phone || '',
    hours: s.opening_hours || '8:30 - 21:30',
    mapUrl: s.google_maps_url || '',
    embedUrl: s.google_maps_embed || '',
    image: s.image_url || '/images/stores/placeholder.svg',
  }
}

// --- Gallery → Testimonial adapter ---
export function mapGalleryToTestimonial(g: CustomerGalleryItem, index: number): Testimonial {
  return {
    id: g.id,
    name: g.customer_name || 'Khách hàng',
    content: g.caption || '',
    rating: 5,
    product: '',
  }
}
