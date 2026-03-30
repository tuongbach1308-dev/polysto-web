import type { Metadata } from 'next'
import { WarrantyLookup } from './WarrantyLookup'

export const metadata: Metadata = { title: 'Tra cứu bảo hành' }

export default function WarrantyPage() {
  return (
    <div className="container-page py-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">Tra cứu bảo hành</h1>
      <p className="text-slate-500 text-center mb-8">Nhập số seri hoặc số điện thoại để kiểm tra thông tin bảo hành.</p>
      <WarrantyLookup />
    </div>
  )
}
