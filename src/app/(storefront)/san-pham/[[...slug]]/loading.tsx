"use client";

import { usePathname } from "next/navigation";
import { SkeletonBox, SkeletonProductGrid, SkeletonDetailHero } from "@/components/Skeleton";

/**
 * Smart skeleton: detects listing vs detail from URL pattern.
 * - /san-pham or /san-pham/apple/ipad → category listing skeleton
 * - /san-pham/ipad-pro-13-inch-m5 (slug with many hyphens, no known category pattern) → detail skeleton
 *
 * Heuristic: product slugs tend to be long (4+ segments when split by hyphen).
 * Category paths are short known slugs. If the last segment has 4+ hyphen-parts → detail.
 */
export default function ProductsLoading() {
  const pathname = usePathname();
  const segments = pathname.replace(/^\/san-pham\/?/, "").split("/").filter(Boolean);

  // No segments = /san-pham (main listing)
  // Last segment has few hyphens = likely category (apple, ipad, macbook, phu-kien)
  // Last segment has many hyphens = likely product detail slug
  const lastSegment = segments[segments.length - 1] || "";
  const hyphenCount = (lastSegment.match(/-/g) || []).length;
  const isDetail = segments.length > 0 && hyphenCount >= 3;

  if (isDetail) return <SkeletonDetailHero />;
  return <ListingSkeleton />;
}

function ListingSkeleton() {
  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <div className="flex items-center gap-1.5">
            <SkeletonBox className="h-3.5 w-16" />
            <span className="text-gray-200">/</span>
            <SkeletonBox className="h-3.5 w-14" />
            <span className="text-gray-200">/</span>
            <SkeletonBox className="h-3.5 w-20" />
          </div>
        </nav>

        {/* Category banner */}
        <div className="mb-5 rounded-xl bg-gradient-to-r from-brand-700 to-brand-500 px-6 py-6">
          <div className="flex items-center gap-3">
            <SkeletonBox className="w-12 h-12 rounded-lg !bg-white/20" />
            <div>
              <SkeletonBox className="h-7 w-40 !bg-white/20 mb-1.5" />
              <SkeletonBox className="h-4 w-56 !bg-white/15" />
            </div>
          </div>
        </div>

        {/* Sub-category pills */}
        <div className="flex gap-2 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="h-9 w-24 rounded-md" />
          ))}
        </div>

        {/* Main layout */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-[220px] flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-brand-700">
                <SkeletonBox className="h-4 w-16 !bg-white/20" />
              </div>
              <div className="p-3 space-y-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonBox key={i} className="h-8 w-full" />
                ))}
              </div>
              <div className="border-t border-gray-100 p-3 space-y-2">
                <SkeletonBox className="h-4 w-20 mb-2" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonBox key={i} className="h-7 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <SkeletonBox className="h-5 w-28" />
              <SkeletonBox className="h-9 w-32 rounded-md" />
            </div>
            <SkeletonProductGrid count={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
