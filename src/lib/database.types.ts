// ═══════════════════════════════════════════════════════════════
// POLY Store — Database Types (matches supabase/migrations/001_schema.sql)
// ═══════════════════════════════════════════════════════════════

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, "created_at" | "updated_at">; Update: Partial<Profile> };
      brands: { Row: Brand; Insert: Omit<Brand, "id" | "created_at" | "updated_at">; Update: Partial<Brand> };
      categories: { Row: Category; Insert: Omit<Category, "id" | "created_at" | "updated_at">; Update: Partial<Category> };
      products: { Row: Product; Insert: Omit<Product, "id" | "created_at" | "updated_at">; Update: Partial<Product> };
      product_variants: { Row: ProductVariant; Insert: Omit<ProductVariant, "id" | "created_at">; Update: Partial<ProductVariant> };
      product_images: { Row: ProductImage; Insert: Omit<ProductImage, "id" | "created_at">; Update: Partial<ProductImage> };
      product_categories: { Row: ProductCategory; Insert: ProductCategory; Update: Partial<ProductCategory> };
      wishlists: { Row: Wishlist; Insert: Omit<Wishlist, "created_at">; Update: Partial<Wishlist> };
      posts: { Row: Post; Insert: Omit<Post, "id" | "created_at" | "updated_at">; Update: Partial<Post> };
      post_categories: { Row: PostCategory; Insert: Omit<PostCategory, "id" | "created_at">; Update: Partial<PostCategory> };
      post_post_categories: { Row: PostPostCategory; Insert: PostPostCategory; Update: Partial<PostPostCategory> };
      orders: { Row: Order; Insert: Omit<Order, "id" | "order_number" | "created_at" | "updated_at">; Update: Partial<Order> };
      vouchers: { Row: Voucher; Insert: Omit<Voucher, "id" | "created_at" | "updated_at" | "used_count">; Update: Partial<Voucher> };
      contacts: { Row: Contact; Insert: Omit<Contact, "id" | "created_at">; Update: Partial<Contact> };
      site_settings: { Row: SiteSetting; Insert: SiteSetting; Update: Partial<SiteSetting> };
    };
  };
}

// ─────────────────────────────────────────
// Profile
// ─────────────────────────────────────────
export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  role: "customer" | "admin";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────
// Brand
// ─────────────────────────────────────────
export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  logo_storage_path: string | null;
  website: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────
// Category (product)
// ─────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
  image_url: string | null;
  image_storage_path: string | null;
  banner_url: string | null;
  banner_storage_path: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_brand: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────
// Product
// ─────────────────────────────────────────
export type ProductCondition = "seal" | "openbox" | "new_nobox" | "likenew" | "old";
export type ProductStatus = "active" | "out_of_stock" | "hidden" | "draft";

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  sku: string | null;
  barcode: string | null;
  brand_id: string | null;
  price: number;
  original_price: number;
  sale_price: number | null;
  sale_starts_at: string | null;
  sale_ends_at: string | null;
  colors: string[];
  thumbnail: string | null;
  thumbnail_storage_path: string | null;
  specs: Record<string, string>;
  box_info: string | null;
  condition: ProductCondition;
  warranty_months: number;
  warranty_repair_months: number;
  status: ProductStatus;
  is_featured: boolean;
  show_on_home: boolean;
  view_count: number;
  sold_count: number;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price: number;
  original_price: number;
  sort_order: number;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  color: string | null;
  url: string;
  storage_path: string | null;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductCategory {
  product_id: string;
  category_id: string;
}

// ─────────────────────────────────────────
// Wishlist
// ─────────────────────────────────────────
export interface Wishlist {
  user_id: string;
  product_id: string;
  created_at: string;
}

// ─────────────────────────────────────────
// Post (blog)
// ─────────────────────────────────────────
export type PostStatus = "published" | "draft" | "hidden";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  thumbnail: string | null;
  thumbnail_storage_path: string | null;
  author: string;
  status: PostStatus;
  tags: string[];
  view_count: number;
  reading_time: number | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PostPostCategory {
  post_id: string;
  category_id: string;
}

// ─────────────────────────────────────────
// Order
// ─────────────────────────────────────────
export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
export type PaymentMethod = "cod" | "bank_transfer" | "qr";
export type PaymentStatus = "unpaid" | "paid" | "refunded";
export type OrderType = "purchase" | "installment" | "lead";

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  customer_address: string | null;
  province: string | null;
  district: string | null;
  ward: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  voucher_code: string | null;
  voucher_discount: number;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_type: OrderType;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  product_id: string;
  title: string;
  variant: string | null;
  color: string | null;
  price: number;
  quantity: number;
  thumbnail: string | null;
  sku?: string | null;
}

// ─────────────────────────────────────────
// Voucher
// ─────────────────────────────────────────
export interface Voucher {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_order: number;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  starts_at: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────
// Contact
// ─────────────────────────────────────────
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ─────────────────────────────────────────
// Site Settings
// ─────────────────────────────────────────
export interface SiteSetting {
  key: string;
  value: unknown;
  updated_at: string;
}
