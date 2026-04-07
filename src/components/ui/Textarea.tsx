import { cn } from '@/lib/utils';
import { type TextareaHTMLAttributes } from 'react';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({ label, className, id, ...props }: Props) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-text-dark mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          'w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-colors resize-y min-h-[100px]',
          className
        )}
        {...props}
      />
    </div>
  );
}
