import { cn } from '@/lib/utils';
import { type InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, id, ...props }: Props) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-dark mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors',
          error && 'border-discount-red',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-discount-red">{error}</p>}
    </div>
  );
}
