interface Props {
  conditionNote?: string
  phone?: string
}

export function ProductSidebar({ conditionNote, phone }: Props) {
  return (
    <div className="product-sidebar">
      {/* Block Promotion (green) */}
      {conditionNote && (
        <div className="block-promotion">
          <div className="heading-promo">Khuyến mãi</div>
          <div className="promo-content" dangerouslySetInnerHTML={{ __html: conditionNote }} />
        </div>
      )}

      {/* Block Policy (dark) */}
      <div className="block-policy">
        <div className="heading-policy">Chính sách mua hàng</div>
        <div style={{ padding: '0 10px' }}>
          <div className="policy-item">
            <div className="icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7bb842" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            </div>
            <div className="info">
              <h3>Bảo hành uy tín</h3>
              <span>Cam kết bảo hành chính hãng</span>
            </div>
          </div>
          <div className="policy-item">
            <div className="icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7bb842" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
            </div>
            <div className="info">
              <h3>Giao hàng toàn quốc</h3>
              <span>Ship COD, kiểm tra hàng</span>
            </div>
          </div>
          <div className="policy-item" style={{ borderBottom: 0 }}>
            <div className="icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7bb842" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
            </div>
            <div className="info">
              <h3>Hotline: {phone || '0938.335.030'}</h3>
              <span>Tư vấn 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service blocks 2x2 */}
      <div className="block-service">
        <div className="row-custom">
          {[
            { bg: '#EBF2FC', icon: '🚚', title: 'Miễn phí ship', desc: 'Đơn >5tr' },
            { bg: '#FAE9EF', icon: '🎁', title: 'Quà tặng', desc: 'Đơn >10tr' },
            { bg: '#FFFBDB', icon: '⭐', title: 'Chính hãng', desc: '100%' },
            { bg: '#E9FFE3', icon: '🔄', title: 'Đổi trả', desc: '7 ngày' },
          ].map((s, i) => (
            <div key={i} style={{ width: '50%', flex: '0 0 50%', paddingLeft: 'var(--gutter)', paddingRight: 'var(--gutter)', marginBottom: 10 }}>
              <div className="promo-item" style={{ background: s.bg, textAlign: 'center', padding: 10, borderRadius: 12 }}>
                <span style={{ fontSize: '2.4rem', display: 'block', marginBottom: 4 }}>{s.icon}</span>
                <div className="info" style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0 0 2px' }}>{s.title}</h3>
                  <span style={{ fontSize: '1.2rem', color: '#666' }}>{s.desc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
