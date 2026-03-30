import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCatalogProductBySlug, getCatalogProducts } from '@/lib/supabase/catalog'
import { getSettings } from '@/lib/supabase/settings'
import { formatVND } from '@/lib/utils'
import { ProductSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getCatalogProductBySlug(params.slug)
  if (!product) return {}
  return {
    title: product.meta_title || product.name,
    description: product.meta_description || product.short_description || '',
    openGraph: {
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
    },
  }
}

export default async function CatalogDetailPage({ params }: { params: { slug: string } }) {
  const product = await getCatalogProductBySlug(params.slug)
  if (!product) notFound()

  const settings = await getSettings()
  const baseUrl = settings.site_url || ''
  const specs = Object.entries(product.specs || {})
  const category = product.category as any

  return (
    <div className="container-page py-8">
      <ProductSchema product={product} baseUrl={baseUrl} />
      <BreadcrumbSchema items={[
        { name: 'Trang chủ', url: baseUrl },
        { name: 'Sản phẩm', url: `${baseUrl}/san-pham` },
        ...(category ? [{ name: category.name, url: `${baseUrl}/danh-muc/${category.slug}` }] : []),
        { name: product.name, url: `${baseUrl}/san-pham/${product.slug}` },
      ]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          {product.images?.length > 0 ? (
            <div className="space-y-3">
              <div className="aspect-square relative rounded-xl overflow-hidden bg-slate-100">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" priority sizes="(max-width:768px) 100vw, 50vw" />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((img, i) => (
                    <div key={i} className="aspect-square relative rounded-lg overflow-hidden bg-slate-100">
                      <Image src={img} alt="" fill className="object-cover" sizes="25vw" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-slate-300 text-6xl">📱</div>
          )}
        </div>

        {/* Info */}
        <div>
          {category && (
            <Link href={`/danh-muc/${category.slug}`} className="text-sm text-primary-600 hover:underline">{category.name}</Link>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1 mb-4">{product.name}</h1>

          <div className="bg-primary-50 rounded-xl p-4 mb-6">
            <p className="text-2xl font-bold text-primary-600">{formatVND(product.price_min)}đ - {formatVND(product.price_max)}đ</p>
            {product.condition_note && <p className="text-sm text-slate-500 mt-1">{product.condition_note}</p>}
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="font-semibold text-slate-800 mb-2">Liên hệ xem hàng</p>
            <p className="text-sm text-slate-500 mb-3">Sản phẩm đã qua sử dụng — vui lòng đến cửa hàng để xem trực tiếp và chọn máy phù hợp.</p>
            <a href={`tel:${settings.phone || ''}`} className="btn-primary w-full text-center">
              Gọi ngay: {settings.phone || 'POLY Store'}
            </a>
          </div>

          {product.short_description && (
            <p className="text-slate-600 mb-4">{product.short_description}</p>
          )}

          {specs.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-slate-800 mb-3">Thông số kỹ thuật</h3>
              <div className="border rounded-lg overflow-hidden">
                {specs.map(([key, val], i) => (
                  <div key={key} className={`flex items-center text-sm ${i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                    <span className="w-1/3 px-4 py-2.5 font-medium text-slate-600 border-r border-slate-100">{key}</span>
                    <span className="flex-1 px-4 py-2.5 text-slate-800">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-8 prose-content" dangerouslySetInnerHTML={{ __html: product.description }} />
      )}
    </div>
  )
}
