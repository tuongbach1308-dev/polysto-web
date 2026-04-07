import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { SITE_NAME, HOTLINE, SOCIAL_LINKS, STORES } from '@/lib/constants'
import type { FooterMenu, SocialLink, StoreInfo } from '@/components/Providers'

interface Props {
  settings: Record<string, string>
  footerMenus: FooterMenu[]
  socialLinks: SocialLink[]
  stores: StoreInfo[]
}

export default function Footer({ settings, footerMenus, socialLinks, stores }: Props) {
  const siteName = settings.site_name || SITE_NAME
  const hotline = settings.phone || settings.header_phone || HOTLINE
  const logoUrl = settings.logo_url || ''

  // Use Supabase stores if available, fallback to static
  const storeList = stores.length > 0 ? stores : [
    { id: '1', name: STORES.hanoi.name, address: STORES.hanoi.address, phone: STORES.hanoi.phone },
    { id: '2', name: STORES.hcm.name, address: STORES.hcm.address, phone: STORES.hcm.phone },
  ]

  // Use Supabase social links if available, fallback to static
  const socials = socialLinks.length > 0 ? socialLinks : [
    { id: '1', platform: 'Shopee', url: SOCIAL_LINKS.shopee },
    { id: '2', platform: 'Instagram', url: SOCIAL_LINKS.instagram },
    { id: '3', platform: 'Facebook', url: SOCIAL_LINKS.facebook },
    { id: '4', platform: 'TikTok', url: SOCIAL_LINKS.tiktok },
    { id: '5', platform: 'Threads', url: SOCIAL_LINKS.threads },
  ]

  // Group footer menus
  const groups: Record<string, FooterMenu[]> = {}
  for (const m of footerMenus) {
    if (!groups[m.menu_group]) groups[m.menu_group] = []
    groups[m.menu_group].push(m)
  }

  const groupLabels: Record<string, string> = { 'chinh-sach': 'Chính sách', 'huong-dan': 'Hướng dẫn', 'thong-tin': 'Thông tin' }

  return (
    <footer className="mt-auto">
      {/* Top bar - social + CTA */}
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="text-sm font-semibold uppercase tracking-wide">Theo dõi {siteName} qua</span>
            <div className="flex items-center gap-3">
              {socials.map(s => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label={s.platform}>
                  <span className="text-sm font-bold">{s.platform.charAt(0)}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Phone CTA */}
          <div className="flex items-center gap-3">
            <div className="text-right text-sm hidden md:block">
              <p className="font-medium">Bạn cần tư vấn hoặc đặt hàng nhanh?</p>
              <p className="text-white/70 text-xs">Để lại số điện thoại, {siteName} sẽ liên hệ bạn ngay!</p>
            </div>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-full overflow-hidden hover:border-white/40 transition-colors focus-within:border-white/50 focus-within:bg-white/15">
              <input type="tel" placeholder="Nhập SĐT của bạn" className="bg-transparent px-5 py-2.5 text-sm text-white placeholder:text-white/50 w-48 focus:outline-none" />
              <button className="w-9 h-9 bg-white text-navy rounded-full flex items-center justify-center hover:bg-white/90 transition-colors shrink-0 mr-1">
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer - white bg */}
      <div className="bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Logo + name */}
          <div className="flex items-center gap-3 mb-6">
            {logoUrl ? (
              <Image src={logoUrl} alt={siteName} width={140} height={36} className="h-8 w-auto" />
            ) : (
              <>
                <span className="text-3xl">🍎</span>
                <span className="text-xl font-bold text-navy uppercase tracking-wide">{siteName}</span>
              </>
            )}
          </div>

          {/* Info rows */}
          <div className="space-y-3">
            {/* Stores */}
            <div className="flex flex-wrap items-start gap-2 text-sm">
              <span className="font-semibold text-text-dark uppercase text-xs tracking-wide min-w-[200px]">Hệ thống bán lẻ {siteName}:</span>
              <div className="flex flex-wrap gap-2">
                {storeList.map(s => (
                  <span key={s.id} className="px-3 py-1.5 border border-border rounded text-text-muted text-xs">{s.address}</span>
                ))}
              </div>
            </div>

            {/* Hotline */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-text-dark uppercase text-xs tracking-wide min-w-[200px]">Tổng đài hỗ trợ:</span>
              <a href={`tel:${hotline}`} className="px-3 py-1.5 border border-border rounded text-text-muted text-xs hover:text-navy hover:border-navy transition-colors">{hotline}</a>
            </div>

            {/* Footer menu groups from Supabase */}
            {Object.entries(groups).map(([group, items]) => (
              <div key={group} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-text-dark uppercase text-xs tracking-wide min-w-[200px]">{groupLabels[group] || group}:</span>
                <div className="flex flex-wrap gap-2">
                  {items.map(item => (
                    item.link_url ? (
                      <Link key={item.id} href={item.link_url} className="px-3 py-1.5 border border-border rounded text-text-muted text-xs hover:text-navy hover:border-navy transition-colors">{item.title}</Link>
                    ) : (
                      <span key={item.id} className="px-3 py-1.5 border border-border rounded text-text-muted text-xs">{item.title}</span>
                    )
                  ))}
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-text-dark uppercase text-xs tracking-wide min-w-[200px]">Thông tin:</span>
              <div className="flex flex-wrap gap-2">
                <Link href="/lien-he" className="px-3 py-1.5 border border-border rounded text-text-muted text-xs hover:text-navy hover:border-navy transition-colors">Về {siteName}</Link>
                {socials.map(s => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border border-border rounded text-text-muted text-xs hover:text-navy hover:border-navy transition-colors">{s.platform}</a>
                ))}
                <Link href="/lien-he" className="px-3 py-1.5 border border-border rounded text-text-muted text-xs hover:text-navy hover:border-navy transition-colors">Liên hệ hợp tác</Link>
              </div>
            </div>

            {/* Payment */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-text-dark uppercase text-xs tracking-wide min-w-[200px]">Hình thức thanh toán:</span>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 border border-border rounded text-xs font-bold text-blue-700">VISA</span>
                <span className="px-3 py-1.5 border border-border rounded text-xs font-bold text-orange-500">MC</span>
                <span className="px-3 py-1.5 border border-border rounded text-xs font-bold text-green-600">Kredivo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 text-center text-xs text-text-muted">
          <span dangerouslySetInnerHTML={{ __html: settings.footer_text || `&copy; ${new Date().getFullYear()} ${siteName}. Tất cả quyền được bảo lưu.` }} />
        </div>
      </div>
    </footer>
  )
}
