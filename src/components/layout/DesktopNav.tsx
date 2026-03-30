'use client'

import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  icon_url?: string
  children?: Category[]
}

interface Props {
  categories: Category[]
}

export function DesktopNav({ categories }: Props) {
  return (
    <div className="header-menu sm-hidden">
      <div className="container">
        <ul id="nav">
          {/* Home */}
          <li className="nav-item">
            <Link href="/">Trang chủ</Link>
          </li>

          {/* Category nav items */}
          {categories.map(cat => (
            <li key={cat.id} className={`nav-item ${cat.children && cat.children.length > 0 ? 'has-mega' : ''}`}>
              <Link href={`/danh-muc/${cat.slug}`}>{cat.name}</Link>
              {cat.children && cat.children.length > 0 && (
                <div className="mega-content">
                  <div className="mega-menu-list custom-scrollbar">
                    <ul className="level0">
                      {cat.children.map(child => (
                        <li key={child.id} className="level1 item">
                          <Link href={`/danh-muc/${child.slug}`}>{child.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          ))}

          {/* Static nav items */}
          <li className="nav-item">
            <Link href="/shop">Hàng Newseal</Link>
          </li>
          <li className="nav-item">
            <Link href="/bao-hanh">Bảo hành</Link>
          </li>
          <li className="nav-item">
            <Link href="/bai-viet">Blog</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
