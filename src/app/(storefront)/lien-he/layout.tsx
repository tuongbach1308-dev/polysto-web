import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ POLY Store - Apple Authorized Reseller. Hotline: 0815 242 433. Hỗ trợ tư vấn 24/7.",
  alternates: { canonical: "/lien-he" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
