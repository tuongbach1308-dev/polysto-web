"use client";

import { useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/database.types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  products: Product[];
  title: string;
  href?: string;
  filters?: string[];
}

export default function ProductCarousel({ products, title, href, filters }: Props) {
  const [active, setActive] = useState(0);

  if (!products || products.length === 0) return null;
  const id = title.replace(/\s/g, "");

  /* Filter products by matching title keyword */
  const filtered = useMemo(() => {
    if (!filters || filters.length === 0) return products;
    const keyword = filters[active]?.toLowerCase();
    if (!keyword) return products;
    const result = products.filter((p) => p.title.toLowerCase().includes(keyword));
    return result.length > 0 ? result : products;
  }, [products, filters, active]);

  return (
    <section className="space-y-3">
      {/* ── Header bar ── */}
      <div className="bg-brand-700 rounded-lg px-4 py-2.5 flex items-center gap-4 flex-wrap">
        <h2 className="text-sm font-bold text-white uppercase whitespace-nowrap">
          {title}
        </h2>

        <div className="ml-auto flex items-center gap-1.5">
          {filters && filters.length > 0 && (
            <div className="hidden sm:flex items-center gap-1">
              {filters.map((f, i) => (
                <button
                  key={f}
                  onClick={() => setActive(i)}
                  className={`text-[12px] font-semibold px-3 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                    i === active
                      ? "bg-white text-brand-700"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {href && (
            <Link
              href={href}
              className="text-[12px] text-white font-medium flex items-center gap-0.5 hover:text-brand-200 transition-colors whitespace-nowrap ml-2 border border-white/30 rounded-md px-3 py-1"
            >
              Xem tất cả <ChevronRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* ── Product slider ── */}
      <div className="relative group/nav">
        <Swiper
          key={active}
          modules={[Navigation]}
          navigation={{ prevEl: `.prev-${id}`, nextEl: `.next-${id}` }}
          spaceBetween={8}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 10 },
            1024: { slidesPerView: 4, spaceBetween: 10 },
            1280: { slidesPerView: 5, spaceBetween: 10 },
          }}
        >
          {filtered.map((p) => (
            <SwiperSlide key={p.id} className="!h-auto">
              <ProductCard product={p} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className={`prev-${id} absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white border border-gray-300 rounded shadow-md hidden lg:flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors`}
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <button
          className={`next-${id} absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white border border-gray-300 rounded shadow-md hidden lg:flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors`}
        >
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>
    </section>
  );
}
