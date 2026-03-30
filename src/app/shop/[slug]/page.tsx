import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getShopProductBySlug } from '@/lib/supabase/shop'
import { getShopProducts } from '@/lib/supabase/shop'
import { getWebSettings } from '@/lib/supabase/settings'
import { ProductSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductInfo } from '@/components/product/ProductInfo'
import { ProductSidebar } from '@/components/product/ProductSidebar'
import { ProductContent } from '@/components/product/ProductContent'
import { ProductRelated } from '@/components/product/ProductRelated'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getShopProductBySlug(params.slug)
  if (!product) return {}
  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.short_description || '',
    openGraph: { images: product.thumbnail ? [{ url: product.thumbnail }] : [] },
  }
}

export default async function ShopDetailPage({ params }: { params: { slug: string } }) {
  const product = await getShopProductBySlug(params.slug)
  if (!product) notFound()

  const settings = await getWebSettings()
  const baseUrl = settings.site_url || ''
  const category = product.category as any

  // Related products
  const related = await getShopProducts({ featured: true, limit: 10 })
  const relatedFiltered = related.filter(p => p.id !== product.id).slice(0, 10)

  return (
    <>
      <ProductSchema product={product} baseUrl={baseUrl} />
      <BreadcrumbSchema items={[
        { name: 'Trang chủ', url: baseUrl },
        { name: 'Hàng Newseal', url: `${baseUrl}/shop` },
        { name: product.name, url: `${baseUrl}/shop/${product.slug}` },
      ]} />

      <Breadcrumb items={[
        { label: 'Hàng Newseal', href: '/shop' },
        ...(category ? [{ label: category.name, href: `/danh-muc/${category.slug}` }] : []),
        { label: product.name },
      ]} />

      <div className="container">
        {/* 3-column layout */}
        <div className="product-detail-row">
          <div className="pd-col-gallery">
            <ProductGallery images={product.images || []} name={product.name} />
          </div>

          <div className="pd-col-info">
            <ProductInfo
              product={product}
              variant="shop"
              phone={settings.phone || settings.header_phone}
            />
          </div>

          <div className="pd-col-sidebar">
            <ProductSidebar
              conditionNote={product.short_description}
              phone={settings.phone || settings.header_phone}
            />
          </div>
        </div>

        <div style={{ marginTop: 30 }}>
          <ProductContent content={product.description || ''} />
        </div>

        <ProductRelated products={relatedFiltered} variant="shop" />
      </div>
    </>
  )
}
