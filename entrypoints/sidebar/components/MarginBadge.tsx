import React from 'react';

interface MarginBadgeProps {
  marginRate: number;
  targetRate: number;
}

export const MarginBadge: React.FC<MarginBadgeProps> = ({ marginRate, targetRate }) => {
  const getMarginEvaluation = () => {
    if (marginRate >= 30) {
      return {
        emoji: '🎉',
        text: '대박! 초고수익 상품',
        color: '#22c55e',
        bgColor: '#dcfce7',
        borderColor: '#86efac',
      };
    } else if (marginRate >= 20) {
      return {
        emoji: '✅',
        text: '좋아요! 괜찮은 마진',
        color: '#16a34a',
        bgColor: '#dcfce7',
        borderColor: '#86efac',
      };
    } else if (marginRate >= 10) {
      return {
        emoji: '⚠️',
        text: '조심! 마진이 낮아요',
        color: '#92400e',
        bgColor: '#fef3c7',
        borderColor: '#fcd34d',
      };
    } else {
      return {
        emoji: '❌',
        text: '위험! 이익이 거의 없어요',
        color: '#991b1b',
        bgColor: '#fee2e2',
        borderColor: '#fca5a5',
      };
    }
  };

  const evaluation = getMarginEvaluation();

  return (
    <div
      style={{
        background: evaluation.bgColor,
        border: `2px solid ${evaluation.borderColor}`,
        borderRadius: '12px',
        padding: '16px',
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'slideIn 0.5s ease',
      }}
    >
      <div style={{ fontSize: '32px' }}>{evaluation.emoji}</div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 800,
            color: evaluation.color,
            marginBottom: '4px',
          }}
        >
          {evaluation.text}
        </div>
        <div style={{ fontSize: '12px', color: evaluation.color }}>
          {marginRate >= targetRate
            ? `목표 ${targetRate}% 달성! 계속 이렇게 하세요 👍`
            : `목표까지 ${(targetRate - marginRate).toFixed(1)}% 남았어요`}
        </div>
      </div>
    </div>
  );
};
