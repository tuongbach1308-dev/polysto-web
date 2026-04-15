"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function FloatingButtons({ phone, zalo }: { phone?: string; zalo?: string }) {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-center gap-3">
      {/* Messenger */}
      <a
        href="#"
        aria-label="Messenger"
        className="w-12 h-12 rounded-full bg-[#0084ff] shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        <svg viewBox="0 0 28 28" fill="white" className="w-6 h-6">
          <path d="M14 2.042c-6.76 0-12 4.952-12 11.64S7.24 25.322 14 25.322a12.73 12.73 0 003.769-.571.525.525 0 01.393.044l2.58 1.431a.525.525 0 00.77-.46l-.06-2.319a.524.524 0 01.195-.416C23.456 21.4 26 17.98 26 13.682 26 6.994 20.76 2.042 14 2.042z" />
          <path d="M8.556 15.604l2.655-4.186a1.655 1.655 0 012.395-.466l2.112 1.58a.662.662 0 00.796 0l2.852-2.153a.415.415 0 01.6.564L17.36 15.13a1.655 1.655 0 01-2.395.466l-2.112-1.58a.662.662 0 00-.796 0l-2.852 2.153a.415.415 0 01-.6-.564z" fill="#0084ff" />
        </svg>
      </a>

      {/* Zalo */}
      <a
        href={zalo || "#"}
        target={zalo ? "_blank" : undefined}
        rel={zalo ? "noopener noreferrer" : undefined}
        aria-label="Zalo"
        className="w-12 h-12 rounded-full bg-white border-2 border-[#0068ff] shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
      >
        <svg viewBox="0 0 48 48" className="w-7 h-7">
          <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" fill="#0068ff" />
          <text x="9" y="31" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="bold" fill="white">Zalo</text>
        </svg>
      </a>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        aria-label="Lên đầu trang"
        className={`w-12 h-12 rounded-full bg-brand-800 shadow-lg flex items-center justify-center hover:bg-brand-700 transition-all ${
          showScroll ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp size={20} className="text-white" />
      </button>
    </div>
  );
}
