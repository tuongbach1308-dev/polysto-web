import { createServerClient } from './server'

export interface WarrantyResult {
  id: string
  seri: string
  customer_name: string
  product_name: string
  warranty_start: string
  warranty_end: string
  status: string
  notes?: string
}

export async function lookupWarranty(query: string): Promise<WarrantyResult[]> {
  const supabase = createServerClient()
  const q = query.trim()
  if (!q) return []

  // Search by serial or phone in warranty table
  const { data } = await supabase
    .from('warranty')
    .select('id, seri, customer_name, product_name, warranty_start, warranty_end, status, notes')
    .or(`seri.ilike.%${q}%,customer_phone.ilike.%${q}%`)
    .order('warranty_start', { ascending: false })
    .limit(10)

  return (data || []).map(w => ({
    ...w,
    // Mask customer name for privacy
    customer_name: w.customer_name ? w.customer_name[0] + '***' + w.customer_name.slice(-1) : '',
  })) as WarrantyResult[]
}
