'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { topNav } from '@/data/navigation'
import { X, Search, ChevronDown, User, LogOut } from 'lucide-react'
import { getCategoryIcon } from '@/lib/category-icons'
import { useAuth } from '@/hooks/useAuth'
import type { SiteCategory } from '@/components/Providers'

interface Props {
  open: boolean
  onClose: () => void
  categories: SiteCategory[]
}

export default function MobileMenu({ open, onClose, categories }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-50 lg:hidden overflow-y-auto transition-transform duration-200 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-dark leading-tight">{user.name}</p>
                <p className="text-[11px] text-text-muted">{user.email}</p>
              </div>
            </div>
          ) : (
            <span className="font-semibold text-text-dark">Menu</span>
          )}
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-text-dark transition-colors" aria-label="Đóng menu">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <input type="text" placeholder="Tìm kiếm sản phẩm..." className="w-full border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-dark placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
          </div>
        </div>

        <nav className="p-4">
          {/* Auth links */}
          <div className="mb-4 pb-4 border-b border-border">
            {isAuthenticated ? (
              <>
                <Link href="/tai-khoan" onClick={onClose} className="flex items-center gap-3 py-2.5 text-sm font-medium text-navy">
                  <User className="h-4 w-4" /> Tài khoản của tôi
                </Link>
                <button onClick={() => { logout(); onClose() }} className="flex items-center gap-3 py-2.5 text-sm font-medium text-discount-red w-full">
                  <LogOut className="h-4 w-4" /> Đăng xuất
                </button>
              </>
            ) : (
              <Link href="/dang-nhap" onClick={onClose} className="flex items-center gap-3 py-2.5 text-sm font-medium text-navy">
                <User className="h-4 w-4" /> Đăng nhập / Đăng ký
              </Link>
            )}
          </div>

          {/* Top nav links */}
          <div className="mb-4 pb-4 border-b border-border">
            {topNav.map((item) => (
              <Link key={item.href} href={item.href} onClick={onClose} className="block py-2.5 text-sm text-text-muted hover:text-text-dark transition-colors">
                {item.label}
              </Link>
            ))}
          </div>

          {/* Category nav — from Supabase */}
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Danh mục sản phẩm</p>
          {categories.map((cat) => (
            <div key={cat.id} className="mb-1">
              <div className="flex items-center justify-between">
                <Link
                  href={`/san-pham?danh-muc=${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 flex-1 py-2.5 text-sm font-medium text-text-dark hover:text-navy transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-bg-gray flex items-center justify-center p-1.5">
                    {cat.icon_url ? <Image src={cat.icon_url} alt="" width={20} height={20} className="w-5 h-5 object-contain" /> : getCategoryIcon(cat.slug, 20)}
                  </span>
                  {cat.name}
                </Link>
                {cat.children && cat.children.length > 0 && (
                  <button onClick={() => setExpanded(expanded === cat.slug ? null : cat.slug)} className="w-8 h-8 flex items-center justify-center text-text-muted">
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expanded === cat.slug ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              {cat.children && expanded === cat.slug && (
                <div className="pl-11 pb-3">
                  {cat.children.map((sub) => (
                    <Link key={sub.id} href={`/san-pham?danh-muc=${sub.slug}`} onClick={onClose} className="block py-1.5 text-sm text-text-muted hover:text-navy transition-colors">
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}
