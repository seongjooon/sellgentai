import { cn } from '@/lib/utils';
import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  hint?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

export function Select({
  label,
  hint,
  options,
  value,
  onChange,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full px-4 py-3 rounded-xl',
          'text-[15px] font-semibold',
          'bg-bg-tertiary border-2 border-brand-primary/50',
          'text-text-primary cursor-pointer',
          'outline-none transition-all duration-200',
          'focus:border-brand-primary focus:shadow-glow',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && (
        <p className="text-[11px] text-text-tertiary">{hint}</p>
      )}
    </div>
  );
}
