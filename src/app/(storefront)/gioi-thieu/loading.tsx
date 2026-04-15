import { SkeletonBox } from "@/components/Skeleton";

export default function AboutLoading() {
  return (
    <div className="bg-surface min-h-screen">
      {/* Hero banner */}
      <div className="max-w-[1200px] mx-auto px-4 pt-4">
        <SkeletonBox className="w-full h-[250px] lg:h-[350px] rounded-lg" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Feature cards grid 2x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
              <SkeletonBox className="h-12 w-12 rounded-lg" />
              <SkeletonBox className="h-5 w-32" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-3/4" />
            </div>
          ))}
        </div>

        {/* Content block */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
          <SkeletonBox className="h-6 w-48 mb-4" />
          <SkeletonBox className="h-4 w-full" />
          <SkeletonBox className="h-4 w-full" />
          <SkeletonBox className="h-4 w-5/6" />
          <SkeletonBox className="h-4 w-full" />
          <SkeletonBox className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
}
