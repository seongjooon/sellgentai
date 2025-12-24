import React from 'react';

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
        emoji: '💡',
        title: '이 가격으로 사입하면 성공!',
        description: '마진이 좋아요. 자신있게 판매하세요.',
        bgColor: '#dcfce7',
        textColor: '#166534',
        borderColor: '#86efac',
      };
    } else if (marginRate >= 10 && netProfit > 0) {
      return {
        emoji: '💡',
        title: '사입가를 더 낮춰보세요',
        description: '마진이 조금 아쉬워요. 더 좋은 가격에 사입하거나 다른 상품을 찾아보세요.',
        bgColor: '#fef3c7',
        textColor: '#92400e',
        borderColor: '#fcd34d',
      };
    } else {
      return {
        emoji: '🚨',
        title: '이 상품은 손해예요!',
        description: '다른 상품을 찾아보세요. 마진이 너무 낮거나 손실이 예상돼요.',
        bgColor: '#fee2e2',
        textColor: '#991b1b',
        borderColor: '#fca5a5',
      };
    }
  };

  const advice = getActionAdvice();

  return (
    <div
      style={{
        background: advice.bgColor,
        border: `2px solid ${advice.borderColor}`,
        borderRadius: '12px',
        padding: '16px',
        marginTop: '12px',
        animation: 'slideIn 0.6s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ fontSize: '24px' }}>{advice.emoji}</div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: advice.textColor,
              marginBottom: '6px',
            }}
          >
            {advice.title}
          </div>
          <div
            style={{
              fontSize: '13px',
              color: advice.textColor,
              lineHeight: '1.5',
              marginBottom: '10px',
            }}
          >
            {advice.description}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: advice.textColor,
              opacity: 0.8,
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '6px',
            }}
          >
            💡 <strong>팁:</strong> 평균적으로 성공하는 셀러들은 20% 이상 마진을 남겨요
          </div>
        </div>
      </div>
    </div>
  );
};
