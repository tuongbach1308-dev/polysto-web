import Link from "next/link";
import Image from "next/image";

export default function Footer({ settings }: { settings: Record<string, string> }) {
  const phone = settings.phone || "0815242433";
  const phoneFormatted = phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  const siteName = settings.site_name || "POLY Store";

  // Parse footer_locations from settings (stored as JSON string)
  let locations: { address: string; mapUrl: string }[] = [];
  try {
    const raw = settings.footer_locations;
    if (raw) locations = JSON.parse(raw);
  } catch { /* ignore */ }

  return (
    <footer>
      {/* ── Theo dõi + Hotline ── */}
      <div className="bg-brand-700 py-4">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-white text-sm font-semibold uppercase whitespace-nowrap">Theo dõi {siteName} qua</span>
            <div className="flex items-center gap-2">
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center hover:scale-110 transition-transform" aria-label="Instagram">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#1877f2] flex items-center justify-center hover:scale-110 transition-transform" aria-label="Facebook">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-black flex items-center justify-center hover:scale-110 transition-transform" aria-label="TikTok">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
              )}
              {settings.shopee && (
                <a href={settings.shopee} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-[#ee4d2d] flex items-center justify-center hover:scale-110 transition-transform" aria-label="Shopee">
                  <span className="text-white text-[10px] font-bold">S</span>
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/80 text-sm hidden sm:inline">Liên hệ ngay Hotline</span>
            <a href={`tel:${phone}`} className="flex items-center gap-2 bg-white text-brand-700 text-sm font-semibold px-4 py-2 rounded-md hover:bg-gray-100 transition-colors whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
              {phoneFormatted}
            </a>
          </div>
        </div>
      </div>

      {/* ── Footer content ── */}
      <div className="bg-white border-t border-gray-200">
      <div className="max-w-[1200px] mx-auto px-4 py-5 space-y-3">

        {/* Logo + Brand */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt={siteName} width={32} height={32} className="rounded" />
          <span className="text-base font-extrabold text-gray-800 uppercase">
            {siteName}
          </span>
        </div>

        <div className="border-t border-gray-100" />

        {/* Hệ thống bán lẻ */}
        {locations.length > 0 && (
          <Row label={`Hệ thống bán lẻ ${siteName}:`}>
            {locations.map((loc, i) => (
              <Pill key={i} href={loc.mapUrl || "#"} external={!!loc.mapUrl}>{loc.address}</Pill>
            ))}
          </Row>
        )}

        {/* Tổng đài */}
        <Row label="Tổng đài hỗ trợ:">
          <Pill href={`tel:${phone}`}>{phone}</Pill>
          {settings.email && <Pill href={`mailto:${settings.email}`}>{settings.email}</Pill>}
        </Row>

        {/* Thông tin */}
        <Row label="Thông tin:">
          {["Về POLY Store", "Shopee", "Instagram", "Facebook", "TikTok", "Thread", "Liên hệ hợp tác"].map((t) => (
            <Pill key={t} href={t === "Về POLY Store" ? "/gioi-thieu" : t === "Liên hệ hợp tác" ? "/lien-he" : "#"}>{t}</Pill>
          ))}
        </Row>

        {/* Chính sách */}
        <Row label="Chính sách:">
          <Pill href="#">Trả góp</Pill>
          <Pill href="#">Bảo hành và đổi trả</Pill>
        </Row>

        {/* Hình thức thanh toán */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="text-xs font-bold text-gray-700 uppercase whitespace-nowrap">
            Hình thức thanh toán
          </span>
          <div className="w-[50px] h-[30px] border border-gray-200 rounded flex items-center justify-center bg-white">
            <svg viewBox="0 0 48 16" className="h-3 w-auto">
              <text x="4" y="13" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#1a1f71">VISA</text>
            </svg>
          </div>
          <div className="w-[50px] h-[30px] border border-gray-200 rounded flex items-center justify-center bg-white">
            <svg viewBox="0 0 48 30" className="h-4 w-auto">
              <circle cx="17" cy="15" r="10" fill="#eb001b" />
              <circle cx="31" cy="15" r="10" fill="#f79e1b" />
              <path d="M24 7.5a10 10 0 010 15 10 10 0 010-15z" fill="#ff5f00" />
            </svg>
          </div>
          <div className="w-[50px] h-[30px] border border-gray-200 rounded flex items-center justify-center bg-white">
            <span className="text-[9px] font-bold italic text-blue-600">Kredivo</span>
          </div>
        </div>

      </div>
      </div>
    </footer>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span className="text-xs font-bold text-gray-700 uppercase whitespace-nowrap">{label}</span>
      {children}
    </div>
  );
}

function Pill({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls = "px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:border-brand-500 hover:text-brand-600 transition-colors";
  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>;
  }
  return <Link href={href} className={cls}>{children}</Link>;
}
