"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/database.types";
import { createClient } from "@/lib/supabase/client";

export default function WishlistPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      // Fetch wishlist with product details
      const { data: rows } = await supabase
        .from("wishlists")
        .select("product_id, products(*)")
        .eq("user_id", user.id);
      const products: Product[] = (rows || [])
        .map((r: { products: Product | Product[] | null }) => Array.isArray(r.products) ? r.products[0] : r.products)
        .filter((p: Product | null): p is Product => p !== null);
      setItems(products);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Sản phẩm yêu thích</h1>
        <span className="text-sm text-gray-400">{items.length} sản phẩm</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
          <Heart className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-sm text-gray-500 mb-4">Chưa có sản phẩm yêu thích nào.</p>
          <Link href="/san-pham" className="btn-primary text-sm px-6 py-2.5">Khám phá sản phẩm</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
