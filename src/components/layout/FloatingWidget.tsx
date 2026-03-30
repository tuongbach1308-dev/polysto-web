'use client'

interface Props {
  settings: Record<string, string>
}

export function FloatingWidget({ settings }: Props) {
  const phone = settings.header_phone || settings.phone || ''
  const zaloUrl = settings.zalo_url || ''
  const mapsUrl = settings.google_maps_url || ''

  if (!phone && !zaloUrl) return null

  return (
    <div className="fixed bottom-[90px] md:bottom-[20px] left-[12px] z-[99] flex flex-col gap-[10px]">
      {/* Phone */}
      {phone && (
        <a
          href={`tel:${phone}`}
          className="widget-pulse w-[48px] h-[48px] rounded-full bg-brand-forest text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title={`Gọi ${phone}`}
        >
          <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      )}

      {/* Zalo */}
      {zaloUrl && (
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-[48px] h-[48px] rounded-full bg-[#0068FF] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title="Chat Zalo"
        >
          <span className="text-[1.6rem] font-bold">Zalo</span>
        </a>
      )}

      {/* Maps */}
      {mapsUrl && (
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-[48px] h-[48px] rounded-full bg-[#EA4335] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          title="Xem bản đồ"
        >
          <svg className="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </a>
      )}
    </div>
  )
}
