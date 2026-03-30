import type { Metadata } from 'next'
import { getWebSettings } from '@/lib/supabase/settings'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { CheckoutClient } from './CheckoutClient'

export const metadata: Metadata = { title: 'Thanh toán' }

export default async function CheckoutPage() {
  const settings = await getWebSettings()

  return (
    <>
      <Breadcrumb items={[{ label: 'Giỏ hàng', href: '/gio-hang' }, { label: 'Thanh toán' }]} />
      <div className="container" style={{ paddingTop: 10, paddingBottom: 40 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 20 }}>Thanh toán</h1>
        <CheckoutClient settings={settings} />
      </div>
    </>
  )
}
