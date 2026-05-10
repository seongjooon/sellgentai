import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface AlertProps {
  variant: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function Alert({ variant, title, children, action, className }: AlertProps) {
  const icons = {
    success: '✅',
    warning: '⚠️',
    danger: '❌',
    info: '💡',
  };

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-4',
        'animate-slide-in',
        variant === 'success' && 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary',
        variant === 'warning' && 'bg-brand-warning/10 border-brand-warning/30 text-brand-warning',
        variant === 'danger' && 'bg-brand-danger/10 border-brand-danger/30 text-brand-danger',
        variant === 'info' && 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        className
      )}
    >
      {title && (
        <div className="flex items-center gap-2 mb-2">
          <span>{icons[variant]}</span>
          <span className="font-bold text-[15px]">{title}</span>
        </div>
      )}
      <div className="text-sm opacity-90">{children}</div>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
