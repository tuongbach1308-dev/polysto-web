import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({ variant = 'primary', size = 'md', className, children, ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-navy/20',
        {
          'bg-navy text-white hover:bg-navy-dark': variant === 'primary',
          'bg-bg-gray text-text-dark hover:bg-gray-200': variant === 'secondary',
          'border border-navy text-navy hover:bg-navy hover:text-white': variant === 'outline',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-5 py-2.5 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
