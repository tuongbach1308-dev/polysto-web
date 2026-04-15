import { SkeletonBox } from "@/components/Skeleton";

/** Content-only skeleton — sidebar is already rendered by template.tsx */
export default function OrdersLoading() {
  return (
    <div className="space-y-4">
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
        </div>
      ))}
    </div>
  );
}
