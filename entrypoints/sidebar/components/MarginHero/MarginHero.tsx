import { cn } from '@/lib/utils';
import { MarginDisplay } from './MarginDisplay';
import { MarginGauge } from './MarginGauge';
import { MarginBadge } from './MarginBadge';

interface MarginHeroProps {
  netProfit: number;
  marginRate: number;
  targetRate: number;
  className?: string;
}

export function MarginHero({
  netProfit,
  marginRate,
  targetRate,
  className,
}: MarginHeroProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        'bg-bg-card rounded-xl',
        'border border-border',
        'p-5',
        className
      )}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-glow-primary pointer-events-none" />

      {/* Animated border glow */}
      <div className="border-glow" />

      <div className="relative z-10 space-y-5">
        {/* Section Label */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-brand-primary rounded-full" />
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            예상 수익 분석
          </span>
        </div>

        {/* Main Metrics Display */}
        <MarginDisplay
          netProfit={netProfit}
          marginRate={marginRate}
          targetRate={targetRate}
        />

        {/* Gauge */}
        <MarginGauge
          current={marginRate}
          target={targetRate}
        />

        {/* Badge */}
        <div className="flex justify-center">
          <MarginBadge
            marginRate={marginRate}
            targetRate={targetRate}
          />
        </div>
      </div>
    </div>
  );
}
