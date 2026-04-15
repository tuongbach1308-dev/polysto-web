import type { Category } from "@/lib/database.types";

/** Collect all descendant category IDs (including the given catId itself) */
export function collectDescendants(catId: string, allCategories: Category[]): string[] {
  const all = new Set<string>([catId]);
  const stack = [catId];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const c of allCategories) {
      if (c.parent_id === cur && !all.has(c.id)) {
        all.add(c.id);
        stack.push(c.id);
      }
    }
  }
  return Array.from(all);
}

/** Build full slug path from root to the given category */
export function buildCategoryPath(catId: string, allCategories: Category[]): string {
  const byId = new Map<string, Category>(allCategories.map((c) => [c.id, c]));
  const chain: string[] = [];
  let cur: Category | undefined = byId.get(catId);
  while (cur) {
    chain.unshift(cur.slug);
    cur = cur.parent_id ? byId.get(cur.parent_id) : undefined;
  }
  return `/san-pham/${chain.join("/")}`;
}

/** Walk up parent_id to build ancestor chain (root → leaf) for a category id */
export function getCategoryChain(catId: string, allCategories: Category[]): Category[] {
  const byId = new Map<string, Category>(allCategories.map((c) => [c.id, c]));
  const chain: Category[] = [];
  let cur: Category | undefined = byId.get(catId);
  while (cur) {
    chain.unshift(cur);
    cur = cur.parent_id ? byId.get(cur.parent_id) : undefined;
  }
  return chain;
}

/** Get direct children of a category */
export function getChildren(parentId: string, allCategories: Category[]): Category[] {
  return allCategories.filter((c) => c.parent_id === parentId);
}
