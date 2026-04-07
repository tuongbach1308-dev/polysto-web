import type { Product } from '@/types/product';
import ProductCard from './ProductCard';
import { PackageSearch } from 'lucide-react';

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <PackageSearch className="h-12 w-12 text-text-muted/30 mx-auto" />
        <p className="mt-3 text-sm font-medium text-text-dark">Không tìm thấy sản phẩm nào</p>
        <p className="mt-1 text-xs text-text-muted">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
