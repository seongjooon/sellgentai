import React, { useState } from 'react';
import { getPlainTerm, getDetailExplanation } from '../constants/plainLanguage';

interface TermWithTooltipProps {
  term: string;
  isBeginnerMode: boolean;
}

/**
 * 전문 용어에 툴팁을 추가하는 컴포넌트
 * 초보 모드일 때는 평어를 함께 표시
 */
export const TermWithTooltip: React.FC<TermWithTooltipProps> = ({ term, isBeginnerMode }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const plainText = getPlainTerm(term);
  const detailText = getDetailExplanation(term);

  return (
    <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ fontWeight: 700 }}>
        {isBeginnerMode ? plainText : term}
      </span>

      {/* 정보 아이콘 */}
      <span
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: '#e0e0e0',
          fontSize: '11px',
          cursor: 'help',
          userSelect: 'none',
        }}
      >
        ℹ️
      </span>

      {/* 툴팁 */}
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            padding: '10px 12px',
            background: '#2d4a3e',
            color: 'white',
            borderRadius: '8px',
            fontSize: '12px',
            lineHeight: '1.5',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {isBeginnerMode && detailText ? (
            <div>
              <div style={{ marginBottom: '4px', opacity: 0.8 }}>
                <strong>{term}</strong>
              </div>
              <div>{detailText}</div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '4px' }}>
                <strong>{plainText}</strong>
              </div>
              {detailText && <div style={{ opacity: 0.9 }}>{detailText}</div>}
            </div>
          )}

          {/* 툴팁 화살표 */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #2d4a3e',
            }}
          />
        </div>
      )}
    </span>
  );
};
