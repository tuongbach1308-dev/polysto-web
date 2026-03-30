import { getBanners } from '@/lib/supabase/banners'
import { getCatalogProducts, getCategoriesHierarchical } from '@/lib/supabase/catalog'
import { getShopProducts } from '@/lib/supabase/shop'
import { getPosts } from '@/lib/supabase/posts'
import { getSettings } from '@/lib/supabase/settings'
import {
  getHomepageSections,
  getFeatures,
  getCustomerGallery,
} from '@/lib/supabase/homepage'

import { HeroSlider } from '@/components/home/HeroSlider'
import { SubBanners } from '@/components/home/SubBanners'
import { CategoryStrip } from '@/components/home/CategoryStrip'
import { CategorySection } from '@/components/home/CategorySection'
import { ShopSection } from '@/components/home/ShopSection'
import { FeaturesStrip } from '@/components/home/FeaturesStrip'
import { BlogSection } from '@/components/home/BlogSection'
import { CustomerGallery } from '@/components/home/CustomerGallery'

export const revalidate = 60

export default async function HomePage() {
  const [
    settings,
    sections,
    heroBanners,
    subBanners,
    categories,
    features,
    shopProducts,
    latestPosts,
    gallery,
  ] = await Promise.all([
    getSettings(),
    getHomepageSections(),
    getBanners('hero'),
    getBanners('sub_banner'),
    getCategoriesHierarchical(),
    getFeatures(),
    getShopProducts({ featured: true, limit: 10 }),
    getPosts({ limit: 8 }),
    getCustomerGallery(),
  ])

  // Pre-fetch products for each category_products section
  const categorySections = sections.filter(s => s.section_type === 'category_products')
  const categoryProductsMap: Record<string, Awaited<ReturnType<typeof getCatalogProducts>>> = {}

  await Promise.all(
    categorySections.map(async (sec) => {
      const catId = sec.config.category_id || sec.category_id
      if (catId) {
        categoryProductsMap[catId] = await getCatalogProducts({
          categoryId: catId,
          limit: sec.config.items_count || 10,
        })
      }
    })
  )

  // Homepage categories for the strip (show_on_homepage)
  const homepageCategories = categories.filter((c: any) => c.show_on_homepage !== false)

  return (
    <div className="homepage">
      {/* Render sections in DB order */}
      {sections.map((section) => {
        switch (section.section_type) {
          case 'hero_banner':
            return (
              <div key={section.id} className="poly-container mt-[12px] md:mt-[15px]">
                <HeroSlider banners={heroBanners} settings={settings} />
              </div>
            )

          case 'sub_banners':
            return <SubBanners key={section.id} banners={subBanners} />

          case 'category_strip':
            return <CategoryStrip key={section.id} categories={homepageCategories} />

          case 'features':
            return <FeaturesStrip key={section.id} features={features} />

          case 'category_products': {
            const catId = section.config.category_id || section.category_id
            if (!catId) return null
            const cat = categories.find((c: any) => c.id === catId)
            if (!cat) return null
            const products = categoryProductsMap[catId] || []
            return (
              <CategorySection
                key={section.id}
                category={cat}
                products={products}
                showSubTabs={section.config.show_sub_tabs !== false}
                showViewAll={section.config.show_view_all !== false}
                layout={section.config.layout || 'grid-4'}
                itemsCount={section.config.items_count || 10}
              />
            )
          }

          case 'blog_posts':
            return <BlogSection key={section.id} posts={latestPosts} title={section.title || undefined} />

          case 'customer_gallery':
            return <CustomerGallery key={section.id} items={gallery} title={section.title || undefined} />

          case 'custom_html':
            if (!section.config.custom_html) return null
            return (
              <section key={section.id} className="py-[15px]">
                <div className="poly-container" dangerouslySetInnerHTML={{ __html: section.config.custom_html }} />
              </section>
            )

          default:
            return null
        }
      })}

      {/* Fallback: if no sections configured, show default layout */}
      {sections.length === 0 && (
        <>
          <div className="poly-container mt-[12px] md:mt-[15px]">
            <HeroSlider banners={heroBanners} settings={settings} />
          </div>
          <SubBanners banners={subBanners} />
          <CategoryStrip categories={homepageCategories} />
          <FeaturesStrip features={features} />
          {shopProducts.length > 0 && <ShopSection products={shopProducts} />}
          <BlogSection posts={latestPosts} />
          <CustomerGallery items={gallery} />
        </>
      )}
    </div>
  )
}
