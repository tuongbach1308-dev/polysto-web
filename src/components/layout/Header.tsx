import { getSettings } from '@/lib/supabase/settings'
import { getPages } from '@/lib/supabase/pages'
import { getCategoriesHierarchical } from '@/lib/supabase/catalog'
import { HeaderClient } from './HeaderClient'

export async function Header() {
  const [settings, pages, categories] = await Promise.all([
    getSettings(),
    getPages(),
    getCategoriesHierarchical(),
  ])
  const headerPages = pages.filter((p: any) => p.show_in_header)

  return (
    <HeaderClient
      settings={settings}
      headerPages={headerPages.map((p: any) => ({ title: p.title, slug: p.slug }))}
      categories={categories}
    />
  )
}
