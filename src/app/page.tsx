import HeroCarousel from '@/components/home/HeroCarousel';
import CategoryBanner from '@/components/home/CategoryBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import Testimonials from '@/components/home/Testimonials';
import BlogPreview from '@/components/home/BlogPreview';
export default function Home() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        <HeroCarousel />
        <CategoryBanner />
        <CategoryGrid />
        <Testimonials />
      </div>
      <BlogPreview />
    </>
  );
}
