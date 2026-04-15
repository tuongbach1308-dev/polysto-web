"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

export default function SearchPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
      document.addEventListener("keydown", esc);
      document.body.style.overflow = "hidden";
      return () => { document.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1500] bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-xl mx-auto mt-20 rounded-lg shadow-2xl overflow-hidden mx-4 sm:mx-auto">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <Search size={18} className="text-gray-400" />
          <input ref={inputRef} className="flex-1 text-sm outline-none" placeholder="Bạn cần tìm gì?" />
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100"><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Tìm kiếm phổ biến</p>
          <div className="flex flex-wrap gap-2">
            {["MacBook Air M4", "iPad Pro M2", "AirPods Max", "iPad Air 7", "MacBook Air M2"].map((t) => (
              <a key={t} href={`/san-pham?q=${encodeURIComponent(t)}`}
                className="px-3 py-1.5 bg-gray-100 rounded text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600 transition-colors">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
