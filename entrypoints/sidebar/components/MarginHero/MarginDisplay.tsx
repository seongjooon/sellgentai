import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface MarginDisplayProps {
  netProfit: number;
  marginRate: number;
  targetRate: number;
  className?: string;
}

// Count up animation hook
function useCountUp(end: number, duration: number = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function - ease out quad
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentCount = startValue + (end - startValue) * easeOutQuad(progress);

      setCount(Math.floor(currentCount));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    if (end !== 0) {
      requestAnimationFrame(animate);
    } else {
      setCount(0);
    }
  }, [end, duration]);

  return count;
}

export function MarginDisplay({
  netProfit,
  marginRate,
  targetRate,
  className,
}: MarginDisplayProps) {
  const animatedProfit = useCountUp(netProfit);
  const animatedMargin = useCountUp(marginRate * 10) / 10;

  const isPositive = netProfit >= 0;
  const meetsTarget = marginRate >= targetRate;

  const formatKRW = (value: number) => `${Math.floor(value).toLocaleString('ko-KR')}`;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Net Profit */}
      <div className="text-center">
        <div className="text-xs text-text-secondary mb-1">예상 순이익</div>
        <div
          className={cn(
            'text-4xl font-extrabold font-mono tracking-tight',
            'animate-value-appear',
            isPositive ? 'text-gradient-primary' : 'text-gradient-danger'
          )}
        >
          {isPositive ? '+' : ''}{formatKRW(animatedProfit)}
          <span className="text-lg ml-1">원</span>
        </div>
      </div>

      {/* Margin Rate */}
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <div className="text-xs text-text-secondary mb-1">마진율</div>
          <div
            className={cn(
              'text-2xl font-bold font-mono',
              meetsTarget ? 'text-brand-primary' : 'text-brand-warning'
            )}
          >
            {animatedMargin.toFixed(1)}%
          </div>
        </div>

        <div className="w-px h-8 bg-border" />

        <div className="text-center">
          <div className="text-xs text-text-secondary mb-1">목표</div>
          <div className="text-2xl font-bold font-mono text-text-tertiary">
            {targetRate}%
          </div>
        </div>
      </div>
    </div>
  );
}
