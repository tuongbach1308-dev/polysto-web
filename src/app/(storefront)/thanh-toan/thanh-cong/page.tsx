"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import StepIndicator from "@/components/StepIndicator";
import { clearCart } from "@/lib/cart";

function Content() {
  const sp = useSearchParams();
  const order = sp.get("order");
  useEffect(() => { clearCart(); }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8"><div className="max-w-[480px] mx-auto">
      <StepIndicator steps={["Giỏ hàng", "Đặt hàng", "Hoàn tất"]} currentStep={3} />
      <div className="text-center mt-8">
        <svg className="checkmark-svg mx-auto" viewBox="0 0 52 52">
          <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
          <path className="checkmark-check" fill="none" stroke="#16a34a" strokeWidth="3" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
        <h1 className="text-xl font-bold text-gray-900 mt-6 mb-2">Đặt hàng thành công!</h1>
        <p className="text-sm text-gray-500">Cảm ơn bạn đã mua hàng tại POLY Store.</p>
        {order && <p className="text-sm bg-brand-50 inline-block px-4 py-2 rounded-md mt-4 mb-4">Mã đơn: <strong className="text-brand-600">{order}</strong></p>}
        <p className="text-xs text-gray-400 mb-8">Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">Về trang chủ</Link>
          <Link href="/tra-cuu-don-hang" className="btn-outline">Tra cứu đơn</Link>
        </div>
      </div>
    </div></div>
  );
}

export default function SuccessPage() {
  return <Suspense fallback={<div className="py-20 text-center text-gray-400">Đang tải...</div>}><Content /></Suspense>;
}
