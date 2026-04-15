"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, X, Check, Tablet, Laptop, Headphones, Cable, Tag, SlidersHorizontal } from "lucide-react";

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

export default function SidebarFilter({ categories, activeCategoryId, currentPath, currentPrice, currentCondition }: Props) {
  const roots = categories.filter((c) => c.parent_id === null).sort((a, b) => a.sort_order - b.sort_order);

  // Auto-open ancestors of active category
  const [openIds, setOpenIds] = useState<string[]>(() => {
    if (!activeCategoryId) return roots.map((r) => r.id); // open all roots by default
    const ids: string[] = [];
    let cur = categories.find((c) => c.id === activeCategoryId);
    while (cur) { ids.push(cur.id); cur = cur.parent_id ? categories.find((c) => c.id === cur!.parent_id) : undefined; }
    return ids;
  });

  const [priceOpen, setPriceOpen] = useState(true);
  const [conditionOpen, setConditionOpen] = useState(true);

  function toggleOpen(id: string) {
    setOpenIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }

  function getChildren(parentId: string) {
    return categories.filter((c) => c.parent_id === parentId).sort((a, b) => a.sort_order - b.sort_order);
  }

  function buildCategoryPath(catId: string): string {
    const parts: string[] = [];
    let current = categories.find((c) => c.id === catId);
    while (current) {
      parts.unshift(current.slug);
      current = current.parent_id ? categories.find((c) => c.id === current!.parent_id) : undefined;
    }
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

  const activeConditions = (currentCondition || "").split(",").filter(Boolean);
  const hasFilters = !!currentPrice || !!currentCondition;

  // Count active filters
  const filterCount = (currentPrice ? 1 : 0) + activeConditions.length;

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 bg-brand-700 rounded-t-lg">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-white" />
          <span className="text-sm font-bold text-white uppercase tracking-wide">Bộ lọc</span>
        </div>
        {filterCount > 0 && (
          <span className="bg-white text-brand-700 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{filterCount}</span>
        )}
      </div>

      <div className="bg-white border border-gray-200 border-t-0 rounded-b-lg divide-y divide-gray-100">

        {/* ══ Danh mục ══ */}
        <div className="p-3">
          <Link href="/san-pham"
            className={`flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-all ${!activeCategoryId ? "bg-brand-50 text-brand-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
            <Tag size={15} className={!activeCategoryId ? "text-brand-500" : "text-gray-400"} />
            Tất cả sản phẩm
          </Link>

          <div className="mt-1 space-y-0.5">
            {roots.map((root) => {
              const children = getChildren(root.id);
              const isOpen = openIds.includes(root.id);
              const isActive = activeCategoryId === root.id;
              const hasActiveChild = children.some((c) => c.id === activeCategoryId || getChildren(c.id).some((gc) => gc.id === activeCategoryId));
              const Icon = CATEGORY_ICONS[root.slug] || Tag;

              return (
                <div key={root.id}>
                  {/* Root category */}
                  <div className="flex items-center gap-1">
                    <Link href={buildCategoryPath(root.id)}
                      className={`flex-1 flex items-center gap-2 px-2 py-2 rounded-md text-sm transition-all ${isActive ? "bg-brand-50 text-brand-600 font-semibold" : hasActiveChild ? "text-brand-600" : "text-gray-700 hover:bg-gray-50"}`}>
                      <Icon size={15} className={isActive || hasActiveChild ? "text-brand-500" : "text-gray-400"} />
                      {root.name}
                    </Link>
                    {children.length > 0 && (
                      <button onClick={() => toggleOpen(root.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>

                  {/* Children — animated */}
                  {(isOpen || hasActiveChild) && children.length > 0 && (
                    <div className="ml-4 pl-3 border-l-2 border-brand-100 space-y-0.5 mt-0.5 mb-1">
                      {children.map((child) => {
                        const grandChildren = getChildren(child.id);
                        const isChildActive = activeCategoryId === child.id;
                        const hasGrandActive = grandChildren.some((gc) => gc.id === activeCategoryId);

                        return (
                          <div key={child.id}>
                            <Link href={buildCategoryPath(child.id)}
                              className={`flex items-center justify-between px-2 py-1.5 rounded-md text-[13px] transition-all ${isChildActive ? "bg-brand-50 text-brand-600 font-semibold" : hasGrandActive ? "text-brand-600" : "text-gray-500 hover:text-brand-600 hover:bg-gray-50"}`}>
                              {child.name}
                              {isChildActive && <Check size={13} className="text-brand-500" />}
                            </Link>

                            {/* Grandchildren */}
                            {(isChildActive || hasGrandActive) && grandChildren.length > 0 && (
                              <div className="ml-3 pl-2 border-l border-gray-200 space-y-0.5 mt-0.5">
                                {grandChildren.map((gc) => (
                                  <Link key={gc.id} href={buildCategoryPath(gc.id)}
                                    className={`flex items-center justify-between px-2 py-1 rounded-md text-xs transition-all ${activeCategoryId === gc.id ? "bg-brand-50 text-brand-600 font-semibold" : "text-gray-400 hover:text-brand-500 hover:bg-gray-50"}`}>
                                    {gc.name}
                                    {activeCategoryId === gc.id && <Check size={11} className="text-brand-500" />}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ══ Khoảng giá ══ */}
        <div>
          <button onClick={() => setPriceOpen(!priceOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-gray-800 uppercase tracking-wide hover:bg-gray-50 transition-colors">
            Khoảng giá
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${priceOpen ? "rotate-180" : ""}`} />
          </button>
          {priceOpen && (
            <div className="px-3 pb-3 space-y-1">
              {PRICE_RANGES.map((r) => {
                const isActive = currentPrice === r.value;
                return (
                  <Link key={r.value} href={buildFilterUrl({ price: isActive ? null : r.value })}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all ${isActive ? "bg-brand-50 text-brand-600 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-brand-600"}`}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? "border-brand-500 bg-brand-500" : "border-gray-300"}`}>
                      {isActive && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    {r.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ══ Tình trạng ══ */}
        <div>
          <button onClick={() => setConditionOpen(!conditionOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-gray-800 uppercase tracking-wide hover:bg-gray-50 transition-colors">
            Tình trạng
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${conditionOpen ? "rotate-180" : ""}`} />
          </button>
          {conditionOpen && (
            <div className="px-3 pb-3 space-y-1">
              {CONDITIONS.map((c) => {
                const isActive = activeConditions.includes(c.value);
                const newConditions = isActive ? activeConditions.filter((v) => v !== c.value) : [...activeConditions, c.value];
                return (
                  <Link key={c.value} href={buildFilterUrl({ condition: newConditions.length > 0 ? newConditions.join(",") : null })}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all ${isActive ? "bg-brand-50 text-brand-600 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-brand-600"}`}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? "border-brand-500 bg-brand-500" : "border-gray-300"}`}>
                      {isActive && <Check size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className={`w-2 h-2 rounded-full ${c.color} flex-shrink-0`} />
                    {c.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ══ Xóa bộ lọc ══ */}
        {hasFilters && (
          <div className="p-3">
            <Link href={currentPath}
              className="flex items-center justify-center gap-1.5 w-full py-2 text-sm text-red-500 hover:text-red-600 font-medium border border-red-200 rounded-md hover:bg-red-50 transition-colors">
              <X size={14} /> Xóa tất cả bộ lọc
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
