import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { CartClient } from './CartClient'

export const metadata: Metadata = { title: 'Giỏ hàng' }

export default function CartPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Giỏ hàng' }]} />
      <div className="container" style={{ paddingTop: 10, paddingBottom: 40 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 20 }}>Giỏ hàng của bạn</h1>
        <CartClient />
      </div>
    </>
  )
}
