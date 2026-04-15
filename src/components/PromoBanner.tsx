"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/database.types";

interface PromoBannerItem {
  image: string;
  href: string;
  alt: string;
}

export default function PromoBanner({ products, banners }: { products: Product[]; banners?: PromoBannerItem[] }) {
  // Use settings-based banners if available, otherwise fall back to product thumbnails
  const hasSettingsBanners = banners && banners.length > 0 && banners.some((b) => b.image);

  if (hasSettingsBanners) {
    const items = banners!.filter((b) => b.image);
    return (
      <div className="max-w-[1200px] mx-auto px-4 pt-3 pb-1">
        <div className="relative group">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            navigation={{ prevEl: ".promo-prev", nextEl: ".promo-next" }}
            pagination={{ clickable: true, el: ".promo-dots" }}
            spaceBetween={12}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 } }}
            loop={items.length > 2}
          >
            {items.map((b, i) => (
              <SwiperSlide key={i}>
                <Link
                  href={b.href || "#"}
                  className="block rounded-lg overflow-hidden h-[200px] relative hover:shadow-md transition-shadow"
                >
                  <Image src={b.image} alt={b.alt || ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="promo-prev absolute left-1 top-[100px] -translate-y-1/2 z-20 w-7 h-7 bg-white/90 border border-gray-200 rounded shadow flex items-center justify-center hover:bg-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft size={14} className="text-gray-500" />
          </button>
          <button className="promo-next absolute right-1 top-[100px] -translate-y-1/2 z-20 w-7 h-7 bg-white/90 border border-gray-200 rounded shadow flex items-center justify-center hover:bg-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={14} className="text-gray-500" />
          </button>
        </div>
        <div className="promo-dots flex justify-center gap-1.5 mt-2.5" />
      </div>
    );
  }

  // Fallback: product-based banners
  if (!products || products.length === 0) return null;

  const items = products.filter((p) => p.thumbnail).slice(0, 8);
  if (items.length === 0) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-3 pb-1">
      <div className="relative group">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation={{ prevEl: ".promo-prev", nextEl: ".promo-next" }}
          pagination={{ clickable: true, el: ".promo-dots" }}
          spaceBetween={12}
          slidesPerView={1}
          breakpoints={{ 768: { slidesPerView: 2 } }}
          loop={items.length > 2}
        >
          {items.map((p) => (
            <SwiperSlide key={p.id}>
              <Link
                href={`/san-pham/${p.slug}`}
                className="block bg-gradient-to-br from-gray-200 via-gray-100 to-gray-50 border border-gray-200 rounded-lg overflow-hidden h-[200px] relative hover:shadow-md transition-shadow"
              >
                {p.thumbnail && (
                  <Image
                    src={p.thumbnail}
                    alt={p.title}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent px-4 py-3">
                  <p className="text-white text-sm font-semibold line-clamp-1 drop-shadow">
                    {p.title.split("|")[0].trim()}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="promo-prev absolute left-1 top-[100px] -translate-y-1/2 z-20 w-7 h-7 bg-white/90 border border-gray-200 rounded shadow flex items-center justify-center hover:bg-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronLeft size={14} className="text-gray-500" />
        </button>
        <button className="promo-next absolute right-1 top-[100px] -translate-y-1/2 z-20 w-7 h-7 bg-white/90 border border-gray-200 rounded shadow flex items-center justify-center hover:bg-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight size={14} className="text-gray-500" />
        </button>
      </div>
      <div className="promo-dots flex justify-center gap-1.5 mt-2.5" />
    </div>
  );
}
