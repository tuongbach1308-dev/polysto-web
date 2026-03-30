'use client'

import Link from 'next/link'
import { MiniCartIcon } from './MiniCartIcon'
import { CartDropdown } from './CartDropdown'

interface Props {
  settings: Record<string, string>
}

export function HeaderActions({ settings }: Props) {
  const storesText = settings.header_stores_text || 'Hệ Thống 2CH'
  const storesLink = settings.header_stores_link || '/he-thong-cua-hang'
  const phone = settings.header_phone || settings.phone || '0938.335.030'

  return (
    <div className="header-right">
      {/* Store button */}
      <div className="sudes-header-stores">
        <Link href={storesLink}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
          </svg>
          <div className="text-box">
            <span className="acc-text-small">Cửa hàng</span>
            <span className="acc-text">{storesText}</span>
          </div>
        </Link>
      </div>

      {/* Hotline */}
      <div className="sudes-header-hotline">
        <a href={`tel:${phone.replace(/\./g, '')}`}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="#fff">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          <div className="text-box">
            <span className="acc-text-small">Hotline</span>
            <span className="acc-text">{phone}</span>
          </div>
        </a>
      </div>

      {/* Cart */}
      <div className="header-action_cart">
        <MiniCartIcon />
        <CartDropdown />
      </div>
    </div>
  )
}
