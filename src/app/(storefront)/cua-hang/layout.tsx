import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hệ thống cửa hàng",
  description: "Hệ thống cửa hàng POLY Store - Apple Authorized Reseller. Địa chỉ, bản đồ, giờ mở cửa.",
  alternates: { canonical: "/cua-hang" },
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
