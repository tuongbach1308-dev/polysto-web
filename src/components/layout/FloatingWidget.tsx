'use client'

import { useState } from 'react'

interface Props {
  settings: Record<string, string>
}

export function FloatingWidget({ settings }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const phone = settings.header_phone || settings.phone || ''
  const zaloUrl = settings.zalo_url || ''
  const messengerUrl = settings.facebook_url || ''
  const mapsUrl = settings.google_maps_url || ''

  if (!phone && !zaloUrl && !messengerUrl) return null

  const items = [
    phone && {
      type: 'phone',
      href: `tel:${phone.replace(/\./g, '')}`,
      title: 'Gọi điện thoại',
      subtitle: phone,
      external: false,
    },
    zaloUrl && {
      type: 'zalo',
      href: zaloUrl,
      title: 'Chat Zalo',
      subtitle: 'Tư vấn ngay',
      external: true,
    },
    messengerUrl && {
      type: 'mess',
      href: messengerUrl,
      title: 'Messenger',
      subtitle: 'Chat với shop',
      external: true,
    },
    mapsUrl && {
      type: 'map',
      href: mapsUrl,
      title: 'Bản đồ',
      subtitle: 'Chỉ đường tới shop',
      external: true,
    },
  ].filter(Boolean) as { type: string; href: string; title: string; subtitle: string; external: boolean }[]

  return (
    <div className="main-widget">
      {/* Pulse animation */}
      <div className="pregan" />
      <div className="pregan" />

      {/* Main circle button */}
      <div className="out-circle" onClick={() => setIsOpen(!isOpen)}>
        {/* Close icon */}
        <div className={`close-icon ${!isOpen ? 'unsee' : ''}`}>
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>

        {/* Main icon (visible when closed) */}
        <div className={`main-icon ${isOpen ? 'unsee' : ''}`} style={{ transition: '0.2s all' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
            <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
          </svg>
          <p>Liên hệ</p>
        </div>
      </div>

      {/* Contact panel */}
      {isOpen && (
        <div className="def-content">
          <div className="def-header">
            <span style={{ fontWeight: 600, fontSize: '1.5rem' }}>Liên hệ với chúng tôi</span>
            <button className="close-icon" onClick={() => setIsOpen(false)} aria-label="Đóng">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {items.map(item => (
            <div key={item.type} className={`item ${item.type}`}>
              <a
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <div className="img">
                  <ContactIcon type={item.type} />
                </div>
                <div className="detail">
                  <span className="arcu-item-title">{item.title}</span>
                  <span className="arcu-item-subtitle">{item.subtitle}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ContactIcon({ type }: { type: string }) {
  switch (type) {
    case 'phone':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      )
    case 'zalo':
      return <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>Zalo</span>
    case 'mess':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
          <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.503 3.686 7.2V22l3.406-1.868c.907.252 1.87.388 2.908.388 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm.997 12.444l-2.545-2.716-4.97 2.716 5.468-5.805 2.609 2.716 4.905-2.716-5.467 5.805z" />
        </svg>
      )
    case 'map':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
        </svg>
      )
    default:
      return null
  }
}
