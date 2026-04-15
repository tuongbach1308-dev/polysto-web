"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { SkeletonProductGrid } from "@/components/Skeleton";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/database.types";
import { Grid3X3, List, ChevronLeft, ChevronRight, Package } from "lucide-react";

interface Props {
  products: Product[];
  totalCount: number;
  currentPage: number;
  perPage: number;
  basePath: string;
  currentSort?: string;
  searchParams: Record<string, string | undefined>;
  categoryIds?: string[];
}

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá tăng dần", value: "price-asc" },
  { label: "Giá giảm dần", value: "price-desc" },
];

export default function ProductGrid({ products: initialProducts, totalCount: initialTotal, currentPage: initialPage, perPage, basePath, currentSort: initialSort, searchParams, categoryIds }: Props) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [currentSort, setCurrentSort] = useState(initialSort);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(totalCount / perPage);

  function buildUrl(overrides: Record<string, string | null>) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) { if (v) params.set(k, v); }
    for (const [k, v] of Object.entries(overrides)) { if (v) params.set(k, v); else params.delete(k); }
    const qs = params.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  }

  /** Fetch products client-side and update state */
  const fetchProducts = useCallback(async (page: number, sort?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryIds && categoryIds.length > 0) params.set("categoryIds", categoryIds.join(","));
      if (searchParams.price) params.set("price", searchParams.price);
      if (searchParams.q) params.set("q", searchParams.q);
      if (searchParams.condition) params.set("condition", searchParams.condition);
      params.set("page", String(page));
      params.set("limit", String(perPage));
      const s = sort || currentSort;
      if (s && s !== "newest") params.set("sort", s);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      setProducts(data.products || []);
      setTotalCount(data.total || 0);
      setCurrentPage(page);
      if (sort !== undefined) setCurrentSort(sort);

      // Update URL without triggering navigation
      const urlOverrides: Record<string, string | null> = {
        page: page === 1 ? null : String(page),
      };
      if (sort !== undefined) {
        urlOverrides.sort = sort === "newest" ? null : sort;
      }
      const newUrl = buildUrl(urlOverrides);
      window.history.pushState(null, "", newUrl);
    } catch {
      // On error, fall back to page navigation
    } finally {
      setLoading(false);
    }
  }, [categoryIds, searchParams, perPage, currentSort, basePath]);

  function handlePageClick(e: React.MouseEvent, page: number) {
    e.preventDefault();
    if (page === currentPage || loading) return;
    // Scroll FIRST, then show skeleton + fetch
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    fetchProducts(page);
  }

  function handleSortChange(sort: string) {
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    fetchProducts(1, sort);
  }

  return (
    <div ref={gridRef} style={{ scrollMarginTop: "var(--sticky-offset)" }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-800">{totalCount}</span> sản phẩm
        </p>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={currentSort || "newest"}
            onChange={(e) => handleSortChange(e.target.value)}
            className="text-sm border border-gray-200 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:border-brand-500"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* View toggle */}
          <div className="hidden lg:flex items-center border border-gray-200 rounded-md overflow-hidden">
            <button onClick={() => setViewMode("grid")}
              className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-brand-600 text-white" : "text-gray-400 hover:text-gray-600"}`}>
              <Grid3X3 size={16} />
            </button>
            <button onClick={() => setViewMode("list")}
              className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-brand-600 text-white" : "text-gray-400 hover:text-gray-600"}`}>
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Products or Skeleton */}
      {loading ? (
        <SkeletonProductGrid count={perPage} />
      ) : products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg py-16 text-center">
          <Package className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-sm text-gray-500 mb-4">Không tìm thấy sản phẩm phù hợp.</p>
          <Link href="/san-pham" className="btn-primary text-sm px-6 py-2.5">Xem tất cả sản phẩm</Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        /* List view */
        <div className="space-y-3">
          {products.map((p) => (
            <Link key={p.id} href={`/san-pham/${p.slug}`} className="flex gap-4 bg-white border border-gray-200 rounded-lg p-4 hover:border-brand-300 hover:shadow-sm transition-all group">
              <div className="w-[120px] h-[120px] bg-gray-50 rounded-md overflow-hidden flex-shrink-0">
                {p.thumbnail ? (
                  <img src={p.thumbnail} alt={p.title} className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-brand-600 transition-colors">{p.title}</h3>
                {p.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>}
                <div className="mt-auto pt-2 flex items-baseline gap-2">
                  <span className="text-base font-bold text-brand-600">{formatPrice(p.price)}</span>
                  {p.original_price > p.price && (
                    <span className="text-xs text-gray-400 line-through">{formatPrice(p.original_price)}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination — renders as <a> for SEO, intercepts click for client-side fetch */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8">
          {currentPage > 1 && (
            <a href={buildUrl({ page: String(currentPage - 1) })} onClick={(e) => handlePageClick(e, currentPage - 1)} className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors">
              <ChevronLeft size={16} />
            </a>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
            .reduce<(number | "...")[]>((acc, p, i, arr) => {
              if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span key={`dot-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">...</span>
              ) : (
                <a key={p} href={buildUrl({ page: p === 1 ? null : String(p) })} onClick={(e) => handlePageClick(e, p as number)}
                  className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${p === currentPage ? "bg-brand-600 text-white" : "border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600"}`}>
                  {p}
                </a>
              )
            )}
          {currentPage < totalPages && (
            <a href={buildUrl({ page: String(currentPage + 1) })} onClick={(e) => handlePageClick(e, currentPage + 1)} className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors">
              <ChevronRight size={16} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
