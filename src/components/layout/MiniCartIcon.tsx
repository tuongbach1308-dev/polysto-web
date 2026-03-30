'use client'

import { useState, useEffect } from 'react'
import { getCart } from '@/lib/cart/store'

export function MiniCartIcon() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const update = () => setCount(getCart().reduce((s, i) => s + i.qty, 0))
    update()
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  return (
    <div className="sudes-header-cart">
      <a href="/gio-hang" aria-label="Giỏ hàng">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        {count > 0 && (
          <span className="count_item_pr">{count > 99 ? '99+' : count}</span>
        )}
      </a>
    </div>
  )
}
