import type { Metadata } from "next";
import { ShieldCheck, Truck, Award, Users, CreditCard, Headphones, Heart, Star, type LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Giới thiệu POLY Store",
  description: "POLY Store - Apple Authorized Reseller. Chuyên cung cấp sản phẩm Apple chính hãng với bảo hành uy tín, giá tốt nhất thị trường.",
  alternates: { canonical: "/gioi-thieu" },
};

const ICON_MAP: Record<string, LucideIcon> = { ShieldCheck, Truck, Award, Users, CreditCard, Headphones, Heart, Star };

const DEFAULT_HTML = `<p>POLY Store là hệ thống cung cấp sản phẩm Apple chính hãng uy tín tại Việt Nam. Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng nhất với giá cả hợp lý nhất.</p>
<h3>Tầm nhìn</h3><p>Trở thành đại lý Apple uy tín hàng đầu Việt Nam.</p>
<h3>Sứ mệnh</h3><p>Cung cấp sản phẩm Apple chính hãng 100% với dịch vụ hậu mãi tốt nhất.</p>
<h3>Giá trị cốt lõi</h3><p>Uy tín - Chất lượng - Tận tâm - Chuyên nghiệp.</p>`;

const DEFAULT_FEATURES = [
  { icon: "ShieldCheck", title: "Chính hãng 100%", desc: "Sản phẩm Apple chính hãng, tem bảo hành." },
  { icon: "Truck", title: "Giao hàng toàn quốc", desc: "Giao nhanh đến mọi tỉnh thành." },
  { icon: "Award", title: "Bảo hành uy tín", desc: "Đổi trả trong 30 ngày." },
  { icon: "Users", title: "Hỗ trợ 24/7", desc: "Tư vấn nhiệt tình mọi lúc." },
];

export default async function AboutPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "page_about").single();
  const page = data?.value as { title?: string; html?: string; features?: { icon: string; title: string; desc: string }[] } | null;

  const title = page?.title || "Giới thiệu POLY Store";
  const html = page?.html || DEFAULT_HTML;
  const features = page?.features && page.features.length > 0 ? page.features : DEFAULT_FEATURES;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">{title}</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6 lg:p-8 mb-8">
        <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((item) => {
          const Icon = ICON_MAP[item.icon] || ShieldCheck;
          return (
            <div key={item.title} className="bg-white rounded-lg border border-gray-200 p-5 text-center">
              <Icon className="mx-auto text-brand-500 mb-3" size={36} />
              <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
