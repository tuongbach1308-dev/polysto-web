"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface ActionResult {
  error?: string;
  success?: boolean;
}

export async function addToWishlist(productId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Chưa đăng nhập" };

  const { error } = await supabase
    .from("wishlists")
    .insert({ user_id: user.id, product_id: productId });

  // Ignore duplicate (product already in wishlist)
  if (error && !error.message.includes("duplicate")) {
    return { error: error.message };
  }

  revalidatePath("/tai-khoan/yeu-thich");
  return { success: true };
}

export async function removeFromWishlist(productId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Chưa đăng nhập" };

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (error) return { error: error.message };

  revalidatePath("/tai-khoan/yeu-thich");
  return { success: true };
}

export async function getWishlistIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", user.id);

  return (data || []).map((r) => r.product_id);
}

/** Bulk migrate localStorage wishlist to DB after user logs in */
export async function syncWishlistToDb(productIds: string[]): Promise<ActionResult> {
  if (productIds.length === 0) return { success: true };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Chưa đăng nhập" };

  // Insert with onConflict do nothing
  const rows = productIds.map((pid) => ({ user_id: user.id, product_id: pid }));
  const { error } = await supabase.from("wishlists").upsert(rows, { onConflict: "user_id,product_id" });

  if (error) return { error: error.message };

  revalidatePath("/tai-khoan/yeu-thich");
  return { success: true };
}
