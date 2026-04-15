import { SkeletonBox } from "@/components/Skeleton";

/** Content-only skeleton — sidebar is already rendered by template.tsx */
export default function ProfileLoading() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
      <SkeletonBox className="h-6 w-40 mb-2" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <SkeletonBox className="h-3.5 w-24" />
          <SkeletonBox className="h-10 w-full rounded-md" />
        </div>
      ))}
      <SkeletonBox className="h-11 w-36 rounded-lg mt-2" />
    </div>
  );
}
