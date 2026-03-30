'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getCart } from '@/lib/cart/store'

interface CategoryChild {
  id: string
  name: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
  icon_url?: string
  image_url?: string
  children?: CategoryChild[]
}

interface Props {
  settings: Record<string, string>
  headerPages: { title: string; slug: string }[]
  categories: Category[]
}

export function HeaderClient({ settings, headerPages, categories }: Props) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  // Settings with defaults
  const logoDesktop = settings.header_logo_desktop || settings.logo_url || ''
  const logoMobile = settings.header_logo_mobile || settings.logo_url || ''
  const phone = settings.header_phone || settings.phone || '0938.335.030'
  const storeText = settings.header_store_text || 'He Thong 2CH'
  const storeLink = settings.header_store_link || '/he-thong-cua-hang'
  const showPhone = settings.header_show_phone !== 'false'
  const showCart = settings.header_show_cart !== 'false'
  const siteName = settings.site_name || 'POLY Store'

  // Cart count listener
  useEffect(() => {
    const update = () => setCartCount(getCart().reduce((s, i) => s + i.qty, 0))
    update()
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  // Body scroll lock when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Click outside to close desktop dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        menuBtnRef.current &&
        !menuBtnRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  // Reset active tab when menu opens
  useEffect(() => {
    if (menuOpen && categories.length > 0) {
      setActiveTab(0)
    }
  }, [menuOpen, categories.length])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const q = searchQuery.trim()
      if (q) {
        router.push(`/search?q=${encodeURIComponent(q)}`)
        setSearchQuery('')
      }
    },
    [searchQuery, router]
  )

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev)
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
  }, [])

  const activeCategory = categories[activeTab] || null

  // Bottom nav items for mobile
  const bottomNavItems: Array<{
    label: string; href: string; icon: string; action?: () => void; iconUrl?: string
  }> = [
    { label: 'Trang chu', href: '/', icon: 'home' },
    { label: 'Danh muc', href: '#', icon: 'grid', action: toggleMenu },
    ...(categories.slice(0, 3).map(cat => ({
      label: cat.name.length > 8 ? cat.name.substring(0, 8) : cat.name,
      href: `/danh-muc/${cat.slug}`,
      icon: 'device',
      iconUrl: cat.icon_url,
    }))),
  ]

  return (
    <>
      {/* ===== HEADER ===== */}
      <header
        className="sticky top-0 z-[1080]"
        style={{ background: 'linear-gradient(180deg, #2F5324, #1E4D2B)' }}
      >
        {/* Desktop Header */}
        <div className="hidden lg:block">
          <div className="mx-auto max-w-[1349px] px-[45px]">
            <div className="flex items-center gap-3 h-16">
              {/* Logo */}
              <Link href="/" className="shrink-0 mr-2">
                {logoDesktop ? (
                  <Image
                    src={logoDesktop}
                    alt={siteName}
                    width={140}
                    height={44}
                    className="h-[44px] w-auto object-contain"
                    priority
                  />
                ) : (
                  <span className="text-white text-xl font-bold">{siteName}</span>
                )}
              </Link>

              {/* Category button */}
              <button
                ref={menuBtnRef}
                onClick={toggleMenu}
                className="relative shrink-0 flex items-center gap-2 h-[44px] px-4 rounded-[10px] bg-white/[0.12] border border-white/[0.22] text-white font-medium hover:bg-white/20 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                <span className="text-sm">Danh muc</span>
                <svg
                  className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1 mx-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Ban can tim gi?"
                    className="w-full h-[44px] pl-4 pr-12 rounded-[10px] bg-white text-gray-800 text-sm placeholder:text-gray-400 outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-[36px] flex items-center justify-center rounded-lg bg-[#2F5324] text-white hover:bg-[#1E4D2B] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Store button */}
              <Link
                href={storeLink}
                className="shrink-0 flex items-center gap-2 h-[44px] px-3 rounded-[10px] bg-white/[0.12] border border-white/[0.22] text-white font-medium hover:bg-white/20 transition-colors text-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {storeText}
              </Link>

              {/* Phone button */}
              {showPhone && (
                <a
                  href={`tel:${phone.replace(/\./g, '')}`}
                  className="shrink-0 flex items-center gap-2 h-[44px] px-3 rounded-[10px] bg-white/[0.12] border border-white/[0.22] text-white font-medium hover:bg-white/20 transition-colors text-sm"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  Goi mua hang
                </a>
              )}

              {/* Cart */}
              {showCart && (
                <Link
                  href="/gio-hang"
                  className="shrink-0 relative flex items-center justify-center w-[44px] h-[44px] rounded-[10px] bg-white/[0.12] border border-white/[0.22] text-white hover:bg-white/20 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-white text-[#1E4D2B] text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[#1E4D2B22]">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Category Mega Menu */}
          {menuOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black/50 z-[1040]"
                onClick={closeMenu}
              />
              {/* Dropdown */}
              <div
                ref={menuRef}
                className="absolute left-0 right-0 z-[1050]"
              >
                <div className="mx-auto max-w-[1349px] px-[45px]">
                  <div className="relative" style={{ marginLeft: '0' }}>
                    <div className="w-[400px] bg-white rounded-lg shadow-[0_8px_25px_rgba(0,0,0,0.15)] border border-[#e5e5e5] overflow-hidden">
                      <div className="flex" style={{ height: '400px' }}>
                        {/* Sidebar tabs */}
                        <div className="w-[200px] bg-[#f0f0f0] border-r border-[#ddd] overflow-y-auto">
                          {categories.map((cat, idx) => (
                            <button
                              key={cat.id}
                              onMouseEnter={() => setActiveTab(idx)}
                              onClick={() => {
                                router.push(`/danh-muc/${cat.slug}`)
                                closeMenu()
                              }}
                              className={`w-full flex items-center gap-2.5 px-4 py-3 text-left text-sm transition-colors ${
                                activeTab === idx
                                  ? 'bg-white text-[#2F5324] font-semibold'
                                  : 'text-gray-700 hover:bg-white/60'
                              }`}
                            >
                              {cat.icon_url ? (
                                <Image
                                  src={cat.icon_url}
                                  alt=""
                                  width={20}
                                  height={20}
                                  className="w-5 h-5 object-contain shrink-0"
                                />
                              ) : (
                                <svg className="w-5 h-5 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
                                </svg>
                              )}
                              <span className="truncate">{cat.name}</span>
                            </button>
                          ))}
                        </div>

                        {/* Content panel */}
                        <div className="flex-1 p-4 overflow-y-auto">
                          {activeCategory && (
                            <>
                              <Link
                                href={`/danh-muc/${activeCategory.slug}`}
                                onClick={closeMenu}
                                className="block text-base font-semibold text-[#2F5324] mb-3 hover:underline"
                              >
                                Tat ca {activeCategory.name}
                              </Link>
                              <div className="flex flex-wrap gap-2">
                                {activeCategory.children && activeCategory.children.length > 0 ? (
                                  activeCategory.children.map(child => (
                                    <Link
                                      key={child.id}
                                      href={`/danh-muc/${child.slug}`}
                                      onClick={closeMenu}
                                      className="px-[14px] py-1.5 bg-[#f0f2f5] rounded-[20px] text-sm text-[#333] hover:bg-[#e4e6e9] transition-colors"
                                    >
                                      {child.name}
                                    </Link>
                                  ))
                                ) : (
                                  <p className="text-sm text-gray-400">Chua co danh muc con</p>
                                )}
                              </div>
                              {activeCategory.image_url && (
                                <div className="mt-4">
                                  <Image
                                    src={activeCategory.image_url}
                                    alt={activeCategory.name}
                                    width={180}
                                    height={120}
                                    className="rounded-lg object-cover"
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="flex items-center gap-2 px-3 py-2">
            {/* Mobile logo icon */}
            <Link href="/" className="shrink-0">
              {logoMobile ? (
                <Image
                  src={logoMobile}
                  alt={siteName}
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain rounded-lg"
                  priority
                />
              ) : (
                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold text-base">
                  P
                </div>
              )}
            </Link>

            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tim kiem san pham..."
                  className="w-full h-10 pl-4 pr-10 bg-white/15 border border-white/25 rounded-[10px] text-white text-sm placeholder:text-white/80 outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Mobile store button */}
            <Link
              href={storeLink}
              className="shrink-0 flex items-center justify-center w-10 h-10 rounded-[10px] bg-white/[0.12] border border-white/[0.22] text-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </Link>

            {/* Mobile cart */}
            {showCart && (
              <Link
                href="/gio-hang"
                className="shrink-0 relative flex items-center justify-center w-10 h-10 rounded-[10px] bg-white/[0.12] border border-white/[0.22] text-white"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-white text-[#1E4D2B] text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[#1E4D2B22]">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ===== MOBILE CATEGORY BOTTOM SHEET ===== */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-[1100]">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={closeMenu} />

          {/* Bottom sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col animate-slide-up">
            {/* Drag handle */}
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Title */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Danh muc san pham</h2>
              <button
                onClick={closeMenu}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Two-column layout */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left sidebar tabs */}
              <div className="w-[100px] bg-[#f0f0f0] border-r border-[#ddd] overflow-y-auto">
                {categories.map((cat, idx) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(idx)}
                    className={`w-full flex flex-col items-center gap-1 px-2 py-3 text-center text-xs transition-colors ${
                      activeTab === idx
                        ? 'bg-white text-[#2F5324] font-semibold'
                        : 'text-gray-600'
                    }`}
                  >
                    {cat.icon_url ? (
                      <Image
                        src={cat.icon_url}
                        alt=""
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
                      </svg>
                    )}
                    <span className="leading-tight">{cat.name}</span>
                  </button>
                ))}
              </div>

              {/* Right content */}
              <div className="flex-1 p-4 overflow-y-auto">
                {activeCategory && (
                  <>
                    <Link
                      href={`/danh-muc/${activeCategory.slug}`}
                      onClick={closeMenu}
                      className="block text-sm font-semibold text-[#2F5324] mb-3 hover:underline"
                    >
                      Xem tat ca {activeCategory.name}
                    </Link>
                    <div className="flex flex-wrap gap-2">
                      {activeCategory.children && activeCategory.children.length > 0 ? (
                        activeCategory.children.map(child => (
                          <Link
                            key={child.id}
                            href={`/danh-muc/${child.slug}`}
                            onClick={closeMenu}
                            className="px-[14px] py-1.5 bg-[#f0f2f5] rounded-[20px] text-sm text-[#333] hover:bg-[#e4e6e9] transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">Chua co danh muc con</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MOBILE BOTTOM NAV BAR ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-6px_16px_rgba(0,0,0,0.08)] z-[1200] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-14">
          {bottomNavItems.map((item, idx) => (
            item.action ? (
              <button
                key={idx}
                onClick={item.action}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-gray-500 hover:text-[#2F5324] transition-colors"
              >
                <BottomNavIcon type={item.icon} iconUrl={(item as any).iconUrl} />
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
              </button>
            ) : (
              <Link
                key={idx}
                href={item.href}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1 text-gray-500 hover:text-[#2F5324] transition-colors"
              >
                <BottomNavIcon type={item.icon} iconUrl={(item as any).iconUrl} />
                <span className="text-[10px] font-medium leading-tight">{item.label}</span>
              </Link>
            )
          ))}
        </div>
      </nav>

      {/* Bottom nav spacer for mobile */}
      <div className="lg:hidden h-14" />

      {/* Slide-up animation */}
      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

function BottomNavIcon({ type, iconUrl }: { type: string; iconUrl?: string }) {
  if (iconUrl) {
    return (
      <Image src={iconUrl} alt="" width={22} height={22} className="w-[22px] h-[22px] object-contain" />
    )
  }

  switch (type) {
    case 'home':
      return (
        <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    case 'grid':
      return (
        <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
        </svg>
      )
    default:
      return (
        <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
      )
  }
}
