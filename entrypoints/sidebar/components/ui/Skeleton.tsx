import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export function Skeleton({ className, height = '20px', width = '100%' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg skeleton-bg animate-shimmer',
        className
      )}
      style={{ height, width }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-bg-card rounded-xl border border-border p-4 space-y-3">
      <Skeleton height="24px" width="60%" />
      <Skeleton height="16px" />
      <Skeleton height="16px" />
    </div>
  );
}
