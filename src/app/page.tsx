import Image from 'next/image'
import Link from 'next/link'
import { getBanners } from '@/lib/supabase/banners'
import { getCatalogProducts } from '@/lib/supabase/catalog'
import { getShopProducts } from '@/lib/supabase/shop'
import { getPosts } from '@/lib/supabase/posts'
import { getSettings } from '@/lib/supabase/settings'
import { formatVND } from '@/lib/utils'

export const revalidate = 60 // ISR: revalidate every 60s

export default async function HomePage() {
  const [banners, featuredCatalog, featuredShop, latestPosts, settings] = await Promise.all([
    getBanners('hero'),
    getCatalogProducts({ featured: true, limit: 8 }),
    getShopProducts({ featured: true, limit: 8 }),
    getPosts({ limit: 4 }),
    getSettings(),
  ])

  return (
    <div>
      {/* Hero Banner */}
      {banners.length > 0 && (
        <section className="relative">
          <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
            <Image
              src={banners[0].image_url}
              alt={banners[0].title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
              <div className="container-page">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">{banners[0].title}</h1>
                {banners[0].subtitle && <p className="text-lg text-white/80 mb-6 max-w-lg">{banners[0].subtitle}</p>}
                {banners[0].link_url && (
                  <Link href={banners[0].link_url} className="btn-primary">
                    {banners[0].link_text || 'Xem ngay'}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Catalog */}
      {featuredCatalog.length > 0 && (
        <section className="container-page py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Sản phẩm nổi bật</h2>
            <Link href="/san-pham" className="text-primary-600 font-medium text-sm hover:underline">Xem tất cả →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredCatalog.map(product => (
              <Link key={product.id} href={`/san-pham/${product.slug}`} className="card group hover:shadow-lg transition-shadow">
                <div className="aspect-square relative overflow-hidden">
                  {product.thumbnail ? (
                    <Image src={product.thumbnail} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 text-4xl">📱</div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h3>
                  <p className="text-sm text-primary-600 font-bold mt-1">{formatVND(product.price_min)}đ - {formatVND(product.price_max)}đ</p>
                  {product.condition_note && <p className="text-xs text-slate-400 mt-0.5">{product.condition_note}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newseal Shop */}
      {featuredShop.length > 0 && (
        <section className="bg-slate-50 py-12">
          <div className="container-page">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Hàng Newseal</h2>
              <Link href="/shop" className="text-primary-600 font-medium text-sm hover:underline">Xem tất cả →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredShop.map(product => (
                <Link key={product.id} href={`/shop/${product.slug}`} className="card group hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative overflow-hidden">
                    {product.thumbnail ? (
                      <Image src={product.thumbnail} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 text-4xl">🏷️</div>
                    )}
                    {product.sale_price && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                        -{Math.round((1 - product.sale_price / product.price) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-primary-600 font-bold">{formatVND(product.sale_price || product.price)}đ</span>
                      {product.sale_price && <span className="text-xs text-slate-400 line-through">{formatVND(product.price)}đ</span>}
                    </div>
                    {product.stock <= 0 && <p className="text-xs text-red-500 mt-0.5">Hết hàng</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Warranty Banner */}
      <section className="container-page py-12">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Tra cứu bảo hành</h2>
            <p className="text-white/80">Nhập số seri hoặc số điện thoại để kiểm tra thông tin bảo hành sản phẩm.</p>
          </div>
          <Link href="/bao-hanh" className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors shrink-0">
            Tra cứu ngay
          </Link>
        </div>
      </section>

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <section className="container-page pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Bài viết mới</h2>
            <Link href="/bai-viet" className="text-primary-600 font-medium text-sm hover:underline">Xem tất cả →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestPosts.map(post => (
              <Link key={post.id} href={`/bai-viet/${post.slug}`} className="card group hover:shadow-lg transition-shadow">
                {post.cover_image && (
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 line-clamp-2 mb-1">{post.title}</h3>
                  {post.excerpt && <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="bg-slate-50 py-12">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">Tại sao chọn POLY Store?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Uy tín', desc: 'Hoạt động nhiều năm tại Bình Thạnh, được hàng nghìn khách hàng tin tưởng.', icon: '🏆' },
              { title: 'Chất lượng', desc: 'Kiểm tra kỹ càng, test máy 21 bước, cam kết đúng mô tả.', icon: '✅' },
              { title: 'Bảo hành', desc: 'Chế độ bảo hành rõ ràng, hỗ trợ nhanh chóng, tra cứu online.', icon: '🛡️' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-xl p-6 text-center">
                <span className="text-4xl mb-3 block">{item.icon}</span>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
