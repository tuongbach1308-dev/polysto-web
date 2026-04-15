import { SkeletonBox } from "@/components/Skeleton";

export default function OrderTrackingLoading() {
  return (
    <div className="bg-surface min-h-screen">
      {/* Hero section */}
      <div className="max-w-[1200px] mx-auto px-4 pt-4">
        <SkeletonBox className="w-full h-[200px] lg:h-[280px] rounded-lg" />
      </div>

      {/* Search card */}
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-lg p-6 space-y-4 -mt-16 relative z-10">
          <SkeletonBox className="h-6 w-48 mx-auto" />
          <SkeletonBox className="h-4 w-64 mx-auto" />
          <div className="space-y-1.5">
            <SkeletonBox className="h-3.5 w-24" />
            <SkeletonBox className="h-10 w-full rounded-md" />
          </div>
          <SkeletonBox className="h-11 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
