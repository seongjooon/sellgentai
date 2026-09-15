import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';
import type { CommonProductData, CalculationHistory } from './types';
import {
  calculateRocketGrossFees,
  getCategoryFeeRate,
  getMatchedCategoryName,
  getLogisticsFee,
  PRODUCT_SIZE_INFO,
  type ProductSizeTier,
} from './feeCalculator';
import { Header } from './components/Header';
import { MarginHero } from './components/MarginHero';
import { HistoryPanel } from './components/History';
import { Card, CardHeader, CardContent, Input, Select, Slider, SkeletonCard, Alert } from './components/ui';
import { ActionCard } from './components/ActionCard';
import { SurveyCard } from './components/SurveyCard';
import { getPlainTerm } from './constants/plainLanguage';
import {
  estimateCost,
  getRecommendedSize,
  COST_HINT_MESSAGE,
  TARGET_MARGIN_HINT_MESSAGE,
} from './constants/smartDefaults';

// 유틸리티 함수
const formatKRW = (value: number) => `${Math.floor(value).toLocaleString('ko-KR')} 원`;
const formatPercent = (value: number) => `${Math.floor(value * 10) / 10} %`;

// 도넛 차트 컴포넌트 (차후 컴포넌트로 분리 예정)
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
    <div className="flex items-center gap-5 mt-3">
      <svg width="160" height="160" className="-rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#2D3340"
          strokeWidth="24"
        />
        {/* 판매 수수료 */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#FFB84D"
          strokeWidth="24"
          strokeDasharray={salesDasharray}
          strokeDashoffset={salesOffset}
          className="transition-all duration-600"
        />
        {/* 물류비 */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="24"
          strokeDasharray={logisticsDasharray}
          strokeDashoffset={logisticsOffset}
          className="transition-all duration-600"
        />
        {/* 순이익 */}
        {profit > 0 && (
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#00D084"
            strokeWidth="24"
            strokeDasharray={profitDasharray}
            strokeDashoffset={profitOffset}
            className="transition-all duration-600"
          />
        )}
      </svg>
      <div className="flex-1 text-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-brand-warning" />
          <span className="text-text-secondary">판매 수수료</span>
          <span className="ml-auto font-bold text-text-primary">{salesPercent.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-text-secondary">물류비</span>
          <span className="ml-auto font-bold text-text-primary">{logisticsPercent.toFixed(1)}%</span>
        </div>
        {profit > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-brand-primary" />
            <span className="text-text-secondary">순이익</span>
            <span className="ml-auto font-bold text-text-primary">{profitPercent.toFixed(1)}%</span>
          </div>
        )}
      </div>
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
        className="w-full flex items-center justify-between bg-transparent border-none p-0 cursor-pointer"
        style={{ marginBottom: isOpen ? '12px' : '0' }}
      >
        <div className="text-sm font-bold text-text-primary">{title}</div>
        <span
          className="text-lg transition-transform duration-200 text-text-secondary"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
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

  // 다크모드 state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // localStorage에서 다크모드 설정 불러오기
    const saved = localStorage.getItem('isDarkMode');
    return saved ? saved === 'true' : false; // 기본값 false (라이트모드 ON)
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

  const formatInput = (value: number) => Math.floor(value).toLocaleString('ko-KR');

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

  // 다크모드 변경 시 localStorage에 저장 및 body 클래스 적용
  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode.toString());
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }, [isDarkMode]);

  // 히스토리 state
  const [history, setHistory] = useState<CalculationHistory[]>(() => {
    const saved = localStorage.getItem('calculationHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [showHistory, setShowHistory] = useState(false);

  // 히스토리 저장 함수
  const saveToHistory = () => {
    if (!product?.title || salePrice === 0 || cost === 0) return;

    const newEntry: CalculationHistory = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      productTitle: product.title,
      productUrl: product.url,
      salePrice,
      cost,
      extraCost,
      productSize,
      marginRate: calculation.marginRate,
      netProfit: calculation.netProfit,
      totalFee: calculation.totalFee,
    };

    const updatedHistory = [newEntry, ...history].slice(0, 10); // 최근 10개만 저장
    setHistory(updatedHistory);
    localStorage.setItem('calculationHistory', JSON.stringify(updatedHistory));
  };

  const sizeOptions = Object.entries(PRODUCT_SIZE_INFO) as [ProductSizeTier, typeof PRODUCT_SIZE_INFO[ProductSizeTier]][];

  // 현재 가격대에서의 물류비 계산
  const currentLogisticsFee = useMemo(() => {
    return getLogisticsFee(salePrice, productSize);
  }, [salePrice, productSize]);

  return (
    <div className="font-sans bg-bg-primary min-h-screen text-text-primary">
      {/* 새로운 Header 컴포넌트 */}
      <Header
        historyCount={history.length}
        isBeginnerMode={isBeginnerMode}
        showHistory={showHistory}
        isLoading={isLoading}
        canSave={!!(product?.title && salePrice !== 0 && cost !== 0)}
        isDarkMode={isDarkMode}
        onHistoryClick={() => setShowHistory(!showHistory)}
        onSaveClick={saveToHistory}
        onBeginnerModeClick={() => setIsBeginnerMode(!isBeginnerMode)}
        onRefreshClick={() => {
          handleRequestScrape();
          setSalePriceOverride(null);
        }}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />

      {/* 히스토리 UI */}
      {showHistory && (
        <HistoryPanel
          history={history}
          onClose={() => setShowHistory(false)}
          onClearAll={() => {
            setHistory([]);
            localStorage.removeItem('calculationHistory');
          }}
          onDelete={(id) => {
            const updatedHistory = history.filter(h => h.id !== id);
            setHistory(updatedHistory);
            localStorage.setItem('calculationHistory', JSON.stringify(updatedHistory));
          }}
          onSelect={(item) => {
            setSalePriceOverride(item.salePrice);
            setCost(item.cost);
            setExtraCost(item.extraCost);
            const validSizes: ProductSizeTier[] = ['extra-small', 'small', 'medium', 'large-1', 'large-2', 'extra-large'];
            if (validSizes.includes(item.productSize as ProductSizeTier)) {
              setProductSize(item.productSize as ProductSizeTier);
            }
            setShowHistory(false);
          }}
        />
      )}

      <div className="px-4 pb-4 space-y-4">

      {/* 스켈레톤 로딩 상태 */}
      {isLoading && (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* 에러 메시지 */}
      {error && !isLoading && (
        <Alert
          variant="danger"
          title="오류 발생"
          action={
            <button
              onClick={() => handleRequestScrape()}
              className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-brand-danger bg-bg-card text-brand-danger hover:bg-brand-danger hover:text-white transition-colors"
            >
              다시 시도
            </button>
          }
        >
          {error}
        </Alert>
      )}

      {!isLoading && (
        <>
          {isCoupangSeller && (
            <Alert variant="danger" title="쿠팡 직매입 상품">
              자체 공급 상품일 가능성이 높아 마진 확보가 어렵습니다. 다른 상품을 검토해 보세요.
            </Alert>
          )}

          {/* 핵심 지표 - MarginHero 컴포넌트 */}
          <MarginHero
            netProfit={calculation.netProfit}
            marginRate={calculation.marginRate}
            targetRate={targetMarginRate}
            className="animate-slide-in"
          />

          {/* 액션 추천 카드 */}
          <ActionCard
            marginRate={calculation.marginRate}
            netProfit={calculation.netProfit}
            recommendedMaxCost={recommendedMaxCost}
          />

          {/* 사용자 설문 카드 (설정이 비어 있거나 종료일이 지나면 표시하지 않음) */}
          <SurveyCard />

          {/* 상품 정보 */}
          <Card className="animate-slide-in">
            <CardHeader icon="📦" title="상품 정보" />
            <CardContent>
              <div className="space-y-2 text-sm">
                {product?.title && (
                  <div>
                    <span className="text-text-secondary font-semibold">제품명: </span>
                    <span className="text-text-primary">{product.title}</span>
                  </div>
                )}
                <div>
                  <span className="text-text-secondary font-semibold">카테고리: </span>
                  <span className="text-text-primary">
                    {categoryName} <span className="text-brand-primary font-bold">({formatPercent(categoryFeeRate * 100)})</span>
                  </span>
                </div>
                <div>
                  <span className="text-text-secondary font-semibold">쿠팡 판매가: </span>
                  <span className="text-text-primary font-bold">{formatKRW(product?.salePrice ?? 0)}</span>
                </div>
                <div>
                  <span className="text-text-secondary font-semibold">쿠팡 배송비: </span>
                  <span className="text-text-primary">
                    {product?.isFreeShipping ? '무료' : formatKRW(product?.shippingFee ?? 0)}
                  </span>
                </div>
                {product?.sellerName && (
                  <div>
                    <span className="text-text-secondary font-semibold">판매자: </span>
                    <span className="text-text-primary">{product.sellerName}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 목표 마진율 설정 */}
          <Card variant="success" className="animate-slide-in">
            <CardHeader icon="🎯" title={`목표 ${getTerm('마진율')} 설정`} />
            <CardContent>
              <Slider
                min={0}
                max={50}
                step={1}
                value={targetMarginRate}
                onChange={setTargetMarginRate}
                formatValue={(v) => `${v.toFixed(1)}%`}
                hint={TARGET_MARGIN_HINT_MESSAGE}
              />

              {/* 추천 최대사입가 */}
              <div className="mt-4 p-3 bg-bg-elevated rounded-xl border-2 border-brand-primary/30">
                <div className="text-[13px] font-bold text-brand-primary mb-1">
                  💡 추천 {getTerm('최대사입가')}
                </div>
                <div className="text-[22px] font-black text-brand-primary mb-1">
                  {formatKRW(recommendedMaxCost)}
                </div>
                <div className="text-[11px] text-text-secondary">
                  목표 {getTerm('마진율')} {formatPercent(targetMarginRate)}를 달성하려면 이 가격 이하로 사입하세요
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 비용 입력 */}
          <Card className="animate-slide-in">
            <CardHeader icon="💰" title="가격 및 비용 입력" />
            <CardContent>
              <Input
                label={`${getTerm('판매가')}${product?.salePrice ? ` (쿠팡: ${formatKRW(product.salePrice)})` : ''}`}
                value={salePrice === 0 ? '' : formatInput(salePrice)}
                onChange={(v) => setSalePriceOverride(toNumber(v))}
                placeholder="0"
                variant="highlighted"
              />

              <Input
                label={`원가 (${getTerm('사입가')})`}
                value={cost === 0 ? '' : formatInput(cost)}
                onChange={(v) => setCost(toNumber(v))}
                placeholder="0"
                hint={COST_HINT_MESSAGE}
              />

              <Input
                label="기타 비용"
                value={extraCost === 0 ? '' : formatInput(extraCost)}
                onChange={(v) => setExtraCost(toNumber(v))}
                placeholder="0"
              />
            </CardContent>
          </Card>

          {/* 상품 크기 선택 */}
          <Card className="animate-slide-in">
            <CardHeader icon="📏" title="상품 크기 선택" />
            <CardContent>
              <Select
                value={productSize}
                onChange={(v) => setProductSize(v as ProductSizeTier)}
                options={sizeOptions.map(([key, value]) => ({
                  value: key,
                  label: `${value.label} - ${formatKRW(getLogisticsFee(salePrice || 25800, key))}`,
                }))}
              />

              {/* 선택된 크기 정보 */}
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="text-xs font-bold text-blue-400 mb-1">
                  💡 {PRODUCT_SIZE_INFO[productSize].label} - {formatKRW(currentLogisticsFee)} (부가세 포함)
                </div>
                <div className="text-[11px] text-blue-400/80">
                  {PRODUCT_SIZE_INFO[productSize].description}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 비용 구성 시각화 */}
          <Card className="animate-slide-in">
            <CardHeader icon="📈" title="비용 구성 비율" />
            <DonutChart
              salesFee={calculation.totalSalesFee}
              logisticsFee={calculation.totalLogisticsFee}
              profit={calculation.netProfit}
            />
          </Card>

          {/* 수수료 상세 - 아코디언 */}
          <Card className="animate-slide-in">
            <Accordion title={`📊 ${getTerm('로켓그로스')} 수수료 상세`} defaultOpen={false}>
              <div className="space-y-2">
                <div className="text-xs font-bold text-text-secondary mb-1">
                  {getTerm('판매수수료')}
                </div>
                <div className="flex justify-between items-center p-2.5 bg-brand-warning/10 rounded-lg">
                  <span className="text-[13px] text-text-secondary font-semibold">{getTerm('판매수수료')} ({formatPercent(categoryFeeRate * 100)})</span>
                  <span className="text-[15px] text-text-primary">{formatKRW(calculation.salesCommission)}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-brand-warning/10 rounded-lg">
                  <span className="text-[13px] text-text-secondary font-semibold">{getTerm('부가세')} (10%)</span>
                  <span className="text-[15px] text-text-primary">{formatKRW(calculation.vat)}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-brand-warning/20 border-2 border-brand-warning/50 rounded-lg">
                  <span className="text-[13px] text-brand-warning font-bold">{getTerm('판매수수료')} 소계</span>
                  <span className="text-[16px] text-brand-warning font-bold">{formatKRW(calculation.totalSalesFee)}</span>
                </div>

                <div className="text-xs font-bold text-text-secondary mt-3 mb-1">
                  {getTerm('물류비')} ({PRODUCT_SIZE_INFO[productSize].label}, {getTerm('부가세')} 포함)
                </div>
                <div className="flex justify-between items-center p-2.5 bg-brand-primary/10 rounded-lg">
                  <span className="text-[13px] text-text-secondary font-semibold">{getTerm('입출고요금')}</span>
                  <span className="text-[15px] text-text-primary">{formatKRW(calculation.logisticsInbound)}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-brand-primary/10 rounded-lg">
                  <span className="text-[13px] text-text-secondary font-semibold">{getTerm('배송비')}</span>
                  <span className="text-[15px] text-text-primary">{formatKRW(calculation.logisticsShipping)}</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-brand-primary/20 border-2 border-brand-primary/50 rounded-lg">
                  <span className="text-[13px] text-brand-primary font-bold">{getTerm('물류비')} 소계</span>
                  <span className="text-[16px] text-brand-primary font-bold">{formatKRW(calculation.totalLogisticsFee)}</span>
                </div>

                <div className="flex justify-between items-center p-3 mt-2 bg-brand-danger/20 border-2 border-brand-danger/50 rounded-lg">
                  <span className="text-[15px] text-brand-danger font-extrabold">총 수수료</span>
                  <span className="text-[20px] text-brand-danger font-extrabold">{formatKRW(calculation.totalFee)}</span>
                </div>
              </div>
            </Accordion>
          </Card>

          {/* 최대 사입가 안내 */}
          <Card variant="info" className="animate-slide-in">
            <div className="text-xs text-blue-400 font-semibold mb-1">
              💡 최대 사입가 (마진 0% 기준)
            </div>
            <div className="text-2xl text-blue-400 font-black">
              {formatKRW(calculation.maxPurchasePrice)}
            </div>
            <div className="text-[11px] text-blue-400/80 mt-1">
              이 가격보다 낮게 사입하면 이익이 발생합니다
            </div>
          </Card>
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
