import { cn } from '@/lib/utils';

interface MarginGaugeProps {
  current: number;
  target: number;
  className?: string;
}

type GaugeStatus = 'danger' | 'warning' | 'success';

function getGaugeStatus(current: number, target: number): GaugeStatus {
  if (current < 0) return 'danger';
  if (current < target) return 'warning';
  return 'success';
}

export function MarginGauge({ current, target, className }: MarginGaugeProps) {
  const maxValue = Math.max(50, target + 10);
  const currentPercent = Math.min(Math.max(0, (current / maxValue) * 100), 100);
  const targetPercent = (target / maxValue) * 100;
  const status = getGaugeStatus(current, target);

  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary">마진율 게이지</span>
        <span className="text-text-tertiary">목표 {target.toFixed(1)}%</span>
      </div>

      {/* Gauge Bar */}
      <div className="relative h-2 bg-bg-primary rounded-full overflow-hidden">
        {/* Fill */}
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full',
            'transition-all duration-1000 ease-out',
            'animate-progress-slide',
            status === 'success' && 'gauge-fill-primary',
            status === 'warning' && 'gauge-fill-warning',
            status === 'danger' && 'gauge-fill-danger'
          )}
          style={{ width: `${currentPercent}%` }}
        />

        {/* Target Marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-text-primary rounded-full"
          style={{ left: `${targetPercent}%` }}
        >
          {/* Target tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-bg-elevated rounded text-[9px] text-text-secondary whitespace-nowrap">
            {target}%
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 text-xs">
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            status === 'success' && 'bg-brand-primary',
            status === 'warning' && 'bg-brand-warning',
            status === 'danger' && 'bg-brand-danger'
          )}
        />
        <span
          className={cn(
            status === 'success' && 'text-brand-primary',
            status === 'warning' && 'text-brand-warning',
            status === 'danger' && 'text-brand-danger'
          )}
        >
          {status === 'success' && '목표 달성'}
          {status === 'warning' && '목표 미달'}
          {status === 'danger' && '손실 위험'}
        </span>
      </div>
    </div>
  );
}
