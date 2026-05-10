import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  hint?: string;
  suffix?: string;
  value: string | number;
  onChange: (value: string) => void;
  variant?: 'default' | 'highlighted';
}

export function Input({
  label,
  hint,
  suffix = '원',
  value,
  onChange,
  variant = 'default',
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center gap-2',
          'px-4 py-3 rounded-xl',
          'border-2 transition-all duration-200',
          'focus-within:border-brand-primary focus-within:shadow-glow',
          variant === 'default' && 'bg-bg-tertiary border-border',
          variant === 'highlighted' && 'bg-bg-elevated border-brand-primary/50',
          className
        )}
      >
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'flex-1 bg-transparent text-right',
            'text-lg font-bold text-text-primary',
            'outline-none placeholder:text-text-tertiary'
          )}
          {...props}
        />
        {suffix && (
          <span className="text-sm text-text-secondary shrink-0">{suffix}</span>
        )}
      </div>
      {hint && (
        <p className="text-[11px] text-text-tertiary">{hint}</p>
      )}
    </div>
  );
}
