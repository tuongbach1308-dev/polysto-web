import { createServerClient } from '@/lib/supabase/server'
import { FlashSaleClient } from './FlashSaleClient'

export async function FlashSale() {
  const supabase = createServerClient()

  // Get flash sale settings
  const { data: settingsRows } = await supabase
    .from('web_settings')
    .select('setting_key, setting_value')
    .in('setting_key', ['flash_sale_enabled', 'flash_sale_end_date', 'flash_sale_title', 'flash_sale_label'])

  const config: Record<string, string> = {}
  settingsRows?.forEach(r => { config[r.setting_key] = r.setting_value || '' })

  if (config.flash_sale_enabled !== 'true') return null

  const endDate = config.flash_sale_end_date
  if (!endDate || new Date(endDate) < new Date()) return null

  // Get flash sale products
  const { data: products } = await supabase
    .from('web_catalog_products')
    .select('*')
    .eq('is_flash_sale', true)
    .eq('is_active', true)
    .order('sort_order')
    .limit(10)

  if (!products?.length) return null

  return (
    <section className="section-index section_flash_sale">
      <div className="container">
        <FlashSaleClient
          title={config.flash_sale_title || 'Thanh Lý Giá Tốt'}
          label={config.flash_sale_label || 'thanhly'}
          endDate={endDate}
          products={products}
        />
      </div>
    </section>
  )
}
