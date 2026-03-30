import type { Metadata } from 'next'
import { CartClient } from './CartClient'

export const metadata: Metadata = { title: 'Giỏ hàng' }

export default function CartPage() {
  return (
    <div className="container-page py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Giỏ hàng</h1>
      <CartClient />
    </div>
  )
}
