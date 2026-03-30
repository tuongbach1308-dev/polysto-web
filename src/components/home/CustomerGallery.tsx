'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GalleryItem {
  id: string
  image_url: string
  caption?: string
  customer_name?: string
}

interface Props {
  items: GalleryItem[]
  title?: string
}

export function CustomerGallery({ items, title = 'Khách hàng của POLY Store' }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  if (items.length === 0) return null

  return (
    <section className="customer-gallery py-[20px]">
      <div className="poly-container">
        <div className="section-title mb-[15px]">
          <h2>{title}</h2>
        </div>

        {/* Horizontal scroll gallery */}
        <div className="flex gap-[10px] overflow-x-auto no-scrollbar pb-[8px]">
          {items.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setLightbox(idx)}
              className="shrink-0 w-[180px] md:w-[220px] group cursor-pointer"
            >
              <div className="relative aspect-square rounded-section overflow-hidden shadow-gallery group-hover:shadow-gallery-hover transition-shadow duration-300">
                <Image
                  src={item.image_url}
                  alt={item.caption || item.customer_name || 'Khách hàng'}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="220px"
                />
              </div>
              {item.customer_name && (
                <p className="text-[1.2rem] font-semibold text-dark text-center mt-[6px] line-clamp-1">
                  {item.customer_name}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-[16px]"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-[16px] right-[16px] w-[40px] h-[40px] rounded-full bg-white/20 text-white flex items-center justify-center text-[2rem] hover:bg-white/30 transition-colors"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>

          {/* Prev/Next */}
          {lightbox > 0 && (
            <button
              className="absolute left-[16px] top-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1) }}
            >
              ‹
            </button>
          )}
          {lightbox < items.length - 1 && (
            <button
              className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1) }}
            >
              ›
            </button>
          )}

          <div className="relative max-w-[90vw] max-h-[85vh] aspect-auto" onClick={e => e.stopPropagation()}>
            <Image
              src={items[lightbox].image_url}
              alt={items[lightbox].caption || ''}
              width={1200}
              height={900}
              className="object-contain max-h-[85vh] rounded-[8px]"
            />
            {(items[lightbox].caption || items[lightbox].customer_name) && (
              <p className="text-white text-center mt-[10px] text-[1.4rem]">
                {items[lightbox].caption || items[lightbox].customer_name}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
