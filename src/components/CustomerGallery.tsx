"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface CustomerPhoto {
  url: string;
  alt: string;
}

export default function CustomerGallery({ images }: { images?: CustomerPhoto[] }) {
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

  const hasImages = images && images.length > 0;

  // Need at least a few items for seamless loop — duplicate if less than 6
  const displayImages = hasImages
    ? images.length < 6 ? [...images, ...images, ...images] : [...images, ...images]
    : [];

  if (!hasImages) return null;

  return (
    <section className="py-6 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-sm font-bold text-gray-800 text-center uppercase tracking-wide mb-4">
          Cảm ơn khách hàng đã tin tưởng POLY Store
        </h2>

        <div
          ref={scrollRef}
          className="overflow-hidden rounded-lg"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="inline-flex gap-2" style={{ WebkitOverflowScrolling: "touch" }}>
            {displayImages.map((photo, i) => (
              <div
                key={i}
                className="w-[180px] h-[240px] flex-shrink-0 rounded-lg overflow-hidden relative bg-gray-100"
              >
                <Image
                  src={photo.url}
                  alt={photo.alt || `Khách hàng ${(i % (images?.length || 1)) + 1}`}
                  fill
                  className="object-cover"
                  sizes="180px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
