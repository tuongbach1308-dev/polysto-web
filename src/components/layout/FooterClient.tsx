'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface FooterMenu {
  id: string; menu_group: string; title: string; link_url?: string
}

interface SocialLink {
  id: string; platform: string; url: string; icon_url?: string
}

interface PaymentIcon {
  id: string; name: string; icon_url: string
}

interface Props {
  settings: Record<string, string>
  footerMenus: FooterMenu[]
  socialLinks: SocialLink[]
  paymentIcons: PaymentIcon[]
  headerPages: { title: string; slug: string }[]
}

const SOCIAL_ICONS: Record<string, string> = {
  facebook: '📘', instagram: '📸', tiktok: '🎵', youtube: '▶️',
  shopee: '🛒', lazada: '🛍️', zalo: '💬',
}

export function FooterClient({ settings, footerMenus, socialLinks, paymentIcons, headerPages }: Props) {
  // Group footer menus by menu_group
  const groups: Record<string, FooterMenu[]> = {}
  for (const item of footerMenus) {
    if (!groups[item.menu_group]) groups[item.menu_group] = []
    groups[item.menu_group].push(item)
  }

  const groupNames = Object.keys(groups)
  const siteName = settings.site_name || 'POLY Store'
  const address = settings.address || ''
  const phone = settings.phone || settings.header_phone || ''
  const email = settings.email || ''
  const openingHours = settings.opening_hours || ''

  return (
    <footer className="bg-dark text-[#a7a7a7] mt-0">
      {/* Top bar */}
      <div className="shadow-footer-top bg-dark-surface">
        <div className="poly-container py-[20px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
            {/* Col 1: About */}
            <FooterAccordion title={siteName} defaultOpen>
              {settings.site_description && (
                <p className="text-[1.3rem] leading-relaxed mb-[10px]">{settings.site_description}</p>
              )}
              {address && (
                <p className="text-[1.3rem] flex gap-[6px]">
                  <span className="shrink-0">📍</span> {address}
                </p>
              )}
              {phone && (
                <p className="text-[1.3rem] mt-[6px] flex gap-[6px]">
                  <span className="shrink-0">📞</span>
                  <a href={`tel:${phone}`} className="text-white font-semibold hover:text-brand transition-colors">{phone}</a>
                </p>
              )}
              {email && (
                <p className="text-[1.3rem] mt-[6px] flex gap-[6px]">
                  <span className="shrink-0">✉️</span>
                  <a href={`mailto:${email}`} className="hover:text-brand transition-colors">{email}</a>
                </p>
              )}
              {openingHours && (
                <p className="text-[1.3rem] mt-[6px] flex gap-[6px]">
                  <span className="shrink-0">🕐</span> {openingHours}
                </p>
              )}
            </FooterAccordion>

            {/* Dynamic menu groups */}
            {groupNames.map(group => (
              <FooterAccordion key={group} title={formatGroupName(group)}>
                <ul className="space-y-[8px]">
                  {groups[group].map(item => (
                    <li key={item.id}>
                      {item.link_url ? (
                        <Link href={item.link_url} className="text-[1.3rem] hover:text-brand transition-colors">
                          {item.title}
                        </Link>
                      ) : (
                        <span className="text-[1.3rem]">{item.title}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </FooterAccordion>
            ))}

            {/* Pages column if we have leftover space */}
            {headerPages.length > 0 && groupNames.length < 3 && (
              <FooterAccordion title="Danh mục">
                <ul className="space-y-[8px]">
                  <li><Link href="/san-pham" className="text-[1.3rem] hover:text-brand transition-colors">Sản phẩm mẫu</Link></li>
                  <li><Link href="/shop" className="text-[1.3rem] hover:text-brand transition-colors">Hàng Newseal</Link></li>
                  <li><Link href="/bai-viet" className="text-[1.3rem] hover:text-brand transition-colors">Blog</Link></li>
                  <li><Link href="/bao-hanh" className="text-[1.3rem] hover:text-brand transition-colors">Tra cứu bảo hành</Link></li>
                  {headerPages.map(p => (
                    <li key={p.slug}>
                      <Link href={`/${p.slug}`} className="text-[1.3rem] hover:text-brand transition-colors">{p.title}</Link>
                    </li>
                  ))}
                </ul>
              </FooterAccordion>
            )}
          </div>
        </div>
      </div>

      {/* Social + Payment */}
      <div className="poly-container py-[16px] border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-[12px]">
          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-[10px]">
              <span className="text-[1.2rem] font-semibold text-white/60 mr-[4px]">Theo dõi:</span>
              {socialLinks.map(s => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[36px] h-[36px] rounded-full bg-white/10 flex items-center justify-center hover:bg-brand transition-colors"
                  title={s.platform}
                >
                  {s.icon_url ? (
                    <Image src={s.icon_url} alt={s.platform} width={20} height={20} className="object-contain" />
                  ) : (
                    <span className="text-[1.4rem]">{SOCIAL_ICONS[s.platform] || '🔗'}</span>
                  )}
                </a>
              ))}
            </div>
          )}

          {/* Payment icons */}
          {paymentIcons.length > 0 && (
            <div className="flex items-center gap-[8px]">
              <span className="text-[1.2rem] font-semibold text-white/60 mr-[4px]">Thanh toán:</span>
              {paymentIcons.map(p => (
                <div key={p.id} className="h-[28px] bg-white rounded-[4px] px-[6px] flex items-center" title={p.name}>
                  <Image src={p.icon_url} alt={p.name} width={36} height={22} className="object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="poly-container py-[14px] border-t border-white/10 text-center">
        <p className="text-[1.2rem] text-white/40">
          {settings.footer_text || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
        </p>
      </div>
    </footer>
  )
}

function FooterAccordion({ title, children, defaultOpen }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen || false)

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`footer-toggle ${open ? 'open' : ''} w-full text-left md:pointer-events-none relative pr-[20px] md:pr-0`}
      >
        <h4 className="text-white font-bold text-[1.5rem] mb-[12px] md:mb-[14px]">{title}</h4>
      </button>
      <div className={`${open ? 'block' : 'hidden'} md:block pb-[12px] md:pb-0`}>
        {children}
      </div>
    </div>
  )
}

function formatGroupName(group: string): string {
  return group
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
