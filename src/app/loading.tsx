export default function Loading() {
  return (
    <div className="container-page py-16 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Đang tải...</p>
      </div>
    </div>
  )
}
