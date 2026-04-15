import { SkeletonBox } from "@/components/Skeleton";

export default function AuthLoading() {
  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex items-center justify-center py-12">
          <div className="bg-white border border-gray-200 rounded-lg p-8 w-full max-w-md space-y-6">
            {/* Logo */}
            <div className="flex justify-center">
              <SkeletonBox className="h-12 w-32" />
            </div>
            {/* Tab switcher */}
            <div className="flex gap-2">
              <SkeletonBox className="h-10 flex-1 rounded-md" />
              <SkeletonBox className="h-10 flex-1 rounded-md" />
            </div>
            {/* Form fields */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <SkeletonBox className="h-3.5 w-24" />
                <SkeletonBox className="h-10 w-full rounded-md" />
              </div>
            ))}
            {/* Submit button */}
            <SkeletonBox className="h-11 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
