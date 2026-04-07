'use client'

import type { ReactNode } from 'react'
import { AuthProvider } from '@/hooks/useAuth'
import { CartProvider } from '@/hooks/useCart'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export interface SiteCategory {
  id: string
  name: string
  slug: string
  icon_url?: string
  children?: SiteCategory[]
}

export interface FooterMenu {
  id: string
  menu_group: string
  title: string
  link_url?: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon_url?: string
}

export interface StoreInfo {
  id: string
  name: string
  address: string
  phone?: string
}

interface Props {
  children: ReactNode
  settings: Record<string, string>
  categories: SiteCategory[]
  footerMenus: FooterMenu[]
  socialLinks: SocialLink[]
  stores: StoreInfo[]
}

export default function Providers({ children, settings, categories, footerMenus, socialLinks, stores }: Props) {
  return (
    <AuthProvider>
      <CartProvider>
        <Header settings={settings} categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} footerMenus={footerMenus} socialLinks={socialLinks} stores={stores} />
      </CartProvider>
    </AuthProvider>
  )
}
