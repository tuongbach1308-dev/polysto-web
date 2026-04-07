import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import { getWebSettings } from '@/lib/supabase/settings'
import { getCategoriesHierarchical } from '@/lib/supabase/catalog'
import { getFooterMenus, getSocialLinks, getStores } from '@/lib/supabase/homepage'
import { LocalBusinessSchema } from '@/components/seo/JsonLd'

const nunito = Nunito({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-nunito',
})

export async function generateMetadata(): Promise<Metadata> {
  const s = await getWebSettings()
  return {
    title: { default: s.home_meta_title || s.site_name || 'POLY Store', template: `%s | ${s.site_name || 'POLY Store'}` },
    description: s.home_meta_description || s.site_description || '',
    metadataBase: new URL(s.site_url || 'https://polystorevn.com'),
    openGraph: { type: 'website', locale: 'vi_VN', siteName: s.site_name || 'POLY Store', images: s.default_og_image ? [s.default_og_image] : [] },
    robots: { index: true, follow: true },
    icons: { icon: s.favicon_url || '/favicon.ico' },
    verification: { google: s.google_search_console || undefined },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories, footerMenus, socialLinks, stores] = await Promise.all([
    getWebSettings(),
    getCategoriesHierarchical(),
    getFooterMenus(),
    getSocialLinks(),
    getStores(),
  ])

  return (
    <html lang="vi" className={`${nunito.variable} h-full antialiased`}>
      <head>
        {settings.custom_css && <style dangerouslySetInnerHTML={{ __html: settings.custom_css }} />}
        {settings.google_analytics_id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${settings.google_analytics_id}');` }} />
          </>
        )}
        {settings.facebook_pixel_id && (
          <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${settings.facebook_pixel_id}');fbq('track','PageView');` }} />
        )}
        <LocalBusinessSchema settings={settings} />
      </head>
      <body className="font-nunito min-h-full flex flex-col" style={{ fontFamily: 'var(--font-nunito), system-ui, sans-serif' }}>
        <Providers
          settings={settings}
          categories={categories}
          footerMenus={footerMenus}
          socialLinks={socialLinks}
          stores={stores}
        >
          {children}
        </Providers>
        {settings.custom_js && <script dangerouslySetInnerHTML={{ __html: settings.custom_js }} />}
      </body>
    </html>
  )
}
