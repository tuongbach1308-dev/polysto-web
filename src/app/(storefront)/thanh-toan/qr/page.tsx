"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import StepIndicator from "@/components/StepIndicator";
import { formatPrice } from "@/lib/format";
import { Clock } from "lucide-react";

function Content() {
  const sp = useSearchParams();
  const order = sp.get("order") || "";
  const amount = parseInt(sp.get("amount") || "0");
  const [time, setTime] = useState(300);

  useEffect(() => {
    const t = setInterval(() => setTime((p) => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
    return () => clearInterval(t);
  }, []);

  const qr = `https://img.vietqr.io/image/970436-1234567890-compact.png?amount=${amount}&addInfo=${encodeURIComponent(order)}&accountName=${encodeURIComponent("POLY STORE")}`;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6"><div className="max-w-[480px] mx-auto">
      <StepIndicator steps={["Giỏ hàng", "Đặt hàng", "Hoàn tất"]} currentStep={2} />
      <h1 className="text-xl font-bold text-gray-900 text-center mt-6 mb-4">Thanh toán QR</h1>
      <div className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-md mb-5 text-sm font-medium ${time > 60 ? "bg-brand-50 text-brand-600" : "bg-red-50 text-red-500"}`}>
        <Clock size={14} />{time > 0 ? `Còn ${String(Math.floor(time / 60)).padStart(2, "0")}:${String(time % 60).padStart(2, "0")}` : "Hết thời gian"}
      </div>
      {order && <p className="text-center text-xs text-gray-400 mb-4">Mã đơn: <strong className="text-brand-600">{order}</strong></p>}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="w-48 h-48 mx-auto bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
          {amount > 0 ? <img src={qr} alt="QR" className="w-full h-full object-contain" /> : <span className="text-xs text-gray-400">QR Code</span>}
        </div>
        <table className="w-full mt-5 text-sm">
          <tbody>
            {[["Ngân hàng", "Vietcombank"], ["Số TK", "1234567890"], ["Chủ TK", "POLY STORE"], ...(amount > 0 ? [["Số tiền", formatPrice(amount)]] : []), ["Nội dung", order]].map(([k, v]) => (
              <tr key={k} className="border-b border-gray-100"><td className="py-2 text-gray-400">{k}</td><td className="py-2 text-right font-medium">{v}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 text-center mt-4 mb-5">Xác nhận trong 15 phút sau khi chuyển khoản.</p>
      <Link href={`/thanh-toan/thanh-cong?order=${order}`} className="block w-full text-center btn-primary py-3">Tôi đã chuyển khoản</Link>
    </div></div>
  );
}

export default function QRPage() {
  return <Suspense fallback={<div className="py-20 text-center text-gray-400">Đang tải...</div>}><Content /></Suspense>;
}
