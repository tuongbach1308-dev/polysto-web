"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { formatPrice, formatDate } from "@/lib/format";
import { addToCart } from "@/lib/cart";
import type { Product, ProductVariant, ProductImage, Post } from "@/lib/database.types";
import { ShoppingBag, Check, Minus, Plus, ChevronRight, ChevronDown, CreditCard, ShieldCheck, Truck, RefreshCw, Newspaper, Play, Heart, Home } from "lucide-react";
import ProductCarousel from "@/components/ProductCarousel";
import ServiceBadges from "@/components/ServiceBadges";
import { isLoggedIn, isInWishlist, toggleWishlist } from "@/lib/auth";
import { getDisplayPrice, getCompareAtPrice, getDiscountPercent, isOnSale } from "@/lib/products";
import { incrementProductView } from "@/lib/actions/view";
import FlashSaleCountdown from "@/components/FlashSaleCountdown";

export interface BreadcrumbLink { name: string; href: string }

interface Props {
  product: Product;
  variants: ProductVariant[];
  productImages?: ProductImage[];
  relatedProducts: Product[];
  relatedPosts: Post[];
  categoryChain?: BreadcrumbLink[];
  brandName?: string | null;
  conditionLabel?: string | null;
}

export default function ProductDetailClient({ product, variants, productImages = [], relatedProducts, relatedPosts, categoryChain = [], brandName, conditionLabel }: Props) {
  const [selVar, setSelVar] = useState(0);
  const [selColor, setSelColor] = useState(0);
  const [thumbs, setThumbs] = useState<SwiperType | null>(null);
  const [added, setAdded] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const specsColRef = useRef<HTMLDivElement>(null);
  const [specsColHeight, setSpecsColHeight] = useState(0);

  // Measure right column height to sync collapsed content height
  const measureSpecsCol = useCallback(() => {
    if (specsColRef.current) {
      setSpecsColHeight(specsColRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    measureSpecsCol();
    window.addEventListener("resize", measureSpecsCol);
    return () => window.removeEventListener("resize", measureSpecsCol);
  }, [measureSpecsCol]);
  const [qty, setQty] = useState(1);
  const [gallerySwiper, setGallerySwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [logged, setLogged] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const update = () => { isLoggedIn().then(setLogged); setWishlisted(isInWishlist(product.id)); };
    update();
    window.addEventListener("auth-updated", update);
    window.addEventListener("wishlist-updated", update);
    return () => { window.removeEventListener("auth-updated", update); window.removeEventListener("wishlist-updated", update); };
  }, [product.id]);

  // Fire-and-forget: record a view when this product detail mounts.
  useEffect(() => {
    incrementProductView(product.id).catch(() => {});
  }, [product.id]);

  // Gallery images: from product_images table, filtered by selected color
  const galleryImages: string[] = useMemo(() => {
    if (productImages.length === 0) {
      return product.thumbnail ? [product.thumbnail] : [];
    }
    const colorName = product.colors?.[selColor] || null;
    const colorSpecific = productImages.filter((img) => img.color === colorName);
    const general = productImages.filter((img) => img.color === null);
    const imgs = colorSpecific.length > 0 ? [...colorSpecific, ...general] : general.length > 0 ? general : productImages;
    return imgs.map((img) => img.url);
  }, [selColor, productImages, product.thumbnail, product.colors]);

  const v = variants[selVar] || null;
  const displayBase = getDisplayPrice(product);
  const price = v?.price || displayBase;
  const oldPrice = v?.original_price || getCompareAtPrice(product);
  const disc = oldPrice > price && oldPrice > 0
    ? (v ? Math.round(((oldPrice - price) / oldPrice) * 100) : getDiscountPercent(product))
    : 0;
  const clean = product.content?.replace(/<(giaban|giacu|mau|tuychon|thongso|thongtin)>[\s\S]*?<\/\1>/g, "") || "";
  const specEntries = Object.entries(product.specs || {});
  const previewSpecs = specEntries.slice(0, 5);

  const videoMatches = (product.content || "").match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/g);
  const videoIds = videoMatches ? [...new Set(videoMatches.map((m) => {
    const match = m.match(/([\w-]{11})$/);
    return match ? match[1] : null;
  }).filter(Boolean))] : [];

  function handleAdd(buyNow = false) {
    addToCart({ product_id: product.id, title: product.title, variant: v?.name || null, color: product.colors?.[selColor] || null, price, quantity: qty, thumbnail: product.thumbnail });
    if (buyNow) { window.location.href = "/thanh-toan"; } else { setAdded(true); setTimeout(() => setAdded(false), 2000); }
  }

  return (
    <div className="overflow-x-hidden">
      {/* ═══ Breadcrumb — hidden on mobile ═══ */}
      <nav className="hidden sm:block max-w-[1200px] mx-auto px-4 pt-4 pb-2">
        <ol className="flex items-center gap-1.5 text-[13px] overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <li className="flex-shrink-0"><Link href="/" className="text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1"><Home size={13} /> Trang chủ</Link></li>
          <li className="flex-shrink-0 text-gray-300">/</li>
          <li className="flex-shrink-0"><Link href="/san-pham" className="text-brand-600 hover:text-brand-700 transition-colors">Sản phẩm</Link></li>
          {categoryChain.map((c) => (
            <span key={c.href} className="contents">
              <li className="flex-shrink-0 text-gray-300">/</li>
              <li className="flex-shrink-0"><Link href={c.href} className="text-brand-600 hover:text-brand-700 transition-colors">{c.name}</Link></li>
            </span>
          ))}
          <li className="flex-shrink-0 text-gray-300">/</li>
          <li className="text-gray-500 truncate max-w-[350px]">{product.title}</li>
        </ol>
      </nav>

      {/* ═══ Product Hero ═══ */}
      <section className="max-w-[1200px] mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Gallery */}
          <div className="lg:col-span-2 border border-gray-200 rounded-lg bg-white overflow-hidden flex flex-col">
            {galleryImages.length > 0 ? (
              <div className="p-2 sm:p-4 flex flex-col flex-1">
                <div className="relative group/gallery flex-1">
                  <Swiper modules={[Navigation, Thumbs]} thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }} navigation={{ prevEl: ".gallery-prev", nextEl: ".gallery-next" }} onSwiper={(s) => { setGallerySwiper(s); setIsBeginning(s.isBeginning); setIsEnd(s.isEnd); }} onSlideChange={(s) => { setIsBeginning(s.isBeginning); setIsEnd(s.isEnd); }} spaceBetween={10} className="w-full aspect-square bg-white rounded-md overflow-hidden">
                    {galleryImages.map((img, i) => (<SwiperSlide key={i}><Image src={img} alt={product.title} fill className="object-contain p-3 sm:p-6" sizes="(max-width:1024px) 100vw, 50vw" /></SwiperSlide>))}
                  </Swiper>
                  <button className={`gallery-prev absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 border border-gray-200 rounded-md shadow flex items-center justify-center transition-all ${isBeginning ? "opacity-30 cursor-not-allowed" : "opacity-0 group-hover/gallery:opacity-100 hover:bg-white cursor-pointer"}`}><ChevronRight size={16} className="text-gray-500 rotate-180" /></button>
                  <button className={`gallery-next absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/90 border border-gray-200 rounded-md shadow flex items-center justify-center transition-all ${isEnd ? "opacity-30 cursor-not-allowed" : "opacity-0 group-hover/gallery:opacity-100 hover:bg-white cursor-pointer"}`}><ChevronRight size={16} className="text-gray-500" /></button>
                </div>
                <Swiper modules={[FreeMode, Thumbs]} onSwiper={setThumbs} spaceBetween={8} slidesPerView={5} freeMode watchSlidesProgress className="mt-3 w-full">
                  {galleryImages.map((img, i) => (<SwiperSlide key={i} className="cursor-pointer"><div className="aspect-square bg-gray-50 rounded-md border border-gray-200 overflow-hidden"><img src={img} alt={`${product.title} - ảnh ${i + 1}`} className="w-full h-full object-contain p-1" /></div></SwiperSlide>))}
                </Swiper>
              </div>
            ) : (<div className="aspect-square bg-gray-50 flex items-center justify-center text-gray-300">No Image</div>)}
          </div>

          {/* Info */}
          <div className="lg:col-span-3 border border-gray-200 rounded-lg p-4 sm:p-5 bg-white flex flex-col">
            <div className="flex items-start gap-2 sm:gap-3 lg:min-h-[64px]">
              <div className="flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight">{product.title}</h1>
                {(brandName || conditionLabel) && (
                  <p className="mt-1 text-sm text-gray-400 flex items-center gap-1.5 flex-wrap">
                    {brandName && (<>Thương hiệu: <span className="text-brand-600 font-medium">{brandName}</span></>)}
                    {brandName && conditionLabel && (<span className="text-gray-300">|</span>)}
                    {conditionLabel && (<>Tình trạng: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">{conditionLabel}</span></>)}
                  </p>
                )}
              </div>
              {logged && (<button onClick={() => toggleWishlist(product.id)} className={`flex-shrink-0 mt-1 w-9 h-9 rounded-full flex items-center justify-center border transition-all ${wishlisted ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200 hover:border-red-200 hover:bg-red-50"}`}><Heart size={18} className={wishlisted ? "text-red-500 fill-red-500" : "text-gray-400"} /></button>)}
            </div>

            {/* Flash Sale countdown */}
            {isOnSale(product) && product.sale_ends_at && (
              <div className="mt-3 sm:mt-4">
                <FlashSaleCountdown
                  salePrice={product.sale_price!}
                  originalPrice={product.price}
                  saleEndsAt={product.sale_ends_at}
                  saleStartsAt={product.sale_starts_at}
                />
              </div>
            )}

            {/* Price bar — hidden when flash sale is active (flash sale banner already shows price) */}
            {!isOnSale(product) && (
            <div className="group mt-3 sm:mt-4 overflow-hidden select-none flex items-center justify-between rounded-lg bg-brand-700 hover:bg-brand-900 pl-3 sm:pl-4 pr-2 py-2 sm:py-2.5 transition-all duration-500 cursor-default w-full sm:w-[70%]">
              <span className="text-xl sm:text-2xl font-bold text-white whitespace-nowrap">{formatPrice(price)}</span>
              <div className="relative h-8 flex items-center">
                {oldPrice > price && (<span className="text-sm text-white/50 line-through whitespace-nowrap">{formatPrice(oldPrice)}</span>)}
                {disc > 0 && (<span className="ml-2 text-xs font-bold text-white text-center bg-brand-500 px-2 py-1 rounded transition-all duration-500 group-hover:invisible">-{disc}%</span>)}
                {oldPrice > price && (<span className="hidden sm:flex absolute top-1/2 right-0 -translate-y-1/2 w-0 opacity-0 group-hover:w-48 group-hover:opacity-100 transition-all duration-500 bg-orange-500 text-white text-sm font-bold rounded-md px-3 py-1 items-center overflow-hidden"><span className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300 whitespace-nowrap">Tiết kiệm&nbsp;{formatPrice(oldPrice - price)}</span></span>)}
              </div>
            </div>
            )}

            {variants.length > 0 && (<div className="mt-5"><p className="text-sm font-medium text-gray-700 mb-2">Dung lượng</p><div className="flex flex-wrap gap-2">{variants.map((vr, i) => (<button key={vr.id} onClick={() => setSelVar(i)} className={`relative px-5 py-2 rounded-md text-sm font-medium border-2 transition-all ${selVar === i ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>{vr.name}{selVar === i && (<span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span>)}</button>))}</div></div>)}

            {product.colors?.length > 0 && (<div className="mt-4"><p className="text-sm font-medium text-gray-700 mb-2">Màu sắc</p><div className="flex flex-wrap gap-2">{product.colors.map((c, i) => (<button key={c} onClick={() => setSelColor(i)} className={`relative px-5 py-2 rounded-md text-sm font-medium border-2 transition-all ${selColor === i ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>{c}{selColor === i && (<span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center"><Check size={10} className="text-white" strokeWidth={3} /></span>)}</button>))}</div></div>)}

            {/* CTA — 1 row desktop, 2 rows mobile */}
            <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
              {/* Row 1 mobile / all desktop: Qty + Mua ngay */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-200 rounded-md shrink-0">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-2 sm:px-2.5 py-2 hover:bg-gray-50 text-gray-500 cursor-pointer"><Minus size={14} /></button>
                  <span className="w-7 text-center text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-2 sm:px-2.5 py-2 hover:bg-gray-50 text-gray-500 cursor-pointer"><Plus size={14} /></button>
                </div>
                <button onClick={() => handleAdd(true)} disabled={product.status === "out_of_stock"} className="flex-1 btn-primary py-2.5 text-[12px] sm:text-[13px] font-bold uppercase cursor-pointer">{product.status === "out_of_stock" ? "Hết hàng" : "Mua ngay"}</button>
              </div>
              {/* Row 2 mobile / continues on desktop: Trả góp + Thêm giỏ */}
              <div className="flex items-center gap-2">
                <button className="flex-1 sm:flex-none btn-outline py-2.5 px-4 text-[12px] sm:text-[13px] font-bold uppercase flex items-center justify-center gap-1 cursor-pointer"><CreditCard size={13} /> Trả góp</button>
                <button onClick={() => handleAdd(false)} disabled={product.status === "out_of_stock"} className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 text-[13px] font-medium transition-colors rounded-md border cursor-pointer ${added ? "text-green-600 border-green-200 bg-green-50" : "text-gray-500 border-gray-200 hover:text-brand-600 hover:border-brand-300"}`}>{added ? <><Check size={14} /> Đã thêm</> : <><ShoppingBag size={14} /> Thêm giỏ</>}</button>
              </div>
            </div>

            <div className="mt-auto border-t border-gray-200 pt-4 sm:pt-5 mt-4 sm:mt-5 grid grid-cols-2 gap-2 sm:gap-4">
              {[
                { icon: RefreshCw, text: `1 Đổi 1 trong ${product.warranty_months < 0 ? `${Math.abs(product.warranty_months)} ngày` : `${product.warranty_months || 12} tháng`}` },
                ...(product.warranty_repair_months ? [{ icon: ShieldCheck, text: `BH sửa chữa ${product.warranty_repair_months} tháng` }] : []),
                { icon: ShieldCheck, text: brandName ? `Hàng chính hãng ${brandName}` : "Hàng chính hãng" },
                { icon: CreditCard, text: "Trả góp qua thẻ" },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-md"><b.icon size={16} className="text-brand-500 flex-shrink-0 sm:w-5 sm:h-5" /><span className="text-xs sm:text-sm text-gray-700 font-medium">{b.text}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Description + Specs sidebar ═══ */}
      <section className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-4">Thông tin sản phẩm</h2>
              {clean ? (<><div className="relative"><div className={`post-body ${!expanded ? "overflow-hidden" : ""}`} style={!expanded ? { maxHeight: specsColHeight > 0 ? `${specsColHeight - 100}px` : "400px" } : undefined} dangerouslySetInnerHTML={{ __html: clean }} />{!expanded && (<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />)}</div><button onClick={() => setExpanded(!expanded)} className="mt-3 w-full py-2.5 text-sm text-brand-500 font-semibold hover:text-brand-600 transition-colors flex items-center justify-center gap-1 border border-brand-200 rounded-md hover:bg-brand-50">{expanded ? "Thu gọn" : "Xem thêm"} <ChevronDown size={14} className={expanded ? "rotate-180 transition-transform" : "transition-transform"} /></button></>) : (<p className="text-sm text-gray-400">Chưa có thông tin sản phẩm.</p>)}
            </div>
          </div>

          <div ref={specsColRef} className="lg:col-span-1 space-y-4">
            {specEntries.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-5 sticky space-y-5" style={{ top: "var(--sticky-offset)" }}>
                <div>
                  <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide mb-4">Thông số kỹ thuật</h2>
                  <div className="rounded-md border border-gray-200 overflow-hidden">{previewSpecs.map(([key, val], i) => (<div key={key} className={`text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} px-3 py-2.5`}><p className="text-gray-500 text-xs">{key}</p><p className="text-gray-800 font-medium mt-0.5">{val}</p></div>))}</div>
                  {specEntries.length > 5 && (<button onClick={() => setShowSpecs(true)} className="mt-3 w-full py-2.5 text-sm text-brand-500 font-semibold hover:text-brand-600 transition-colors flex items-center justify-center gap-1 border border-brand-200 rounded-md hover:bg-brand-50">Xem chi tiết <ChevronRight size={14} /></button>)}
                </div>
                {videoIds.length > 0 && (<div className="border-t border-gray-200 pt-5"><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2"><Play size={15} className="text-brand-500" /> Video sản phẩm</h3><div className="space-y-2">{videoIds.slice(0, 2).map((id) => (<div key={id} className="aspect-video rounded-md overflow-hidden bg-gray-100"><iframe src={`https://www.youtube.com/embed/${id}`} title="Video sản phẩm" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" /></div>))}</div></div>)}
                {relatedPosts.length > 0 && (<div className="border-t border-gray-200 pt-5"><h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2"><Newspaper size={15} className="text-brand-500" /> Bài viết liên quan</h3><div className="space-y-3">{relatedPosts.map((post) => (<Link key={post.id} href={`/tin-tuc/${post.slug}`} className="group flex gap-2.5"><div className="w-[60px] h-[44px] flex-shrink-0 rounded overflow-hidden bg-gray-100 relative">{post.thumbnail ? (<Image src={post.thumbnail} alt={post.title} fill className="object-cover" sizes="60px" />) : (<div className="w-full h-full bg-brand-700 flex items-center justify-center"><span className="text-white/30 text-[8px] font-black">POLY</span></div>)}</div><div className="flex-1 min-w-0"><h4 className="text-[12px] text-gray-700 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">{post.title}</h4><p className="text-[10px] text-gray-400 mt-0.5">{formatDate(post.created_at)}</p></div></Link>))}</div></div>)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Specs Modal */}
      {showSpecs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSpecs(false)} />
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-[640px] max-h-[85vh] flex flex-col animate-in overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-brand-700"><ShieldCheck size={20} className="text-white/80" /><h3 className="text-sm font-bold text-white uppercase tracking-wide flex-1">Thông số kỹ thuật — {product.title.split("|")[0].trim()}</h3><button onClick={() => setShowSpecs(false)} className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center transition-colors"><span className="text-white text-lg leading-none">&times;</span></button></div>
            <div className="overflow-y-auto flex-1"><table className="w-full"><tbody>{specEntries.map(([k, val], i) => (<tr key={k} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}><td className="px-5 py-3 text-sm text-gray-500 w-2/5 align-top border-r border-gray-100">{k}</td><td className="px-5 py-3 text-sm text-gray-800 font-medium w-3/5">{val}</td></tr>))}</tbody></table></div>
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between"><span className="text-xs text-gray-400">{specEntries.length} thông số</span><button onClick={() => setShowSpecs(false)} className="text-sm text-brand-500 font-semibold hover:text-brand-600 transition-colors">Đóng</button></div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (<section className="max-w-[1200px] mx-auto px-4 py-6"><ProductCarousel products={relatedProducts} title="Sản phẩm tương tự" /></section>)}

      {/* Service Badges */}
      <ServiceBadges />

      {/* ═══ Mobile sticky bottom CTA ═══ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] p-3 flex items-center gap-2 sm:hidden">
        <div className="min-w-0 flex-shrink-0">
          <span className="text-base font-bold text-brand-600 block leading-none">{formatPrice(price)}</span>
          {oldPrice > price && <span className="text-[10px] text-gray-400 line-through">{formatPrice(oldPrice)}</span>}
        </div>
        <button onClick={() => handleAdd(false)} disabled={product.status === "out_of_stock"}
          className={`p-2.5 rounded-md border flex-shrink-0 transition-colors ${added ? "text-green-600 border-green-200 bg-green-50" : "text-gray-500 border-gray-200"}`}>
          {added ? <Check size={18} /> : <ShoppingBag size={18} />}
        </button>
        <button onClick={() => handleAdd(true)} disabled={product.status === "out_of_stock"}
          className="flex-1 btn-primary py-2.5 text-sm font-bold uppercase">
          {product.status === "out_of_stock" ? "Hết hàng" : "Mua ngay"}
        </button>
      </div>
      {/* Spacer for sticky bottom bar on mobile */}
      <div className="h-16 sm:hidden" />
    </div>
  );
}
