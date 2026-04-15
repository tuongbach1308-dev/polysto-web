"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Newspaper, MessageCircleQuestion, MonitorSmartphone, ThumbsUp, Lightbulb, Tag, Users } from "lucide-react";
import PostTOC from "@/components/PostTOC";

interface PostCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  sort_order: number;
}

const SIDEBAR_ICONS: Record<string, typeof Newspaper> = {
  "tin-cong-nghe": Newspaper, "tu-van": MessageCircleQuestion, "tren-tay": MonitorSmartphone,
  "danh-gia": ThumbsUp, "thu-thuat": Lightbulb, "khuyen-mai": Tag, "tuyen-dung": Users,
};

export default function BlogSidebar({ categories }: { categories: PostCategory[] }) {
  const pathname = usePathname();

  // Detect active category from URL: /tin-tuc/[slug]
  const segments = pathname.replace(/^\/tin-tuc\/?/, "").split("/").filter(Boolean);
  const firstSegment = segments[0] || "";
  const activeCat = categories.find((c) => c.slug === firstSegment);
  const isHome = !firstSegment; // /tin-tuc root

  // Detect if we're on a post detail page (slug has many hyphens)
  const isDetail = segments.length > 0 && (firstSegment.match(/-/g) || []).length >= 3;

  return (
    <aside className="hidden lg:block lg:col-span-1">
      <div className="sticky space-y-1" style={{ top: "var(--sticky-offset)" }}>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">Danh mục</h3>
        <Link href="/tin-tuc" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${isHome ? "bg-brand-50 text-brand-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
          <Newspaper size={15} className={isHome ? "text-brand-500" : "text-gray-400"} />
          Tất cả
        </Link>
        {categories.map((cat) => {
          const Icon = SIDEBAR_ICONS[cat.slug] || Newspaper;
          const active = activeCat?.id === cat.id;
          return (
            <Link key={cat.id} href={`/tin-tuc/${cat.slug}`}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-brand-50 text-brand-600 font-semibold" : "text-gray-600 hover:bg-gray-50"}`}>
              <Icon size={15} className={active ? "text-brand-500" : "text-gray-400"} />
              {cat.name}
            </Link>
          );
        })}

        {/* TOC — only on post detail pages */}
        {isDetail && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <PostTOC />
          </div>
        )}
      </div>
    </aside>
  );
}
