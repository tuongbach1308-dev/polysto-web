'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useCallback, useEffect } from 'react'
import { topNav } from '@/data/navigation'
import { useCart } from '@/hooks/useCart'
import MobileMenu from './MobileMenu'
import { Search, ShoppingBag, Menu, User, LogOut, Package, Settings, X, ChevronDown, LayoutGrid, MapPin } from 'lucide-react'
import { getCategoryIcon } from '@/lib/category-icons'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from '@/components/auth/AuthModal'
import { formatPrice } from '@/lib/utils'
import type { SiteCategory } from '@/components/Providers'

interface SearchResult {
  id: string; name: string; slug: string; thumbnail?: string
  price_min?: number; price_max?: number; price?: number; sale_price?: number
}

interface Props {
  settings: Record<string, string>
  categories: SiteCategory[]
}

export default function Header({ settings, categories }: Props) {
  const siteName = settings.site_name || 'POLY Store'
  const logoUrl = settings.logo_url || '/images/logo/logo-1.svg'

  const { user, isAuthenticated, logout } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [headerCollapsed, setHeaderCollapsed] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { totalItems } = useCart()

  // Debounced search via API
  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return }
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        if (res.ok) {
          const data = await res.json()
          setSearchResults([...(data.catalog || []), ...(data.shop || [])].slice(0, 6))
        }
      } catch { /* ignore */ }
    }, 300)
  }, [searchQuery])

  const handleCategoryEnter = useCallback((slug: string) => {
    if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null }
    setActiveCategory(slug)
  }, [])

  const handleCategoryLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => { setActiveCategory(null) }, 150)
  }, [])

  const handleDropdownEnter = useCallback(() => {
    if (closeTimeoutRef.current) { clearTimeout(closeTimeoutRef.current); closeTimeoutRef.current = null }
  }, [])

  const handleDropdownLeave = useCallback(() => { setActiveCategory(null) }, [])

  const activeCategoryData = categories.find((c) => c.slug === activeCategory)

  return (
    <header className="sticky top-0 z-50">
      {/* ROW 1 - Main Bar */}
      <div className="bg-navy">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3 lg:gap-5 h-14 lg:h-14">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2">
            <Image
              src={logoUrl}
              alt={siteName}
              width={140}
              height={36}
              className="h-8 lg:h-9 w-auto"
              priority
              unoptimized
            />
          </Link>

          {/* Category toggle button */}
          <button
            onClick={() => setHeaderCollapsed(!headerCollapsed)}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            <LayoutGrid className="h-4 w-4" />
            Danh mục
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${!headerCollapsed ? 'rotate-180' : ''}`} />
          </button>

          {/* Search input - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg relative">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="w-full bg-white rounded-lg pl-10 pr-10 py-2 text-sm text-text-dark placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted/50" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Search dropdown */}
            {searchFocused && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-fadeIn">
                {searchResults.length > 0 ? (
                  <>
                    {searchResults.map((p) => (
                      <Link
                        key={p.id}
                        href={p.price != null ? `/shop/${p.slug}` : `/san-pham/${p.slug}`}
                        onClick={() => { setSearchQuery(''); setSearchFocused(false) }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-bg-gray transition-colors border-b border-border last:border-b-0"
                      >
                        {p.thumbnail ? (
                          <Image src={p.thumbnail} alt={p.name} width={40} height={40} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <span className="w-10 h-10 bg-bg-gray rounded-lg flex items-center justify-center text-lg shrink-0">📦</span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-dark truncate">{p.name}</p>
                          <p className="text-xs text-price-orange font-semibold">
                            {p.sale_price ? formatPrice(p.sale_price) : p.price ? formatPrice(p.price) : p.price_min ? formatPrice(p.price_min) : ''}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <Link
                      href={`/san-pham?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => { setSearchQuery(''); setSearchFocused(false) }}
                      className="block px-4 py-2.5 text-center text-xs font-medium text-navy bg-bg-gray hover:bg-navy/5 transition-colors"
                    >
                      Xem tất cả kết quả →
                    </Link>
                  </>
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-text-muted">Không tìm thấy sản phẩm nào</p>
                    <p className="text-xs text-text-muted/70 mt-1">Thử tìm kiếm với từ khóa khác</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Nav links - hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-1 ml-auto">
            {topNav.map((item) => (
              <Link key={item.href} href={item.href} className="px-2.5 py-1.5 text-sm text-white/70 hover:text-white transition-colors duration-200">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 lg:gap-1.5 ml-auto lg:ml-4">
            {/* Search - mobile */}
            <button onClick={() => setMobileSearchOpen(true)} className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors" aria-label="Tìm kiếm">
              <Search className="h-[18px] w-[18px]" />
            </button>

            {/* Store */}
            <Link href="/cua-hang" className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
              <MapPin className="h-[18px] w-[18px]" />
              <div className="text-[11px] leading-tight">
                <span className="font-semibold text-white block">{settings.header_stores_text || '2 Cửa hàng'}</span>
              </div>
            </Link>

            {/* Cart */}
            <Link href="/gio-hang" className="relative w-9 h-9 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors" aria-label="Giỏ hàng">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-discount-red text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold leading-none">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="hidden lg:block w-px h-5 bg-white/20 mx-0.5" />

            {/* User / Login */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 px-2 lg:px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white text-[11px] font-bold">{user.name.charAt(0)}</div>
                  <span className="hidden lg:block text-sm font-medium text-white max-w-[100px] truncate">{user.name.split(' ').slice(-2).join(' ')}</span>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-border rounded-xl shadow-xl z-[70] py-1.5 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-text-dark truncate">{user.name}</p>
                        <p className="text-xs text-text-muted truncate">{user.email}</p>
                      </div>
                      <div className="py-1.5">
                        <Link href="/tai-khoan" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-text-muted hover:text-text-dark hover:bg-bg-gray transition-colors"><User className="h-4 w-4" /> Tài khoản</Link>
                        <Link href="/tai-khoan/don-hang" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-text-muted hover:text-text-dark hover:bg-bg-gray transition-colors"><Package className="h-4 w-4" /> Đơn hàng</Link>
                        <Link href="/tai-khoan/thong-tin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-text-muted hover:text-text-dark hover:bg-bg-gray transition-colors"><Settings className="h-4 w-4" /> Cài đặt</Link>
                      </div>
                      <hr className="border-border" />
                      <div className="py-1.5">
                        <button onClick={() => { logout(); setUserMenuOpen(false) }} className="flex items-center gap-2.5 px-4 py-2 text-sm text-discount-red hover:bg-discount-red/5 transition-colors w-full"><LogOut className="h-4 w-4" /> Đăng xuất</button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="flex items-center gap-2 px-2 lg:px-2.5 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                <User className="h-[18px] w-[18px]" />
                <span className="hidden lg:block text-sm font-medium">Đăng nhập</span>
              </button>
            )}

            <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />

            {/* Menu - mobile */}
            <button onClick={() => setMobileOpen(true)} className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors" aria-label="Mở menu">
              <Menu className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>

      {/* ROW 2 - Category Bar (from Supabase) */}
      {!headerCollapsed && (
        <>
          <div className="fixed inset-0 top-[57px] lg:top-[57px] z-40" onClick={() => setHeaderCollapsed(true)} />
          <div className="border-b border-border relative z-50 bg-[#F0F5EF]">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-2 lg:gap-4 overflow-x-auto scrollbar-hide py-2 lg:py-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/san-pham?danh-muc=${cat.slug}`}
                    className={`flex items-center gap-1.5 shrink-0 px-2 lg:px-3 py-1.5 rounded-lg transition-colors duration-200 ${activeCategory === cat.slug ? 'bg-bg-gray' : 'hover:bg-bg-gray'}`}
                    onMouseEnter={() => handleCategoryEnter(cat.slug)}
                    onMouseLeave={handleCategoryLeave}
                  >
                    <span className="w-7 h-7 lg:w-8 lg:h-8 rounded-md bg-bg-gray flex items-center justify-center p-1.5">
                      {cat.icon_url ? <Image src={cat.icon_url} alt="" width={20} height={20} className="w-5 h-5 object-contain" /> : getCategoryIcon(cat.slug, 20)}
                    </span>
                    <span className="text-[11px] lg:text-xs text-text-muted font-medium whitespace-nowrap">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mega Dropdown — show children */}
            {activeCategoryData?.children && activeCategoryData.children.length > 0 && (
              <div className="absolute left-0 right-0 top-full bg-white shadow-lg border border-border rounded-b-xl z-50 animate-fadeIn" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
                <div className="max-w-7xl mx-auto px-4 py-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {activeCategoryData.children.map((sub) => (
                      <Link key={sub.id} href={`/san-pham?danh-muc=${sub.slug}`} className="flex items-center gap-2 text-sm text-text-muted hover:text-text-dark transition-colors duration-200 py-1">
                        <span className="w-8 h-8 rounded bg-bg-gray flex items-center justify-center p-1.5 shrink-0">{getCategoryIcon(activeCategoryData.slug, 18)}</span>
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} categories={categories} />

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setMobileSearchOpen(false); setSearchQuery('') }} />
          <div className="relative bg-white px-4 pt-4 pb-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input type="text" autoFocus placeholder="Tìm kiếm sản phẩm..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border border-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-text-dark placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy" />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted/50" />
                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"><X className="h-4 w-4" /></button>}
              </div>
              <button onClick={() => { setMobileSearchOpen(false); setSearchQuery('') }} className="text-sm text-text-muted font-medium shrink-0">Hủy</button>
            </div>
          </div>
          {searchQuery.length >= 2 && (
            <div className="bg-white max-h-[60vh] overflow-y-auto">
              {searchResults.length > 0 ? searchResults.map((p) => (
                <Link key={p.id} href={p.price != null ? `/shop/${p.slug}` : `/san-pham/${p.slug}`} onClick={() => { setSearchQuery(''); setMobileSearchOpen(false) }} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-gray border-b border-border">
                  {p.thumbnail ? <Image src={p.thumbnail} alt={p.name} width={40} height={40} className="w-10 h-10 rounded-lg object-cover shrink-0" /> : <span className="w-10 h-10 bg-bg-gray rounded-lg flex items-center justify-center text-lg shrink-0">📦</span>}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text-dark truncate">{p.name}</p>
                    <p className="text-xs text-price-orange font-semibold">{p.sale_price ? formatPrice(p.sale_price) : p.price ? formatPrice(p.price) : p.price_min ? formatPrice(p.price_min) : ''}</p>
                  </div>
                </Link>
              )) : (
                <div className="px-4 py-8 text-center"><p className="text-sm text-text-muted">Không tìm thấy sản phẩm nào</p></div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
