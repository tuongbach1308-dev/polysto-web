import { SkeletonBox } from "@/components/Skeleton";

/** Content-only skeleton — sidebar is already rendered by template.tsx */
export default function AccountDashboardLoading() {
  return (
    <div className="space-y-6">
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
  );
}
