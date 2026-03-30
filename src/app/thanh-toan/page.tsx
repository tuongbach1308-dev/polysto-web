import type { Metadata } from 'next'
import { CheckoutClient } from './CheckoutClient'

export const metadata: Metadata = { title: 'Thanh toán' }

export default function CheckoutPage() {
  return (
    <div className="container-page py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Thanh toán</h1>
      <CheckoutClient />
    </div>
  )
}
