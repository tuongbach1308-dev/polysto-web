import { createClient } from "@/lib/supabase/server";
import BlogSidebar from "./BlogSidebar";

export const revalidate = 60;

interface PostCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
}

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: allCats } = await supabase.from("post_categories").select("*").order("sort_order");
  const childCats = (allCats || []).filter((c: PostCategory) => c.parent_id !== null);

  return (
    <div className="bg-surface min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar — persists across all tin-tuc navigations */}
          <BlogSidebar categories={childCats} />

          {/* Content — only this area changes */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
