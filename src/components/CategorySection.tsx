"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import CategoryCarouselSkeleton from "@/components/skeletons/CategorySectionSkeleton";
import type { Product } from "@/lib/database.types";

export interface SubCategory {
  id: string;
  name: string;
  href: string;
  products?: Product[];  // Only present for the initial/default tab
}

interface Props {
  brandName: string;
  categoryName: string;
  categoryHref: string;
  subcategories: SubCategory[];
}

export default function CategorySection({ brandName, categoryName, categoryHref, subcategories }: Props) {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [productCache] = useState<Map<string, Product[]>>(() => {
    const initial = new Map<string, Product[]>();
    // Cache the first tab's products if available
    if (subcategories[0]?.products) {
      initial.set(subcategories[0].id, subcategories[0].products);
    }
    return initial;
  });

  if (subcategories.length === 0) return null;

  const activeSub = subcategories[active] || subcategories[0];
  const cachedProducts = productCache.get(activeSub.id);
  const id = categoryName.replace(/\s+/g, "-").toLowerCase();

  const handleTabChange = useCallback(async (index: number) => {
    setActive(index);
    const sub = subcategories[index];
    if (productCache.has(sub.id)) return; // Already cached

    setLoading(true);
    try {
      const res = await fetch(`/api/products/by-category?id=${sub.id}&home=true`);
      const data = await res.json();
      productCache.set(sub.id, data.products || []);
    } catch {
      productCache.set(sub.id, []);
    } finally {
      setLoading(false);
    }
  }, [subcategories, productCache]);

  const products = cachedProducts || activeSub.products || [];

  return (
    <section className="max-w-[1200px] mx-auto px-4 py-6 space-y-3">
      {/* Header bar */}
      <div className="bg-brand-700 rounded-lg px-4 py-2.5 flex items-center gap-4 flex-wrap">
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider">{brandName}</span>
          <h2 className="text-sm font-bold text-white uppercase whitespace-nowrap">{categoryName}</h2>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-1 flex-wrap">
            {subcategories.map((s, i) => (
              <button
                key={s.id}
                onClick={() => handleTabChange(i)}
                className={`text-[12px] font-semibold px-3 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  i === active ? "bg-white text-brand-700" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <Link
            href={categoryHref}
            className="text-[12px] text-white font-medium flex items-center gap-0.5 hover:text-brand-200 transition-colors whitespace-nowrap ml-2 border border-white/30 rounded-md px-3 py-1"
          >
            Xem tất cả <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Mobile sub pills */}
      <div className="sm:hidden flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {subcategories.map((s, i) => (
          <button
            key={s.id}
            onClick={() => handleTabChange(i)}
            className={`text-[12px] font-semibold px-3 py-1 rounded-md whitespace-nowrap flex-shrink-0 transition-colors cursor-pointer ${
              i === active ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Slider or Skeleton */}
      <div className="relative group/nav">
        {loading ? (
          <CategoryCarouselSkeleton />
        ) : products.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400 bg-white rounded-lg border border-dashed border-gray-200">
            Chưa có sản phẩm trong danh mục này
          </div>
        ) : (
          <>
            <Swiper
              key={`${id}-${active}`}
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
              {products.map((p) => (
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
          </>
        )}
      </div>
    </section>
  );
}
