import { getWebSettings } from '@/lib/supabase/settings'
import { getCategoriesHierarchical } from '@/lib/supabase/catalog'
import { HeaderClient } from './HeaderClient'

export async function Header() {
  const [settings, categories] = await Promise.all([
    getWebSettings(),
    getCategoriesHierarchical(),
  ])

  return <HeaderClient settings={settings} categories={categories} />
}
