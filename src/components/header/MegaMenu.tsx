"use client";

import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Laptop, Tablet, Headphones, Cable, Smartphone, Folder, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/database.types";

const CACHE_KEY = "polystore-megamenu-categories";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const ICON_MAP: Record<string, typeof Tablet> = {
  ipad: Tablet,
  macbook: Laptop,
  "am-thanh": Headphones,
  airpods: Headphones,
  "phu-kien": Cable,
  iphone: Smartphone,
};

interface CategoryNode extends Category {
  children: CategoryNode[];
}

export default function MegaMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const [panelTop, setPanelTop] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Measure the category bar wrapper's bottom (including its border-b) so the
  // panel sits absolutely flush under it, no matter what height the bar ends up.
  useLayoutEffect(() => {
    if (!activeId) return;
    function measure() {
      if (!navRef.current) return;
      const bar = navRef.current.closest("[data-cat-bar]") as HTMLElement | null;
      const rect = (bar || navRef.current).getBoundingClientRect();
      setPanelTop(rect.bottom);
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [activeId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setCategories(data);
          }
        } catch {}
      }
    }

    const supabase = createClient();
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setCategories(data as Category[]);
          if (typeof window !== "undefined") {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
          }
        }
      });
  }, []);

  // Build tree
  const tree = useMemo(() => {
    const map = new Map<string, CategoryNode>();
    const roots: CategoryNode[] = [];
    categories.forEach((cat) => map.set(cat.id, { ...cat, children: [] }));
    map.forEach((node) => {
      if (node.parent_id && map.has(node.parent_id)) {
        map.get(node.parent_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });
    function sortByOrder(nodes: CategoryNode[]) {
      nodes.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
      nodes.forEach((n) => sortByOrder(n.children));
    }
    sortByOrder(roots);
    return roots;
  }, [categories]);

  // Slug path
  const pathMap = useMemo(() => {
    const map = new Map<string, string>();
    function walk(nodes: CategoryNode[], prefix: string) {
      for (const node of nodes) {
        const path = prefix ? `${prefix}/${node.slug}` : node.slug;
        map.set(node.id, path);
        walk(node.children, path);
      }
    }
    walk(tree, "");
    return map;
  }, [tree]);

  function buildHref(catId: string) {
    const path = pathMap.get(catId);
    return path ? `/san-pham/${path}` : "/san-pham";
  }

  // Build bar items: max 2 levels (root + level 1) on bar.
  // Level 2+ only appears in dropdowns.
  // Hidden nodes are skipped — their children get promoted.
  const barItems = useMemo(() => {
    const items: CategoryNode[] = [];
    function collect(nodes: CategoryNode[], depth: number) {
      if (depth >= 2) return; // stop at level 2
      for (const node of nodes) {
        if (node.is_active) {
          items.push(node); // show on bar, children go to dropdown
        } else {
          collect(node.children, depth + 1); // skip hidden, promote children
        }
      }
    }
    collect(tree, 0);
    return items;
  }, [tree]);

  const activeCat = barItems.find((r) => r.id === activeId) || null;

  function isBrand(cat: CategoryNode): boolean {
    return !!cat.is_brand;
  }

  // Get the left pixel position of a nav item for simple dropdown positioning
  function getNavItemLeft(catId: string): number {
    if (!navRef.current) return 0;
    const link = navRef.current.querySelector(`a[href="${buildHref(catId)}"]`);
    if (!link) return 0;
    return link.getBoundingClientRect().left;
  }

  return (
    <div onMouseLeave={() => setActiveId(null)}>
      {/* ── Bar ── */}
      <nav ref={navRef} className="flex items-center h-[42px] gap-0 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {barItems.map((cat) => {
          const Icon = ICON_MAP[cat.slug] || Folder;
          const href = buildHref(cat.id);
          const isActive = activeId === cat.id;
          const hasChildren = cat.children.length > 0;
          return (
            <Link
              key={cat.id}
              href={href}
              onMouseEnter={() => hasChildren ? setActiveId(cat.id) : setActiveId(null)}
              className={`flex items-center gap-1.5 h-full px-3 text-[13px] font-semibold whitespace-nowrap border-b-2 transition-all shrink-0 ${
                isActive
                  ? "text-brand-600 border-brand-500 bg-brand-50/40"
                  : "text-gray-700 border-transparent hover:text-brand-600"
              }`}
            >
              {cat.image_url ? (
                <img src={cat.image_url} alt={cat.name} className="w-4 h-4 object-cover" />
              ) : (
                <Icon size={16} className="opacity-70" />
              )}
              {cat.name}
            </Link>
          );
        })}
      </nav>

      {/* ── Dropdown panel — portaled to body ── */}
      {mounted && activeCat && activeCat.children.length > 0 && createPortal(
        isBrand(activeCat) ? (
          /* ══ MEGA DROPDOWN — for brands (root categories with grandchildren) ══ */
          <div
            className="fixed left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]"
            style={{ top: panelTop }}
            onMouseEnter={() => setActiveId(activeCat.id)}
            onMouseLeave={() => setActiveId(null)}
          >
            <div className="max-w-[1200px] mx-auto px-4">
              <div>
                <div className="flex">
                  {/* Left sidebar */}
                  <div className="w-[220px] bg-gray-50/70 border-r border-gray-100 py-3 flex-shrink-0">
                    {activeCat.children.map((child) => (
                      <Link
                        key={child.id}
                        href={buildHref(child.id)}
                        className="flex items-center justify-between gap-2 px-5 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-white hover:text-gray-900 transition-colors"
                      >
                        <span className="truncate">{child.name}</span>
                        <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>

                  {/* Right: grandchildren grid */}
                  <div className="flex-1 p-6 min-w-0">
                    <div className="grid grid-cols-4 gap-x-6 gap-y-5">
                      {activeCat.children.map((child) => {
                        const hasGrandchildren = child.children.length > 0;
                        return (
                          <div key={child.id} className="min-w-0">
                            <Link
                              href={buildHref(child.id)}
                              className="block pb-2 mb-2 border-b border-gray-100 text-[12px] font-bold text-gray-900 uppercase tracking-wider hover:text-gray-600 transition-colors truncate"
                            >
                              {child.name}
                            </Link>
                            {hasGrandchildren ? (
                              <ul className="space-y-1">
                                {child.children.map((gc) => (
                                  <li key={gc.id}>
                                    <Link
                                      href={buildHref(gc.id)}
                                      className="block py-0.5 text-[13px] text-gray-600 hover:text-gray-900 transition-colors truncate"
                                    >
                                      {gc.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <Link
                                href={buildHref(child.id)}
                                className="inline-flex items-center gap-1 text-[12px] text-gray-400 hover:text-gray-700 transition-colors"
                              >
                                Xem tất cả <ChevronRight size={12} />
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                  <span className="text-[12px] text-gray-500">
                    Khám phá toàn bộ sản phẩm <span className="font-semibold text-gray-700">{activeCat.name}</span>
                  </span>
                  <Link
                    href={buildHref(activeCat.id)}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Xem tất cả {activeCat.name} <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ══ SIMPLE DROPDOWN — for non-brand categories ══ */
          <div
            className="fixed z-50"
            style={{ top: panelTop }}
            onMouseEnter={() => setActiveId(activeCat.id)}
            onMouseLeave={() => setActiveId(null)}
          >
            <div
              className="absolute bg-white border border-gray-200 rounded-b-lg shadow-lg min-w-[200px] py-1.5"
              style={{ left: getNavItemLeft(activeCat.id) }}
            >
              {activeCat.children.map((child) => (
                <Link
                  key={child.id}
                  href={buildHref(child.id)}
                  className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-colors"
                >
                  {child.name}
                </Link>
              ))}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <Link
                  href={buildHref(activeCat.id)}
                  className="block px-4 py-2 text-[12px] font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
                >
                  Xem tất cả {activeCat.name} →
                </Link>
              </div>
            </div>
          </div>
        ),
        document.body
      )}

    </div>
  );
}
