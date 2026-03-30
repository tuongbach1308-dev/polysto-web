'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { getCart } from '@/lib/cart/store'

interface Props {
  onOpenMenu: () => void
}

export function MobileBottomNav({ onOpenMenu }: Props) {
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const update = () => setCartCount(getCart().reduce((s, i) => s + i.qty, 0))
    update()
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  const items = [
    { id: 'home', label: 'Trang chủ', href: '/', icon: HomeIcon },
    { id: 'menu', label: 'Danh mục', href: '#', icon: GridIcon, onClick: onOpenMenu },
    { id: 'store', label: 'Cửa hàng', href: '/he-thong-cua-hang', icon: MapPinIcon },
    { id: 'cart', label: 'Giỏ hàng', href: '/gio-hang', icon: BagIcon, badge: cartCount },
    { id: 'account', label: 'Tài khoản', href: '#', icon: UserIcon },
  ]

  const isActive = (id: string, href: string) => {
    if (id === 'home') return pathname === '/'
    if (id === 'menu') return false
    return pathname.startsWith(href)
  }

  return (
    <div id="mobile-bottom-nav-wrapper">
      <ul className="mobile-nav-list">
        {items.map(item => {
          const active = isActive(item.id, item.href)
          const Icon = item.icon

          if (item.onClick) {
            return (
              <li key={item.id} className={`nav-item ${active ? 'active' : ''}`}>
                <button className="nav-link" onClick={item.onClick} type="button">
                  <Icon />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          }

          return (
            <li key={item.id} className={`nav-item ${active ? 'active' : ''}`}>
              <Link href={item.href} className="nav-link">
                <Icon />
                <span>{item.label}</span>
                {item.badge ? <span className="cart-badge-mobile">{item.badge > 99 ? '99+' : item.badge}</span> : null}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
