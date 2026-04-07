import { cn } from '@/lib/utils';
import { type SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export default function Select({ label, options, className, id, ...props }: Props) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-dark mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors',
          className
        )}
        {...props}
      >
        <option value="">Chọn...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
