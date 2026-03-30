import Link from 'next/link'
import { getSettings } from '@/lib/supabase/settings'
import { getPages } from '@/lib/supabase/pages'
import { HeaderClient } from './HeaderClient'

export async function Header() {
  const [settings, pages] = await Promise.all([getSettings(), getPages()])
  const headerPages = pages.filter(p => p.show_in_header)

  return (
    <HeaderClient
      siteName={settings.site_name || 'POLY Store'}
      logoUrl={settings.logo_url}
      phone={settings.phone}
      headerPages={headerPages.map(p => ({ title: p.title, slug: p.slug }))}
    />
  )
}
