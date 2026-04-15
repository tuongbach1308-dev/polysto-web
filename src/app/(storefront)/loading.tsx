import { SkeletonHero, SkeletonProductGrid, SkeletonBox } from "@/components/Skeleton";

export default function HomeLoading() {
  return (
    <div className="bg-surface min-h-screen">
      <SkeletonHero />
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <SkeletonBox className="h-10 w-full rounded-lg mb-3" />
        <SkeletonProductGrid count={5} />
      </div>
    </div>
  );
}
