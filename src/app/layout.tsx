import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ZaloButton } from '@/components/layout/ZaloButton'
import { LocalBusinessSchema } from '@/components/seo/JsonLd'
import { getSettings } from '@/lib/supabase/settings'
import '@/styles/globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: {
      default: settings.home_meta_title || settings.site_name || 'POLY Store Bình Thạnh',
      template: `%s | ${settings.site_name || 'POLY Store'}`,
    },
    description: settings.home_meta_description || settings.site_description || '',
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      url: settings.site_url || '',
      siteName: settings.site_name || 'POLY Store',
      images: settings.default_og_image ? [{ url: settings.default_og_image }] : [],
    },
    icons: settings.favicon_url ? { icon: settings.favicon_url } : undefined,
    metadataBase: settings.site_url ? new URL(settings.site_url) : undefined,
    verification: {
      google: settings.google_search_console || undefined,
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <html lang="vi">
      <head>
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
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ZaloButton />
      </body>
    </html>
  )
}
