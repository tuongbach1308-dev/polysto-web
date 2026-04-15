"use client";

import { usePathname } from "next/navigation";
import { SkeletonBox } from "@/components/Skeleton";

export default function BlogLoading() {
  const pathname = usePathname();
  const segments = pathname.replace(/^\/tin-tuc\/?/, "").split("/").filter(Boolean);

  const lastSegment = segments[segments.length - 1] || "";
  const hyphenCount = (lastSegment.match(/-/g) || []).length;
  const isDetail = segments.length > 0 && hyphenCount >= 3;

  if (isDetail) return <PostDetailSkeleton />;
  return <ListingSkeleton />;
}

/** Content-only listing skeleton — sidebar is in layout.tsx */
function ListingSkeleton() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <SkeletonBox className="h-3 w-14" />
        <SkeletonBox className="h-3 w-3" />
        <SkeletonBox className="h-3 w-12" />
      </div>

      {/* Hero featured */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <SkeletonBox className="lg:col-span-3 min-h-[260px] lg:min-h-[340px] rounded-xl" />
        <div className="lg:col-span-2 grid grid-cols-1 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <SkeletonBox className="w-[130px] aspect-[16/10] rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <SkeletonBox className="h-3.5 w-full" />
                <SkeletonBox className="h-3.5 w-3/4" />
                <SkeletonBox className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post grid */}
      <div>
        <SkeletonBox className="h-4 w-32 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <SkeletonBox className="aspect-[16/10] rounded-none" />
              <div className="p-4 space-y-2.5">
                <SkeletonBox className="h-4 w-full" />
                <SkeletonBox className="h-4 w-3/4" />
                <SkeletonBox className="h-3 w-1/3 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Content-only post detail skeleton — sidebar is in layout.tsx */
function PostDetailSkeleton() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-4">
        <SkeletonBox className="h-3 w-14" />
        <SkeletonBox className="h-3 w-3" />
        <SkeletonBox className="h-3 w-12" />
        <SkeletonBox className="h-3 w-3" />
        <SkeletonBox className="h-3 w-40" />
      </div>

      {/* Thumbnail */}
      <SkeletonBox className="w-full aspect-[2/1] rounded-xl" />

      {/* Article card */}
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-6 -mt-12 relative z-10 mx-4 space-y-4">
        <SkeletonBox className="h-5 w-16 rounded-md" />
        <SkeletonBox className="h-7 w-full" />
        <SkeletonBox className="h-7 w-3/4" />
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <SkeletonBox className="w-9 h-9 rounded-full" />
          <div className="space-y-1.5">
            <SkeletonBox className="h-3.5 w-24" />
            <SkeletonBox className="h-3 w-32" />
          </div>
        </div>
        <div className="space-y-3 pt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonBox key={i} className={`h-4 ${i % 3 === 2 ? "w-5/6" : "w-full"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
