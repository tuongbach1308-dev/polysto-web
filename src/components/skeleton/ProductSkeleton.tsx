export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-3 space-y-2.5">
        <div className="h-3.5 skeleton w-full" />
        <div className="h-3.5 skeleton w-3/4" />
        <div className="flex gap-1.5 mt-1">
          <div className="h-5 w-12 skeleton rounded" />
          <div className="h-5 w-16 skeleton rounded" />
        </div>
        <div className="h-10 skeleton rounded-lg mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="h-4 skeleton w-64 mb-4" />
      <div className="grid grid-cols-1 lg:grid-cols-[4fr_5fr_3fr] gap-5 mt-4">
        <div className="aspect-square skeleton rounded-xl" />
        <div className="space-y-4">
          <div className="h-7 skeleton w-full" />
          <div className="h-5 skeleton w-48" />
          <div className="h-14 skeleton rounded-xl" />
          <div className="h-5 skeleton w-32" />
          <div className="flex gap-2">
            <div className="h-9 w-16 skeleton rounded-lg" />
            <div className="h-9 w-16 skeleton rounded-lg" />
            <div className="h-9 w-16 skeleton rounded-lg" />
          </div>
          <div className="h-5 skeleton w-24" />
          <div className="flex gap-2">
            <div className="h-9 w-20 skeleton rounded-lg" />
            <div className="h-9 w-20 skeleton rounded-lg" />
          </div>
          <div className="h-12 skeleton rounded-xl mt-4" />
        </div>
        <div className="space-y-4">
          <div className="h-48 skeleton rounded-xl" />
          <div className="h-64 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}
