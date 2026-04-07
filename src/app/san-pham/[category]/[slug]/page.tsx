'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/data/products';
import { getCategoryBySlug } from '@/data/categories';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ProductImages from '@/components/product/ProductImages';
import ProductInfo from '@/components/product/ProductInfo';
import ProductDetailSidebar from '@/components/product/ProductDetailSidebar';
import ProductCard from '@/components/product/ProductCard';
import { ProductDetailSkeleton } from '@/components/skeleton/ProductSkeleton';

export default function ProductDetailPage() {
  const [descExpanded, setDescExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const params = useParams();
  const categorySlug = params.category as string;
  const productSlug = params.slug as string;

  const category = getCategoryBySlug(categorySlug);
  const product = getProductBySlug(categorySlug, productSlug);

  if (!product || !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Sản phẩm không tồn tại</h1>
        <p className="mt-2 text-text-muted">Vui lòng kiểm tra lại đường dẫn.</p>
      </div>
    );
  }

  useEffect(() => { setMounted(true); }, []);

  const related = getRelatedProducts(product.id);

  if (!mounted) return <ProductDetailSkeleton />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <Breadcrumbs
        items={[
          { label: 'Sản phẩm', href: '/san-pham' },
          { label: category.name, href: `/san-pham/${categorySlug}` },
          { label: product.name },
        ]}
      />

      {/* Top section - 3 columns: Images | Info | Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[4fr_5fr_3fr] gap-5 mt-4">
        <div className="self-start lg:sticky lg:top-24">
          <ProductImages productName={product.name} category={product.category} />
        </div>
        <ProductInfo product={product} />
        <ProductDetailSidebar />
      </div>

      {/* Bottom section - Description + Specs side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mt-10">
        {/* Left - Product description — collapsible card */}
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold text-text-dark uppercase mb-4">Thông tin sản phẩm</h2>
            <div className={`prose prose-sm max-w-none text-text-muted overflow-hidden transition-all duration-500 ${
              descExpanded ? 'max-h-[2000px]' : 'max-h-[120px]'
            }`}>
              <h3 className="text-base font-bold text-text-dark">{product.name}</h3>
              <p>{product.description}</p>
              <p>
                <strong>Hiệu năng đột phá:</strong> {product.name} được trang bị chip {product.specs['Chip'] || 'Apple'} mạnh mẽ,
                mang lại hiệu suất vượt trội cho mọi tác vụ từ học tập, làm việc đến giải trí.
              </p>
              <p>
                <strong>Màn hình sắc nét:</strong> Trang bị màn hình {product.specs['Màn hình'] || 'Retina'} cho
                độ sáng cao, màu sắc chân thực và trải nghiệm hình ảnh tuyệt vời.
              </p>
              <p>
                <strong>Thiết kế mỏng nhẹ:</strong> Với thiết kế kim loại nguyên khối, {product.name} vừa sang trọng vừa bền bỉ,
                dễ dàng mang theo mọi nơi.
              </p>
              <p>
                Tại POLY Store, sản phẩm được đảm bảo chất lượng, giá cạnh tranh và chính sách hỗ trợ rõ ràng.
              </p>
            </div>
            {!descExpanded && (
              <div className="relative h-10 -mt-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </div>
          <button
            onClick={() => setDescExpanded(!descExpanded)}
            className="w-full py-3 border-t border-border text-sm font-semibold text-navy hover:bg-bg-gray transition-colors flex items-center justify-center gap-1.5"
          >
            {descExpanded ? 'Thu gọn' : 'Xem thêm thông tin'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform duration-300 ${descExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Right - Specs table — sticky within its grid area */}
        <section>
          <h2 className="text-lg font-bold text-text-dark uppercase mb-4">Thông số kỹ thuật</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                {Object.entries(product.specs).map(([key, value], i) => (
                  <tr key={key} className={i % 2 === 0 ? 'bg-white' : 'bg-bg-gray/50'}>
                    <td className="px-4 py-2.5 text-sm text-text-muted w-2/5 border-b border-border">{key}</td>
                    <td className="px-4 py-2.5 text-sm text-text-dark font-medium border-b border-border">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Related products — bottom, above footer */}
      {related.length > 0 && (
        <section className="mt-10 mb-4">
          <h2 className="text-lg font-bold text-text-dark uppercase mb-4">Thường được mua cùng</h2>
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
              {related.map((p) => (
                <div key={p.id} className="w-[calc((100%-64px)/5)] min-w-[calc((100%-64px)/5)] max-lg:w-[calc((100%-48px)/4)] max-lg:min-w-[calc((100%-48px)/4)] max-md:w-[calc((100%-32px)/3)] max-md:min-w-[calc((100%-32px)/3)] max-sm:w-[calc((100%-16px)/2)] max-sm:min-w-[calc((100%-16px)/2)] shrink-0">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
