"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, BadgeCheck, Shield, ThumbsUp } from "lucide-react";

interface HeroBanner {
  image?: string;
  badge: string;
  title: string;
  tags: { label: string; sub: string }[];
  href: string;
}

const FALLBACK_BANNERS: HeroBanner[] = [
  {
    badge: "Không cần mới - Chỉ cần chuẩn POLY",
    title: "iPad chuẩn\nPOLY Store",
    tags: [
      { label: "Giá hợp lý", sub: "Đa dạng phân loại A+, A, B" },
      { label: "7 trạm xác nhận", sub: "Chất lượng chuẩn POLY" },
      { label: "Chính sách", sub: "Bảo hành đầy đủ" },
    ],
    href: "/san-pham?category=ipad",
  },
  {
    badge: "Apple chính hãng - Giá tốt nhất",
    title: "MacBook Air\nPOLY Store",
    tags: [
      { label: "Giá tốt nhất", sub: "So với thị trường" },
      { label: "Chính hãng 100%", sub: "Tem bảo hành Apple" },
      { label: "Trả góp 0%", sub: "Qua thẻ tín dụng" },
    ],
    href: "/san-pham?category=macbook",
  },
  {
    badge: "Trải nghiệm âm thanh đỉnh cao",
    title: "AirPods\nPOLY Store",
    tags: [
      { label: "Chính hãng", sub: "Apple Authorized" },
      { label: "Bảo hành 12T", sub: "1 đổi 1 lỗi NSX" },
      { label: "Freeship", sub: "Toàn quốc" },
    ],
    href: "/san-pham?category=am-thanh",
  },
];

const TAG_ICONS = [ThumbsUp, BadgeCheck, Shield];

export default function HeroSlider({ banners: bannersProp }: { banners?: HeroBanner[] }) {
  const banners = bannersProp && bannersProp.length > 0 ? bannersProp : FALLBACK_BANNERS;

  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-4">
      <div className="relative group">
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={false}
          navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
          loop
          className="rounded-lg overflow-hidden shadow-lg"
        >
          {banners.map((b, i) => (
            <SwiperSlide key={i}>
              <a href={b.href} className="block relative text-white overflow-hidden">
                {/* Background: image or gradient fallback */}
                {b.image ? (
                  <Image src={b.image} alt={b.badge || b.title} fill className="object-cover" sizes="(max-width: 1200px) 100vw, 1200px" priority={i === 0} />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500" />
                )}
                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-black/30" />

                <div className="relative px-6 md:px-10 py-8 md:py-10 flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-1 rounded mb-3">
                      {b.badge}
                    </span>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-tight whitespace-pre-line drop-shadow-lg">
                      {b.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {b.tags.map((tag, ti) => {
                        const Icon = TAG_ICONS[ti] || ThumbsUp;
                        return (
                          <div key={ti} className="bg-white/15 backdrop-blur-sm rounded px-3 py-2 flex items-start gap-2">
                            <Icon size={16} className="text-white/80 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-white leading-tight">{tag.label}</p>
                              <p className="text-[10px] text-white/60 leading-tight">{tag.sub}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {!b.image && (
                    <div className="hidden md:flex items-center justify-center w-[280px] h-[160px] flex-shrink-0">
                      <div className="w-full h-full bg-white/10 rounded-lg flex items-center justify-center">
                        <span className="text-6xl font-black text-white/15">POLY</span>
                      </div>
                    </div>
                  )}
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="hero-prev absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 border border-gray-200 rounded shadow flex items-center justify-center hover:bg-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <button className="hero-next absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 border border-gray-200 rounded shadow flex items-center justify-center hover:bg-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
