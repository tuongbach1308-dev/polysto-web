import { SkeletonBox, SkeletonProductCard } from "@/components/Skeleton";

/** Homepage loading skeleton — matches the Suspense streaming section structure */
export default function HomeLoading() {
  return (
    <div className="bg-surface min-h-screen">
      {/* Hero */}
      <div className="max-w-[1200px] mx-auto px-4 pt-3">
        <SkeletonBox className="w-full h-[300px] lg:h-[400px] rounded-lg" />
      </div>

      {/* Promo banners */}
      <div className="max-w-[1200px] mx-auto px-4 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SkeletonBox className="h-[160px] rounded-lg" />
          <SkeletonBox className="h-[160px] rounded-lg hidden sm:block" />
        </div>
      </div>

      {/* Category quick links */}
      <div className="max-w-[1200px] mx-auto px-4 pt-5 pb-4">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Category section */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-3">
        <SkeletonBox className="h-11 w-full rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
