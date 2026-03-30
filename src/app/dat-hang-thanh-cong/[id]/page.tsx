import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Đặt hàng thành công' }

export default function OrderSuccessPage({ params }: { params: { id: string } }) {
  return (
    <div className="container-page py-16 text-center max-w-lg mx-auto">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold text-slate-800 mb-3">Đặt hàng thành công!</h1>
      <p className="text-slate-500 mb-2">Cảm ơn bạn đã mua hàng tại POLY Store.</p>
      <p className="text-sm text-slate-400 mb-8">Mã đơn hàng: <span className="font-mono font-semibold uppercase">{params.id.slice(0, 8)}</span></p>
      <p className="text-sm text-slate-500 mb-8">Chúng tôi sẽ liên hệ bạn sớm nhất để xác nhận đơn hàng.</p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/" className="btn-secondary">Trang chủ</Link>
        <Link href="/shop" className="btn-primary">Tiếp tục mua sắm</Link>
      </div>
    </div>
  )
}
