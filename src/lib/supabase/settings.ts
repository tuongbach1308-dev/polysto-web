import { createServerClient } from './server'

export interface WebSettings {
  // General
  site_name: string
  site_description: string
  site_url: string
  logo_url: string
  logo_mobile_url: string
  favicon_url: string

  // Contact
  phone: string
  phone_2: string
  email: string
  address: string
  google_maps_embed: string
  zalo_url: string
  facebook_url: string
  tiktok_url: string
  opening_hours: string

  // SEO
  home_meta_title: string
  home_meta_description: string
  default_og_image: string
  google_analytics_id: string
  google_search_console: string
  facebook_pixel_id: string
  fb_domain_verification: string

  // Shop
  shipping_fee: string
  free_shipping_threshold: string
  bank_name: string
  bank_account_number: string
  bank_account_name: string

  // Theme
  primary_color: string
  heading_font: string
  body_font: string
  border_radius: string
  custom_css: string
  custom_js: string

  // Footer
  footer_slogan: string
  footer_text: string

  // Header
  header_stores_text: string
  header_stores_link: string
  header_phone: string

  // Slider
  slider_autoplay_delay: string

  // Generic fallback
  [key: string]: string
}

export type SettingsMap = Record<string, string>

export async function getWebSettings(): Promise<WebSettings> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('web_settings')
    .select('setting_key, setting_value')

  if (error) {
    console.error('Failed to load web_settings:', error)
    return {} as WebSettings
  }

  const settings: Record<string, string> = {}
  data?.forEach((row) => {
    settings[row.setting_key] = row.setting_value || ''
  })

  return settings as WebSettings
}

// Backward-compatible alias — existing components import this
export async function getSettings(): Promise<SettingsMap> {
  return getWebSettings()
}

// Helper to get a single setting
export async function getWebSetting(key: string): Promise<string> {
  const settings = await getWebSettings()
  return settings[key] || ''
}
