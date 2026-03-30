import Image from 'next/image'
import Link from 'next/link'
import { getWebSettings } from '@/lib/supabase/settings'
import { getFooterMenus, getSocialLinks, getPaymentIcons } from '@/lib/supabase/homepage'
import { FooterAccordion } from './FooterAccordion'
import { SocialLinks } from './SocialLinks'
import { PaymentIcons } from './PaymentIcons'

export async function Footer() {
  const [settings, menus, socials, payments] = await Promise.all([
    getWebSettings(),
    getFooterMenus(),
    getSocialLinks(),
    getPaymentIcons(),
  ])

  const logo = settings.logo_url || ''
  const siteName = settings.site_name || 'POLY Store'
  const slogan = settings.footer_slogan || settings.site_description || ''
  const address = settings.address || ''
  const phone = settings.phone || settings.header_phone || ''
  const email = settings.email || ''

  // Group menus
  const groups: Record<string, typeof menus> = {}
  for (const m of menus) {
    if (!groups[m.menu_group]) groups[m.menu_group] = []
    groups[m.menu_group].push(m)
  }

  const groupLabels: Record<string, string> = {
    'chinh-sach': 'Chính sách',
    'huong-dan': 'Hướng dẫn',
  }

  return (
    <footer className="footer">
      {/* Mid Footer */}
      <div className="mid-footer">
        <div className="container">
          <div className="row-custom">
            {/* Col 1: Info */}
            <div className="footer-info" style={{ width: '100%', flex: '0 0 100%' }}>
              <style>{`
                @media (min-width: 992px) {
                  .footer-info { width: 33.333% !important; flex: 0 0 33.333% !important; }
                  .footer-col { width: 16.666% !important; flex: 0 0 16.666% !important; }
                  .footer-col-social { width: 33.333% !important; flex: 0 0 33.333% !important; }
                }
              `}</style>

              <div className="logo-footer">
                <Link href="/">
                  {logo ? (
                    <Image src={logo} alt={siteName} width={249} height={26} style={{ maxWidth: 249 }} />
                  ) : (
                    <span style={{ color: '#fff', fontSize: '2rem', fontWeight: 700 }}>{siteName}</span>
                  )}
                </Link>
              </div>

              {slogan && <p className="des_foo">{slogan}</p>}

              {address && (
                <div className="content-contact">
                  <span className="list_footer">
                    📍 {address}
                  </span>
                </div>
              )}
              {phone && (
                <div className="content-contact">
                  <span className="list_footer">
                    📞 <a href={`tel:${phone.replace(/\./g, '')}`}>{phone}</a>
                  </span>
                </div>
              )}
              {email && (
                <div className="content-contact">
                  <span className="list_footer">
                    ✉️ <a href={`mailto:${email}`}>{email}</a>
                  </span>
                </div>
              )}
            </div>

            {/* Menu columns */}
            {Object.entries(groups).map(([group, items]) => (
              <div key={group} className="footer-col" style={{ width: '100%', flex: '0 0 100%' }}>
                <FooterAccordion title={groupLabels[group] || formatGroupName(group)}>
                  <ul>
                    {items.map(item => (
                      <li key={item.id} className="li_menu">
                        {item.link_url ? (
                          <Link href={item.link_url}>{item.title}</Link>
                        ) : (
                          <span>{item.title}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </FooterAccordion>
              </div>
            ))}

            {/* Col 4: Social + Payment */}
            <div className="footer-col-social" style={{ width: '100%', flex: '0 0 100%' }}>
              <FooterAccordion title="Kết nối với chúng tôi">
                <SocialLinks links={socials} />
              </FooterAccordion>

              <div style={{ marginTop: 15 }}>
                <h4 className="title-menu"><span>Hỗ trợ thanh toán</span></h4>
                <PaymentIcons icons={payments} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="copyright">
        <span className="wsp" dangerouslySetInnerHTML={{
          __html: settings.footer_text || `© ${new Date().getFullYear()} <b>${siteName}</b>. All rights reserved.`
        }} />
      </div>
    </footer>
  )
}

function formatGroupName(group: string): string {
  return group.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
