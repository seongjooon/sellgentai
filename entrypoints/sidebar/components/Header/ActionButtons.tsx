import { cn } from '@/lib/utils';

interface ActionButtonsProps {
  historyCount: number;
  isBeginnerMode: boolean;
  showHistory: boolean;
  isLoading: boolean;
  canSave: boolean;
  onHistoryClick: () => void;
  onSaveClick: () => void;
  onBeginnerModeClick: () => void;
  onRefreshClick: () => void;
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label?: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

function ActionButton({
  icon,
  label,
  isActive = false,
  disabled = false,
  onClick,
  className,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center gap-1.5',
        'px-3 py-2 rounded-lg',
        'text-xs font-semibold',
        'transition-all duration-200',
        'border border-border',
        isActive
          ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/50'
          : 'bg-bg-tertiary text-text-secondary hover:bg-bg-elevated hover:text-text-primary',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'hover:scale-[1.02] active:scale-[0.98]',
        className
      )}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}

export function ActionButtons({
  historyCount,
  isBeginnerMode,
  showHistory,
  isLoading,
  canSave,
  onHistoryClick,
  onSaveClick,
  onBeginnerModeClick,
  onRefreshClick,
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {/* History Button */}
      <ActionButton
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v4l3 3" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        }
        label={`${historyCount}`}
        isActive={showHistory}
        onClick={onHistoryClick}
      />

      {/* Save Button */}
      <ActionButton
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17,21 17,13 7,13 7,21" />
            <polyline points="7,3 7,8 15,8" />
          </svg>
        }
        disabled={!canSave}
        onClick={onSaveClick}
      />

      {/* Beginner Mode Button - Hidden but functional */}
      <ActionButton
        icon={
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        }
        label={isBeginnerMode ? '초보' : '전문'}
        isActive={isBeginnerMode}
        onClick={onBeginnerModeClick}
        className="hidden"
      />

      {/* Refresh Button */}
      <ActionButton
        icon={
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={cn(isLoading && 'animate-spin')}
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        }
        disabled={isLoading}
        onClick={onRefreshClick}
      />
    </div>
  );
}
