import { SkeletonBox, SkeletonArticleCard } from "@/components/Skeleton";

export default function BlogLoading() {
  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5">
          <SkeletonBox className="h-3.5 w-16" />
          <span className="text-gray-200">/</span>
          <SkeletonBox className="h-3.5 w-14" />
          <span className="text-gray-200">/</span>
          <SkeletonBox className="h-3.5 w-20" />
        </div>

        {/* Title */}
        <SkeletonBox className="h-7 w-40" />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonArticleCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
