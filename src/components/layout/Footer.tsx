import Link from 'next/link'
import { getSettings } from '@/lib/supabase/settings'
import { getPages } from '@/lib/supabase/pages'

export async function Footer() {
  const [settings, pages] = await Promise.all([getSettings(), getPages()])
  const footerPages = pages.filter(p => p.show_in_footer)

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About */}
          <div className="md:col-span-1">
            <h3 className="text-white font-bold text-lg mb-3">{settings.site_name || 'POLY Store'}</h3>
            <p className="text-sm leading-relaxed">{settings.site_description || ''}</p>
            {settings.address && <p className="text-sm mt-3">{settings.address}</p>}
          </div>

          {/* Col 2: Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Danh mục</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/san-pham" className="hover:text-white transition-colors">Sản phẩm</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Hàng Newseal</Link></li>
              <li><Link href="/bai-viet" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/bao-hanh" className="hover:text-white transition-colors">Tra cứu bảo hành</Link></li>
            </ul>
          </div>

          {/* Col 3: Pages */}
          {footerPages.length > 0 && (
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Thông tin</h4>
              <ul className="space-y-2 text-sm">
                {footerPages.map(p => (
                  <li key={p.id}><Link href={`/${p.slug}`} className="hover:text-white transition-colors">{p.title}</Link></li>
                ))}
              </ul>
            </div>
          )}

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">Liên hệ</h4>
            <ul className="space-y-2 text-sm">
              {settings.phone && <li>Hotline: <a href={`tel:${settings.phone}`} className="text-white font-semibold hover:underline">{settings.phone}</a></li>}
              {settings.phone_2 && <li>SĐT 2: <a href={`tel:${settings.phone_2}`} className="hover:text-white">{settings.phone_2}</a></li>}
              {settings.email && <li>Email: <a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a></li>}
              {settings.opening_hours && <li>Giờ mở cửa: {settings.opening_hours}</li>}
            </ul>
            <div className="flex items-center gap-3 mt-4">
              {settings.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>}
              {settings.zalo_url && <a href={settings.zalo_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Zalo</a>}
              {settings.tiktok_url && <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok</a>}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-500">
          <p>{settings.footer_text || '© 2026 POLY Store. All rights reserved.'}</p>
        </div>
      </div>
    </footer>
  )
}
