'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { getCart, getCartTotal, clearCart, type CartItem } from '@/lib/cart/store'
import { formatVND } from '@/lib/utils'

export function CheckoutClient({ settings }: { settings: Record<string, string> }) {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', note: '', payment: 'cod' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { setItems(getCart()) }, [])

  const subtotal = getCartTotal(items)
  const freeShipThreshold = parseInt(settings.free_shipping_threshold || '500000', 10)
  const shippingBase = parseInt(settings.shipping_fee || '30000', 10)
  const shippingFee = subtotal >= freeShipThreshold ? 0 : shippingBase
  const total = subtotal + shippingFee

  if (items.length === 0) {
    return <p style={{ textAlign: 'center', color: '#999', padding: '60px 0', fontSize: '1.6rem' }}>Giỏ hàng trống — không thể thanh toán.</p>
  }

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.')
      return
    }
    // VN phone validation
    if (!/^(0[1-9][0-9]{8})$/.test(form.phone.replace(/\D/g, ''))) {
      setError('Số điện thoại không hợp lệ.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email || undefined,
          shipping_address: form.address,
          customer_note: form.note || undefined,
          payment_method: form.payment,
          items: items.map(i => ({ product_id: i.id, name: i.name, price: i.price, qty: i.qty, image: i.image })),
          subtotal,
          shipping_fee: shippingFee,
          total,
        }),
      })
      if (!res.ok) throw new Error('Lỗi đặt hàng')
      const data = await res.json()
      clearCart()
      router.push(`/dat-hang-thanh-cong/${data.id}`)
    } catch {
      setError('Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ cửa hàng.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="checkout-grid">
        {/* Left: Form */}
        <div className="checkout-form">
          <div className="checkout-section">
            <h2 className="checkout-heading">Thông tin giao hàng</h2>
            <div className="checkout-fields">
              <div className="checkout-field">
                <label>Số điện thoại *</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} required placeholder="0902 960 804" />
              </div>
              <div className="checkout-field">
                <label>Họ tên *</label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Nguyễn Văn A" />
              </div>
              <div className="checkout-field full">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="checkout-field full">
                <label>Địa chỉ giao hàng *</label>
                <textarea value={form.address} onChange={e => set('address', e.target.value)} required rows={2} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" />
              </div>
              <div className="checkout-field full">
                <label>Ghi chú</label>
                <textarea value={form.note} onChange={e => set('note', e.target.value)} rows={2} placeholder="Ghi chú cho đơn hàng..." />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2 className="checkout-heading">Phương thức thanh toán</h2>
            <div className="checkout-payment-options">
              <label className={`payment-option ${form.payment === 'cod' ? 'active' : ''}`}>
                <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={e => set('payment', e.target.value)} />
                <span>💵 Thanh toán khi nhận hàng (COD)</span>
              </label>
              <label className={`payment-option ${form.payment === 'bank_transfer' ? 'active' : ''}`}>
                <input type="radio" name="payment" value="bank_transfer" checked={form.payment === 'bank_transfer'} onChange={e => set('payment', e.target.value)} />
                <span>🏦 Chuyển khoản ngân hàng</span>
              </label>
            </div>
            {form.payment === 'bank_transfer' && settings.bank_name && (
              <div className="bank-info">
                <p><strong>Ngân hàng:</strong> {settings.bank_name}</p>
                <p><strong>STK:</strong> {settings.bank_account_number}</p>
                <p><strong>Chủ TK:</strong> {settings.bank_account_name}</p>
                <p style={{ fontSize: '1.3rem', color: '#666', marginTop: 8 }}>Nội dung CK: [Tên] + [SĐT]</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="checkout-summary">
          <div className="checkout-section">
            <h2 className="checkout-heading">Đơn hàng ({items.length} sản phẩm)</h2>
            <div className="checkout-items">
              {items.map(item => (
                <div key={item.id} className="checkout-item">
                  <div className="checkout-item-image">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} width={50} height={50} style={{ objectFit: 'cover', borderRadius: 4 }} />
                    ) : (
                      <span style={{ fontSize: '1.6rem', color: '#ccc' }}>📷</span>
                    )}
                    <span className="checkout-item-qty">{item.qty}</span>
                  </div>
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{item.name}</span>
                    <span className="checkout-item-price">{formatVND(item.price * item.qty)}đ</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Tạm tính</span>
                <span>{formatVND(subtotal)}đ</span>
              </div>
              <div className="checkout-total-row">
                <span>Phí vận chuyển</span>
                <span>{shippingFee === 0 ? <strong style={{ color: '#7bb842' }}>Miễn phí</strong> : `${formatVND(shippingFee)}đ`}</span>
              </div>
              <div className="checkout-total-row total">
                <span>Tổng cộng</span>
                <span>{formatVND(total)}đ</span>
              </div>
            </div>
          </div>

          {error && <p style={{ color: '#f83015', fontSize: '1.4rem', textAlign: 'center', margin: '10px 0' }}>{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary-custom" style={{ width: '100%', textAlign: 'center', opacity: submitting ? 0.6 : 1 }}>
            {submitting ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
          </button>
        </div>
      </div>
    </form>
  )
}
