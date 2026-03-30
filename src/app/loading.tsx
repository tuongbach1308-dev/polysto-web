export default function Loading() {
  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0', minHeight: 300 }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ width: 36, height: 36, border: '3px solid #ebebeb', borderTopColor: '#7bb842', borderRadius: '50%', animation: 'spinner 1s infinite linear', margin: '0 auto 15px' }} />
        <p style={{ color: '#999', fontSize: '1.4rem' }}>Đang tải...</p>
      </div>
    </div>
  )
}
