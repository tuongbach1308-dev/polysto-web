import type { Metadata, Viewport } from 'next'
import { Nunito } from 'next/font/google'
import '@/styles/globals.css'
import { getWebSettings } from '@/lib/supabase/settings'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingWidget } from '@/components/layout/FloatingWidget'
import { BackToTop } from '@/components/layout/BackToTop'
import { MobileWrapper } from '@/components/layout/MobileWrapper'
import { LocalBusinessSchema } from '@/components/seo/JsonLd'
import { getCategoriesHierarchical } from '@/lib/supabase/catalog'

const nunito = Nunito({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-nunito',
})

export const viewport: Viewport = {
  width: 'device-width',
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#222',
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getWebSettings()

  return {
    title: {
      template: `%s | ${settings.site_name || 'POLY Store'}`,
      default: settings.home_meta_title || settings.site_name || 'POLY Store',
    },
    description: settings.home_meta_description || settings.site_description || '',
    metadataBase: new URL(settings.site_url || 'https://polystorevn.com'),
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      siteName: settings.site_name || 'POLY Store',
      images: settings.default_og_image ? [settings.default_og_image] : [],
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: settings.favicon_url || '/favicon.ico',
    },
    verification: {
      google: settings.google_search_console || undefined,
    },
    other: {
      'facebook-domain-verification': settings.fb_domain_verification || '',
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [settings, categories] = await Promise.all([
    getWebSettings(),
    getCategoriesHierarchical(),
  ])

  // Build CSS variables from admin theme settings
  const themeVars = {
    '--theme-primary': settings.primary_color || '#7bb842',
    '--theme-border-radius': `${settings.border_radius || 8}px`,
  } as React.CSSProperties

  return (
    <html lang="vi" className={nunito.variable}>
      <head>
        {/* Admin custom CSS */}
        {settings.custom_css && (
          <style dangerouslySetInnerHTML={{ __html: settings.custom_css }} />
        )}
        {/* Google Analytics */}
        {settings.google_analytics_id && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${settings.google_analytics_id}');
                `,
              }}
            />
          </>
        )}
        {/* Facebook Pixel */}
        {settings.facebook_pixel_id && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${settings.facebook_pixel_id}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
        <LocalBusinessSchema settings={settings} />
      </head>
      <body className="font-nunito" style={themeVars}>
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileWrapper categories={categories} />
        <FloatingWidget settings={settings} />
        <BackToTop />

        {/* Admin custom JS */}
        {settings.custom_js && (
          <script dangerouslySetInnerHTML={{ __html: settings.custom_js }} />
        )}
      </body>
    </html>
  )
}
