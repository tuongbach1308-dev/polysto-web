"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import SidebarFilter from "@/components/SidebarFilter";
import MobileFilter from "@/components/MobileFilter";
import type { Category } from "@/lib/database.types";

interface Props {
  categories: Category[];
  children: React.ReactNode;
}

function Inner({ categories, children }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Detect product detail: slug with 3+ hyphens in last segment
  const segments = pathname.replace(/^\/san-pham\/?/, "").split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "";
  const hyphenCount = (lastSegment.match(/-/g) || []).length;
  const isDetail = segments.length > 0 && hyphenCount >= 3;

  // Product detail — full width, no sidebar
  if (isDetail) return <>{children}</>;

  // Listing — resolve active category from URL
  const activeCat = resolveCategoryFromPath(segments, categories);
  const basePath = `/san-pham${segments.length > 0 ? "/" + segments.join("/") : ""}`;
  const currentPrice = searchParams.get("price") || undefined;
  const currentCondition = searchParams.get("condition") || undefined;
  const filterCount = (currentPrice ? 1 : 0) + ((currentCondition || "").split(",").filter(Boolean).length);

  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        {/* Mobile filter button — above content */}
        <div className="lg:hidden mb-4">
          <MobileFilter
            categories={categories}
            activeCategoryId={activeCat?.id || null}
            currentPath={basePath}
            currentPrice={currentPrice}
            currentCondition={currentCondition}
            filterCount={filterCount}
          />
        </div>

        {/* Sidebar + Content */}
        <div className="flex gap-6">
          <div className="hidden lg:block w-[220px] flex-shrink-0">
            <SidebarFilter
              categories={categories}
              activeCategoryId={activeCat?.id || null}
              currentPath={basePath}
              currentPrice={currentPrice}
              currentCondition={currentCondition}
            />
          </div>
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Walk slug path to find active category */
function resolveCategoryFromPath(slugs: string[], categories: Category[]): Category | null {
  let parentId: string | null = null;
  let found: Category | null = null;
  for (const s of slugs) {
    const match = categories.find((c) =>
      c.slug === s && (parentId ? c.parent_id === parentId : !c.parent_id)
    );
    if (!match) break;
    found = match;
    parentId = match.id;
  }
  return found;
}

export default function ProductLayoutShell({ categories, children }: Props) {
  return (
    <Suspense fallback={<>{children}</>}>
      <Inner categories={categories}>{children}</Inner>
    </Suspense>
  );
}
