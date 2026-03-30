import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getCatalogProducts, getCategories } from '@/lib/supabase/catalog'
import { formatVND } from '@/lib/utils'
import { BreadcrumbSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = { title: 'Sản phẩm' }
export const revalidate = 60

export default async function CatalogPage() {
  const [products, categories] = await Promise.all([getCatalogProducts(), getCategories()])

  return (
    <div className="container-page py-8">
      <BreadcrumbSchema items={[{ name: 'Trang chủ', url: '/' }, { name: 'Sản phẩm', url: '/san-pham' }]} />

      <h1 className="text-3xl font-bold text-slate-800 mb-2">Sản phẩm</h1>
      <p className="text-slate-500 mb-8">Danh sách sản phẩm đã qua sử dụng tại POLY Store. Giá tùy tình trạng máy — liên hệ cửa hàng để xem hàng trực tiếp.</p>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
          <Link href="/san-pham" className="px-4 py-2 rounded-full bg-primary-600 text-white text-sm font-medium shrink-0">Tất cả</Link>
          {categories.map(cat => (
            <Link key={cat.id} href={`/danh-muc/${cat.slug}`} className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 text-sm font-medium hover:border-primary-300 hover:text-primary-600 transition-colors shrink-0">
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <Link key={product.id} href={`/san-pham/${product.slug}`} className="card group hover:shadow-lg transition-shadow">
            <div className="aspect-square relative overflow-hidden">
              {product.thumbnail ? (
                <Image src={product.thumbnail} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width:768px) 50vw, 25vw" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 text-4xl">📱</div>
              )}
            </div>
            <div className="p-3">
              <h2 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h2>
              {product.brand && <p className="text-xs text-slate-400">{product.brand}</p>}
              <p className="text-sm text-primary-600 font-bold mt-1">{formatVND(product.price_min)}đ - {formatVND(product.price_max)}đ</p>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && <p className="text-center text-slate-400 py-16">Chưa có sản phẩm nào.</p>}
    </div>
  )
}
