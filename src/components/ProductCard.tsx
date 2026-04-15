"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/database.types";
import { ShoppingCart, Heart, Zap } from "lucide-react";
import QuickView from "@/components/QuickView";
import { isLoggedIn, isInWishlist, toggleWishlist } from "@/lib/auth";
import { getConditionBadge, getDisplayPrice, getCompareAtPrice, getDiscountPercent, isOnSale } from "@/lib/products";

function getCategoryTags(title: string): { name: string; slug: string }[] {
  const tags: { name: string; slug: string }[] = [];
  const t = title.toLowerCase();
  if (t.includes("ipad pro")) { tags.push({ name: "iPad", slug: "ipad" }, { name: "iPad Pro", slug: "ipad-pro" }); }
  else if (t.includes("ipad air")) { tags.push({ name: "iPad", slug: "ipad" }, { name: "iPad Air", slug: "ipad-air" }); }
  else if (t.includes("ipad mini")) { tags.push({ name: "iPad", slug: "ipad" }, { name: "iPad Mini", slug: "ipad-mini" }); }
  else if (t.includes("ipad")) { tags.push({ name: "iPad", slug: "ipad" }); }
  else if (t.includes("macbook air")) { tags.push({ name: "MacBook", slug: "macbook" }, { name: "MacBook Air", slug: "macbook-air" }); }
  else if (t.includes("macbook pro")) { tags.push({ name: "MacBook", slug: "macbook" }, { name: "MacBook Pro", slug: "macbook-pro" }); }
  else if (t.includes("macbook")) { tags.push({ name: "MacBook", slug: "macbook" }); }
  else if (t.includes("airpods pro")) { tags.push({ name: "Âm thanh", slug: "am-thanh" }, { name: "AirPods Pro", slug: "airpods-pro" }); }
  else if (t.includes("airpods max")) { tags.push({ name: "Âm thanh", slug: "am-thanh" }, { name: "AirPods Max", slug: "airpods-max" }); }
  else if (t.includes("airpods")) { tags.push({ name: "Âm thanh", slug: "am-thanh" }, { name: "AirPods", slug: "airpods" }); }
  else if (t.includes("pencil")) { tags.push({ name: "Phụ kiện", slug: "phu-kien" }, { name: "Apple Pencil", slug: "apple-pencil" }); }
  else if (t.includes("keyboard") || t.includes("bàn phím")) { tags.push({ name: "Phụ kiện", slug: "phu-kien" }, { name: "Bàn phím", slug: "ban-phim-chuot" }); }
  return tags.slice(0, 2);
}

interface CardProps {
  product: Product;
  categoryTags?: { name: string; slug: string }[];
}

export default function ProductCard({ product, categoryTags: propTags }: CardProps) {
  const [quickView, setQuickView] = useState(false);
  const [logged, setLogged] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const update = () => { isLoggedIn().then(setLogged); setWishlisted(isInWishlist(product.id)); };
    update();
    window.addEventListener("auth-updated", update);
    window.addEventListener("wishlist-updated", update);
    return () => { window.removeEventListener("auth-updated", update); window.removeEventListener("wishlist-updated", update); };
  }, [product.id]);

  const displayPrice = getDisplayPrice(product);
  const comparePrice = getCompareAtPrice(product);
  const discount = getDiscountPercent(product);
  const badge = getConditionBadge(product);
  const categoryTags = propTags || getCategoryTags(product.title);
  const onSale = isOnSale(product);

  // Mini countdown for flash sale cards
  const [countdown, setCountdown] = useState("");
  useEffect(() => {
    if (!onSale || !product.sale_ends_at) return;
    function calc() {
      const diff = new Date(product.sale_ends_at!).getTime() - Date.now();
      if (diff <= 0) { setCountdown(""); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const pad = (n: number) => String(n).padStart(2, "0");
      setCountdown(d > 0 ? `${d}N ${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(h)}:${pad(m)}:${pad(s)}`);
    }
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [onSale, product.sale_ends_at]);

  return (
    <>
      <Link
        href={`/san-pham/${product.slug}`}
        className={`product-card group flex flex-col h-full ${
          onSale ? "ring-1 ring-red-300" : ""
        }`}
      >
        {/* ── Image — fixed aspect ── */}
        <div className="relative aspect-square bg-white flex-shrink-0">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300 text-xs">No Image</div>
          )}

          {/* Flash Sale badge — top left */}
          {onSale ? (
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between bg-gradient-to-r from-red-600 to-orange-500 px-2 py-1">
              <div className="flex items-center gap-1">
                <Zap size={10} className="text-yellow-300 fill-yellow-300" />
                <span className="text-white text-[9px] font-bold uppercase">Sale</span>
                <span className="bg-yellow-400 text-red-700 text-[9px] font-bold px-1 rounded">-{discount}%</span>
              </div>
              {countdown && (
                <span className="text-white/90 text-[9px] font-bold tabular-nums">{countdown}</span>
              )}
            </div>
          ) : discount > 0 ? (
            <span className="absolute top-2 left-2 bg-brand-500 text-white text-[11px] font-bold px-2 py-0.5 rounded leading-none">
              -{discount}%
            </span>
          ) : null}

          {/* Condition badge — top right (offset down if flash sale ribbon) */}
          {badge && (
            <span className={`absolute ${onSale ? "top-8" : "top-2"} right-2 bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded leading-none`}>
              {badge}
            </span>
          )}

          {/* Out of stock */}
          {product.status === "out_of_stock" && (
            <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
              <span className="bg-gray-700 text-white text-xs font-semibold px-4 py-2 rounded">Hết Hàng</span>
            </div>
          )}

          {/* Wishlist */}
          {logged && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
              className="absolute bottom-2 right-2 z-10 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
            >
              <Heart size={14} className={wishlisted ? "text-red-500 fill-red-500" : "text-gray-400"} />
            </button>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex flex-col flex-1 px-3 pt-2 pb-3">
          {/* Warranty */}
          <div className="h-[18px] flex items-center">
            <span className="text-[10px] text-brand-600 font-medium">BH {product.warranty_months < 0 ? `${Math.abs(product.warranty_months)} ngày` : `${product.warranty_months || 12} tháng`} 1 đổi 1</span>
          </div>

          {/* Title */}
          <h3 className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-[1.35] h-[36px] group-hover:text-brand-600 transition-colors">
            {product.title}
          </h3>

          {/* Category tags */}
          <div className="flex gap-1.5 mt-1.5 h-[22px] items-center overflow-hidden">
            {categoryTags.length > 0 ? (
              categoryTags.map((tag) => (
                <span
                  key={tag.slug}
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/san-pham?category=${tag.slug}`; }}
                  className="text-[10px] text-gray-500 border border-gray-300 px-2 py-0.5 rounded leading-tight hover:text-brand-600 hover:border-brand-300 transition-colors cursor-pointer"
                >
                  {tag.name}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-transparent">—</span>
            )}
          </div>

          <div className="flex-1" />

          {/* ── Price bar ── */}
          {onSale ? (
            /* Flash sale price — red themed */
            <div
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickView(true); }}
              className="bg-red-50 group-hover:bg-red-600 rounded px-3 py-2 flex items-center justify-between gap-2 mt-2 transition-colors duration-200 cursor-pointer border border-red-200 group-hover:border-red-600"
            >
              <div className="min-w-0">
                <span className="text-[14px] font-bold text-red-600 group-hover:text-white leading-none block truncate transition-colors duration-200">
                  {formatPrice(displayPrice)}
                </span>
                <span className="block h-[14px] text-[10px] leading-tight mt-0.5">
                  <span className="text-gray-400 group-hover:text-white/50 line-through transition-colors duration-200">
                    {formatPrice(comparePrice)}
                  </span>
                  <span className="text-red-500 group-hover:text-yellow-300 font-bold ml-1 transition-colors duration-200">
                    -{discount}%
                  </span>
                </span>
              </div>
              <div className="w-7 h-7 bg-red-600 group-hover:bg-white/20 rounded flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                <ShoppingCart size={14} className="text-white" />
              </div>
            </div>
          ) : (
            /* Normal price */
            <div
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickView(true); }}
              className="bg-gray-100 group-hover:bg-brand-700 rounded px-3 py-2 flex items-center justify-between gap-2 mt-2 transition-colors duration-200 cursor-pointer"
            >
              <div className="min-w-0">
                <span className="text-[14px] font-bold text-brand-600 group-hover:text-white leading-none block truncate transition-colors duration-200">
                  {formatPrice(displayPrice)}
                </span>
                <span className="block h-[14px] text-[10px] leading-tight mt-0.5">
                  {comparePrice > displayPrice ? (
                    <span className="text-gray-400 group-hover:text-white/50 line-through transition-colors duration-200">
                      {formatPrice(comparePrice)}
                    </span>
                  ) : (
                    <span className="text-transparent">.</span>
                  )}
                </span>
              </div>
              <div className="w-7 h-7 bg-brand-600 group-hover:bg-white/20 rounded flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                <ShoppingCart size={14} className="text-white" />
              </div>
            </div>
          )}
        </div>
      </Link>

      <QuickView productId={product.id} open={quickView} onClose={() => setQuickView(false)} />
    </>
  );
}
