import { cn } from '@/lib/utils';
import type { CalculationHistory } from '../../types';
import type { ProductSizeTier } from '../../feeCalculator';

interface HistoryPanelProps {
  history: CalculationHistory[];
  onClose: () => void;
  onClearAll: () => void;
  onDelete: (id: string) => void;
  onSelect: (item: CalculationHistory) => void;
}

interface HistoryItemProps {
  item: CalculationHistory;
  onDelete: (id: string) => void;
  onSelect: (item: CalculationHistory) => void;
}

function HistoryItem({ item, onDelete, onSelect }: HistoryItemProps) {
  const date = new Date(item.timestamp);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

  const getMarginColor = (rate: number) => {
    if (rate >= 15) return 'text-brand-primary';
    if (rate >= 10) return 'text-brand-warning';
    return 'text-brand-danger';
  };

  return (
    <div
      className={cn(
        'p-3 rounded-xl cursor-pointer',
        'bg-white/10 border border-white/20',
        'transition-all duration-200',
        'hover:bg-white/20 hover:-translate-y-0.5'
      )}
      onClick={() => onSelect(item)}
    >
      {/* Title and Delete */}
      <div className="flex justify-between items-start gap-2 mb-2">
        <div className="flex-1 text-[13px] font-semibold text-white leading-snug line-clamp-2">
          {item.productTitle || '제목 없음'}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className={cn(
            'shrink-0 px-2 py-1 text-[11px]',
            'rounded-md border border-white/30',
            'bg-brand-danger/20 text-white',
            'hover:bg-brand-danger/30 transition-colors'
          )}
        >
          삭제
        </button>
      </div>

      {/* Date */}
      <div className="text-[11px] text-white/50 mb-2">
        {formattedDate}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-[10px] text-white/50 mb-0.5">마진율</div>
          <div className={cn('text-[13px] font-bold', getMarginColor(item.marginRate))}>
            {item.marginRate.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-[10px] text-white/50 mb-0.5">순이익</div>
          <div className={cn(
            'text-[13px] font-bold',
            item.netProfit >= 0 ? 'text-brand-primary' : 'text-brand-danger'
          )}>
            {Math.floor(item.netProfit).toLocaleString()}원
          </div>
        </div>
        <div>
          <div className="text-[10px] text-white/50 mb-0.5">판매가</div>
          <div className="text-[13px] font-semibold text-white">
            {Math.floor(item.salePrice).toLocaleString()}원
          </div>
        </div>
      </div>
    </div>
  );
}

export function HistoryPanel({
  history,
  onClose,
  onClearAll,
  onDelete,
  onSelect,
}: HistoryPanelProps) {
  return (
    <div className={cn(
      'mx-4 mb-4 p-4',
      'bg-bg-card rounded-xl',
      'border border-border',
      'animate-slide-in'
    )}>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-bold text-text-primary">
          계산 히스토리
        </h3>
        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className={cn(
              'px-3 py-1.5 text-xs font-semibold',
              'rounded-lg border border-brand-danger/30',
              'bg-brand-danger/20 text-brand-danger',
              'hover:bg-brand-danger/30 transition-colors'
            )}
          >
            전체 삭제
          </button>
        )}
      </div>

      {/* Content */}
      {history.length === 0 ? (
        <div className="py-8 text-center text-sm text-text-tertiary">
          저장된 히스토리가 없습니다.
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-2">
          {history.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
