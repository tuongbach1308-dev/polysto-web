import { NextRequest, NextResponse } from 'next/server'
import { lookupWarranty } from '@/lib/supabase/warranty'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')
  if (!q || q.trim().length < 3) {
    return NextResponse.json([], { status: 200 })
  }

  try {
    const results = await lookupWarranty(q)
    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
