'use client';

import { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { conditionLabels } from '@/types/product';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProductGrid from '@/components/product/ProductGrid';
import ProductSidebar, { PRICE_MIN, PRICE_MAX } from '@/components/product/ProductSidebar';
import ProductFilterBar, { type SortBy, type FilterChip } from '@/components/product/ProductFilterBar';
import Pagination from '@/components/product/Pagination';
import { ProductGridSkeleton } from '@/components/skeleton/ProductSkeleton';
import { getCategoryIcon } from '@/lib/category-icons';
import { cn, formatPrice } from '@/lib/utils';
import { X } from 'lucide-react';

const PER_PAGE = 12;

export default function AllProductsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><div className="h-8 skeleton w-48 mb-4" /><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({length:8},(_,i)=><div key={i} className="aspect-square skeleton rounded-xl"/>)}</div></div>}>
      <AllProductsContent />
    </Suspense>
  );
}

function AllProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('danh-muc');

  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [activeConditions, setActiveConditions] = useState<string[]>([]);
  const [activeStorage, setActiveStorage] = useState<string | null>(null);
  const [activeConnectivity, setActiveConnectivity] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeCategoryData = activeCategory ? categories.find((c) => c.slug === activeCategory) : null;

  // Reset model when category changes
  useEffect(() => { setActiveModel(null); }, [activeCategory]);

  useEffect(() => { setMounted(true); }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (activeCategory) result = result.filter((p) => p.category === activeCategory);
    if (activeModel) result = result.filter((p) => p.model === activeModel);
    if (priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX) {
      result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    }
    if (activeConditions.length > 0) result = result.filter((p) => activeConditions.includes(p.condition));
    if (activeStorage) {
      result = result.filter((p) => {
        const mem = p.specs['Bộ nhớ'] || p.specs['SSD'] || '';
        return mem.includes(activeStorage);
      });
    }
    if (activeConnectivity) {
      result = result.filter((p) => {
        const conn = p.specs['Kết nối'] || '';
        return conn.includes(activeConnectivity) || (activeConnectivity === 'WiFi' && conn === 'WiFi');
      });
    }
    if (inStockOnly) result = result.filter((p) => p.inStock);
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    return result;
  }, [activeCategory, activeModel, priceRange, activeConditions, activeStorage, activeConnectivity, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);
  const pagedProducts = filteredProducts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  useEffect(() => { setCurrentPage(1); }, [activeCategory, activeModel, priceRange, activeConditions, activeStorage, activeConnectivity, inStockOnly, sortBy]);

  const hasFilters = !!activeCategory || !!activeModel || priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX || activeConditions.length > 0 || !!activeStorage || !!activeConnectivity || inStockOnly;

  const clearAll = () => {
    setActiveCategory(null);
    setActiveModel(null);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    setActiveConditions([]);
    setActiveStorage(null);
    setActiveConnectivity(null);
    setInStockOnly(false);
    setSortBy('default');
  };

  const filterChips: FilterChip[] = [];
  if (activeCategory) {
    const cat = categories.find((c) => c.slug === activeCategory);
    filterChips.push({ label: cat?.name || activeCategory, onRemove: () => setActiveCategory(null) });
  }
  if (activeModel) filterChips.push({ label: activeModel, onRemove: () => setActiveModel(null) });
  if (priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX) {
    filterChips.push({ label: `${formatPrice(priceRange[0])} — ${formatPrice(priceRange[1])}`, onRemove: () => setPriceRange([PRICE_MIN, PRICE_MAX]) });
  }
  activeConditions.forEach((c) => filterChips.push({
    label: conditionLabels[c as keyof typeof conditionLabels] || c,
    onRemove: () => setActiveConditions((prev) => prev.filter((x) => x !== c)),
  }));
  if (activeStorage) filterChips.push({ label: activeStorage, onRemove: () => setActiveStorage(null) });
  if (activeConnectivity) filterChips.push({ label: activeConnectivity, onRemove: () => setActiveConnectivity(null) });
  if (inStockOnly) filterChips.push({ label: 'Còn hàng', onRemove: () => setInStockOnly(false) });

  const sidebar = (
    <ProductSidebar
      models={activeCategoryData?.models}
      activeModel={activeModel}
      onModelChange={setActiveModel}
      priceRange={priceRange}
      onPriceRangeChange={setPriceRange}
      activeConditions={activeConditions}
      onConditionsChange={setActiveConditions}
      activeStorage={activeStorage}
      onStorageChange={setActiveStorage}
      activeConnectivity={activeConnectivity}
      onConnectivityChange={setActiveConnectivity}
      inStockOnly={inStockOnly}
      onInStockChange={setInStockOnly}
      onResetAll={clearAll}
      hasFilters={hasFilters}
    />
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Breadcrumbs items={activeCategoryData ? [{ label: 'Sản phẩm', href: '/san-pham' }, { label: activeCategoryData.name }] : [{ label: 'Sản phẩm' }]} />
      <h1 className="text-2xl font-bold text-text-dark mb-4">{activeCategoryData?.name || 'Tất cả sản phẩm'}</h1>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4">
        <button onClick={() => setActiveCategory(null)} className={cn('shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors', !activeCategory ? 'bg-navy text-white border-navy' : 'border-border text-text-muted hover:border-navy/40')}>Tất cả</button>
        {categories.map((cat) => (
          <button key={cat.slug} onClick={() => setActiveCategory(cat.slug === activeCategory ? null : cat.slug)} className={cn('shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors', activeCategory === cat.slug ? 'bg-navy text-white border-navy' : 'border-border text-text-muted hover:border-navy/40')}>
            <span className="w-4 h-4 flex items-center justify-center">{getCategoryIcon(cat.slug, 14)}</span>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <div className="hidden lg:block">{sidebar}</div>
        <div>
          <ProductFilterBar totalCount={filteredProducts.length} sortBy={sortBy} onSortChange={setSortBy} filterChips={filterChips} onClearAll={clearAll} onMobileFilterOpen={() => setMobileFilterOpen(true)} />
          {!mounted ? <ProductGridSkeleton count={PER_PAGE} /> : (
            <>
              <ProductGrid products={pagedProducts} />
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilterOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-white z-10">
              <span className="font-semibold text-text-dark">Bộ lọc</span>
              <button onClick={() => setMobileFilterOpen(false)} className="w-8 h-8 rounded-full bg-bg-gray flex items-center justify-center"><X className="h-4 w-4 text-text-muted" /></button>
            </div>
            <div className="p-4">{sidebar}</div>
            <div className="p-4 border-t border-border sticky bottom-0 bg-white flex gap-3">
              <button onClick={() => { clearAll(); setMobileFilterOpen(false); }} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium text-text-muted">Xóa bộ lọc</button>
              <button onClick={() => setMobileFilterOpen(false)} className="flex-1 py-2.5 bg-navy text-white rounded-lg text-sm font-bold">Xem {filteredProducts.length} SP</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
