export default function Loading() {
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      {/* Breadcrumb skeleton */}
      <div style={{ height: 44, background: '#f5f5f5', marginBottom: 20, borderRadius: 4 }} />

      {/* Title skeleton */}
      <div style={{ width: 200, height: 28, background: '#f1f1f1', borderRadius: 6, margin: '0 auto 20px' }} />

      {/* Product grid skeleton */}
      <div className="row-custom product-grid-row product-grid-wrap">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="product-col">
            <div style={{ background: '#fff', borderRadius: 10, padding: 10, boxShadow: '0 0 6px rgba(50,50,93,0.15)' }}>
              <div style={{ aspectRatio: '1', background: '#f1f1f1', borderRadius: 8, marginBottom: 12 }} />
              <div style={{ height: 16, background: '#f1f1f1', borderRadius: 4, marginBottom: 8 }} />
              <div style={{ height: 16, width: '60%', background: '#f1f1f1', borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
