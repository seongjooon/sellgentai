import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { CommonProductData } from './types';
import {
  calculateRocketGrossFees,
  getCategoryFeeRate,
  getMatchedCategoryName,
  getLogisticsFee,
  PRODUCT_SIZE_INFO,
  type ProductSizeTier,
} from './feeCalculator';
import { MarginBadge } from './components/MarginBadge';
import { ActionCard } from './components/ActionCard';
import { TermWithTooltip } from './components/TermWithTooltip';
import { getPlainTerm } from './constants/plainLanguage';
import {
  estimateCost,
  getRecommendedSize,
  COST_HINT_MESSAGE,
  TARGET_MARGIN_HINT_MESSAGE,
} from './constants/smartDefaults';

// Sellgent AI 브랜드 컬러 팔레트
const colors = {
  // 메인 브랜드 컬러 (로고의 다크 그린)
  primary: '#2d4a3e',
  primaryLight: '#3d5a4e',
  primaryDark: '#1d3a2e',

  // 액센트 컬러 (밝은 그린)
  accent: '#4ade80',
  accentHover: '#22c55e',
  accentSoft: '#dcfce7',
  accentText: '#166534',

  // 배경
  bg: '#f8fafb',
  bgGradient: 'linear-gradient(135deg, #f8fafb 0%, #e8f4f0 100%)',
  panel: '#ffffff',
  panelHover: '#fafafa',

  // 테두리 및 텍스트
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  text: '#111827',
  textMuted: '#6b7280',
  textLight: '#9ca3af',

  // 입력 필드
  fieldBg: '#f9fafb',
  fieldBorder: '#d1d5db',
  fieldFocus: '#4ade80',

  // 상태 컬러
  success: '#22c55e',
  successBg: '#dcfce7',
  successBorder: '#86efac',
  successText: '#166534',

  warning: '#fbbf24',
  warningBg: '#fef3c7',
  warningBorder: '#fcd34d',
  warningText: '#92400e',

  danger: '#ef4444',
  dangerBg: '#fee2e2',
  dangerBorder: '#fca5a5',
  dangerText: '#991b1b',

  info: '#3b82f6',
  infoBg: '#dbeafe',
  infoBorder: '#93c5fd',
  infoText: '#1e40af',

  // Alias for backward compatibility
  muted: '#6b7280',
};

const cardStyle: React.CSSProperties = {
  borderRadius: '16px',
  border: `1px solid ${colors.borderLight}`,
  background: colors.panel,
  padding: '18px',
  marginBottom: '14px',
  boxShadow: '0 2px 8px rgba(45, 74, 62, 0.06), 0 1px 2px rgba(45, 74, 62, 0.04)',
  transition: 'all 0.2s ease',
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: colors.text,
  marginBottom: '8px',
  letterSpacing: '-0.01em',
};

const valueBox: React.CSSProperties = {
  border: `2px solid ${colors.borderLight}`,
  borderRadius: '12px',
  background: colors.fieldBg,
  padding: '14px 16px',
  fontSize: '18px',
  fontWeight: 700,
  color: colors.text,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all 0.2s ease',
};

const formatKRW = (value: number) => `${value.toLocaleString('ko-KR')} 원`;
const formatPercent = (value: number) => `${value.toLocaleString('ko-KR', { maximumFractionDigits: 1 })} %`;

// 스켈레톤 로딩 컴포넌트
const SkeletonBox: React.FC<{ height?: string; width?: string }> = ({ height = '20px', width = '100%' }) => (
  <div
    style={{
      height,
      width,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: '8px',
    }}
  />
);

// 숫자 카운트업 애니메이션 훅
const useCountUp = (end: number, duration: number = 800) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentCount = startValue + (end - startValue) * easeOutQuad(progress);

      setCount(Math.floor(currentCount));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    if (end !== 0) {
      requestAnimationFrame(animate);
    } else {
      setCount(0);
    }
  }, [end, duration]);

  return count;
};

// 도넛 차트 컴포넌트
const DonutChart: React.FC<{
  salesFee: number;
  logisticsFee: number;
  profit: number;
}> = ({ salesFee, logisticsFee, profit }) => {
  const total = salesFee + logisticsFee + Math.max(0, profit);
  if (total === 0) return null;

  const salesPercent = (salesFee / total) * 100;
  const logisticsPercent = (logisticsFee / total) * 100;
  const profitPercent = (Math.max(0, profit) / total) * 100;

  // SVG 원형 그래프 생성
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const salesDasharray = `${(salesPercent / 100) * circumference} ${circumference}`;
  const logisticsDasharray = `${(logisticsPercent / 100) * circumference} ${circumference}`;
  const profitDasharray = `${(profitPercent / 100) * circumference} ${circumference}`;

  const salesOffset = 0;
  const logisticsOffset = -((salesPercent / 100) * circumference);
  const profitOffset = -((salesPercent + logisticsPercent) / 100) * circumference;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '12px' }}>
      <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={colors.borderLight}
          strokeWidth="24"
        />
        {/* 판매 수수료 */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={colors.warning}
          strokeWidth="24"
          strokeDasharray={salesDasharray}
          strokeDashoffset={salesOffset}
          style={{ transition: 'all 0.6s ease' }}
        />
        {/* 물류비 */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={colors.info}
          strokeWidth="24"
          strokeDasharray={logisticsDasharray}
          strokeDashoffset={logisticsOffset}
          style={{ transition: 'all 0.6s ease' }}
        />
        {/* 순이익 */}
        {profit > 0 && (
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={colors.success}
            strokeWidth="24"
            strokeDasharray={profitDasharray}
            strokeDashoffset={profitOffset}
            style={{ transition: 'all 0.6s ease' }}
          />
        )}
      </svg>
      <div style={{ flex: 1, fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: colors.warning }} />
          <span style={{ color: colors.textMuted }}>판매 수수료</span>
          <span style={{ marginLeft: 'auto', fontWeight: 700 }}>{salesPercent.toFixed(1)}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: colors.info }} />
          <span style={{ color: colors.textMuted }}>물류비</span>
          <span style={{ marginLeft: 'auto', fontWeight: 700 }}>{logisticsPercent.toFixed(1)}%</span>
        </div>
        {profit > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: colors.success }} />
            <span style={{ color: colors.textMuted }}>순이익</span>
            <span style={{ marginLeft: 'auto', fontWeight: 700 }}>{profitPercent.toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 마진율 게이지 차트
const MarginGauge: React.FC<{ current: number; target: number }> = ({ current, target }) => {
  const maxValue = Math.max(50, target + 10);
  const currentPercent = Math.min((current / maxValue) * 100, 100);
  const targetPercent = (target / maxValue) * 100;

  const getColor = () => {
    if (current < 0) return colors.danger;
    if (current < target) return colors.warning;
    return colors.success;
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
        <span style={{ color: colors.textMuted }}>현재 마진율</span>
        <span style={{ fontWeight: 700, color: getColor(), fontSize: '16px' }}>
          {formatPercent(current)}
        </span>
      </div>
      <div style={{ position: 'relative', height: '32px', background: colors.borderLight, borderRadius: '16px', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${Math.max(0, currentPercent)}%`,
            background: `linear-gradient(90deg, ${getColor()}, ${getColor()}dd)`,
            borderRadius: '16px',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '12px',
          }}
        >
          {currentPercent > 20 && (
            <span style={{ color: 'white', fontSize: '13px', fontWeight: 800 }}>
              {formatPercent(current)}
            </span>
          )}
        </div>
        {/* 목표 마커 */}
        <div
          style={{
            position: 'absolute',
            left: `${targetPercent}%`,
            top: '-4px',
            bottom: '-4px',
            width: '3px',
            background: colors.primary,
            borderRadius: '2px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: colors.primary,
              color: 'white',
              fontSize: '9px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
            }}
          >
            목표 {formatPercent(target)}
          </div>
        </div>
      </div>
    </div>
  );
};

// 툴팁 컴포넌트
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{ cursor: 'help' }}
      >
        {children}
      </span>
      {show && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            padding: '8px 12px',
            background: colors.text,
            color: 'white',
            fontSize: '11px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {text}
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
              borderTop: `6px solid ${colors.text}`,
            }}
          />
        </div>
      )}
    </div>
  );
};

// 아코디언 컴포넌트
const Accordion: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'transparent',
          border: 'none',
          padding: '0',
          cursor: 'pointer',
          marginBottom: isOpen ? '12px' : '0',
        }}
      >
        <div style={labelStyle}>{title}</div>
        <span style={{ fontSize: '18px', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </button>
      <div
        style={{
          maxHeight: isOpen ? '1000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}
      >
        {children}
      </div>
    </div>
  );
};

const SidebarApp: React.FC = () => {
  const [product, setProduct] = useState<CommonProductData | null>(null);
  const [cost, setCost] = useState<number>(0);
  const [extraCost, setExtraCost] = useState<number>(0);
  const [productSize, setProductSize] = useState<ProductSizeTier>('medium');
  const [salePriceOverride, setSalePriceOverride] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [targetMarginRate, setTargetMarginRate] = useState<number>(() => {
    // localStorage에서 목표 마진율 불러오기
    const saved = localStorage.getItem('targetMarginRate');
    return saved ? parseFloat(saved) : 20; // 기본값 20%
  });

  // 초보 모드 state
  const [isBeginnerMode, setIsBeginnerMode] = useState<boolean>(() => {
    // localStorage에서 초보 모드 설정 불러오기
    const saved = localStorage.getItem('isBeginnerMode');
    return saved ? saved === 'true' : true; // 기본값 true (초보 모드 ON)
  });

  // 초보 모드에 따라 용어 표시
  const getTerm = (term: string) => {
    return isBeginnerMode ? getPlainTerm(term) : term;
  };

  const isCoupangSeller = useMemo(() => {
    const name = (product?.sellerName || '').trim();
    return name ? name.includes('쿠팡') : false;
  }, [product?.sellerName]);

  const categoryFeeRate = useMemo(() => {
    return getCategoryFeeRate(product?.categoryPath || []);
  }, [product?.categoryPath]);

  const categoryName = useMemo(() => {
    return getMatchedCategoryName(product?.categoryPath || []);
  }, [product?.categoryPath]);

  const salePrice = useMemo(() => {
    if (salePriceOverride !== null) return salePriceOverride;
    return product?.salePrice ?? 0;
  }, [product?.salePrice, salePriceOverride]);

  const toNumber = (value: string) => {
    const numeric = value.replace(/[^\d]/g, '');
    if (!numeric) return 0;
    const parsed = Number(numeric);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatInput = (value: number) => value.toLocaleString('ko-KR');

  const calculation = useMemo(() => {

    if (salePrice === 0) {
      return {
        salesCommission: 0,
        vat: 0,
        totalSalesFee: 0,
        logisticsInbound: 0,
        logisticsShipping: 0,
        totalLogisticsFee: 0,
        totalFee: 0,
        cost: 0,
        extraCost: 0,
        totalCost: 0,
        netProfit: 0,
        marginRate: 0,
        maxPurchasePrice: 0,
        categoryFeeRate: 0,
        productSize: 'medium' as ProductSizeTier,
      };
    }

    return calculateRocketGrossFees({
      salePrice,
      categoryFeeRate,
      cost,
      extraCost,
      productSize,
    });
  }, [salePrice, categoryFeeRate, cost, extraCost, productSize]);

  // 목표 마진율 기반 추천 사입가 계산
  const recommendedMaxCost = useMemo(() => {
    if (salePrice === 0) return 0;

    // 목표 순이익 = 판매가 × (목표 마진율 / 100)
    const targetProfit = salePrice * (targetMarginRate / 100);

    // 추천 사입가 = 판매가 - 목표 순이익 - 총 수수료 - 기타 비용
    const recommended = salePrice - targetProfit - calculation.totalFee - extraCost;

    return Math.max(0, recommended); // 음수 방지
  }, [salePrice, targetMarginRate, calculation.totalFee, extraCost]);

  // 목표 마진율 달성 여부
  const meetsTargetMargin = useMemo(() => {
    return calculation.marginRate >= targetMarginRate;
  }, [calculation.marginRate, targetMarginRate]);

  const handleRequestScrape = () => {
    setIsLoading(true);
    setError(null);
    window.parent?.postMessage({ type: 'REQUEST_SCRAPE' }, '*');
  };

  useEffect(() => {
    handleRequestScrape();

    // 타임아웃: 8초 후에도 응답이 없으면 에러
    const timeout = setTimeout(() => {
      setIsLoading((currentLoading) => {
        if (currentLoading) {
          setError('상품 정보를 가져올 수 없습니다. 쿠팡 상품 페이지인지 확인해주세요.');
          return false;
        }
        return currentLoading;
      });
    }, 8000);

    const handler = (event: MessageEvent) => {
      if (typeof event.data !== 'object' || !event.data) return;
      if (event.data.type === 'SCRAPE_RESULT' && event.data.payload) {
        clearTimeout(timeout);
        const productData = event.data.payload as CommonProductData;
        setProduct(productData);
        setIsLoading(false);

        // 상품 정보가 비어있으면 에러 표시
        if (!productData.salePrice && !productData.title) {
          setError('상품 정보를 찾을 수 없습니다. 페이지를 새로고침해보세요.');
        }
      }
    };

    window.addEventListener('message', handler);
    return () => {
      window.removeEventListener('message', handler);
      clearTimeout(timeout);
    };
  }, []);

  // 제품 정보가 변경되면 판매가 초기화 (처음 한 번만)
  useEffect(() => {
    if (product?.salePrice !== undefined && product?.salePrice !== null) {
      setSalePriceOverride((prev) => (prev === null ? product.salePrice ?? 0 : prev));
    }
  }, [product?.salePrice]);

  // 상품 정보 로드 시 스마트 기본값 설정
  useEffect(() => {
    if (!product) return;

    // 1. 자동 사입가 추정 (판매가의 60%)
    if (product.salePrice && cost === 0) {
      const estimatedCost = estimateCost(product.salePrice);
      setCost(estimatedCost);
    }

    // 2. 카테고리 기반 추천 상품 크기
    if (product.categoryPath && product.categoryPath.length > 0) {
      const recommendedSize = getRecommendedSize(product.categoryPath);
      setProductSize(recommendedSize);
    }
  }, [product]);

  // 목표 마진율 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('targetMarginRate', targetMarginRate.toString());
  }, [targetMarginRate]);

  // 초보 모드 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('isBeginnerMode', isBeginnerMode.toString());
  }, [isBeginnerMode]);

  const sizeOptions = Object.entries(PRODUCT_SIZE_INFO) as [ProductSizeTier, typeof PRODUCT_SIZE_INFO[ProductSizeTier]][];

  // 현재 가격대에서의 물류비 계산
  const currentLogisticsFee = useMemo(() => {
    return getLogisticsFee(salePrice, productSize);
  }, [salePrice, productSize]);

  // 애니메이션용 카운트업 값
  const animatedProfit = useCountUp(calculation.netProfit);
  const animatedMargin = useCountUp(calculation.marginRate * 10) / 10;

  return (
    <div
      style={{
        fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: colors.bgGradient,
        minHeight: '100vh',
        padding: '0',
        color: colors.text,
      }}
    >
      {/* 헤더 - 브랜드 그라디언트 */}
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
          padding: '20px 16px',
          marginBottom: '16px',
          boxShadow: '0 4px 12px rgba(45, 74, 62, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px',
            }}>
              <span style={{ fontSize: '24px' }}>🤖</span>
              Sellgent AI
            </div>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 500,
            }}>
              로켓그로스 마진 계산기
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* 초보 모드 토글 */}
            <button
              onClick={() => setIsBeginnerMode(!isBeginnerMode)}
              style={{
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 600,
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                background: isBeginnerMode ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '14px' }}>🎓</span>
              {isBeginnerMode ? '초보 모드' : '전문 모드'}
            </button>
            <button
              onClick={() => {
                handleRequestScrape();
                setSalePriceOverride(null);
              }}
            style={{
              padding: '10px 14px',
              fontSize: '13px',
              fontWeight: 600,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              opacity: isLoading ? 0.6 : 1,
            }}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '14px' }}>🔄</span>
            새로고침
          </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 16px' }}>

      {/* 스켈레톤 로딩 상태 */}
      {isLoading && (
        <>
          <div style={cardStyle}>
            <SkeletonBox height="24px" width="60%" />
            <div style={{ marginTop: '12px' }}>
              <SkeletonBox height="16px" />
              <div style={{ marginTop: '8px' }}>
                <SkeletonBox height="16px" />
              </div>
            </div>
          </div>
          <div style={cardStyle}>
            <SkeletonBox height="120px" />
          </div>
        </>
      )}

      {/* 에러 메시지 */}
      {error && !isLoading && (
        <div
          style={{
            ...cardStyle,
            background: colors.dangerBg,
            border: `2px solid ${colors.dangerBorder}`,
            color: colors.dangerText,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: '4px', fontSize: '16px' }}>⚠️ 오류 발생</div>
          <div style={{ fontSize: '14px', marginBottom: '12px' }}>{error}</div>
          <button
            onClick={() => handleRequestScrape()}
            style={{
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 600,
              border: `2px solid ${colors.danger}`,
              borderRadius: '8px',
              background: colors.panel,
              color: colors.danger,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.danger;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.panel;
              e.currentTarget.style.color = colors.danger;
            }}
          >
            다시 시도
          </button>
        </div>
      )}

      {!isLoading && (
        <>
          {isCoupangSeller && (
            <div
              style={{
                ...cardStyle,
                display: 'grid',
                gap: '6px',
                background: colors.dangerBg,
                border: `2px solid ${colors.dangerBorder}`,
                color: colors.dangerText,
                animation: 'slideIn 0.3s ease',
              }}
            >
              <div style={{ fontWeight: 800, fontSize: '15px' }}>⚠️ 쿠팡 직매입 상품</div>
              <div style={{ fontSize: '13px' }}>
                자체 공급 상품일 가능성이 높아 마진 확보가 어렵습니다. 다른 상품을 검토해 보세요.
              </div>
            </div>
          )}

          {/* 핵심 지표 - 크게 강조 */}
          <div
            style={{
              ...cardStyle,
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
              border: 'none',
              padding: '24px',
              animation: 'slideIn 0.4s ease',
            }}
          >
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              📊 예상 수익 분석
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>{getTerm('순이익')}</div>
                <div style={{
                  color: 'white',
                  fontSize: '28px',
                  fontWeight: 900,
                  textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}>
                  {calculation.netProfit >= 0 ? '+' : ''}{formatKRW(animatedProfit)}
                </div>
              </div>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>{getTerm('마진율')}</div>
                <div style={{
                  color: calculation.marginRate >= targetMarginRate ? colors.accent : colors.warning,
                  fontSize: '28px',
                  fontWeight: 900,
                  textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}>
                  {formatPercent(animatedMargin)}
                </div>
              </div>
            </div>

            {/* 마진율 게이지 */}
            <MarginGauge current={calculation.marginRate} target={targetMarginRate} />

            {/* 마진율 평가 배지 */}
            <MarginBadge marginRate={calculation.marginRate} targetRate={targetMarginRate} />

            {/* 액션 추천 카드 */}
            <ActionCard
              marginRate={calculation.marginRate}
              netProfit={calculation.netProfit}
              recommendedMaxCost={recommendedMaxCost}
            />
          </div>

          {/* 상품 정보 */}
          <div style={{ ...cardStyle, animation: 'slideIn 0.5s ease' }}>
            <div style={{ ...labelStyle, marginBottom: '12px' }}>📦 상품 정보</div>
            <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
              {product?.title && (
                <div>
                  <span style={{ color: colors.muted, fontWeight: 600 }}>제품명: </span>
                  <span style={{ color: colors.text }}>{product.title}</span>
                </div>
              )}
              <div>
                <span style={{ color: colors.muted, fontWeight: 600 }}>카테고리: </span>
                <span style={{ color: colors.text }}>
                  {categoryName} <span style={{ color: colors.accent, fontWeight: 700 }}>({formatPercent(categoryFeeRate * 100)})</span>
                </span>
              </div>
              <div>
                <span style={{ color: colors.muted, fontWeight: 600 }}>쿠팡 판매가: </span>
                <span style={{ color: colors.text, fontWeight: 700 }}>{formatKRW(product?.salePrice ?? 0)}</span>
              </div>
              <div>
                <span style={{ color: colors.muted, fontWeight: 600 }}>쿠팡 배송비: </span>
                <span style={{ color: colors.text }}>
                  {product?.isFreeShipping ? '무료' : formatKRW(product?.shippingFee ?? 0)}
                </span>
              </div>
              {product?.sellerName && (
                <div>
                  <span style={{ color: colors.muted, fontWeight: 600 }}>판매자: </span>
                  <span style={{ color: colors.text }}>{product.sellerName}</span>
                </div>
              )}
            </div>
          </div>

          {/* 목표 마진율 설정 - 강조 */}
          <div style={{ ...cardStyle, background: colors.accentSoft, border: `2px solid ${colors.accent}`, animation: 'slideIn 0.6s ease' }}>
            <div style={{ ...labelStyle, marginBottom: '12px', color: colors.accentText }}>
              🎯 목표 {getTerm('마진율')} 설정
              <Tooltip text={isBeginnerMode ? "얼마나 남기고 싶은지 설정하면, 얼마에 사입해야 하는지 알려드려요" : "원하는 수익률을 설정하면 최적 사입가를 계산해드립니다"}>
                <span style={{ marginLeft: '6px', fontSize: '12px', color: colors.accentText, cursor: 'help' }}>ℹ️</span>
              </Tooltip>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={targetMarginRate}
                  onChange={(e) => setTargetMarginRate(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    height: '10px',
                    borderRadius: '5px',
                    outline: 'none',
                    cursor: 'pointer',
                    accentColor: colors.accent,
                  }}
                />
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 900,
                    color: colors.accentText,
                    minWidth: '70px',
                    textAlign: 'right',
                  }}
                >
                  {formatPercent(targetMarginRate)}
                </div>
              </div>
              {/* 목표 마진율 힌트 */}
              <div style={{ fontSize: '11px', color: colors.accentText, marginTop: '8px', opacity: 0.8 }}>
                {TARGET_MARGIN_HINT_MESSAGE}
              </div>
            </div>
            <div
              style={{
                fontSize: '12px',
                background: 'white',
                border: `2px solid ${colors.accent}`,
                borderRadius: '12px',
                padding: '14px',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '6px', color: colors.accentText, fontSize: '13px' }}>
                💡 추천 {getTerm('최대사입가')}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: colors.accentText, marginBottom: '6px' }}>
                {formatKRW(recommendedMaxCost)}
              </div>
              <div style={{ fontSize: '11px', color: colors.accentText }}>
                목표 {getTerm('마진율')} {formatPercent(targetMarginRate)}를 달성하려면 이 가격 이하로 사입하세요
              </div>
            </div>
          </div>

          {/* 비용 입력 */}
          <div style={{ ...cardStyle, animation: 'slideIn 0.7s ease' }}>
            <div style={{ ...labelStyle, marginBottom: '12px' }}>💰 가격 및 비용 입력</div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ ...labelStyle, fontSize: '12px' }}>
                {getTerm('판매가')} {product?.salePrice && <span style={{ fontSize: '11px', color: colors.muted, fontWeight: 400 }}>(쿠팡: {formatKRW(product.salePrice)})</span>}
              </div>
              <div style={{
                ...valueBox,
                border: `2px solid ${colors.accent}`,
                transition: 'all 0.2s ease',
              }}
                onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accentSoft}`}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={salePrice === 0 ? '' : formatInput(salePrice)}
                  onChange={(e) => setSalePriceOverride(toNumber(e.target.value))}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: colors.text,
                    outline: 'none',
                  }}
                />
                <span style={{ marginLeft: '6px', color: colors.text, fontSize: '14px' }}>원</span>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ ...labelStyle, fontSize: '12px' }}>원가 ({getTerm('사입가')})</div>
              <div style={valueBox}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={cost === 0 ? '' : formatInput(cost)}
                  onChange={(e) => setCost(toNumber(e.target.value))}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: colors.text,
                    outline: 'none',
                  }}
                />
                <span style={{ marginLeft: '6px', color: colors.text, fontSize: '14px' }}>원</span>
              </div>
              {/* 사입가 힌트 */}
              <div style={{ fontSize: '11px', color: colors.muted, marginTop: '6px' }}>
                {COST_HINT_MESSAGE}
              </div>
            </div>

            <div>
              <div style={{ ...labelStyle, fontSize: '12px' }}>기타 비용</div>
              <div style={valueBox}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={extraCost === 0 ? '' : formatInput(extraCost)}
                  onChange={(e) => setExtraCost(toNumber(e.target.value))}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    width: '100%',
                    textAlign: 'right',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: colors.text,
                    outline: 'none',
                  }}
                />
                <span style={{ marginLeft: '6px', color: colors.text, fontSize: '14px' }}>원</span>
              </div>
            </div>
          </div>

          {/* 상품 크기 선택 */}
          <div style={{ ...cardStyle, animation: 'slideIn 0.8s ease' }}>
            <div style={{ ...labelStyle, marginBottom: '12px' }}>
              📏 상품 크기 선택
              <Tooltip text="상품의 실제 크기에 따라 물류비가 달라집니다">
                <span style={{ marginLeft: '6px', fontSize: '12px', color: colors.muted, cursor: 'help' }}>ℹ️</span>
              </Tooltip>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <select
                value={productSize}
                onChange={(e) => setProductSize(e.target.value as ProductSizeTier)}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '15px',
                  fontWeight: 600,
                  border: `2px solid ${colors.accent}`,
                  borderRadius: '10px',
                  background: colors.panel,
                  color: colors.text,
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.accentSoft}`}
                onBlur={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                {sizeOptions.map(([key, value]) => {
                  const fee = getLogisticsFee(salePrice || 25800, key);
                  return (
                    <option key={key} value={key}>
                      {value.label} - {formatKRW(fee)}
                    </option>
                  );
                })}
              </select>
            </div>
            <div
              style={{
                fontSize: '12px',
                color: colors.muted,
                background: colors.infoBg,
                border: `1px solid ${colors.infoBorder}`,
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '6px', color: colors.infoText }}>
                💡 {PRODUCT_SIZE_INFO[productSize].label} - {formatKRW(currentLogisticsFee)} (부가세 포함)
              </div>
              <div style={{ color: colors.infoText, marginBottom: '6px', fontSize: '11px' }}>
                {PRODUCT_SIZE_INFO[productSize].description}
              </div>
            </div>
          </div>

          {/* 비용 구성 시각화 */}
          <div style={{ ...cardStyle, animation: 'slideIn 0.9s ease' }}>
            <div style={{ ...labelStyle, marginBottom: '12px' }}>📈 비용 구성 비율</div>
            <DonutChart
              salesFee={calculation.totalSalesFee}
              logisticsFee={calculation.totalLogisticsFee}
              profit={calculation.netProfit}
            />
          </div>

          {/* 수수료 상세 - 아코디언 */}
          <div style={{ ...cardStyle, animation: 'slideIn 1s ease' }}>
            <Accordion title={`📊 ${getTerm('로켓그로스')} 수수료 상세`} defaultOpen={false}>
              <div style={{ display: 'grid', gap: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: colors.muted, marginBottom: '4px' }}>
                  {getTerm('판매수수료')}
                </div>
                <div style={{ ...valueBox, background: '#fef9f5', padding: '10px 12px', border: 'none' }}>
                  <span style={{ fontSize: '13px', color: colors.muted, fontWeight: 600 }}>{getTerm('판매수수료')} ({formatPercent(categoryFeeRate * 100)})</span>
                  <span style={{ fontSize: '15px' }}>{formatKRW(calculation.salesCommission)}</span>
                </div>
                <div style={{ ...valueBox, background: '#fef9f5', padding: '10px 12px', border: 'none' }}>
                  <span style={{ fontSize: '13px', color: colors.muted, fontWeight: 600 }}>{getTerm('부가세')} (10%)</span>
                  <span style={{ fontSize: '15px' }}>{formatKRW(calculation.vat)}</span>
                </div>
                <div
                  style={{
                    ...valueBox,
                    background: colors.warningBg,
                    border: `2px solid ${colors.warningBorder}`,
                    padding: '10px 12px',
                  }}
                >
                  <span style={{ fontSize: '13px', color: colors.warningText, fontWeight: 700 }}>{getTerm('판매수수료')} 소계</span>
                  <span style={{ fontSize: '16px', color: colors.warningText }}>{formatKRW(calculation.totalSalesFee)}</span>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 700, color: colors.muted, marginTop: '8px', marginBottom: '4px' }}>
                  {getTerm('물류비')} ({PRODUCT_SIZE_INFO[productSize].label}, {getTerm('부가세')} 포함)
                </div>
                <div style={{ ...valueBox, background: '#f0fdf4', padding: '10px 12px', border: 'none' }}>
                  <span style={{ fontSize: '13px', color: colors.muted, fontWeight: 600 }}>{getTerm('입출고요금')}</span>
                  <span style={{ fontSize: '15px' }}>{formatKRW(calculation.logisticsInbound)}</span>
                </div>
                <div style={{ ...valueBox, background: '#f0fdf4', padding: '10px 12px', border: 'none' }}>
                  <span style={{ fontSize: '13px', color: colors.muted, fontWeight: 600 }}>{getTerm('배송비')}</span>
                  <span style={{ fontSize: '15px' }}>{formatKRW(calculation.logisticsShipping)}</span>
                </div>
                <div
                  style={{
                    ...valueBox,
                    background: colors.successBg,
                    border: `2px solid ${colors.successBorder}`,
                    padding: '10px 12px',
                  }}
                >
                  <span style={{ fontSize: '13px', color: colors.successText, fontWeight: 700 }}>{getTerm('물류비')} 소계</span>
                  <span style={{ fontSize: '16px', color: colors.successText }}>{formatKRW(calculation.totalLogisticsFee)}</span>
                </div>

                <div
                  style={{
                    ...valueBox,
                    background: colors.dangerBg,
                    border: `2px solid ${colors.dangerBorder}`,
                    marginTop: '8px',
                  }}
                >
                  <span style={{ fontSize: '15px', color: colors.dangerText, fontWeight: 800 }}>총 수수료</span>
                  <span style={{ fontSize: '20px', color: colors.dangerText, fontWeight: 800 }}>{formatKRW(calculation.totalFee)}</span>
                </div>
              </div>
            </Accordion>
          </div>

          {/* 최대 사입가 안내 */}
          <div
            style={{
              ...cardStyle,
              background: colors.infoBg,
              border: `2px solid ${colors.infoBorder}`,
              animation: 'slideIn 1.1s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: colors.infoText, fontWeight: 600, marginBottom: '6px' }}>
                  💡 최대 사입가 (마진 0% 기준)
                </div>
                <div style={{ fontSize: '24px', color: colors.infoText, fontWeight: 900 }}>
                  {formatKRW(calculation.maxPurchasePrice)}
                </div>
                <div style={{ fontSize: '11px', color: colors.infoText, marginTop: '6px' }}>
                  이 가격보다 낮게 사입하면 이익이 발생합니다
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

const container = document.getElementById('root');

if (container) {
  // CSS 애니메이션 추가
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <SidebarApp />
    </React.StrictMode>,
  );
}
