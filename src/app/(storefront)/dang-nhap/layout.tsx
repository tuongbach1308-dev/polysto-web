import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập / Đăng ký",
  description: "Đăng nhập hoặc tạo tài khoản POLY Store để theo dõi đơn hàng, lưu sản phẩm yêu thích và nhận ưu đãi.",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
