import { SkeletonBox } from "@/components/Skeleton";

export default function AccountDashboardLoading() {
  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
              <div className="flex items-center gap-3">
                <SkeletonBox className="h-12 w-12 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <SkeletonBox className="h-4 w-28" />
                  <SkeletonBox className="h-3 w-36" />
                </div>
              </div>
              <div className="space-y-1 pt-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonBox key={i} className="h-9 w-full rounded-md" />
                ))}
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Welcome card */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <SkeletonBox className="h-6 w-48 mb-2" />
              <SkeletonBox className="h-4 w-72" />
            </div>

            {/* Stat cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                  <SkeletonBox className="h-4 w-20" />
                  <SkeletonBox className="h-7 w-16" />
                </div>
              ))}
            </div>

            {/* Recent orders list */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
              <SkeletonBox className="h-6 w-40" />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                  <SkeletonBox className="h-4 w-24 shrink-0" />
                  <SkeletonBox className="h-4 flex-1" />
                  <SkeletonBox className="h-4 w-24 shrink-0" />
                  <SkeletonBox className="h-6 w-20 rounded-full shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
