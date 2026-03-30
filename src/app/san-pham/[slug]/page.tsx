import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCatalogProductBySlug, getCatalogProducts } from '@/lib/supabase/catalog'
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
  const product = await getCatalogProductBySlug(params.slug)
  if (!product) return {}
  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.short_description || '',
    openGraph: { images: product.thumbnail ? [{ url: product.thumbnail }] : [] },
  }
}

export default async function CatalogDetailPage({ params }: { params: { slug: string } }) {
  const product = await getCatalogProductBySlug(params.slug)
  if (!product) notFound()

  const settings = await getWebSettings()
  const baseUrl = settings.site_url || ''
  const category = product.category as any

  // Related products
  const related = category
    ? await getCatalogProducts({ categoryId: category.id, limit: 10 })
    : []
  const relatedFiltered = related.filter(p => p.id !== product.id).slice(0, 10)

  return (
    <>
      <ProductSchema product={product} baseUrl={baseUrl} />
      <BreadcrumbSchema items={[
        { name: 'Trang chủ', url: baseUrl },
        { name: 'Sản phẩm', url: `${baseUrl}/san-pham` },
        ...(category ? [{ name: category.name, url: `${baseUrl}/danh-muc/${category.slug}` }] : []),
        { name: product.name, url: `${baseUrl}/san-pham/${product.slug}` },
      ]} />

      <Breadcrumb items={[
        { label: 'Sản phẩm', href: '/san-pham' },
        ...(category ? [{ label: category.name, href: `/danh-muc/${category.slug}` }] : []),
        { label: product.name },
      ]} />

      <div className="container">
        {/* 3-column layout */}
        <div className="product-detail-row">
          {/* Gallery — 40% */}
          <div className="pd-col-gallery">
            <ProductGallery images={product.images || []} name={product.name} />
          </div>

          {/* Info — 35% */}
          <div className="pd-col-info">
            <ProductInfo
              product={product}
              variant="catalog"
              phone={settings.phone || settings.header_phone}
            />
          </div>

          {/* Sidebar — 25% */}
          <div className="pd-col-sidebar">
            <ProductSidebar
              conditionNote={product.condition_note}
              phone={settings.phone || settings.header_phone}
            />
          </div>
        </div>

        {/* Description (collapsible) */}
        <div style={{ marginTop: 30 }}>
          <ProductContent content={product.description || ''} />
        </div>

        {/* Related products */}
        <ProductRelated products={relatedFiltered} variant="catalog" />
      </div>
    </>
  )
}
