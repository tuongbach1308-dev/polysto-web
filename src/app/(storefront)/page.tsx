import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ServiceBadges from "@/components/ServiceBadges";
import CustomerGallerySection from "./_sections/CustomerGallerySection";
import HeroSection from "./_sections/HeroSection";
import PromoBannerSection from "./_sections/PromoBannerSection";
import HotSaleSection from "./_sections/HotSaleSection";
import CategorySectionsGroup from "./_sections/CategorySectionsGroup";
import LatestPostsSection from "./_sections/LatestPostsSection";
import {
  HeroSkeleton,
  PromoBannerSkeleton,
  HotSaleSkeleton,
  CategorySectionsSkeleton,
  PostsSkeleton,
} from "./_sections/HomeSectionSkeletons";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "POLY Store - Apple Authorized Reseller | MacBook, iPad, AirPods Chính Hãng",
  description: "Mua MacBook, iPad, AirPods, Phụ kiện Apple chính hãng giá tốt nhất. Bảo hành 12 tháng 1 đổi 1. Freeship toàn quốc. Trả góp 0%.",
  alternates: { canonical: "/" },
};

const CATEGORY_CARDS = [
  { label: "iPad", href: "/san-pham?category=ipad", img: "/categories/ipad.svg" },
  { label: "MacBook", href: "/san-pham?category=macbook", img: "/categories/macbook.svg" },
  { label: "Âm thanh", href: "/san-pham?category=am-thanh", img: "/categories/am-thanh.svg" },
  { label: "Phụ kiện", href: "/san-pham?category=phu-kien", img: "/categories/phu-kien.svg" },
];

/** Lightweight data for static sections (category links + service badges) */
async function getStaticSettings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["homepage_categories", "homepage_badges", "categories_per_row"]);

  const map = new Map((data || []).map((r) => [r.key, r.value]));
  return {
    categories: Array.isArray(map.get("homepage_categories"))
      ? (map.get("homepage_categories") as { label: string; img: string; href: string }[])
      : null,
    badges: Array.isArray(map.get("homepage_badges"))
      ? (map.get("homepage_badges") as { title: string; desc: string }[])
      : null,
    categoriesPerRow: parseInt(String(map.get("categories_per_row") ?? "4")) || 4,
  };
}

export default async function HomePage() {
  const settings = await getStaticSettings();
  const cats = settings.categories && settings.categories.length > 0 ? settings.categories : CATEGORY_CARDS;

  return (
    <div className="bg-surface min-h-screen">
      {/* ── Hero banner — streams independently ── */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* ── Promo banners ── */}
      <Suspense fallback={<PromoBannerSkeleton />}>
        <PromoBannerSection />
      </Suspense>

      {/* ── Category quick links — static, renders immediately ── */}
      <div className="max-w-[1200px] mx-auto px-4 pt-5 pb-4">
        <div className="flex gap-3 overflow-x-auto lg:gap-4 lg:overflow-visible" style={{ scrollbarWidth: "none", msOverflowStyle: "none", display: "flex" }}>
          <div className="hidden lg:grid lg:gap-4 w-full" style={{ gridTemplateColumns: `repeat(${settings.categoriesPerRow}, 1fr)` }}>
            {cats.map((c) => (
              <Link key={c.label} href={c.href}
                className="group relative bg-white border border-gray-200 rounded-lg p-4 lg:p-5 flex flex-col items-center gap-2 lg:gap-3 overflow-hidden transition-all duration-300 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/50 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-b from-brand-50/0 to-brand-50/0 group-hover:from-brand-50/60 group-hover:to-brand-50/30 transition-all duration-300" />
                <div className="relative w-[70px] h-[50px] lg:w-[90px] lg:h-[70px] flex items-center justify-center">
                  {c.img && <img src={c.img} alt={c.label} className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110" />}
                </div>
                <span className="relative text-xs lg:text-sm font-semibold text-gray-700 group-hover:text-brand-600 transition-colors duration-300">{c.label}</span>
              </Link>
            ))}
          </div>
          {/* Mobile: horizontal scroll */}
          <div className="flex gap-3 lg:hidden">
            {cats.map((c) => (
              <Link key={c.label} href={c.href}
                className="group relative bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center gap-2 overflow-hidden transition-all duration-300 hover:border-brand-300 flex-shrink-0 w-[120px]">
                <div className="relative w-[70px] h-[50px] flex items-center justify-center">
                  {c.img && <img src={c.img} alt={c.label} className="max-w-full max-h-full object-contain" />}
                </div>
                <span className="relative text-xs font-semibold text-gray-700">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hot Sale — streams independently ── */}
      <Suspense fallback={<HotSaleSkeleton />}>
        <HotSaleSection />
      </Suspense>

      {/* ── Category product sections — group 1 ── */}
      <Suspense fallback={<CategorySectionsSkeleton />}>
        <CategorySectionsGroup group={1} />
      </Suspense>

      {/* ── Service badges — static ── */}
      <ServiceBadges badges={settings.badges || undefined} />

      {/* ── Category product sections — group 2 ── */}
      <Suspense fallback={<CategorySectionsSkeleton />}>
        <CategorySectionsGroup group={2} />
      </Suspense>

      {/* ── Customer gallery — fetches from site_settings ── */}
      <Suspense>
        <CustomerGallerySection />
      </Suspense>

      {/* ── Latest posts — streams independently ── */}
      <Suspense fallback={<PostsSkeleton />}>
        <LatestPostsSection />
      </Suspense>
    </div>
  );
}
