import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getShopProductBySlug } from '@/lib/supabase/shop'
import { getSettings } from '@/lib/supabase/settings'
import { formatVND } from '@/lib/utils'
import { ProductSchema, BreadcrumbSchema } from '@/components/seo/JsonLd'
import { AddToCartButton } from './AddToCartButton'

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

  const settings = await getSettings()
  const baseUrl = settings.site_url || ''
  const specs = Object.entries(product.specs || {})
  const finalPrice = product.sale_price || product.price

  return (
    <div className="container-page py-8">
      <ProductSchema product={product} baseUrl={baseUrl} />
      <BreadcrumbSchema items={[
        { name: 'Trang chủ', url: baseUrl },
        { name: 'Newseal', url: `${baseUrl}/shop` },
        { name: product.name, url: `${baseUrl}/shop/${product.slug}` },
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
            <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-6xl">🏷️</div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">{product.name}</h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-primary-600">{formatVND(finalPrice)}đ</span>
            {product.sale_price && <span className="text-lg text-slate-400 line-through">{formatVND(product.price)}đ</span>}
            {product.sale_price && (
              <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded-md">
                -{Math.round((1 - product.sale_price / product.price) * 100)}%
              </span>
            )}
          </div>

          {product.short_description && <p className="text-slate-600 mb-4">{product.short_description}</p>}

          <div className="mb-6">
            <p className="text-sm text-slate-500">
              Tình trạng: {product.stock > 0 ? <span className="text-emerald-600 font-semibold">Còn hàng ({product.stock})</span> : <span className="text-red-500 font-semibold">Hết hàng</span>}
            </p>
            {product.sku && <p className="text-sm text-slate-400 mt-1">SKU: {product.sku}</p>}
          </div>

          <AddToCartButton product={{ id: product.id, name: product.name, price: finalPrice, image: product.thumbnail }} disabled={product.stock <= 0} />

          {specs.length > 0 && (
            <div className="mt-8">
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

      {product.description && (
        <div className="mt-8 prose-content" dangerouslySetInnerHTML={{ __html: product.description }} />
      )}
    </div>
  )
}
