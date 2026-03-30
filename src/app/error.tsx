'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '60px 0', minHeight: 400 }}>
      <div style={{ fontSize: '5rem', marginBottom: 20 }}>⚠️</div>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 10 }}>Đã xảy ra lỗi</h1>
      <p style={{ color: '#666', fontSize: '1.6rem', marginBottom: 30 }}>
        Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.
      </p>
      <button onClick={reset} className="btn-primary-custom">Thử lại</button>
    </div>
  )
}
