import type { MetadataRoute } from 'next'
import { getWebSettings } from '@/lib/supabase/settings'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getWebSettings()
  const siteUrl = settings.site_url || 'https://polystorevn.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/gio-hang', '/thanh-toan', '/dat-hang-thanh-cong'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
