import { SkeletonBox } from "@/components/Skeleton";

export default function CheckoutSuccessLoading() {
  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center py-16">
          {/* Checkmark circle */}
          <SkeletonBox className="h-20 w-20 rounded-full mb-6" />
          {/* Title */}
          <SkeletonBox className="h-7 w-64 mb-3" />
          {/* Order number */}
          <SkeletonBox className="h-5 w-48 mb-2" />
          {/* Subtitle */}
          <SkeletonBox className="h-4 w-72 mb-8" />
          {/* Buttons */}
          <div className="flex gap-4">
            <SkeletonBox className="h-11 w-40 rounded-lg" />
            <SkeletonBox className="h-11 w-40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
