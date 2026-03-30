import Image from 'next/image'
import { createServerClient } from '@/lib/supabase/server'

export async function CustomerGallery() {
  const supabase = createServerClient()
  const { data: items } = await supabase
    .from('web_customer_gallery')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (!items?.length) return null

  return (
    <section className="section-index section_customer">
      <div className="container">
        <div className="section-title">
          <h2>Khách Hàng <span>Của POLY Store</span></h2>
        </div>
        <div className="row-custom cus-list hide-scrollbar">
          {items.map(item => (
            <div key={item.id} className="cus-item">
              <div className="aspect-1">
                <Image
                  src={item.image_url}
                  alt={item.caption || item.customer_name || 'Khách hàng'}
                  width={400}
                  height={400}
                  sizes="(max-width: 767px) 38vw, 28vw"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
