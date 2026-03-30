import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getShopProducts } from '@/lib/supabase/shop'
import { formatVND } from '@/lib/utils'

export const metadata: Metadata = { title: 'Hàng Newseal' }
export const revalidate = 60

export default async function ShopPage() {
  const products = await getShopProducts()

  return (
    <div className="container-page py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Hàng Newseal</h1>
      <p className="text-slate-500 mb-8">Sản phẩm mới nguyên seal, chính hãng — mua online, giao hàng toàn quốc.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <Link key={product.id} href={`/shop/${product.slug}`} className="card group hover:shadow-lg transition-shadow">
            <div className="aspect-square relative overflow-hidden">
              {product.thumbnail ? (
                <Image src={product.thumbnail} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width:768px) 50vw, 25vw" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl">🏷️</div>
              )}
              {product.sale_price && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                  -{Math.round((1 - product.sale_price / product.price) * 100)}%
                </span>
              )}
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white font-bold">Hết hàng</span></div>
              )}
            </div>
            <div className="p-3">
              <h2 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-primary-600 font-bold">{formatVND(product.sale_price || product.price)}đ</span>
                {product.sale_price && <span className="text-xs text-slate-400 line-through">{formatVND(product.price)}đ</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && <p className="text-center text-slate-400 py-16">Chưa có sản phẩm nào.</p>}
    </div>
  )
}
