import { notFound } from 'next/navigation';
import { getCatalogProductBySlug, getCatalogProducts, getCategoryBySlug } from '@/lib/supabase/catalog';
import { mapCatalogToProduct } from '@/lib/adapters';
import { getProductBySlug as getStaticProduct, getRelatedProducts as getStaticRelated } from '@/data/products';
import { getCategoryBySlug as getStaticCategory } from '@/data/categories';
import ProductDetailClient from './ProductDetailClient';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const supaProduct = await getCatalogProductBySlug(slug);
  const product = supaProduct ? mapCatalogToProduct(supaProduct) : getStaticProduct(category, slug);
  if (!product) return { title: 'Sản phẩm không tồn tại' };
  return {
    title: `${product.name} | POLY Store`,
    description: product.description?.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { category: categorySlug, slug: productSlug } = await params;

  // Try Supabase first, fall back to static
  const [supaProduct, supaCategory] = await Promise.all([
    getCatalogProductBySlug(productSlug),
    getCategoryBySlug(categorySlug),
  ]);

  const product = supaProduct ? mapCatalogToProduct(supaProduct) : getStaticProduct(categorySlug, productSlug);
  const category = supaCategory
    ? { name: supaCategory.name, slug: supaCategory.slug }
    : getStaticCategory(categorySlug);

  if (!product || !category) return notFound();

  // Get related products
  let related: import('@/types/product').Product[] = [];
  if (supaProduct?.category_id) {
    const supaRelated = await getCatalogProducts({ categoryId: supaProduct.category_id, limit: 6 });
    related = supaRelated.filter(p => p.id !== supaProduct.id).map(mapCatalogToProduct);
  }
  if (!related.length) {
    related = getStaticRelated(product.id);
  }

  return (
    <ProductDetailClient
      product={product}
      categorySlug={categorySlug}
      categoryName={category.name}
      related={related}
    />
  );
}
