import { createClient } from "@/lib/supabase/server";
import ProductLayoutShell from "./ProductLayoutShell";
import type { Category } from "@/lib/database.types";

export const revalidate = 60;

export default async function ProductLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");

  return (
    <ProductLayoutShell categories={(categories || []) as Category[]}>
      {children}
    </ProductLayoutShell>
  );
}
