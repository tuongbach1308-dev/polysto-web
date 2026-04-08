import { Suspense } from 'react';
import { getCategories, getCatalogProducts } from '@/lib/supabase/catalog';
import { mapCatalogToProduct, mapSupaCategory } from '@/lib/adapters';
import { products as staticProducts } from '@/data/products';
import { categories as staticCategories } from '@/data/categories';
import AllProductsContent from './AllProductsContent';

export default async function AllProductsPage() {
  const [supaCategories, supaProducts] = await Promise.all([
    getCategories(),
    getCatalogProducts(),
  ]);

  const products = supaProducts.length ? supaProducts.map(mapCatalogToProduct) : staticProducts;
  const categories = supaCategories.length
    ? supaCategories.map(c => mapSupaCategory(c, products))
    : staticCategories;

  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><div className="h-8 skeleton w-48 mb-4" /><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({length:8},(_,i)=><div key={i} className="aspect-square skeleton rounded-xl"/>)}</div></div>}>
      <AllProductsContent products={products} categories={categories} />
    </Suspense>
  );
}
