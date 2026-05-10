import { cn } from '@/lib/utils';

interface MarginBadgeProps {
  marginRate: number;
  targetRate: number;
  className?: string;
}

type BadgeStatus = 'excellent' | 'good' | 'warning' | 'danger';

interface BadgeConfig {
  status: BadgeStatus;
  label: string;
  description: string;
}

function getBadgeConfig(marginRate: number, targetRate: number): BadgeConfig {
  if (marginRate >= 30) {
    return {
      status: 'excellent',
      label: '초고수익',
      description: '대박 상품이에요!',
    };
  }
  if (marginRate >= targetRate) {
    return {
      status: 'good',
      label: '목표 달성',
      description: '잘하고 있어요!',
    };
  }
  if (marginRate >= 10) {
    return {
      status: 'warning',
      label: '마진 부족',
      description: `목표까지 ${(targetRate - marginRate).toFixed(1)}% 남음`,
    };
  }
  return {
    status: 'danger',
    label: '손실 위험',
    description: '사입가를 낮춰보세요',
  };
}

export function MarginBadge({ marginRate, targetRate, className }: MarginBadgeProps) {
  const config = getBadgeConfig(marginRate, targetRate);

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2',
        'px-3 py-1.5 rounded-full',
        'animate-badge-pop',
        'border',
        config.status === 'excellent' && 'bg-brand-primary/20 border-brand-primary/50 text-brand-primary',
        config.status === 'good' && 'bg-brand-primary/15 border-brand-primary/40 text-brand-primary',
        config.status === 'warning' && 'bg-brand-warning/20 border-brand-warning/50 text-brand-warning',
        config.status === 'danger' && 'bg-brand-danger/20 border-brand-danger/50 text-brand-danger',
        className
      )}
    >
      {/* Status dot */}
      <div
        className={cn(
          'w-2 h-2 rounded-full',
          config.status === 'excellent' && 'bg-brand-primary animate-glow-pulse',
          config.status === 'good' && 'bg-brand-primary',
          config.status === 'warning' && 'bg-brand-warning',
          config.status === 'danger' && 'bg-brand-danger'
        )}
      />

      {/* Label */}
      <span className="text-xs font-bold">{config.label}</span>

      {/* Separator */}
      <span className="text-text-tertiary">|</span>

      {/* Description */}
      <span className="text-xs text-text-secondary">{config.description}</span>
    </div>
  );
}
