/** Reusable skeleton loading primitives */

export function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />;
}

export function SkeletonText({ lines = 1, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3 bg-gray-200 animate-pulse rounded ${i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"}`} />
      ))}
    </div>
  );
}

export function SkeletonProductCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Image */}
      <SkeletonBox className="aspect-square rounded-none" />
      <div className="p-3 space-y-2">
        {/* Condition badge */}
        <SkeletonBox className="h-4 w-16 rounded-full" />
        {/* Title 2 lines */}
        <div className="space-y-1.5">
          <SkeletonBox className="h-3.5 w-full" />
          <SkeletonBox className="h-3.5 w-3/4" />
        </div>
        {/* Price */}
        <div className="flex items-center gap-2 pt-1">
          <SkeletonBox className="h-5 w-24" />
          <SkeletonBox className="h-3.5 w-16" />
        </div>
        {/* Discount badge */}
        <SkeletonBox className="h-5 w-14 rounded-sm" />
        {/* Buy button */}
        <SkeletonBox className="h-9 w-full rounded-md mt-1" />
      </div>
    </div>
  );
}

export function SkeletonProductGrid({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-3">
      <SkeletonBox className="w-full h-[300px] lg:h-[400px] rounded-lg" />
    </div>
  );
}

export function SkeletonArticleCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <SkeletonBox className="aspect-[16/10] rounded-none" />
      <div className="p-4 space-y-2">
        <SkeletonText lines={2} />
        <SkeletonBox className="h-3 w-24" />
      </div>
    </div>
  );
}

export function SkeletonSidebar() {
  return (
    <div className="space-y-4">
      <SkeletonBox className="h-10 w-full rounded-t-lg" />
      <div className="space-y-2 px-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonBox key={i} className="h-8 w-full" />
        ))}
      </div>
      <div className="space-y-2 px-3 pt-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBox key={i} className="h-6 w-full" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonDetailHero() {
  return (
    <div className="bg-surface min-h-screen">
      {/* Breadcrumb */}
      <nav className="hidden sm:block max-w-[1200px] mx-auto px-4 pt-4 pb-2">
        <div className="flex items-center gap-1.5">
          <SkeletonBox className="h-3.5 w-16" />
          <span className="text-gray-200">/</span>
          <SkeletonBox className="h-3.5 w-14" />
          <span className="text-gray-200">/</span>
          <SkeletonBox className="h-3.5 w-12" />
          <span className="text-gray-200">/</span>
          <SkeletonBox className="h-3.5 w-40" />
        </div>
      </nav>

      {/* Product hero */}
      <section className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Gallery */}
          <div className="lg:col-span-2 border border-gray-200 rounded-lg bg-white overflow-hidden p-4">
            <SkeletonBox className="aspect-square w-full rounded-md" />
            <div className="flex gap-2 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonBox key={i} className="w-16 h-16 rounded-md" />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-3 border border-gray-200 rounded-lg bg-white p-5 space-y-4">
            {/* Title */}
            <div>
              <SkeletonBox className="h-7 w-full max-w-[400px] mb-2" />
              <SkeletonBox className="h-4 w-48" />
            </div>
            {/* Price bar */}
            <SkeletonBox className="h-12 w-[70%] rounded-lg" />
            {/* Color options */}
            <div>
              <SkeletonBox className="h-4 w-16 mb-2" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonBox key={i} className="h-10 w-20 rounded-md" />
                ))}
              </div>
            </div>
            {/* Variant options */}
            <div>
              <SkeletonBox className="h-4 w-20 mb-2" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonBox key={i} className="h-10 w-24 rounded-md" />
                ))}
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <SkeletonBox className="h-11 flex-1 rounded-lg" />
              <SkeletonBox className="h-11 w-40 rounded-md" />
            </div>
            {/* Service badges */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBox key={i} className="h-10 rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Description + Specs */}
      <section className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-5">
            <SkeletonBox className="h-5 w-40 mb-4" />
            <div className="space-y-3">
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-5/6" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-3/4" />
            </div>
          </div>
          {/* Specs sidebar */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg p-5">
            <SkeletonBox className="h-5 w-36 mb-4" />
            <div className="space-y-0 rounded-md border border-gray-200 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`px-3 py-3 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <SkeletonBox className="h-3 w-20 mb-1.5" />
                  <SkeletonBox className="h-4 w-32" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
