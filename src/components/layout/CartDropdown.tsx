'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getCart, updateCartQty, removeFromCart, getCartTotal, type CartItem } from '@/lib/cart/store'
import { formatVND } from '@/lib/utils'

export function CartDropdown() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const update = () => setItems(getCart())
    update()
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  const total = getCartTotal(items)

  return (
    <div className="top-cart-content">
      <div className="CartHeaderContainer">
        {items.length === 0 ? (
          <div className="cart--empty-message" style={{ padding: '30px 20px' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <p style={{ color: '#999', fontSize: '1.4rem' }}>Giỏ hàng trống</p>
          </div>
        ) : (
          <>
            <div className="cartheader">
              <div className="cart_body">
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 10, marginBottom: 12, position: 'relative' }}>
                    <div className="cart_image">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} width={64} height={64} style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 64, height: 64, background: '#f1f1f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: '#ccc' }}>📷</div>
                      )}
                    </div>
                    <div className="cart_info" style={{ flex: 1, minWidth: 0 }}>
                      <div className="cart_name">
                        <Link href={`/shop/${item.id}`} style={{ fontSize: '1.4rem', fontWeight: 500 }}>{item.name}</Link>
                      </div>
                      <div className="cart_select" style={{ display: 'flex', alignItems: 'center', marginTop: 6 }}>
                        <button
                          className="ajaxcart__qty--minus"
                          onClick={() => updateCartQty(item.id, item.qty - 1)}
                          disabled={item.qty <= 1}
                        >−</button>
                        <input type="text" readOnly value={item.qty} />
                        <button
                          className="ajaxcart__qty--plus"
                          onClick={() => updateCartQty(item.id, item.qty + 1)}
                        >+</button>
                      </div>
                      <div className="cart-price" style={{ marginTop: 4 }}>{formatVND(item.price)}đ</div>
                    </div>
                    <button
                      className="remove-item-cart"
                      onClick={() => removeFromCart(item.id)}
                      style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                      aria-label="Xóa"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="ajaxcart__footer">
                <div>
                  <span style={{ fontSize: '1.3rem', color: '#666' }}>Tổng:</span>
                  <span className="total-price" style={{ marginLeft: 6 }}>{formatVND(total)}đ</span>
                </div>
                <Link href="/gio-hang">
                  <button type="button">XEM GIỎ HÀNG</button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
