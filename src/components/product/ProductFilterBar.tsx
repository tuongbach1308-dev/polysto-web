'use client';

import { X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

type SortBy = 'default' | 'price-asc' | 'price-desc';

const sortOptions: { value: SortBy; label: string }[] = [
  { value: 'default', label: 'Mặc định' },
  { value: 'price-asc', label: 'Giá thấp → cao' },
  { value: 'price-desc', label: 'Giá cao → thấp' },
];

interface FilterChip {
  label: string;
  onRemove: () => void;
}

interface Props {
  totalCount: number;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  filterChips: FilterChip[];
  onClearAll: () => void;
  onMobileFilterOpen: () => void;
}

export type { SortBy, FilterChip };

export default function ProductFilterBar({ totalCount, sortBy, onSortChange, filterChips, onClearAll, onMobileFilterOpen }: Props) {
  return (
    <div className="mb-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileFilterOpen}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-sm text-text-muted hover:text-text-dark hover:bg-bg-gray transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Bộ lọc
          </button>
          <p className="text-sm text-text-muted">{totalCount} sản phẩm</p>
        </div>
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-text-muted" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            className="text-sm text-text-dark bg-transparent border-none focus:outline-none cursor-pointer font-medium"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {filterChips.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {filterChips.map((chip, i) => (
            <button
              key={i}
              onClick={chip.onRemove}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy/10 text-navy text-xs font-medium rounded-full hover:bg-navy/20 transition-colors"
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button onClick={onClearAll} className="text-xs text-discount-red font-medium link-hover">
            Xóa tất cả
          </button>
        </div>
      )}
    </div>
  );
}
