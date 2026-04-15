import { SkeletonBox, SkeletonProductCard } from "@/components/Skeleton";

export function HeroSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-3">
      <SkeletonBox className="w-full h-[300px] lg:h-[400px] rounded-lg" />
    </div>
  );
}

export function PromoBannerSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SkeletonBox className="h-[160px] rounded-lg" />
        <SkeletonBox className="h-[160px] rounded-lg hidden sm:block" />
      </div>
    </div>
  );
}

export function HotSaleSkeleton() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-6">
      <div className="rounded-lg overflow-hidden bg-brand-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBox className="h-5 w-32 !bg-white/20" />
          <div className="flex gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBox key={i} className="w-[36px] h-[30px] rounded !bg-white/20" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonProductCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function CategorySectionsSkeleton() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 py-6 space-y-3">
      <SkeletonBox className="h-11 w-full rounded-lg !bg-brand-700/30" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonProductCard key={i} />
        ))}
      </div>
    </section>
  );
}

export function PostsSkeleton() {
  return (
    <section className="bg-brand-800 py-8">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <SkeletonBox className="h-5 w-40 !bg-white/20" />
          <SkeletonBox className="h-4 w-24 !bg-white/10" />
        </div>
        <div className="border-t border-white/20 mb-5" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="aspect-[16/10] rounded-lg !bg-white/10" />
          ))}
        </div>
      </div>
    </section>
  );
}
