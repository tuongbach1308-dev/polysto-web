'use client'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Đã xảy ra lỗi</h1>
      <p className="text-slate-500 mb-6">Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.</p>
      <button onClick={reset} className="btn-primary">Thử lại</button>
    </div>
  )
}
