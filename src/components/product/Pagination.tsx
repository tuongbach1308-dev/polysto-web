import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scrollTargetId?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, scrollTargetId }: Props) {
  const handlePage = (page: number) => {
    onPageChange(page);
    if (scrollTargetId) {
      document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        onClick={() => handlePage(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn('w-9 h-9 rounded-lg flex items-center justify-center transition-colors', currentPage === 1 ? 'text-border cursor-not-allowed' : 'text-text-muted hover:bg-bg-gray hover:text-text-dark')}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-text-muted text-sm">...</span>
        ) : (
          <button
            key={p}
            onClick={() => handlePage(p)}
            className={cn(
              'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
              currentPage === p ? 'bg-navy text-white' : 'text-text-muted hover:bg-bg-gray hover:text-text-dark'
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => handlePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn('w-9 h-9 rounded-lg flex items-center justify-center transition-colors', currentPage === totalPages ? 'text-border cursor-not-allowed' : 'text-text-muted hover:bg-bg-gray hover:text-text-dark')}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
