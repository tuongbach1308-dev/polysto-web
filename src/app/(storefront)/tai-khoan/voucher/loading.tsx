import { SkeletonBox } from "@/components/Skeleton";

/** Content-only skeleton — sidebar is already rendered by template.tsx */
export default function VouchersLoading() {
  return (
    <div className="space-y-4">
      <SkeletonBox className="h-6 w-40 mb-2" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-4">
          <SkeletonBox className="h-16 w-16 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBox className="h-5 w-40" />
            <SkeletonBox className="h-3.5 w-56" />
            <SkeletonBox className="h-3 w-32" />
          </div>
          <SkeletonBox className="h-9 w-20 rounded-md shrink-0" />
        </div>
      ))}
    </div>
  );
}
