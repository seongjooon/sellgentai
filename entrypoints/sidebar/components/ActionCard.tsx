import React from 'react';
import { Alert } from './ui';

interface ActionCardProps {
  marginRate: number;
  netProfit: number;
  recommendedMaxCost: number;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  marginRate,
  netProfit,
  recommendedMaxCost,
}) => {
  const getActionAdvice = () => {
    if (marginRate >= 20 && netProfit > 0) {
      return {
        variant: 'success' as const,
        emoji: '✅',
        title: '좋아요! 계속하세요',
        description: '목표 20% 달성! 자신있게 사입하세요',
      };
    } else if (marginRate >= 10 && netProfit > 0) {
      return {
        variant: 'warning' as const,
        emoji: '⚠️',
        title: '사입가를 더 낮춰보세요',
        description: '마진이 조금 아쉬워요. 더 좋은 가격에 사입하거나 다른 상품을 찾아보세요.',
      };
    } else {
      return {
        variant: 'danger' as const,
        emoji: '❌',
        title: '이 상품은 손해예요!',
        description: '다른 상품을 찾아보세요. 마진이 너무 낮거나 손실이 예상돼요.',
      };
    }
  };

  const advice = getActionAdvice();

  return (
    <Alert
      variant={advice.variant}
      title={`${advice.emoji} ${advice.title}`}
      className="animate-slide-in"
    >
      <p className="mb-2">{advice.description}</p>
      <div className="mt-3 text-xs opacity-80 p-2 bg-white/10 rounded-lg">
        💡 <strong>팁:</strong> 평균적으로 성공하는 셀러들은 20% 이상 마진을 남겨요
      </div>
    </Alert>
  );
};
