"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronRight, Phone, MapPin, Folder } from "lucide-react";
import { Tablet, Laptop, Headphones, Cable, Smartphone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/database.types";

const ICON_MAP: Record<string, typeof Tablet> = {
  ipad: Tablet, macbook: Laptop, "am-thanh": Headphones,
  airpods: Headphones, "phu-kien": Cable, iphone: Smartphone,
};

const LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Tin công nghệ", href: "/tin-tuc" },
  { label: "Cửa hàng", href: "/cua-hang" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Liên hệ", href: "/lien-he" },
  { label: "Tra cứu đơn hàng", href: "/tra-cuu-don-hang" },
];

const CACHE_KEY = "polystore-mobile-categories";
const CACHE_TTL = 5 * 60 * 1000;

interface CategoryNode extends Category {
  children: CategoryNode[];
}

export default function MobileDrawer({ open, onClose, phone, address }: { open: boolean; onClose: () => void; phone?: string; address?: string }) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setExpandedIds(new Set()); // reset on close
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) setCategories(data);
        } catch {}
      }
    }
    const supabase = createClient();
    supabase.from("categories").select("*").eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setCategories(data as Category[]);
          if (typeof window !== "undefined") {
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
          }
        }
      });
  }, []);

  const tree = useMemo(() => {
    const map = new Map<string, CategoryNode>();
    const roots: CategoryNode[] = [];
    categories.forEach((cat) => map.set(cat.id, { ...cat, children: [] }));
    map.forEach((node) => {
      if (node.parent_id && map.has(node.parent_id)) {
        map.get(node.parent_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });
    function sortByOrder(nodes: CategoryNode[]) {
      nodes.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
      nodes.forEach((n) => sortByOrder(n.children));
    }
    sortByOrder(roots);
    return roots;
  }, [categories]);

  const pathMap = useMemo(() => {
    const map = new Map<string, string>();
    function walk(nodes: CategoryNode[], prefix: string) {
      for (const node of nodes) {
        const path = prefix ? `${prefix}/${node.slug}` : node.slug;
        map.set(node.id, path);
        walk(node.children, path);
      }
    }
    walk(tree, "");
    return map;
  }, [tree]);

  function buildHref(catId: string) {
    const path = pathMap.get(catId);
    return path ? `/san-pham/${path}` : "/san-pham";
  }

  // Same logic as desktop: max 2 levels, hidden promote children
  const menuItems = useMemo(() => {
    const items: CategoryNode[] = [];
    function collect(nodes: CategoryNode[], depth: number) {
      if (depth >= 2) return;
      for (const node of nodes) {
        if (node.is_active) items.push(node);
        else collect(node.children, depth + 1);
      }
    }
    collect(tree, 0);
    return items;
  }, [tree]);

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1400]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-[300px] bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-gray-100 shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <Image src="/logo.svg" alt="POLY Store" width={28} height={28} className="rounded-md" />
            <span className="font-bold text-gray-900">POLY<span className="text-brand-500">Store</span></span>
          </Link>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100 cursor-pointer"><X size={20} /></button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Categories */}
          <div className="py-1">
            {menuItems.map((cat) => (
              <MobileMenuItem
                key={cat.id}
                node={cat}
                depth={0}
                expandedIds={expandedIds}
                toggleExpand={toggleExpand}
                buildHref={buildHref}
                onClose={onClose}
              />
            ))}
          </div>

          {/* Links */}
          <div className="border-t border-gray-100 py-1">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={onClose}
                className="block px-4 py-2.5 text-sm text-gray-600 hover:text-brand-500 hover:bg-gray-50 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-3 shrink-0 space-y-2">
          <a href={`tel:${(phone || "0815242433").replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-brand-600 font-medium">
            <Phone size={14} /> {phone ? phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3") : "0815 242 433"}
          </a>
          {(() => {
            let addr = "";
            try { const locs = address ? JSON.parse(address) : []; if (locs[0]?.address) addr = locs[0].address; } catch { /* */ }
            return addr ? (
              <p className="flex items-center gap-2 text-xs text-gray-400">
                <MapPin size={12} /> {addr}
              </p>
            ) : null;
          })()}
        </div>
      </div>
    </div>
  );
}

/** Recursive menu item — each level collapses independently */
function MobileMenuItem({
  node,
  depth,
  expandedIds,
  toggleExpand,
  buildHref,
  onClose,
}: {
  node: CategoryNode;
  depth: number;
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  buildHref: (id: string) => string;
  onClose: () => void;
}) {
  const hasChildren = node.children.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const Icon = ICON_MAP[node.slug] || Folder;
  const pl = depth === 0 ? "pl-4" : depth === 1 ? "pl-10" : "pl-14";

  return (
    <div>
      <div className={`flex items-center ${pl} pr-2`}>
        <Link
          href={buildHref(node.id)}
          onClick={onClose}
          className="flex-1 flex items-center gap-2.5 py-2.5 min-w-0"
        >
          {depth === 0 && (
            node.image_url
              ? <img src={node.image_url} alt={node.name} className="w-5 h-5 rounded object-cover shrink-0" />
              : <Icon size={17} className="text-brand-500 shrink-0" />
          )}
          <span className={`truncate ${
            depth === 0 ? "text-sm font-semibold text-gray-800" :
            depth === 1 ? "text-sm text-gray-700" :
            "text-xs text-gray-500"
          }`}>
            {node.name}
          </span>
        </Link>
        {hasChildren && (
          <button
            onClick={() => toggleExpand(node.id)}
            className="p-2 shrink-0 cursor-pointer"
          >
            <ChevronRight
              size={14}
              className={`text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
            />
          </button>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div className={depth === 0 ? "bg-gray-50/70" : ""}>
          {node.children.map((child) => (
            <MobileMenuItem
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              buildHref={buildHref}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}
