import { SkeletonProductCard } from "@/components/Skeleton";

/** Skeleton for a product carousel inside CategorySection — shown while fetching tab data */
export default function CategoryCarouselSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}
