import ProductCarousel from './ProductCarousel';
import SupportHighlights from '@/components/ui/SupportHighlights';
import { getFeaturedProducts } from '@/data/products';

const topSections = [
  { slug: 'ipad', title: 'IPAD TỐI ƯU CHO HỌC SINH SINH VIÊN', limit: 10 },
  { slug: 'macbook', title: 'MACBOOK - HIỆU NĂNG VƯỢT TRỘI', limit: 8 },
];

const bottomSections = [
  { slug: 'phu-kien-apple', title: 'PHỤ KIỆN APPLE CHÍNH HÃNG', limit: 8 },
  { slug: 'am-thanh', title: 'ÂM THANH - TRẢI NGHIỆM ĐỈNH CAO', limit: 6 },
];

export default function CategoryGrid() {
  return (
    <div className="space-y-10">
      {topSections.map(({ slug, title, limit }) => {
        const products = getFeaturedProducts(slug, limit);
        if (products.length === 0) return null;
        return <ProductCarousel key={slug} title={title} products={products} viewAllHref={`/san-pham/${slug}`} />;
      })}

      <SupportHighlights />

      {bottomSections.map(({ slug, title, limit }) => {
        const products = getFeaturedProducts(slug, limit);
        if (products.length === 0) return null;
        return <ProductCarousel key={slug} title={title} products={products} viewAllHref={`/san-pham/${slug}`} />;
      })}
    </div>
  );
}
