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
      <div className="text-center py-16">
        <p className="text-slate-400 text-lg mb-4">Giỏ hàng trống</p>
        <Link href="/shop" className="btn-primary">Mua sắm ngay</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="card p-4 flex items-center gap-4">
            {item.image && (
              <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-slate-800 truncate">{item.name}</h3>
              <p className="text-sm text-primary-600 font-semibold">{formatVND(item.price)}đ</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateCartQty(item.id, item.qty - 1)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">-</button>
              <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
              <button onClick={() => updateCartQty(item.id, item.qty + 1)} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">+</button>
            </div>
            <p className="font-semibold text-slate-800 w-28 text-right">{formatVND(item.price * item.qty)}đ</p>
            <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 p-1 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="card p-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500">Tổng cộng</span>
          <span className="text-2xl font-bold text-primary-600">{formatVND(total)}đ</span>
        </div>
        <Link href="/thanh-toan" className="btn-primary w-full text-center">Tiến hành thanh toán</Link>
      </div>
    </div>
  )
}
