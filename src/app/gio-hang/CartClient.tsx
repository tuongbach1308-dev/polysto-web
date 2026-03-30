'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getCart, updateCartQty, removeFromCart, getCartTotal, type CartItem } from '@/lib/cart/store'
import { formatVND } from '@/lib/utils'

export function CartClient() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const update = () => setItems(getCart())
    update()
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  const total = getCartTotal(items)

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 20px' }}>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
        </svg>
        <p style={{ color: '#999', fontSize: '1.6rem', marginBottom: 20 }}>Giỏ hàng của bạn đang trống</p>
        <Link href="/shop" className="btn-primary-custom">Mua sắm ngay</Link>
      </div>
    )
  }

  return (
    <div>
      {/* Cart items */}
      <div className="cart-page-items">
        {/* Header row (desktop) */}
        <div className="cart-header-row sm-hidden">
          <span style={{ flex: 1 }}>Sản phẩm</span>
          <span style={{ width: 120, textAlign: 'center' }}>Số lượng</span>
          <span style={{ width: 120, textAlign: 'right' }}>Thành tiền</span>
          <span style={{ width: 40 }} />
        </div>

        {items.map(item => (
          <div key={item.id} className="cart-page-item">
            <div className="cart-page-item-info">
              <div className="cart-page-item-image">
                {item.image ? (
                  <Image src={item.image} alt={item.name} width={80} height={80} style={{ objectFit: 'cover', borderRadius: 5 }} />
                ) : (
                  <span style={{ fontSize: '2rem', color: '#ccc' }}>📷</span>
                )}
              </div>
              <div className="cart-page-item-detail">
                <h3>{item.name}</h3>
                <span className="cart-item-price">{formatVND(item.price)}đ</span>
              </div>
            </div>
            <div className="cart-page-item-qty">
              <div className="cart_select">
                <button className="ajaxcart__qty--minus" onClick={() => updateCartQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>−</button>
                <input type="text" readOnly value={item.qty} />
                <button className="ajaxcart__qty--plus" onClick={() => updateCartQty(item.id, item.qty + 1)}>+</button>
              </div>
            </div>
            <div className="cart-page-item-total">
              <span style={{ fontWeight: 700, color: '#7bb842', fontSize: '1.6rem' }}>{formatVND(item.price * item.qty)}đ</span>
            </div>
            <button
              className="cart-page-item-remove"
              onClick={() => removeFromCart(item.id)}
              aria-label="Xóa"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        ))}
      </div>

      {/* Footer: total + checkout */}
      <div className="cart-page-footer">
        <div className="cart-page-total">
          <span style={{ fontSize: '1.6rem', color: '#666' }}>Tổng cộng:</span>
          <span className="total-price" style={{ fontSize: '2.2rem' }}>{formatVND(total)}đ</span>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 15 }}>
          <Link href="/shop" className="btn-primary-custom" style={{ background: '#fff', color: '#141414', border: '1px solid #141414', flex: 1, textAlign: 'center' }}>
            Tiếp tục mua sắm
          </Link>
          <Link href="/thanh-toan" className="btn-primary-custom" style={{ flex: 1, textAlign: 'center' }}>
            Thanh toán
          </Link>
        </div>
      </div>
    </div>
  )
}
