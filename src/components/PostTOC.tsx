"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function PostTOC() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState("");

  /* Extract headings from .post-body */
  useEffect(() => {
    const el = document.querySelector(".post-body");
    if (!el) return;

    const nodes = el.querySelectorAll("h2, h3");
    const items: Heading[] = [];

    nodes.forEach((node, i) => {
      const id = node.id || `heading-${i}`;
      if (!node.id) node.id = id;
      items.push({
        id,
        text: node.textContent || "",
        level: node.tagName === "H2" ? 2 : 3,
      });
    });

    setHeadings(items);
  }, []);

  /* Track active heading on scroll */
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-1">
      <p className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-3">Mục lục</p>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className={`block text-[13px] leading-snug py-1 border-l-2 transition-colors ${
            h.level === 3 ? "pl-5" : "pl-3"
          } ${
            activeId === h.id
              ? "border-brand-500 text-brand-600 font-medium"
              : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300"
          }`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  );
}
