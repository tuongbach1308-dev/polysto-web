"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Smoothly scroll to top on every route change */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}
