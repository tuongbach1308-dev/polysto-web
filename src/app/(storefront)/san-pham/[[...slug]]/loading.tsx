import { SkeletonBox, SkeletonProductGrid } from "@/components/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        {/* Breadcrumb - just dots */}
        <nav className="mb-4">
          <div className="flex items-center gap-1.5">
            <SkeletonBox className="h-3.5 w-16" />
            <span className="text-gray-200">/</span>
            <SkeletonBox className="h-3.5 w-14" />
            <span className="text-gray-200">/</span>
            <SkeletonBox className="h-3.5 w-20" />
          </div>
        </nav>

        {/* Category banner - keep the real gradient bg, skeleton text inside */}
        <div className="mb-5 rounded-xl bg-gradient-to-r from-brand-700 to-brand-500 px-6 py-6 text-white">
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
          {/* Sidebar - keep structure, skeleton content inside */}
          <div className="hidden lg:block w-[220px] flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Sidebar header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-brand-700">
                <SkeletonBox className="h-4 w-4 !bg-white/20" />
                <SkeletonBox className="h-4 w-16 !bg-white/20" />
              </div>
              {/* Category items */}
              <div className="p-3 space-y-1">
                <SkeletonBox className="h-9 w-full" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonBox key={i} className="h-8 w-full ml-2" />
                ))}
                <SkeletonBox className="h-9 w-full mt-2" />
              </div>
              {/* Price section */}
              <div className="border-t border-gray-100 p-3 space-y-2">
                <SkeletonBox className="h-4 w-20 mb-2" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonBox key={i} className="h-7 w-full" />
                ))}
              </div>
              {/* Condition section */}
              <div className="border-t border-gray-100 p-3 space-y-2">
                <SkeletonBox className="h-4 w-24 mb-2" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonBox key={i} className="h-7 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Product grid area */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-4">
              <SkeletonBox className="h-5 w-28" />
              <div className="flex items-center gap-2">
                <SkeletonBox className="h-9 w-32 rounded-md" />
                <SkeletonBox className="h-9 w-9 rounded-md" />
              </div>
            </div>
            {/* Product cards */}
            <SkeletonProductGrid count={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
