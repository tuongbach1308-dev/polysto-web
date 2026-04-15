"use client";

import { useState } from "react";
import { Ticket, Copy, Check, Clock } from "lucide-react";

interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  minOrder: string;
  expiry: string;
  used: boolean;
}

const VOUCHERS: Voucher[] = [
  { id: "1", code: "POLY50K", title: "Giảm 50.000đ", description: "Đơn hàng từ 2.000.000đ", discount: "50.000đ", minOrder: "2.000.000đ", expiry: "30/04/2026", used: false },
  { id: "2", code: "FREESHIP", title: "Miễn phí vận chuyển", description: "Áp dụng mọi đơn hàng", discount: "Free Ship", minOrder: "0đ", expiry: "31/05/2026", used: false },
  { id: "3", code: "POLY100K", title: "Giảm 100.000đ", description: "Đơn hàng từ 5.000.000đ", discount: "100.000đ", minOrder: "5.000.000đ", expiry: "15/04/2026", used: false },
  { id: "4", code: "NEWUSER", title: "Giảm 200.000đ cho khách mới", description: "Đơn hàng đầu tiên từ 3.000.000đ", discount: "200.000đ", minOrder: "3.000.000đ", expiry: "01/03/2026", used: true },
];

export default function VoucherPage() {
  const [tab, setTab] = useState<"active" | "used">("active");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = VOUCHERS.filter((v) => tab === "active" ? !v.used : v.used);

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-gray-900">Voucher của tôi</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab("active")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === "active" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          Còn hiệu lực ({VOUCHERS.filter((v) => !v.used).length})
        </button>
        <button onClick={() => setTab("used")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === "used" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          Đã sử dụng ({VOUCHERS.filter((v) => v.used).length})
        </button>
      </div>

      {/* Voucher list */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Ticket className="mx-auto text-gray-200 mb-3" size={48} />
          <p className="text-sm text-gray-400">Không có voucher nào.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((v) => (
            <div key={v.id} className={`bg-white border rounded-lg overflow-hidden flex ${v.used ? "border-gray-200 opacity-60" : "border-brand-200"}`}>
              {/* Left ticket stub */}
              <div className={`w-[120px] flex flex-col items-center justify-center p-4 flex-shrink-0 ${v.used ? "bg-gray-100" : "bg-brand-50"}`}>
                <Ticket size={24} className={v.used ? "text-gray-400" : "text-brand-500"} />
                <span className={`text-lg font-bold mt-1 ${v.used ? "text-gray-400" : "text-brand-600"}`}>{v.discount}</span>
              </div>

              {/* Right content */}
              <div className="flex-1 p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800">{v.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{v.description}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>HSD: {v.expiry}</span>
                    <span className="ml-2">Đơn tối thiểu: {v.minOrder}</span>
                  </div>
                </div>
                {!v.used && (
                  <button
                    onClick={() => copyCode(v.code)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium flex-shrink-0 transition-colors ${
                      copied === v.code
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-brand-50 text-brand-600 border border-brand-200 hover:bg-brand-100"
                    }`}
                  >
                    {copied === v.code ? <><Check size={14} /> Đã copy</> : <><Copy size={14} /> {v.code}</>}
                  </button>
                )}
                {v.used && (
                  <span className="text-xs text-gray-400 font-medium px-3 py-1.5 bg-gray-100 rounded-md flex-shrink-0">Đã dùng</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
