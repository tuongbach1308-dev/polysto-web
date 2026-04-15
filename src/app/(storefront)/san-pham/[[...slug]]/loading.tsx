"use client";

import { usePathname } from "next/navigation";
import { SkeletonBox, SkeletonProductGrid, SkeletonDetailHero } from "@/components/Skeleton";

/**
 * Smart skeleton: detects listing vs detail from URL pattern.
 * - Listing: only product grid skeleton (no sidebar skeleton — sidebar is static)
 * - Detail: per-section skeleton (hero, info, specs, related)
 */
export default function ProductsLoading() {
  const pathname = usePathname();
  const segments = pathname.replace(/^\/san-pham\/?/, "").split("/").filter(Boolean);

  const lastSegment = segments[segments.length - 1] || "";
  const hyphenCount = (lastSegment.match(/-/g) || []).length;
  const isDetail = segments.length > 0 && hyphenCount >= 3;

  if (isDetail) return <SkeletonDetailHero />;
  return <ListingSkeleton />;
}

/** Listing skeleton — content area only, no sidebar skeleton */
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
            <SkeletonBox key={i} className="h-[44px] w-24 rounded-md" />
          ))}
        </div>

        {/* Main layout — sidebar space preserved but no skeleton, only content skeletons */}
        <div className="flex gap-6">
          {/* Sidebar — empty space holder, no skeleton animation */}
          <div className="hidden lg:block w-[220px] flex-shrink-0" />

          {/* Product grid — only this area shows skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <SkeletonBox className="h-5 w-28" />
              <SkeletonBox className="h-9 w-32 rounded-md" />
            </div>
            <SkeletonProductGrid count={8} />
          </div>
        </div>
      </div>
    </div>
  );
}
