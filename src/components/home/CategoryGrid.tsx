import ProductCarousel from './ProductCarousel';
import SupportHighlights from '@/components/ui/SupportHighlights';
import { getFeaturedProducts } from '@/data/products';
import type { Product } from '@/types/product';

interface SectionData {
  slug: string;
  title: string;
  products: Product[];
}

const defaultTopSections = [
  { slug: 'ipad', title: 'IPAD TỐI ƯU CHO HỌC SINH SINH VIÊN', limit: 10 },
  { slug: 'macbook', title: 'MACBOOK - HIỆU NĂNG VƯỢT TRỘI', limit: 8 },
];

const defaultBottomSections = [
  { slug: 'phu-kien-apple', title: 'PHỤ KIỆN APPLE CHÍNH HÃNG', limit: 8 },
  { slug: 'am-thanh', title: 'ÂM THANH - TRẢI NGHIỆM ĐỈNH CAO', limit: 6 },
];

interface Props {
  topSections?: SectionData[];
  bottomSections?: SectionData[];
}

export default function CategoryGrid({ topSections: propTop, bottomSections: propBottom }: Props) {
  const topSecs = propTop?.length ? propTop : defaultTopSections.map(({ slug, title, limit }) => ({
    slug, title, products: getFeaturedProducts(slug, limit),
  }));
  const bottomSecs = propBottom?.length ? propBottom : defaultBottomSections.map(({ slug, title, limit }) => ({
    slug, title, products: getFeaturedProducts(slug, limit),
  }));

  return (
    <div className="space-y-10">
      {topSecs.map(({ slug, title, products }) => {
        if (products.length === 0) return null;
        return <ProductCarousel key={slug} title={title} products={products} viewAllHref={`/san-pham/${slug}`} />;
      })}

      <SupportHighlights />

      {bottomSecs.map(({ slug, title, products }) => {
        if (products.length === 0) return null;
        return <ProductCarousel key={slug} title={title} products={products} viewAllHref={`/san-pham/${slug}`} />;
      })}
    </div>
  );
}
