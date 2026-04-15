import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tra cứu bảo hành & Đơn hàng",
  description: "Tra cứu đơn hàng, bảo hành sản phẩm và các chính sách tại POLY Store.",
  alternates: { canonical: "/tra-cuu-don-hang" },
};

export default function TraCuuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
