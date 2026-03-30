'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SearchBar } from './SearchBar'
import { HeaderActions } from './HeaderActions'
import { DesktopNav } from './DesktopNav'

interface Category {
  id: string
  name: string
  slug: string
  icon_url?: string
  children?: Category[]
}

interface Props {
  settings: Record<string, string>
  categories: Category[]
}

export function HeaderClient({ settings, categories }: Props) {
  const logo = settings.logo_url || ''
  const siteName = settings.site_name || 'POLY Store'

  return (
    <header id="polyHeader">
      <div className="main-header">
        <div className="container">
          <div className="header-row">
            {/* Logo */}
            <div className="header-logo">
              <Link href="/">
                {logo ? (
                  <Image
                    src={logo}
                    alt={siteName}
                    width={249}
                    height={26}
                    priority
                    style={{ maxHeight: 40, width: 'auto' }}
                  />
                ) : (
                  <span style={{ color: '#fff', fontSize: '2rem', fontWeight: 700 }}>{siteName}</span>
                )}
              </Link>
            </div>

            {/* Search — hidden mobile */}
            <div className="header-mid sm-hidden">
              <SearchBar />
            </div>

            {/* Actions */}
            <HeaderActions settings={settings} />
          </div>
        </div>
      </div>

      {/* Desktop navigation bar */}
      <DesktopNav categories={categories} />
    </header>
  )
}
