"use server";

import { createClient } from "@supabase/supabase-js";

/** Increment product view count (fire-and-forget, uses service role) */
export async function incrementProductView(id: string): Promise<void> {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await admin
    .from("products")
    .select("view_count")
    .eq("id", id)
    .single();

  if (data) {
    await admin
      .from("products")
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq("id", id);
  }
}
