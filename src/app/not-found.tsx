import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '60px 0', minHeight: 500 }}>
      <h1 style={{ fontSize: '12rem', fontWeight: 900, color: '#ebebeb', lineHeight: 1, margin: '0 0 10px' }}>404</h1>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 10 }}>Không tìm thấy trang</h2>
      <p style={{ color: '#666', fontSize: '1.6rem', marginBottom: 30 }}>
        Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
        <Link href="/" className="btn-primary-custom">Trang chủ</Link>
        <Link href="/san-pham" className="btn-primary-custom" style={{ background: '#fff', color: '#141414', border: '1px solid #141414' }}>
          Xem sản phẩm
        </Link>
      </div>
    </div>
  )
}
