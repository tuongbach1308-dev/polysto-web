import Link from "next/link";
import { SITE_NAME } from "@/lib/seo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        {/* 404 number */}
        <p className="text-[120px] md:text-[160px] font-bold leading-none text-brand-500/15 select-none">
          404
        </p>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 -mt-6 md:-mt-8 font-heading">
          Trang không tồn tại
        </h1>
        <p className="mt-3 text-gray-500 text-sm md:text-base leading-relaxed">
          Trang bạn tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Về trang chủ
          </Link>
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            Xem sản phẩm
          </Link>
        </div>

        {/* Brand */}
        <p className="mt-12 text-xs text-gray-300">{SITE_NAME}</p>
      </div>
    </div>
  );
}
