import type { Metadata } from 'next'
import Image from 'next/image'
import { createServerClient } from '@/lib/supabase/server'
import { Breadcrumb } from '@/components/shared/Breadcrumb'

export const metadata: Metadata = { title: 'Hệ thống cửa hàng' }
export const revalidate = 300

export default async function StoreLocatorPage() {
  const supabase = createServerClient()
  const { data: stores } = await supabase
    .from('web_stores')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  return (
    <>
      <Breadcrumb items={[{ label: 'Hệ thống cửa hàng' }]} />
      <div className="container" style={{ paddingTop: 20, paddingBottom: 60 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 10 }}>Hệ thống cửa hàng</h1>
          <p style={{ color: '#666', fontSize: '1.6rem' }}>POLY Store — Uy tín, Chất lượng, Tận tâm</p>
        </div>

        {stores && stores.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {stores.map(store => (
              <div key={store.id} className="store-card">
                <div className="store-card-inner">
                  {/* Image */}
                  {store.image_url && (
                    <div className="store-card-image">
                      <Image src={store.image_url} alt={store.name} width={400} height={250} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  {/* Info */}
                  <div className="store-card-info">
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 10 }}>{store.name}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '1.4rem' }}>
                      <p style={{ margin: 0, display: 'flex', gap: 8 }}>
                        <span style={{ flexShrink: 0 }}>📍</span>
                        <span>{store.address}{store.district ? `, ${store.district}` : ''}{store.city ? `, ${store.city}` : ''}</span>
                      </p>
                      {store.phone && (
                        <p style={{ margin: 0, display: 'flex', gap: 8 }}>
                          <span style={{ flexShrink: 0 }}>📞</span>
                          <a href={`tel:${store.phone.replace(/\./g, '')}`} style={{ color: '#7bb842', fontWeight: 600 }}>{store.phone}</a>
                          {store.phone_2 && <span> / <a href={`tel:${store.phone_2.replace(/\./g, '')}`} style={{ color: '#7bb842', fontWeight: 600 }}>{store.phone_2}</a></span>}
                        </p>
                      )}
                      {store.email && (
                        <p style={{ margin: 0, display: 'flex', gap: 8 }}>
                          <span style={{ flexShrink: 0 }}>✉️</span>
                          <a href={`mailto:${store.email}`}>{store.email}</a>
                        </p>
                      )}
                      {store.opening_hours && (
                        <p style={{ margin: 0, display: 'flex', gap: 8 }}>
                          <span style={{ flexShrink: 0 }}>🕐</span>
                          <span>{store.opening_hours}</span>
                        </p>
                      )}
                    </div>
                    {store.google_maps_url && (
                      <a href={store.google_maps_url} target="_blank" rel="noopener noreferrer" className="btn-primary-custom" style={{ marginTop: 15, display: 'inline-flex', fontSize: '1.4rem', height: 36, lineHeight: '36px', padding: '0 20px' }}>
                        📍 Chỉ đường
                      </a>
                    )}
                  </div>
                </div>

                {/* Google Maps embed */}
                {store.google_maps_embed && (
                  <div style={{ marginTop: 15, borderRadius: 12, overflow: 'hidden' }}>
                    <iframe
                      src={store.google_maps_embed}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#999', padding: '40px 0', fontSize: '1.4rem' }}>Chưa có thông tin cửa hàng.</p>
        )}
      </div>
    </>
  )
}
