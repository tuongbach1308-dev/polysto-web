import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_name, customer_phone, customer_email, shipping_address, customer_note, payment_method, items, subtotal, shipping_fee, total } = body

    if (!customer_name || !customer_phone || !shipping_address || !items?.length) {
      return NextResponse.json({ error: 'Thiếu thông tin bắt buộc' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Generate order number: WEB-YYYYMMDD-XXX
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const { count } = await supabase
      .from('web_shop_orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date().toISOString().slice(0, 10))
    const orderNum = `WEB-${today}-${String((count || 0) + 1).padStart(3, '0')}`

    const { data, error } = await supabase
      .from('web_shop_orders')
      .insert({
        order_number: orderNum,
        customer_name,
        customer_phone,
        customer_email: customer_email || null,
        shipping_address,
        customer_note: customer_note || null,
        payment_method: payment_method || 'cod',
        items,
        subtotal,
        shipping_fee,
        total,
      })
      .select('id, order_number')
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
