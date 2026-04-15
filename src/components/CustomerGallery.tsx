"use client";

import { useEffect, useRef } from "react";

const PHOTOS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  alt: `Khách hàng ${i + 1}`,
}));

export default function CustomerGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId: number;
    let pos = 0;

    function step() {
      pos += 0.5;
      if (pos >= el!.scrollWidth / 2) pos = 0;
      el!.scrollLeft = pos;
      animId = requestAnimationFrame(step);
    }

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section className="py-6 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-sm font-bold text-gray-800 text-center uppercase tracking-wide mb-4">
          Cảm ơn khách hàng đã tin tưởng POLY Store
        </h2>

        {/* Auto-scroll strip — contained within max-w */}
        <div
          ref={scrollRef}
          className="overflow-hidden rounded-lg"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="inline-flex gap-2" style={{ WebkitOverflowScrolling: "touch" }}>
            {[...PHOTOS, ...PHOTOS].map((photo, i) => (
              <div
                key={i}
                className="w-[220px] h-[160px] flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
              >
                <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-gray-100 to-gray-50">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-gray-400">{photo.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
