"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, ShoppingBag, Menu, MapPin, Phone, User, LayoutGrid, ChevronDown, FileSearch, Newspaper, LogOut } from "lucide-react";
import { getCart } from "@/lib/cart";
import { getUser, onAuthChange, signOut } from "@/lib/auth";
import Logo from "@/components/Logo";
import MegaMenu from "@/components/header/MegaMenu";
import SearchPopup from "@/components/header/SearchPopup";
import MobileDrawer from "@/components/header/MobileDrawer";
import type { User as SupaUser } from "@supabase/supabase-js";

export default function Header({ settings }: { settings: Record<string, string> }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [catOpen, setCatOpen] = useState(true);
  const [catHighlight, setCatHighlight] = useState(false);
  const [user, setUser] = useState<SupaUser | null>(null);
  const pathname = usePathname();
  // News / article pages keep the category bar persistently open — do not auto-close on scroll.
  const isNewsPage = pathname?.startsWith("/tin-tuc") ?? false;

  useEffect(() => {
    const update = () => setCartCount(getCart().reduce((s, i) => s + i.quantity, 0));
    update();
    window.addEventListener("cart-updated", update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener("cart-updated", update); window.removeEventListener("storage", update); };
  }, []);

  useEffect(() => {
    // Fetch initial user state on mount
    getUser().then(setUser);
    // Subscribe to auth state changes
    const sub = onAuthChange((u) => setUser(u));
    return () => sub.unsubscribe();
  }, []);

  // Auto close category bar when scrolling down, reopen when scrolling up.
  // Always open when near the top of the page.
  // Skipped on news pages so the bar stays visible while reading articles.
  useEffect(() => {
    if (isNewsPage) {
      setCatOpen(true);
      return;
    }
    let lastY = window.scrollY;
    let ticking = false;
    const THRESHOLD = 6; // ignore tiny jitter
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - lastY;
        if (y < 80) {
          setCatOpen(true);
        } else if (dy > THRESHOLD) {
          setCatOpen(false);
          lastY = y;
        } else if (dy < -THRESHOLD) {
          setCatOpen(true);
          lastY = y;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isNewsPage]);

  return (
    <>
      {/* ════ SLOGAN BAR — SCROLLS ════ */}
      <div className="text-white/70 text-[11px]" style={{ background: "#114a2b" }}>
        <div className="max-w-[1200px] mx-auto px-4 h-[26px] flex items-center justify-between">
          <span className="hidden sm:inline">{settings.header_slogan || "Apple Authorized Reseller — Chính hãng, Uy tín, Giá tốt"}</span>
          <span className="sm:hidden text-[10px]">{settings.site_name || "POLY Store"} — Chính hãng Apple</span>
          <div className="flex items-center gap-3">
            <a href={`tel:${settings.phone || "0815242433"}`} className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone size={10} /> {settings.phone ? settings.phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3") : "0815 242 433"}
            </a>
          </div>
        </div>
      </div>

      {/* ════ HEADER 1 — STICKY ════ */}
      <div className="sticky top-0 z-50 shadow-sm" style={{ background: "linear-gradient(180deg, #1a6b3a, #155e35)" }}>
        <div className="max-w-[1200px] mx-auto px-4 h-[52px] flex items-center gap-2">
          {/* ── Mobile menu ── */}
          <button className="lg:hidden text-white p-1" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>

          {/* ── Logo ── */}
          <Logo size="md" showText={true} light className="hidden sm:flex" />
          <Logo size="sm" showText={false} className="sm:hidden" />

          {/* ── Nút Danh mục (toggle header 2) ── */}
          <button
            onClick={() => setCatOpen(!catOpen)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all flex-shrink-0 bg-white/10 hover:bg-white/20"
          >
            <LayoutGrid size={16} className="text-white" />
            <span className="text-[13px] text-white font-medium">Danh mục</span>
            <ChevronDown size={14} className={`text-white/60 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
          </button>

          {/* ── Search ── */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex-1 max-w-[420px] flex items-center h-[34px] bg-white/15 rounded-md px-4 gap-2 hover:bg-white/25 transition-colors cursor-text"
          >
            <Search size={15} className="text-white/60 flex-shrink-0" />
            <span className="text-white/60 text-sm truncate">Bạn cần tìm gì?</span>
          </button>

          {/* ── Spacer ── */}
          <div className="flex-1 hidden lg:block" />

          {/* ── Right: Tra cứu + Giỏ hàng + Đăng nhập ── */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link href="/tra-cuu-don-hang" className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors">
              <FileSearch size={18} className="text-white/80" />
              <span className="text-[13px] text-white/80">Tra cứu</span>
            </Link>

            <Link href="/cua-hang" className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors">
              <MapPin size={18} className="text-white/80" />
              <span className="text-[13px] text-white/80">Cửa hàng</span>
            </Link>

            <Link href="/gio-hang" className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors">
              <ShoppingBag size={18} className="text-white/80" />
              <span className="text-[13px] text-white/80 hidden sm:inline">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 left-[22px] sm:left-auto sm:-top-0.5 sm:-right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold px-1">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <Link href="/tai-khoan" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors">
                  <User size={18} className="text-white" />
                  <span className="text-[13px] text-white/80 hidden sm:inline max-w-[80px] truncate">
                    {user.user_metadata?.full_name || user.email?.split("@")[0] || "Tài khoản"}
                  </span>
                </Link>
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[160px] z-50">
                  <Link href="/tai-khoan" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Tài khoản của tôi
                  </Link>
                  <Link href="/tai-khoan/don-hang" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Đơn hàng
                  </Link>
                  <Link href="/tai-khoan/yeu-thich" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Yêu thích
                  </Link>
                  <button
                    onClick={() => signOut().then(() => window.location.href = "/")}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100 flex items-center gap-2"
                  >
                    <LogOut size={14} /> Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/dang-nhap" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors">
                <User size={18} className="text-white" />
                <span className="text-[13px] text-white/80 hidden sm:inline">Đăng nhập</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ════ HEADER 2 — Category nav (toggle) ════ */}
      <div data-cat-bar className={`hidden lg:block border-b border-gray-200 bg-white sticky top-[52px] z-40 transition-all duration-300 origin-top ${catOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"}`}>
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
          <MegaMenu />
          <Link href="/tin-tuc" className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-gray-600 hover:text-brand-500 transition-colors flex-shrink-0">
            <Newspaper size={15} className="opacity-70" />
            Tin công nghệ
          </Link>
        </div>
      </div>

      <SearchPopup open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} phone={settings.phone} address={settings.footer_locations} />
    </>
  );
}
