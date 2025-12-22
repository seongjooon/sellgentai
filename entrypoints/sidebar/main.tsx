import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { CommonProductData } from './types';
import {
  calculateRocketGrossFees,
  getCategoryFeeRate,
  getMatchedCategoryName,
  ROCKET_GROWTH_LOGISTICS_FEES,
  type ProductSizeTier,
} from './feeCalculator';

const colors = {
  bg: '#f5f7fb',
  panel: '#ffffff',
  border: '#e5e7eb',
  text: '#111827',
  muted: '#6b7280',
  accent: '#10a37f',
  accentText: '#0b5b45',
  accentSoft: '#e8f5f0',
  fieldBg: '#f2f6ff',
  warning: '#fef3c7',
  warningBorder: '#fcd34d',
  warningText: '#92400e',
  danger: '#fee2e2',
  dangerBorder: '#fecdd3',
  dangerText: '#991b1b',
  info: '#e0f2fe',
  infoBorder: '#7dd3fc',
  infoText: '#0c4a6e',
};

const cardStyle: React.CSSProperties = {
  borderRadius: '12px',
  border: `1px solid ${colors.border}`,
  background: colors.panel,
  padding: '16px',
  marginBottom: '14px',
  boxShadow: '0 6px 20px rgba(15, 23, 42, 0.08)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: colors.text,
  marginBottom: '6px',
};

const valueBox: React.CSSProperties = {
  border: `1px solid ${colors.border}`,
  borderRadius: '10px',
  background: colors.fieldBg,
  padding: '14px 12px',
  fontSize: '18px',
  fontWeight: 700,
  color: colors.text,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const formatKRW = (value: number) => `${value.toLocaleString('ko-KR')} 원`;
const formatPercent = (value: number) => `${value.toLocaleString('ko-KR', { maximumFractionDigits: 1 })} %`;

const SidebarApp: React.FC = () => {
  const [product, setProduct] = useState<CommonProductData | null>(null);
  const [cost, setCost] = useState<number>(0);
  const [extraCost, setExtraCost] = useState<number>(0);
  const [productSize, setProductSize] = useState<ProductSizeTier>('medium');
  const [salePriceOverride, setSalePriceOverride] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleRequestScrape = () => {
    setIsLoading(true);
    setError(null);
    window.parent?.postMessage({ type: 'REQUEST_SCRAPE' }, '*');

    // 5초 후에도 응답이 없으면 타임아웃 에러
    const timeout = setTimeout(() => {
      if (isLoading) {
        setError('상품 정보를 가져올 수 없습니다. 쿠팡 상품 페이지인지 확인해주세요.');
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    const cleanup = handleRequestScrape();

    const handler = (event: MessageEvent) => {
      if (typeof event.data !== 'object' || !event.data) return;
      if (event.data.type === 'SCRAPE_RESULT' && event.data.payload) {
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
      if (cleanup) cleanup();
    };
  }, []);

  // 제품 정보가 변경되면 판매가 초기화 (처음 한 번만)
  useEffect(() => {
    if (product?.salePrice !== undefined && product?.salePrice !== null) {
      setSalePriceOverride((prev) => (prev === null ? product.salePrice ?? 0 : prev));
    }
  }, [product?.salePrice]);

  const sizeOptions = Object.entries(ROCKET_GROWTH_LOGISTICS_FEES) as [ProductSizeTier, typeof ROCKET_GROWTH_LOGISTICS_FEES[ProductSizeTier]][];

  return (
    <div
      style={{
        fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: colors.bg,
        minHeight: '100vh',
        padding: '16px',
        color: colors.text,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontSize: '20px', fontWeight: 800 }}>
          🚀 로켓그로스 마진 계산기
        </div>
        <button
          onClick={() => {
            handleRequestScrape();
            setSalePriceOverride(null);
          }}
          style={{
            padding: '8px 12px',
            fontSize: '13px',
            fontWeight: 600,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            background: colors.panel,
            color: colors.text,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          disabled={isLoading}
        >
          <span style={{ fontSize: '14px' }}>🔄</span>
          새로고침
        </button>
      </div>

      {/* 로딩 상태 */}
      {isLoading && (
        <div
          style={{
            ...cardStyle,
            background: colors.info,
            border: `1px solid ${colors.infoBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              border: `3px solid ${colors.infoBorder}`,
              borderTopColor: colors.infoText,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <div style={{ color: colors.infoText, fontWeight: 600 }}>
            상품 정보를 불러오는 중...
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && !isLoading && (
        <div
          style={{
            ...cardStyle,
            background: colors.danger,
            border: `1px solid ${colors.dangerBorder}`,
            color: colors.dangerText,
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: '4px' }}>⚠️ 오류 발생</div>
          <div style={{ fontSize: '14px' }}>{error}</div>
          <button
            onClick={() => handleRequestScrape()}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              border: `1px solid ${colors.dangerBorder}`,
              borderRadius: '8px',
              background: colors.panel,
              color: colors.dangerText,
              cursor: 'pointer',
            }}
          >
            다시 시도
          </button>
        </div>
      )}

      {isCoupangSeller && (
        <div
          style={{
            ...cardStyle,
            display: 'grid',
            gap: '6px',
            background: colors.danger,
            border: `1px solid ${colors.dangerBorder}`,
            color: colors.dangerText,
          }}
        >
          <div style={{ fontWeight: 800 }}>⚠️ 쿠팡 직매입 상품</div>
          <div style={{ fontSize: '13px' }}>
            자체 공급 상품일 가능성이 높아 마진 확보가 어렵습니다. 다른 상품을 검토해 보세요.
          </div>
        </div>
      )}

      {/* 상품 정보 */}
      <div style={cardStyle}>
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

      {/* 상품 크기 선택 */}
      <div style={cardStyle}>
        <div style={{ ...labelStyle, marginBottom: '12px' }}>📏 상품 크기 선택</div>
        <div style={{ marginBottom: '12px' }}>
          <select
            value={productSize}
            onChange={(e) => setProductSize(e.target.value as ProductSizeTier)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '15px',
              fontWeight: 600,
              border: `2px solid ${colors.accent}`,
              borderRadius: '10px',
              background: colors.panel,
              color: colors.text,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {sizeOptions.map(([key, value]) => (
              <option key={key} value={key}>
                {value.label} - {formatKRW(value.total)} (입출고 {formatKRW(value.inboundOutbound)} + 배송 {formatKRW(value.shipping)})
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            fontSize: '12px',
            color: colors.muted,
            background: colors.info,
            border: `1px solid ${colors.infoBorder}`,
            borderRadius: '8px',
            padding: '10px',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '4px', color: colors.infoText }}>
            💡 {ROCKET_GROWTH_LOGISTICS_FEES[productSize].label}
          </div>
          <div style={{ color: colors.infoText }}>
            {ROCKET_GROWTH_LOGISTICS_FEES[productSize].description}
          </div>
        </div>
      </div>

      {/* 비용 입력 */}
      <div style={cardStyle}>
        <div style={{ ...labelStyle, marginBottom: '12px' }}>💰 가격 및 비용 입력</div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ ...labelStyle, fontSize: '12px' }}>
            판매가 {product?.salePrice && <span style={{ fontSize: '11px', color: colors.muted, fontWeight: 400 }}>(쿠팡: {formatKRW(product.salePrice)})</span>}
          </div>
          <div style={valueBox}>
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
          <div style={{ ...labelStyle, fontSize: '12px' }}>원가 (사입가)</div>
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

      {/* 수수료 상세 */}
      <div style={cardStyle}>
        <div style={{ ...labelStyle, marginBottom: '12px' }}>📊 로켓그로스 수수료</div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: colors.muted, marginBottom: '4px' }}>
            판매 수수료
          </div>
          <div style={{ ...valueBox, background: '#fef9f5', padding: '10px 12px' }}>
            <span style={{ fontSize: '13px', color: colors.muted, fontWeight: 600 }}>판매 수수료 ({formatPercent(categoryFeeRate * 100)})</span>
            <span style={{ fontSize: '15px' }}>{formatKRW(calculation.salesCommission)}</span>
          </div>
          <div style={{ ...valueBox, background: '#fef9f5', padding: '10px 12px' }}>
            <span style={{ fontSize: '13px', color: colors.muted, fontWeight: 600 }}>부가세 (10%)</span>
            <span style={{ fontSize: '15px' }}>{formatKRW(calculation.vat)}</span>
          </div>
          <div
            style={{
              ...valueBox,
              background: colors.accentSoft,
              border: `2px solid ${colors.accent}`,
              padding: '10px 12px',
            }}
          >
            <span style={{ fontSize: '13px', color: colors.accentText, fontWeight: 700 }}>판매 수수료 소계</span>
            <span style={{ fontSize: '16px', color: colors.accentText }}>{formatKRW(calculation.totalSalesFee)}</span>
          </div>

          <div style={{ fontSize: '12px', fontWeight: 700, color: colors.muted, marginTop: '8px', marginBottom: '4px' }}>
            물류비 ({ROCKET_GROWTH_LOGISTICS_FEES[productSize].label})
          </div>
          <div style={{ ...valueBox, background: '#f0fdf4', padding: '10px 12px' }}>
            <span style={{ fontSize: '13px', color: colors.muted, fontWeight: 600 }}>입출고 요금</span>
            <span style={{ fontSize: '15px' }}>{formatKRW(calculation.logisticsInbound)}</span>
          </div>
          <div style={{ ...valueBox, background: '#f0fdf4', padding: '10px 12px' }}>
            <span style={{ fontSize: '13px', color: colors.muted, fontWeight: 600 }}>배송 요금</span>
            <span style={{ fontSize: '15px' }}>{formatKRW(calculation.logisticsShipping)}</span>
          </div>
          <div
            style={{
              ...valueBox,
              background: '#dcfce7',
              border: `2px solid #86efac`,
              padding: '10px 12px',
            }}
          >
            <span style={{ fontSize: '13px', color: '#15803d', fontWeight: 700 }}>물류비 소계</span>
            <span style={{ fontSize: '16px', color: '#15803d' }}>{formatKRW(calculation.totalLogisticsFee)}</span>
          </div>

          <div
            style={{
              ...valueBox,
              background: '#fef3c7',
              border: `2px solid ${colors.warningBorder}`,
              marginTop: '8px',
            }}
          >
            <span style={{ fontSize: '15px', color: colors.warningText, fontWeight: 800 }}>총 수수료</span>
            <span style={{ fontSize: '20px', color: colors.warningText, fontWeight: 800 }}>{formatKRW(calculation.totalFee)}</span>
          </div>
        </div>
      </div>

      {/* 마진 계산 결과 */}
      <div style={cardStyle}>
        <div style={{ ...labelStyle, marginBottom: '12px' }}>💵 마진 계산 결과</div>
        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={valueBox}>
            <span style={{ fontSize: '13px', color: colors.muted, fontWeight: 600 }}>총 비용</span>
            <span style={{ fontSize: '16px' }}>{formatKRW(calculation.totalCost)}</span>
          </div>
          <div
            style={{
              ...valueBox,
              background: calculation.netProfit >= 0 ? '#f0fdf4' : '#fef2f2',
              border: `2px solid ${calculation.netProfit >= 0 ? '#86efac' : '#fca5a5'}`,
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: calculation.netProfit >= 0 ? '#15803d' : '#991b1b',
                fontWeight: 700,
              }}
            >
              예상 순이익
            </span>
            <span
              style={{
                fontSize: '20px',
                color: calculation.netProfit >= 0 ? '#15803d' : '#991b1b',
                fontWeight: 800,
              }}
            >
              {formatKRW(calculation.netProfit)}
            </span>
          </div>
          <div style={valueBox}>
            <span style={{ fontSize: '13px', color: colors.muted, fontWeight: 600 }}>마진율</span>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: calculation.marginRate >= 20 ? '#15803d' : calculation.marginRate >= 10 ? '#ca8a04' : '#991b1b',
              }}
            >
              {formatPercent(calculation.marginRate)}
            </span>
          </div>
        </div>
      </div>

      {/* 최대 사입가 */}
      <div
        style={{
          ...cardStyle,
          background: colors.warning,
          border: `1px solid ${colors.warningBorder}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '12px', color: colors.warningText, fontWeight: 600, marginBottom: '4px' }}>
              💡 최대 사입가 (마진 0% 기준)
            </div>
            <div style={{ fontSize: '20px', color: colors.warningText, fontWeight: 800 }}>
              {formatKRW(calculation.maxPurchasePrice)}
            </div>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: colors.warningText, marginTop: '8px' }}>
          이 가격보다 낮게 사입하면 이익이 발생합니다
        </div>
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
  `;
  document.head.appendChild(style);

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <SidebarApp />
    </React.StrictMode>,
  );
}
