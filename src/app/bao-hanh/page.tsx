import type { Metadata } from 'next'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { WarrantyLookup } from './WarrantyLookup'

export const metadata: Metadata = { title: 'Tra cứu bảo hành' }

export default function WarrantyPage() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Tra cứu bảo hành' }]} />
      <div className="container" style={{ paddingTop: 20, paddingBottom: 60, maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 10 }}>Tra cứu bảo hành</h1>
          <p style={{ color: '#666', fontSize: '1.6rem' }}>Nhập số seri hoặc số điện thoại để kiểm tra thông tin bảo hành.</p>
        </div>
        <WarrantyLookup />
      </div>
    </>
  )
}
