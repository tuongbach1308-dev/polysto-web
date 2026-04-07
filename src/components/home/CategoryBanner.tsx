import Link from 'next/link';
import { categories } from '@/data/categories';
import { getCategoryIcon } from '@/lib/category-icons';

export default function CategoryBanner() {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide md:grid md:grid-cols-5 lg:grid-cols-7 md:overflow-visible">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/san-pham/${cat.slug}`}
          className="group flex flex-col items-center gap-2.5 bg-bg-gray rounded-xl p-4 hover:shadow-md hover:bg-white hover:border-navy/10 border border-transparent transition-all shrink-0 w-[100px] md:w-auto"
        >
          <div className="w-14 h-14 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-200">
            {getCategoryIcon(cat.slug, 40)}
          </div>
          <span className="text-xs font-medium text-text-dark text-center leading-tight whitespace-nowrap">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}
