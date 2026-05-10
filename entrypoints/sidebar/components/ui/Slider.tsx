import { cn } from '@/lib/utils';

interface SliderProps {
  label?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export function Slider({
  label,
  hint,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  formatValue = (v) => `${v}%`,
}: SliderProps) {
  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="slider-custom flex-1"
        />
        <div className="min-w-[70px] text-right text-2xl font-black text-brand-primary">
          {formatValue(value)}
        </div>
      </div>
      {hint && (
        <p className="text-[11px] text-text-tertiary">{hint}</p>
      )}
    </div>
  );
}
