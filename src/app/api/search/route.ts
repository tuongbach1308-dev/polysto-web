import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ catalog: [], shop: [] })
  }

  const supabase = createServerClient()
  const pattern = `%${q}%`

  const [catalog, shop] = await Promise.all([
    supabase
      .from('web_catalog_products')
      .select('id, name, slug, thumbnail, price_min, price_max')
      .eq('is_active', true)
      .ilike('name', pattern)
      .order('sort_order')
      .limit(5),
    supabase
      .from('web_shop_products')
      .select('id, name, slug, thumbnail, price, sale_price')
      .eq('is_active', true)
      .ilike('name', pattern)
      .order('sort_order')
      .limit(5),
  ])

  return NextResponse.json({
    catalog: catalog.data || [],
    shop: shop.data || [],
  })
}
