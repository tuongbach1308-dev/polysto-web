import Image from 'next/image'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'

const BG_COLORS = ['#EBF2FC', '#FAE9EF', '#FFFBDB', '#E9FFE3']

export async function FeaturesStrip() {
  const supabase = createServerClient()
  const { data: features } = await supabase
    .from('web_features')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
    .limit(4)

  if (!features?.length) return null

  return (
    <div className="section_services">
      <div className="container">
        <div className="row-custom promo-box">
          {features.map((feature, index) => {
            const content = (
              <div className="promo-item" style={{ background: BG_COLORS[index] || BG_COLORS[0] }}>
                <div className="icon">
                  {feature.icon_url ? (
                    <Image
                      src={feature.icon_url}
                      alt={feature.title}
                      width={50}
                      height={50}
                      style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    />
                  ) : feature.icon_name ? (
                    <span style={{ fontSize: '3rem', lineHeight: 1 }}>{feature.icon_name}</span>
                  ) : (
                    <span style={{ fontSize: '3rem', lineHeight: 1 }}>⭐</span>
                  )}
                </div>
                <div className="info">
                  <h3>{feature.title}</h3>
                  {feature.description && <span>{feature.description}</span>}
                </div>
              </div>
            )

            return (
              <div key={feature.id} className="promo-col">
                {feature.link_url ? (
                  <Link href={feature.link_url} style={{ display: 'block', height: '100%' }}>{content}</Link>
                ) : (
                  content
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
