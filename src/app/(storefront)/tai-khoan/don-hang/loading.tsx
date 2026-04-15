import { SkeletonBox } from "@/components/Skeleton";

export default function OrdersLoading() {
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
          <div className="lg:col-span-3 space-y-4">
            {/* Tab bar */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonBox key={i} className="h-9 w-24 rounded-full shrink-0" />
              ))}
            </div>

            {/* Order cards */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <SkeletonBox className="h-4 w-32" />
                  <SkeletonBox className="h-6 w-24 rounded-full" />
                </div>
                <div className="flex items-center gap-4">
                  <SkeletonBox className="h-16 w-16 rounded-md shrink-0" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBox className="h-4 w-3/4" />
                    <SkeletonBox className="h-3.5 w-1/2" />
                  </div>
                  <SkeletonBox className="h-5 w-24 shrink-0" />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <SkeletonBox className="h-9 w-28 rounded-md" />
                  <SkeletonBox className="h-9 w-28 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
