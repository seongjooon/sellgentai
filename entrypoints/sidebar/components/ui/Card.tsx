import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'success' | 'warning' | 'danger' | 'info';
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all duration-200',
        variant === 'default' && 'bg-bg-card border-border',
        variant === 'elevated' && 'bg-bg-elevated border-border shadow-md',
        variant === 'success' && 'bg-brand-primary/10 border-brand-primary/30',
        variant === 'warning' && 'bg-brand-warning/10 border-brand-warning/30',
        variant === 'danger' && 'bg-brand-danger/10 border-brand-danger/30',
        variant === 'info' && 'bg-blue-500/10 border-blue-500/30',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  icon?: ReactNode;
  title: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ icon, title, action, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-sm">{icon}</span>}
        <h3 className="text-sm font-bold text-text-primary">{title}</h3>
      </div>
      {action}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('space-y-3', className)}>{children}</div>;
}
