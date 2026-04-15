"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/database.types";
import { useCountdownTo } from "@/lib/countdown";

interface HotSaleConfig {
  enabled?: string;
  title?: string;
  end?: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function HotSale({ products, config }: { products: Product[]; config?: HotSaleConfig }) {
  const countdown = useCountdownTo(config?.end);

  // Hidden if disabled or no products
  if (config?.enabled === "false") return null;
  if (!products || products.length === 0) return null;

  const title = config?.title || "Hot Sale";

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-6">
      <div className="rounded-lg overflow-hidden" style={{ background: "linear-gradient(180deg, #155e30 0%, #155e30 75%, #1a7a42 100%)" }}>

        {/* ── Header ── */}
        <div className="px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-yellow-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              {title}
            </h2>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-1.5">
            {[
              { val: countdown.d, label: "Ngày" },
              { val: countdown.h, label: "Giờ" },
              { val: countdown.m, label: "Phút" },
              { val: countdown.s, label: "Giây" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="bg-white rounded min-w-[36px] h-[30px] flex flex-col items-center justify-center px-1">
                  <span className="text-gray-900 text-xs font-bold leading-none">
                    {pad(t.val)}
                  </span>
                  <span className="text-gray-500 text-[8px] leading-none mt-0.5">
                    {t.label}
                  </span>
                </div>
                {i < 3 && <span className="text-white/60 font-bold text-xs">:</span>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Product cards ── */}
        <div className="px-4 pb-4 relative group/nav">
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{ prevEl: ".hs-prev", nextEl: ".hs-next" }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            spaceBetween={8}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 10 },
              1024: { slidesPerView: 4, spaceBetween: 10 },
              1280: { slidesPerView: 5, spaceBetween: 10 },
            }}
          >
            {products.map((p) => (
              <SwiperSlide key={p.id} className="!h-auto">
                <ProductCard product={p} />
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="hs-prev absolute left-1 top-[40%] -translate-y-1/2 z-20 w-8 h-8 bg-white/90 border border-gray-200 rounded shadow-md flex items-center justify-center hover:bg-white cursor-pointer opacity-0 group-hover/nav:opacity-100 transition-opacity">
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <button className="hs-next absolute right-1 top-[40%] -translate-y-1/2 z-20 w-8 h-8 bg-white/90 border border-gray-200 rounded shadow-md flex items-center justify-center hover:bg-white cursor-pointer opacity-0 group-hover/nav:opacity-100 transition-opacity">
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>

        {/* ── View all ── */}
        <div className="flex justify-center pb-4">
          <Link
            href="/san-pham"
            className="bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold px-6 py-2 rounded-md transition-colors inline-flex items-center gap-1"
          >
            Xem tất cả <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
