import { SkeletonBox } from "@/components/Skeleton";

/** Content-only skeleton — sidebar is already rendered by template.tsx */
export default function AddressesLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <SkeletonBox className="h-6 w-40" />
        <SkeletonBox className="h-9 w-32 rounded-md" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <SkeletonBox className="h-5 w-32" />
            <SkeletonBox className="h-6 w-20 rounded-full" />
          </div>
          <SkeletonBox className="h-4 w-full" />
          <SkeletonBox className="h-4 w-3/4" />
          <SkeletonBox className="h-4 w-32" />
          <div className="flex gap-2 pt-2">
            <SkeletonBox className="h-8 w-16 rounded-md" />
            <SkeletonBox className="h-8 w-16 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
