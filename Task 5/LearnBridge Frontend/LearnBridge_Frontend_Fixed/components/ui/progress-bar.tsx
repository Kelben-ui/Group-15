import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, variant = 'default', ...props }, ref) => {
    const percentage = (value / max) * 100;
    
    const variants = {
      default: 'bg-primary',
      success: 'bg-secondary',
      warning: 'bg-accent',
      error: 'bg-destructive',
    };

    return (
      <div
        ref={ref}
        className={cn('w-full h-2 bg-muted rounded-full overflow-hidden', className)}
        {...props}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-300', variants[variant])}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    );
  }
);
ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
