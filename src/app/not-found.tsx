import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-6xl font-bold text-slate-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy trang</h2>
      <p className="text-slate-500 mb-8">Trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/" className="btn-primary">Trang chủ</Link>
        <Link href="/san-pham" className="btn-secondary">Xem sản phẩm</Link>
      </div>
    </div>
  )
}
