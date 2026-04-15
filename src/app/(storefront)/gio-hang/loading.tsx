import { SkeletonBox } from "@/components/Skeleton";

export default function CartLoading() {
  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <SkeletonBox className="h-8 w-48 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                {/* Checkbox */}
                <SkeletonBox className="h-5 w-5 rounded" />
                {/* Image */}
                <SkeletonBox className="h-20 w-20 rounded-md shrink-0" />
                {/* Title + details */}
                <div className="flex-1 space-y-2">
                  <SkeletonBox className="h-4 w-3/4" />
                  <SkeletonBox className="h-3 w-1/2" />
                </div>
                {/* Price */}
                <SkeletonBox className="h-5 w-24 shrink-0" />
                {/* Quantity */}
                <SkeletonBox className="h-9 w-24 rounded-md shrink-0" />
              </div>
            ))}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
              <SkeletonBox className="h-6 w-32 mb-2" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <SkeletonBox className="h-4 w-20" />
                  <SkeletonBox className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <SkeletonBox className="h-4 w-24" />
                  <SkeletonBox className="h-4 w-20" />
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <SkeletonBox className="h-5 w-20" />
                  <SkeletonBox className="h-5 w-28" />
                </div>
              </div>
              <SkeletonBox className="h-11 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
