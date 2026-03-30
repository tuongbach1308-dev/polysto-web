import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { formatVND } from '@/lib/utils'

export const metadata: Metadata = { title: 'Đặt hàng thành công' }

export default async function OrderSuccessPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: order } = await supabase
    .from('web_shop_orders')
    .select('*')
    .eq('id', params.id)
    .single()

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60, maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#7bb842', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 10 }}>Đặt hàng thành công!</h1>
        <p style={{ color: '#666', fontSize: '1.6rem', marginBottom: 5 }}>Cảm ơn bạn đã mua hàng tại POLY Store.</p>

        {order && (
          <div style={{ background: '#f8f8f8', borderRadius: 12, padding: 20, marginTop: 20, textAlign: 'left' }}>
            <p style={{ fontSize: '1.4rem', marginBottom: 8 }}>
              <strong>Mã đơn:</strong> <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{order.order_number}</span>
            </p>
            <p style={{ fontSize: '1.4rem', marginBottom: 8 }}>
              <strong>Tổng tiền:</strong> <span style={{ color: '#7bb842', fontWeight: 700 }}>{formatVND(order.total)}đ</span>
            </p>
            <p style={{ fontSize: '1.4rem', marginBottom: 8 }}>
              <strong>Thanh toán:</strong> {order.payment_method === 'cod' ? 'COD (nhận hàng trả tiền)' : 'Chuyển khoản'}
            </p>
            <p style={{ fontSize: '1.3rem', color: '#999', marginTop: 12 }}>
              Chúng tôi sẽ liên hệ xác nhận đơn hàng trong thời gian sớm nhất.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 30 }}>
          <Link href="/" className="btn-primary-custom" style={{ background: '#fff', color: '#141414', border: '1px solid #141414' }}>
            Trang chủ
          </Link>
          <Link href="/shop" className="btn-primary-custom">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  )
}
