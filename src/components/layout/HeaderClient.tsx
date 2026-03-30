'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCart } from '@/lib/cart/store'

interface HeaderClientProps {
  siteName: string
  logoUrl?: string
  phone?: string
  headerPages: { title: string; slug: string }[]
}

export function HeaderClient({ siteName, logoUrl, phone, headerPages }: HeaderClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const update = () => setCartCount(getCart().reduce((s, i) => s + i.qty, 0))
    update()
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  const navLinks = [
    { href: '/', label: 'Trang chủ' },
    { href: '/san-pham', label: 'Sản phẩm' },
    { href: '/shop', label: 'Newseal' },
    { href: '/bai-viet', label: 'Blog' },
    { href: '/bao-hanh', label: 'Tra cứu BH' },
    ...headerPages.map(p => ({ href: `/${p.slug}`, label: p.title })),
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      {/* Top bar */}
      {phone && (
        <div className="bg-primary-600 text-white text-xs py-1.5">
          <div className="container-page flex items-center justify-between">
            <span>Hotline: <a href={`tel:${phone}`} className="font-semibold hover:underline">{phone}</a></span>
            <span className="hidden sm:block">Cửa hàng điện thoại & phụ kiện uy tín tại Bình Thạnh</span>
          </div>
        </div>
      )}

      <div className="container-page">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {logoUrl ? (
              <Image src={logoUrl} alt={siteName} width={40} height={40} className="rounded-lg" />
            ) : (
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">P</div>
            )}
            <span className="text-lg font-bold text-slate-800 hidden sm:block">{siteName}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Cart + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link href="/gio-hang" className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
              <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
