"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/format";
import { addToCart } from "@/lib/cart";
import type { Product, ProductVariant, ProductImage, Brand } from "@/lib/database.types";
import { getDisplayPrice, getCompareAtPrice, getDiscountPercent, isOnSale, CONDITION_LABELS } from "@/lib/products";
import FlashSaleCountdown from "@/components/FlashSaleCountdown";
import { X, ShoppingBag, Check, Minus, Plus, ChevronRight, CreditCard, ShieldCheck, Truck, RefreshCw } from "lucide-react";

interface Props {
  productId: string;
  open: boolean;
  onClose: () => void;
}

export default function QuickView({ productId, open, onClose }: Props) {
  const supabase = createClient();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [selVar, setSelVar] = useState(0);
  const [selColor, setSelColor] = useState(0);
  const [thumbs, setThumbs] = useState<SwiperType | null>(null);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (!open || !productId) return;
    setProduct(null); setVariants([]); setProductImages([]); setBrand(null);
    setSelVar(0); setSelColor(0); setQty(1); setAdded(false);

    let cancelled = false;
    (async () => {
      const { data: p } = await supabase.from("products").select("*").eq("id", productId).single();
      if (cancelled || !p) return;
      setProduct(p);
      const [vRes, imgRes] = await Promise.all([
        supabase.from("product_variants").select("*").eq("product_id", p.id).order("sort_order"),
        supabase.from("product_images").select("*").eq("product_id", p.id).order("sort_order"),
      ]);
      if (cancelled) return;
      if (vRes.data?.length) setVariants(vRes.data);
      if (imgRes.data?.length) setProductImages(imgRes.data);
      if (p.brand_id) {
        const { data: b } = await supabase.from("brands").select("*").eq("id", p.brand_id).maybeSingle();
        if (!cancelled && b) setBrand(b);
      }
    })();
    return () => { cancelled = true; };
  }, [productId, open, supabase]);

  const galleryImages = useMemo(() => {
    if (productImages.length === 0) return product?.thumbnail ? [product.thumbnail] : [];
    const colorName = product?.colors?.[selColor] || null;
    const colorSpecific = productImages.filter((img) => img.color === colorName);
    const general = productImages.filter((img) => img.color === null);
    const imgs = colorSpecific.length > 0 ? [...colorSpecific, ...general] : general.length > 0 ? general : productImages;
    return imgs.map((img) => img.url);
  }, [productImages, product?.colors, product?.thumbnail, selColor]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  const v = variants[selVar] || null;
  const displayBase = product ? getDisplayPrice(product) : 0;
  const compareBase = product ? getCompareAtPrice(product) : 0;
  const price = v?.price || displayBase;
  const oldPrice = v?.original_price || compareBase;
  const disc = oldPrice > price && oldPrice > 0
    ? (v ? Math.round(((oldPrice - price) / oldPrice) * 100) : (product ? getDiscountPercent(product) : 0))
    : 0;
  const onSale = product ? isOnSale(product) : false;
  const conditionLabel = product?.condition ? CONDITION_LABELS[product.condition] : null;

  function handleAdd(buyNow = false) {
    if (!product) return;
    addToCart({ product_id: product.id, title: product.title, variant: v?.name || null, color: product.colors?.[selColor] || null, price, quantity: qty, thumbnail: product.thumbnail });
    if (buyNow) { onClose(); window.location.href = "/thanh-toan"; } else { setAdded(true); setTimeout(() => setAdded(false), 2000); }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center transition-colors cursor-pointer">
          <X size={18} className="text-gray-500" />
        </button>

        {!product ? (
          <div className="py-20 text-center text-gray-400">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {/* ── Gallery ── */}
            <div className="md:col-span-2 p-4 border-r border-gray-100">
              {galleryImages.length > 0 ? (
                <>
                  <div className="relative group/qvgallery">
                    <Swiper
                      modules={[Navigation, Thumbs]}
                      thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
                      navigation={{ prevEl: ".qv-prev", nextEl: ".qv-next" }}
                      onSwiper={(s) => { setIsBeginning(s.isBeginning); setIsEnd(s.isEnd); }}
                      onSlideChange={(s) => { setIsBeginning(s.isBeginning); setIsEnd(s.isEnd); }}
                      spaceBetween={10}
                      className="aspect-square bg-white rounded-md overflow-hidden"
                    >
                      {galleryImages.map((img: string, i: number) => (
                        <SwiperSlide key={i}>
                          <Image src={img} alt={`${product.title} - ảnh ${i + 1}`} fill className="object-contain p-4" sizes="360px" />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <button className={`qv-prev absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-white/90 border border-gray-200 rounded-md shadow flex items-center justify-center transition-all ${isBeginning ? "opacity-30 cursor-not-allowed" : "opacity-0 group-hover/qvgallery:opacity-100 hover:bg-white cursor-pointer"}`}>
                      <ChevronRight size={14} className="text-gray-500 rotate-180" />
                    </button>
                    <button className={`qv-next absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-white/90 border border-gray-200 rounded-md shadow flex items-center justify-center transition-all ${isEnd ? "opacity-30 cursor-not-allowed" : "opacity-0 group-hover/qvgallery:opacity-100 hover:bg-white cursor-pointer"}`}>
                      <ChevronRight size={14} className="text-gray-500" />
                    </button>
                  </div>
                  <Swiper modules={[FreeMode, Thumbs]} onSwiper={setThumbs} spaceBetween={6} slidesPerView={5} freeMode watchSlidesProgress className="mt-2">
                    {galleryImages.map((img: string, i: number) => (
                      <SwiperSlide key={i} className="cursor-pointer">
                        <div className="aspect-square bg-gray-50 rounded border border-gray-200 overflow-hidden">
                          <img src={img} alt={`${product.title} - ảnh ${i + 1}`} className="w-full h-full object-contain p-0.5" />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </>
              ) : (
                <div className="aspect-square bg-gray-50 rounded-md flex items-center justify-center text-gray-300 text-sm">No Image</div>
              )}
            </div>

            {/* ── Info ── */}
            <div className="md:col-span-3 p-5 flex flex-col">
              {/* Title */}
              <h2 className="text-lg font-bold text-gray-900 leading-tight pr-8">
                {product.title}
              </h2>

              {/* Brand + Condition — synced with detail page */}
              {(brand || conditionLabel) && (
                <p className="mt-1 text-sm text-gray-400 flex items-center gap-1.5 flex-wrap">
                  {brand && (<>Thương hiệu: <span className="text-brand-600 font-medium">{brand.name}</span></>)}
                  {brand && conditionLabel && (<span className="text-gray-300">|</span>)}
                  {conditionLabel && (<>Tình trạng: <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">{conditionLabel}</span></>)}
                </p>
              )}

              {/* Flash Sale countdown */}
              {onSale && product.sale_ends_at && (
                <div className="mt-3">
                  <FlashSaleCountdown
                    salePrice={product.sale_price!}
                    originalPrice={product.price}
                    saleEndsAt={product.sale_ends_at}
                    saleStartsAt={product.sale_starts_at}
                  />
                </div>
              )}

              {/* Price bar — hidden when flash sale */}
              {!onSale && (
                <div className="group mt-3 overflow-hidden select-none flex items-center justify-between rounded-lg bg-brand-700 hover:bg-brand-900 pl-4 pr-2 py-2 transition-all duration-500 cursor-default w-[70%]">
                  <span className="text-xl font-bold text-white whitespace-nowrap">{formatPrice(price)}</span>
                  <div className="relative h-7 flex items-center">
                    {oldPrice > price && (
                      <span className="text-xs text-white/50 line-through whitespace-nowrap">{formatPrice(oldPrice)}</span>
                    )}
                    {disc > 0 && (
                      <span className="ml-1.5 text-[11px] font-bold text-white bg-brand-500 px-1.5 py-0.5 rounded">-{disc}%</span>
                    )}
                  </div>
                </div>
              )}

              {/* Variants */}
              {variants.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Dung lượng</p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((vr, i) => (
                      <button key={vr.id} onClick={() => setSelVar(i)}
                        className={`relative px-4 py-1.5 rounded-md text-sm font-medium border-2 transition-all cursor-pointer ${selVar === i ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                        {vr.name}
                        {selVar === i && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center">
                            <Check size={10} className="text-white" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Màu sắc</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c, i) => (
                      <button key={c} onClick={() => setSelColor(i)}
                        className={`relative px-4 py-1.5 rounded-md text-sm font-medium border-2 transition-all cursor-pointer ${selColor === i ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                        {c}
                        {selColor === i && (
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-500 rounded-full flex items-center justify-center">
                            <Check size={10} className="text-white" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Qty + CTA — 1 row desktop, 2 rows mobile */}
              <div className="mt-4 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-200 rounded-md shrink-0">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-2.5 py-2 hover:bg-gray-50 text-gray-500 cursor-pointer"><Minus size={14} /></button>
                    <span className="w-7 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="px-2.5 py-2 hover:bg-gray-50 text-gray-500 cursor-pointer"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => handleAdd(true)} disabled={product.status === "out_of_stock"}
                    className="flex-1 btn-primary py-2 text-[13px] font-bold uppercase cursor-pointer">
                    {product.status === "out_of_stock" ? "Hết hàng" : "Mua ngay"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex-1 sm:flex-none btn-outline py-2 px-4 text-[13px] font-bold uppercase flex items-center justify-center gap-1 cursor-pointer">
                    <CreditCard size={13} /> Trả góp
                  </button>
                  <button onClick={() => handleAdd(false)} disabled={product.status === "out_of_stock"}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-medium transition-colors rounded-md border cursor-pointer ${added ? "text-green-600 border-green-200 bg-green-50" : "text-gray-500 border-gray-200 hover:text-brand-600 hover:border-brand-300"}`}>
                    {added ? <><Check size={14} /> Đã thêm</> : <><ShoppingBag size={14} /> Thêm giỏ</>}
                  </button>
                </div>
              </div>

              {/* Mini badges */}
              <div className="mt-auto pt-4 border-t border-gray-100 mt-4 grid grid-cols-2 gap-3">
                {[
                  { icon: RefreshCw, text: `1 Đổi 1 trong ${product.warranty_months < 0 ? `${Math.abs(product.warranty_months)} ngày` : `${product.warranty_months || 12} tháng`}` },
                  ...(product.warranty_repair_months ? [{ icon: ShieldCheck, text: `BH sửa chữa ${product.warranty_repair_months} tháng` }] : []),
                  { icon: ShieldCheck, text: brand ? `Hàng chính hãng ${brand.name}` : "Hàng chính hãng" },
                  { icon: CreditCard, text: "Trả góp qua thẻ" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-md">
                    <b.icon size={16} className="text-brand-500 flex-shrink-0" />
                    <span className="text-xs text-gray-600 font-medium">{b.text}</span>
                  </div>
                ))}
              </div>

              {/* View full page */}
              <Link href={`/san-pham/${product.slug}`} onClick={onClose}
                className="mt-3 text-sm text-brand-500 font-medium hover:text-brand-600 transition-colors text-center">
                Xem chi tiết sản phẩm →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
