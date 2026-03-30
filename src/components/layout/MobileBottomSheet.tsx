'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string
  name: string
  slug: string
  icon_url?: string
  children?: { id: string; name: string; slug: string }[]
}

interface Props {
  categories: Category[]
  isOpen: boolean
  onClose: () => void
}

export function MobileBottomSheet({ categories, isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || '')

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Reset to first tab when opened
  useEffect(() => {
    if (isOpen && categories.length > 0) {
      setActiveTab(categories[0].id)
    }
  }, [isOpen, categories])

  const activeCategory = categories.find(c => c.id === activeTab)

  return (
    <>
      {/* Overlay */}
      <div
        className={`mobile-nav-overflow ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div className={`mobile-bottom-sheet ${isOpen ? 'open' : ''}`}>
        {/* Title bar */}
        <div className="sheet-title">
          <span>Danh mục sản phẩm</span>
          <button className="close-btn" onClick={onClose} aria-label="Đóng">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body: 2-column layout */}
        <div className="sheet-body">
          {/* Left tabs */}
          <ul className="sheet-tabs">
            {categories.map(cat => (
              <li key={cat.id} className={activeTab === cat.id ? 'active' : ''}>
                <a
                  href="#"
                  onClick={e => { e.preventDefault(); setActiveTab(cat.id) }}
                >
                  {cat.icon_url ? (
                    <Image src={cat.icon_url} alt={cat.name} width={28} height={28} style={{ objectFit: 'contain' }} />
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                    </svg>
                  )}
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Right content panels */}
          <div className="sheet-content">
            {categories.map(cat => (
              <div key={cat.id} className={`sheet-panel ${activeTab === cat.id ? 'active' : ''}`}>
                {/* Panel header */}
                <div className="panel-header">
                  <span className="panel-title">{cat.name}</span>
                  <Link href={`/danh-muc/${cat.slug}`} className="view-all-link" onClick={onClose}>
                    Xem tất cả
                  </Link>
                </div>

                {/* Children as pill links */}
                {cat.children && cat.children.length > 0 ? (
                  <div className="content-group">
                    <div className="group-items">
                      {cat.children.map(child => (
                        <Link
                          key={child.id}
                          href={`/danh-muc/${child.slug}`}
                          onClick={onClose}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: '#999', fontSize: '1.3rem' }}>Chưa có danh mục con</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
