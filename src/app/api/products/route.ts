import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const categoryId = req.nextUrl.searchParams.get('category_id')
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '8', 10)

  if (!categoryId) {
    return NextResponse.json({ products: [] })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('web_catalog_products')
    .select('*')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('sort_order')
    .limit(limit)

  if (error) {
    return NextResponse.json({ products: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({ products: data || [] })
}
