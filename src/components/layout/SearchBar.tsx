'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatVND } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  slug: string
  thumbnail?: string
  price_min?: number
  price_max?: number
  price?: number
  sale_price?: number
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{ catalog: SearchResult[]; shop: SearchResult[] }>({ catalog: [], shop: [] })
  const wrapRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setOpen(false); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data)
      setOpen(true)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  const handleChange = (val: string) => {
    setQuery(val)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => doSearch(val), 300)
  }

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const total = results.catalog.length + results.shop.length

  return (
    <div className="search-bar" ref={wrapRef}>
      <input
        type="text"
        placeholder="Bạn cần tìm gì?"
        value={query}
        onChange={e => handleChange(e.target.value)}
        onFocus={() => { if (total > 0) setOpen(true) }}
        autoComplete="off"
      />
      <button type="button" className="icon-fallback-text" onClick={() => doSearch(query)}>
        {loading ? (
          <svg className="animate-spinner" style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="10" /></svg>
        ) : (
          <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
        )}
      </button>

      {/* Search suggest dropdown */}
      {open && (
        <div className="search-suggest open">
          {total === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', fontSize: '1.4rem', padding: '10px 0' }}>
              Không tìm thấy sản phẩm
            </p>
          ) : (
            <>
              {results.catalog.length > 0 && (
                <>
                  <div className="search-title">Sản phẩm mẫu</div>
                  <div className="list-search">
                    {results.catalog.map(p => (
                      <Link key={p.id} href={`/san-pham/${p.slug}`} className="product-smart" onClick={() => setOpen(false)}>
                        <div className="image_thumb">
                          {p.thumbnail ? (
                            <Image src={p.thumbnail} alt={p.name} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 4 }} />
                          ) : (
                            <span style={{ fontSize: '2rem', color: '#ccc' }}>📷</span>
                          )}
                        </div>
                        <div className="product-info">
                          <h3>{p.name}</h3>
                          <div className="price-box">
                            {p.price_min === p.price_max
                              ? `${formatVND(p.price_min!)}đ`
                              : `${formatVND(p.price_min!)}đ - ${formatVND(p.price_max!)}đ`
                            }
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
              {results.shop.length > 0 && (
                <>
                  <div className="search-title" style={{ marginTop: results.catalog.length ? 10 : 0 }}>Hàng Newseal</div>
                  <div className="list-search">
                    {results.shop.map(p => (
                      <Link key={p.id} href={`/shop/${p.slug}`} className="product-smart" onClick={() => setOpen(false)}>
                        <div className="image_thumb">
                          {p.thumbnail ? (
                            <Image src={p.thumbnail} alt={p.name} width={60} height={60} style={{ objectFit: 'cover', borderRadius: 4 }} />
                          ) : (
                            <span style={{ fontSize: '2rem', color: '#ccc' }}>📷</span>
                          )}
                        </div>
                        <div className="product-info">
                          <h3>{p.name}</h3>
                          <div className="price-box">
                            {formatVND(p.sale_price || p.price!)}đ
                            {p.sale_price && p.sale_price < p.price! && (
                              <span className="compare-price" style={{ marginLeft: 6 }}>{formatVND(p.price!)}đ</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
