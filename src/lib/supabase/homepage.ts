import { createServerClient } from './server'

export interface HomepageSection {
  id: string
  section_type: string
  title?: string
  category_id?: string
  config: {
    category_id?: string
    items_count?: number
    layout?: string
    show_sub_tabs?: boolean
    show_view_all?: boolean
    custom_html?: string
  }
  sort_order: number
  is_active: boolean
}

export interface Feature {
  id: string
  icon_url?: string
  icon_type: string
  icon_name?: string
  title: string
  description?: string
  link_url?: string
  sort_order: number
}

export interface CustomerGalleryItem {
  id: string
  image_url: string
  caption?: string
  customer_name?: string
  sort_order: number
}

export interface Store {
  id: string
  name: string
  address: string
  city: string
  district?: string
  phone?: string
  phone_2?: string
  opening_hours?: string
  google_maps_url?: string
  google_maps_embed?: string
  image_url?: string
}

export interface FooterMenu {
  id: string
  menu_group: string
  title: string
  link_url?: string
  sort_order: number
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon_url?: string
  sort_order: number
}

export interface PaymentIcon {
  id: string
  name: string
  icon_url: string
  sort_order: number
}

export async function getHomepageSections() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('web_homepage_sections')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return (data || []) as HomepageSection[]
}

export async function getFeatures() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('web_features')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return (data || []) as Feature[]
}

export async function getCustomerGallery() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('web_customer_gallery')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return (data || []) as CustomerGalleryItem[]
}

export async function getStores() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('web_stores')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return (data || []) as Store[]
}

export async function getFooterMenus() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('web_footer_menus')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return (data || []) as FooterMenu[]
}

export async function getSocialLinks() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('web_social_links')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return (data || []) as SocialLink[]
}

export async function getPaymentIcons() {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('web_payment_icons')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return (data || []) as PaymentIcon[]
}
