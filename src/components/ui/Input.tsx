'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={id} className="block text-sm font-accent tracking-wider uppercase text-muted">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-surface border border-border rounded-[3px] px-4 py-3 text-foreground placeholder:text-muted-dark transition-all duration-300 focus:border-gold focus:ring-1 focus:ring-gold/30',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
