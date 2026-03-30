'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCart, getCartTotal, clearCart, type CartItem } from '@/lib/cart/store'
import { formatVND } from '@/lib/utils'

export function CheckoutClient() {
  const router = useRouter()
  const [items, setItems] = useState<CartItem[]>([])
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', note: '', payment: 'cod' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { setItems(getCart()) }, [])

  const subtotal = getCartTotal(items)
  const shippingFee = subtotal >= 500000 ? 0 : 30000
  const total = subtotal + shippingFee

  if (items.length === 0) {
    return <p className="text-center text-slate-400 py-16">Giỏ hàng trống — không thể thanh toán.</p>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.')
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

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-4 space-y-4">
        <h2 className="font-semibold text-slate-800">Thông tin giao hàng</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Họ tên *</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Số điện thoại *</label>
            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Địa chỉ giao hàng *</label>
          <textarea value={form.address} onChange={e => set('address', e.target.value)} required rows={2} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Ghi chú</label>
          <textarea value={form.note} onChange={e => set('note', e.target.value)} rows={2} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 resize-none" placeholder="Ghi chú cho đơn hàng..." />
        </div>
      </div>

      <div className="card p-4">
        <h2 className="font-semibold text-slate-800 mb-3">Phương thức thanh toán</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:border-primary-300 transition-colors">
            <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={e => set('payment', e.target.value)} />
            <div><p className="text-sm font-medium">Thanh toán khi nhận hàng (COD)</p></div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 cursor-pointer hover:border-primary-300 transition-colors">
            <input type="radio" name="payment" value="bank_transfer" checked={form.payment === 'bank_transfer'} onChange={e => set('payment', e.target.value)} />
            <div><p className="text-sm font-medium">Chuyển khoản ngân hàng</p></div>
          </label>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="font-semibold text-slate-800 mb-3">Đơn hàng</h2>
        <div className="space-y-2 text-sm">
          {items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span className="text-slate-600">{item.name} x{item.qty}</span>
              <span className="font-medium">{formatVND(item.price * item.qty)}đ</span>
            </div>
          ))}
          <div className="border-t border-slate-100 pt-2 mt-2 space-y-1">
            <div className="flex justify-between text-slate-500"><span>Tạm tính</span><span>{formatVND(subtotal)}đ</span></div>
            <div className="flex justify-between text-slate-500"><span>Phí ship</span><span>{shippingFee === 0 ? 'Miễn phí' : `${formatVND(shippingFee)}đ`}</span></div>
            <div className="flex justify-between text-lg font-bold text-slate-800"><span>Tổng</span><span className="text-primary-600">{formatVND(total)}đ</span></div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full text-center disabled:opacity-50">
        {submitting ? 'Đang xử lý...' : 'Đặt hàng'}
      </button>
    </form>
  )
}
