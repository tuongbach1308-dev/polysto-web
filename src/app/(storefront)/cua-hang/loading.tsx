import { SkeletonBox } from "@/components/Skeleton";

export default function StoresLoading() {
  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Title */}
        <SkeletonBox className="h-8 w-48 mb-6" />

        {/* Store cards */}
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <SkeletonBox className="w-full h-48 rounded-none" />
              <div className="p-5 space-y-3">
                <SkeletonBox className="h-6 w-48" />
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-3/4" />
                <div className="flex items-center gap-4 pt-2">
                  <SkeletonBox className="h-4 w-32" />
                  <SkeletonBox className="h-4 w-40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
