import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav className="flex items-center gap-1.5 text-sm py-3 overflow-x-auto scrollbar-hide">
      <Link href="/" className="flex items-center gap-1 text-text-muted hover:text-navy transition-colors shrink-0">
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Trang chủ</span>
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5 shrink-0">
            <ChevronRight className="h-3 w-3 text-border" />
            {!isLast && item.href ? (
              <Link href={item.href} className="text-text-muted hover:text-navy transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-text-dark font-medium truncate max-w-[200px] lg:max-w-none">
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
