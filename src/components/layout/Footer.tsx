import { getSettings } from '@/lib/supabase/settings'
import { getPages } from '@/lib/supabase/pages'
import { getFooterMenus, getSocialLinks, getPaymentIcons } from '@/lib/supabase/homepage'
import { FooterClient } from './FooterClient'

export async function Footer() {
  const [settings, pages, footerMenus, socialLinks, paymentIcons] = await Promise.all([
    getSettings(),
    getPages(),
    getFooterMenus(),
    getSocialLinks(),
    getPaymentIcons(),
  ])

  const headerPages = pages.filter(p => p.show_in_footer).map(p => ({ title: p.title, slug: p.slug }))

  return (
    <FooterClient
      settings={settings}
      footerMenus={footerMenus}
      socialLinks={socialLinks}
      paymentIcons={paymentIcons}
      headerPages={headerPages}
    />
  )
}
