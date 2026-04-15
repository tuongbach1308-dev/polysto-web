import { SkeletonBox } from "@/components/Skeleton";

export default function ContactLoading() {
  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Title */}
        <SkeletonBox className="h-8 w-40 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Info cards left */}
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 flex items-start gap-4">
                <SkeletonBox className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <SkeletonBox className="h-5 w-32" />
                  <SkeletonBox className="h-4 w-full" />
                  <SkeletonBox className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>

          {/* Contact form right */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
            <SkeletonBox className="h-6 w-48 mb-2" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <SkeletonBox className="h-3.5 w-24" />
                <SkeletonBox className={`${i === 3 ? "h-24" : "h-10"} w-full rounded-md`} />
              </div>
            ))}
            <SkeletonBox className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
