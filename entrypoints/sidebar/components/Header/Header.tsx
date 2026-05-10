import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { ActionButtons } from './ActionButtons';

interface HeaderProps {
  historyCount: number;
  isBeginnerMode: boolean;
  showHistory: boolean;
  isLoading: boolean;
  canSave: boolean;
  isDarkMode: boolean;
  onHistoryClick: () => void;
  onSaveClick: () => void;
  onBeginnerModeClick: () => void;
  onRefreshClick: () => void;
  onThemeToggle: () => void;
  className?: string;
}

export function Header({
  historyCount,
  isBeginnerMode,
  showHistory,
  isLoading,
  canSave,
  isDarkMode,
  onHistoryClick,
  onSaveClick,
  onBeginnerModeClick,
  onRefreshClick,
  onThemeToggle,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'relative overflow-hidden',
        'bg-bg-secondary border-b border-border',
        'px-4 py-4',
        className
      )}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-glow-primary pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Logo and Theme Toggle */}
        <div className="flex items-center justify-between">
          <Logo />

          {/* Theme Toggle Button */}
          <button
            onClick={onThemeToggle}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg',
              'text-xs font-semibold',
              'transition-all duration-200',
              'border border-border',
              'bg-bg-tertiary text-text-secondary',
              'hover:bg-bg-elevated hover:text-text-primary',
              'hover:scale-[1.02] active:scale-[0.98]'
            )}
          >
            {isDarkMode ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <span>라이트</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span>다크</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <ActionButtons
          historyCount={historyCount}
          isBeginnerMode={isBeginnerMode}
          showHistory={showHistory}
          isLoading={isLoading}
          canSave={canSave}
          onHistoryClick={onHistoryClick}
          onSaveClick={onSaveClick}
          onBeginnerModeClick={onBeginnerModeClick}
          onRefreshClick={onRefreshClick}
        />
      </div>
    </header>
  );
}

export { Logo } from './Logo';
export { ActionButtons } from './ActionButtons';
