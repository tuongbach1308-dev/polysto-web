// ═══════════════════════════════════════════════════════════════
// Product helpers — pricing, condition, sale logic
// ═══════════════════════════════════════════════════════════════

import type { Product, ProductCondition } from "@/lib/database.types";

/** Check if a product currently has an active sale */
export function isOnSale(product: Pick<Product, "sale_price" | "sale_starts_at" | "sale_ends_at">): boolean {
  if (!product.sale_price || product.sale_price <= 0) return false;
  const now = Date.now();
  if (product.sale_starts_at && new Date(product.sale_starts_at).getTime() > now) return false;
  if (product.sale_ends_at && new Date(product.sale_ends_at).getTime() < now) return false;
  return true;
}

/** Get the price the user actually pays (sale price if active, otherwise base price) */
export function getDisplayPrice(product: Pick<Product, "price" | "sale_price" | "sale_starts_at" | "sale_ends_at">): number {
  return isOnSale(product) ? (product.sale_price as number) : product.price;
}

/** Get the strikethrough "old" price for display (original_price or price when on sale) */
export function getCompareAtPrice(
  product: Pick<Product, "price" | "original_price" | "sale_price" | "sale_starts_at" | "sale_ends_at">
): number {
  if (isOnSale(product)) return product.price;
  return product.original_price;
}

/** Calculate discount percentage from comparing displayPrice to compareAtPrice */
export function getDiscountPercent(
  product: Pick<Product, "price" | "original_price" | "sale_price" | "sale_starts_at" | "sale_ends_at">
): number {
  const display = getDisplayPrice(product);
  const compare = getCompareAtPrice(product);
  if (compare <= display || compare <= 0) return 0;
  return Math.round(((compare - display) / compare) * 100);
}

/** Map condition enum to display label (Vietnamese) */
export const CONDITION_LABELS: Record<ProductCondition, string> = {
  seal: "Nguyên Seal",
  openbox: "Open Box",
  new_nobox: "New Nobox",
  likenew: "Like New",
  old: "Cũ",
};

/** Get badge label for product condition */
export function getConditionBadge(product: Pick<Product, "condition">): string | null {
  if (!product.condition) return null;
  return CONDITION_LABELS[product.condition] || null;
}

/** Map condition to schema.org ItemCondition URL */
export const CONDITION_SCHEMA: Record<ProductCondition, string> = {
  seal: "https://schema.org/NewCondition",
  openbox: "https://schema.org/NewCondition",
  new_nobox: "https://schema.org/NewCondition",
  likenew: "https://schema.org/RefurbishedCondition",
  old: "https://schema.org/UsedCondition",
};

/** Map status to schema.org availability */
export function getSchemaAvailability(status: string): string {
  if (status === "active") return "https://schema.org/InStock";
  if (status === "out_of_stock") return "https://schema.org/OutOfStock";
  return "https://schema.org/Discontinued";
}
