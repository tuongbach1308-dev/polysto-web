'use client';

import { cn } from '@/lib/utils';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm rounded-lg border border-border disabled:opacity-40 hover:bg-bg-gray transition-colors"
      >
        ←
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            'w-9 h-9 text-sm rounded-lg transition-colors',
            page === currentPage
              ? 'bg-navy text-white'
              : 'border border-border hover:bg-bg-gray'
          )}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm rounded-lg border border-border disabled:opacity-40 hover:bg-bg-gray transition-colors"
      >
        →
      </button>
    </div>
  );
}
