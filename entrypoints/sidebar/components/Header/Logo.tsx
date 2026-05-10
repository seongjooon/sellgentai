import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const logoUrl = '/icon/128.png';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Logo Icon with glow effect */}
      <div className="relative">
        <div className="absolute inset-0 bg-brand-primary/30 rounded-full blur-md animate-glow-pulse" />
        <img
          src={logoUrl}
          alt="Sellgent AI Logo"
          className="relative w-9 h-9 rounded-full"
        />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <span className="text-lg font-extrabold text-gradient-primary leading-tight">
          Sellgent AI
        </span>
        <span className="text-[10px] text-text-secondary font-medium tracking-wide">
          로켓그로스 마진 계산기
        </span>
      </div>
    </div>
  );
}
