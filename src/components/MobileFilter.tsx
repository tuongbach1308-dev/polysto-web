"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { X, SlidersHorizontal, Check, ChevronDown, ChevronRight, Tablet, Laptop, Headphones, Cable, Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
}

interface Props {
  categories: Category[];
  activeCategoryId: string | null;
  currentPath: string;
  currentPrice?: string;
  currentCondition?: string;
  filterCount: number;
}

const PRICE_RANGES = [
  { label: "Dưới 5 triệu", value: "0-5000000" },
  { label: "5 - 10 triệu", value: "5000000-10000000" },
  { label: "10 - 20 triệu", value: "10000000-20000000" },
  { label: "20 - 50 triệu", value: "20000000-50000000" },
  { label: "Trên 50 triệu", value: "50000000-999999999" },
];

const CONDITIONS = [
  { label: "Nguyên Seal", value: "seal", color: "bg-green-500" },
  { label: "Open Box", value: "openbox", color: "bg-blue-500" },
  { label: "New Nobox", value: "new_nobox", color: "bg-orange-500" },
  { label: "Like New", value: "likenew", color: "bg-purple-500" },
  { label: "Cũ", value: "old", color: "bg-gray-500" },
];

const CATEGORY_ICONS: Record<string, typeof Tablet> = {
  ipad: Tablet, macbook: Laptop, "am-thanh": Headphones, "phu-kien": Cable,
};

export default function MobileFilter({ categories, activeCategoryId, currentPath, currentPrice, currentCondition, filterCount }: Props) {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"category" | "price" | "condition">("category");

  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const roots = categories.filter((c) => c.parent_id === null).sort((a, b) => a.sort_order - b.sort_order);
  const activeConditions = (currentCondition || "").split(",").filter(Boolean);

  function getChildren(parentId: string) {
    return categories.filter((c) => c.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order);
  }

  function buildCategoryPath(catId: string): string {
    const parts: string[] = [];
    let current = categories.find((c) => c.id === catId);
    while (current) { parts.unshift(current.slug); current = current.parent_id ? categories.find((c) => c.id === current!.parent_id) : undefined; }
    return `/san-pham/${parts.join("/")}`;
  }

  function buildFilterUrl(overrides: { price?: string | null; condition?: string | null }) {
    const params = new URLSearchParams();
    const price = overrides.price !== undefined ? overrides.price : currentPrice;
    const condition = overrides.condition !== undefined ? overrides.condition : currentCondition;
    if (price) params.set("price", price);
    if (condition) params.set("condition", condition);
    const qs = params.toString();
    return `${currentPath}${qs ? `?${qs}` : ""}`;
  }

  const hasFilters = !!currentPrice || !!currentCondition;

  return (
    <>
      {/* Trigger button */}
      <button onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 active:bg-gray-50 transition-colors">
        <SlidersHorizontal size={15} className="text-brand-500" />
        Bộ lọc
        {filterCount > 0 && (
          <span className="bg-brand-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{filterCount}</span>
        )}
      </button>

      {/* Bottom sheet */}
      {open && createPortal(
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] flex flex-col animate-slideUp">
            {/* Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Bộ lọc sản phẩm</h3>
              <div className="flex items-center gap-3">
                {hasFilters && (
                  <Link href={currentPath} onClick={() => setOpen(false)} className="text-xs text-red-500 font-medium">
                    Xóa lọc
                  </Link>
                )}
                <button onClick={() => setOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Section tabs */}
            <div className="flex border-b border-gray-100">
              {[
                { key: "category" as const, label: "Danh mục" },
                { key: "price" as const, label: "Khoảng giá" },
                { key: "condition" as const, label: "Tình trạng" },
              ].map((tab) => (
                <button key={tab.key} onClick={() => setActiveSection(tab.key)}
                  className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeSection === tab.key ? "border-brand-500 text-brand-600" : "border-transparent text-gray-400"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">

              {/* ── Danh mục ── */}
              {activeSection === "category" && (
                <div className="space-y-1">
                  <Link href="/san-pham" onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${!activeCategoryId ? "bg-brand-50 text-brand-600 font-semibold" : "text-gray-700 active:bg-gray-50"}`}>
                    <Tag size={18} className={!activeCategoryId ? "text-brand-500" : "text-gray-400"} />
                    <span className="flex-1">Tất cả sản phẩm</span>
                    {!activeCategoryId && <Check size={16} className="text-brand-500" />}
                  </Link>

                  {roots.map((root) => {
                    const children = getChildren(root.id);
                    const isActive = activeCategoryId === root.id;
                    const hasActiveChild = children.some((c) => c.id === activeCategoryId || getChildren(c.id).some((gc) => gc.id === activeCategoryId));
                    const Icon = CATEGORY_ICONS[root.slug] || Tag;

                    return (
                      <div key={root.id}>
                        <Link href={buildCategoryPath(root.id)} onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive ? "bg-brand-50 text-brand-600 font-semibold" : hasActiveChild ? "text-brand-600" : "text-gray-700 active:bg-gray-50"}`}>
                          <Icon size={18} className={isActive || hasActiveChild ? "text-brand-500" : "text-gray-400"} />
                          <span className="flex-1">{root.name}</span>
                          {isActive && <Check size={16} className="text-brand-500" />}
                          {children.length > 0 && !isActive && <ChevronRight size={16} className="text-gray-300" />}
                        </Link>

                        {(isActive || hasActiveChild) && children.length > 0 && (
                          <div className="ml-6 pl-3 border-l-2 border-brand-100 space-y-0.5 my-1">
                            {children.map((child) => {
                              const isChildActive = activeCategoryId === child.id;
                              return (
                                <Link key={child.id} href={buildCategoryPath(child.id)} onClick={() => setOpen(false)}
                                  className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${isChildActive ? "bg-brand-50 text-brand-600 font-semibold" : "text-gray-500 active:bg-gray-50"}`}>
                                  {child.name}
                                  {isChildActive && <Check size={14} className="text-brand-500" />}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── Khoảng giá ── */}
              {activeSection === "price" && (
                <div className="space-y-2">
                  {PRICE_RANGES.map((r) => {
                    const isActive = currentPrice === r.value;
                    return (
                      <Link key={r.value} href={buildFilterUrl({ price: isActive ? null : r.value })} onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${isActive ? "border-brand-500 bg-brand-50" : "border-gray-100 active:border-gray-200"}`}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? "border-brand-500 bg-brand-500" : "border-gray-300"}`}>
                          {isActive && <Check size={12} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className={`text-sm ${isActive ? "text-brand-600 font-semibold" : "text-gray-700"}`}>{r.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* ── Tình trạng ── */}
              {activeSection === "condition" && (
                <div className="space-y-2">
                  {CONDITIONS.map((c) => {
                    const isActive = activeConditions.includes(c.value);
                    const newConditions = isActive ? activeConditions.filter((v) => v !== c.value) : [...activeConditions, c.value];
                    return (
                      <Link key={c.value} href={buildFilterUrl({ condition: newConditions.length > 0 ? newConditions.join(",") : null })} onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${isActive ? "border-brand-500 bg-brand-50" : "border-gray-100 active:border-gray-200"}`}>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? "border-brand-500 bg-brand-500" : "border-gray-300"}`}>
                          {isActive && <Check size={12} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className={`w-2.5 h-2.5 rounded-full ${c.color} flex-shrink-0`} />
                        <span className={`text-sm ${isActive ? "text-brand-600 font-semibold" : "text-gray-700"}`}>{c.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white safe-area-pb">
              <button onClick={() => setOpen(false)}
                className="w-full btn-primary py-3 text-sm font-bold">
                Xem kết quả
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
