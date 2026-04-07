import { Tablet, Laptop, Headphones, Zap, Shield, Pencil, Package } from 'lucide-react';
import type { ReactNode } from 'react';

const iconMap: Record<string, ReactNode> = {
  ipad: <Tablet className="w-full h-full text-indigo-500" strokeWidth={1.5} />,
  macbook: <Laptop className="w-full h-full text-sky-500" strokeWidth={1.5} />,
  'am-thanh': <Headphones className="w-full h-full text-slate-400" strokeWidth={1.5} />,
  'phu-kien-apple': <Zap className="w-full h-full text-amber-500" strokeWidth={1.5} />,
  'phu-kien-ipad': <Shield className="w-full h-full text-blue-500" strokeWidth={1.5} />,
  'but-cam-ung': <Pencil className="w-full h-full text-orange-400" strokeWidth={1.5} />,
  'phu-kien-khac': <Package className="w-full h-full text-amber-600" strokeWidth={1.5} />,
};

export function getCategoryIcon(slug: string, size = 20): ReactNode {
  return (
    <span className="shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
      {iconMap[slug] || <Package className="w-full h-full text-gray-400" strokeWidth={1.5} />}
    </span>
  );
}
