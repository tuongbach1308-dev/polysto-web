import HeroCarousel from '@/components/home/HeroCarousel';
import CategoryBanner from '@/components/home/CategoryBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import Testimonials from '@/components/home/Testimonials';
import BlogPreview from '@/components/home/BlogPreview';
import { getBanners } from '@/lib/supabase/banners';
import { getCategories, getCatalogProducts } from '@/lib/supabase/catalog';
import { getCustomerGallery } from '@/lib/supabase/homepage';
import { getPosts } from '@/lib/supabase/posts';
import { mapBanner, mapCatalogToProduct, mapSupaCategory, mapPostToBlogPost } from '@/lib/adapters';

const SECTION_CONFIG = {
  top: [
    { slug: 'ipad', title: 'IPAD TỐI ƯU CHO HỌC SINH SINH VIÊN', limit: 10 },
    { slug: 'macbook', title: 'MACBOOK - HIỆU NĂNG VƯỢT TRỘI', limit: 8 },
  ],
  bottom: [
    { slug: 'phu-kien-apple', title: 'PHỤ KIỆN APPLE CHÍNH HÃNG', limit: 8 },
    { slug: 'am-thanh', title: 'ÂM THANH - TRẢI NGHIỆM ĐỈNH CAO', limit: 6 },
  ],
};

export default async function Home() {
  // Fetch all homepage data in parallel
  const [supaBanners, supaCategories, allProducts, gallery, supaPosts] = await Promise.all([
    getBanners('hero'),
    getCategories(),
    getCatalogProducts(),
    getCustomerGallery(),
    getPosts({ limit: 6 }),
  ]);

  // Map Supabase data to component types
  const banners = supaBanners.length ? supaBanners.map(mapBanner) : undefined;
  const products = allProducts.map(mapCatalogToProduct);
  const categories = supaCategories.length
    ? supaCategories.map(c => mapSupaCategory(c, products))
    : undefined;
  const posts = supaPosts.length ? supaPosts.map(mapPostToBlogPost) : undefined;

  // Build product sections per category
  const buildSections = (config: typeof SECTION_CONFIG.top) =>
    config.map(({ slug, title, limit }) => {
      const catId = supaCategories.find(c => c.slug === slug)?.id;
      const sectionProducts = catId
        ? products.filter(p => p.category === slug).slice(0, limit)
        : [];
      return { slug, title, products: sectionProducts };
    });

  const topSections = products.length ? buildSections(SECTION_CONFIG.top) : undefined;
  const bottomSections = products.length ? buildSections(SECTION_CONFIG.bottom) : undefined;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        <HeroCarousel banners={banners} />
        <CategoryBanner categories={categories} />
        <CategoryGrid topSections={topSections} bottomSections={bottomSections} />
        <Testimonials gallery={gallery.length ? gallery : undefined} />
      </div>
      <BlogPreview posts={posts} />
    </>
  );
}
