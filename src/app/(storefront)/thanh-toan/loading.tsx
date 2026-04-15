import { SkeletonBox } from "@/components/Skeleton";

export default function CheckoutLoading() {
  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <SkeletonBox className="h-8 w-8 rounded-full" />
              <SkeletonBox className="h-4 w-20" />
              {i < 2 && <SkeletonBox className="h-0.5 w-12" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form fields left */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 space-y-5">
            <SkeletonBox className="h-6 w-40 mb-4" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <SkeletonBox className="h-3.5 w-24" />
                <SkeletonBox className="h-10 w-full rounded-md" />
              </div>
            ))}
            <SkeletonBox className="h-6 w-48 mt-6 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonBox key={i} className="h-16 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Order summary right */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
              <SkeletonBox className="h-6 w-32" />
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <SkeletonBox className="h-16 w-16 rounded-md shrink-0" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBox className="h-3.5 w-full" />
                    <SkeletonBox className="h-4 w-24" />
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <div className="flex justify-between">
                  <SkeletonBox className="h-4 w-20" />
                  <SkeletonBox className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
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
