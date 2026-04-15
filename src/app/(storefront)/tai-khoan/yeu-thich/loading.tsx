import { SkeletonBox } from "@/components/Skeleton";

/** Content-only skeleton — sidebar is already rendered by template.tsx */
export default function WishlistLoading() {
  return (
    <div>
      <SkeletonBox className="h-6 w-40 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <SkeletonBox className="aspect-square rounded-none" />
            <div className="p-3 space-y-2">
              <SkeletonBox className="h-3.5 w-full" />
              <SkeletonBox className="h-3.5 w-3/4" />
              <div className="flex items-center gap-2 pt-1">
                <SkeletonBox className="h-5 w-24" />
                <SkeletonBox className="h-3.5 w-16" />
              </div>
              <SkeletonBox className="h-9 w-full rounded-md mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
