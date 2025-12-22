/**
 * 쿠팡 로켓그로스 수수료 계산 모듈
 *
 * 카테고리별 판매 수수료율 및 계산 로직
 * 참고: https://cloud.mkt.coupang.com/Fee-Table
 */

/**
 * 카테고리별 판매 수수료율 매핑 테이블
 *
 * breadcrumb나 카테고리 텍스트에서 키워드를 찾아 매칭
 * 여러 키워드가 매칭되면 가장 구체적인(먼저 매칭된) 수수료율 사용
 */
export const CATEGORY_FEE_RATES: Record<string, number> = {
  // 가전/디지털
  '에어컨': 0.058,
  '카메라': 0.058,
  '렌즈': 0.06,
  '태블릿': 0.05,
  '컴퓨터': 0.05,
  '노트북': 0.05,
  'PC': 0.05,
  '모니터': 0.045,
  '게임': 0.068,
  '게이밍': 0.068,
  '가전': 0.078,
  '디지털': 0.078,
  '전자': 0.078,

  // 가구/홈인테리어
  '가구': 0.108,
  '홈인테리어': 0.108,
  '인테리어': 0.108,
  '침대': 0.108,
  '소파': 0.108,

  // 도서/음반/문구
  '도서': 0.108,
  '책': 0.108,
  '음반': 0.108,
  '문구': 0.108,
  '사무': 0.108,

  // 유아동/출산
  '기저귀': 0.064,
  '분유': 0.064,
  '물티슈': 0.082,
  '이유식': 0.078,
  '유아': 0.10,
  '출산': 0.10,
  '아기': 0.10,

  // 스포츠/레저
  '골프': 0.076,
  '자전거': 0.076,
  '스포츠의류': 0.105,
  '운동화': 0.105,
  '스포츠': 0.108,
  '레저': 0.108,
  '캠핑': 0.108,

  // 뷰티/미용
  '뷰티': 0.096,
  '화장품': 0.096,
  '미용': 0.096,
  '코스메틱': 0.096,
  '성인용품': 0.096,

  // 생활/건강
  '생활': 0.078,
  '건강': 0.078,
  '주방': 0.078,
  '욕실': 0.078,

  // 식품
  '식품': 0.106,
  '음식': 0.106,
  '먹거리': 0.106,
  '간식': 0.106,
  '음료': 0.106,

  // 완구/취미
  '완구': 0.108,
  '장난감': 0.108,
  '취미': 0.108,
  '드론': 0.078,

  // 자동차/공구
  '자동차': 0.10,
  '차량': 0.10,
  '카': 0.10,
  '오토바이': 0.076,
  '모터사이클': 0.076,
  '공구': 0.10,

  // 패션
  '패션': 0.105,
  '의류': 0.105,
  '옷': 0.105,
  '남성패션': 0.105,
  '여성패션': 0.105,
  '신발': 0.105,
  '슈즈': 0.105,
  '가방': 0.105,
  '액세서리': 0.105,
  '시계': 0.105,
  '주얼리': 0.04,
  '보석': 0.04,

  // 반려동물
  '반려동물': 0.108,
  '펫': 0.108,
  '애완': 0.108,
};

/**
 * 기본 수수료율 (카테고리 매칭 실패 시)
 */
export const DEFAULT_FEE_RATE = 0.10; // 10%

/**
 * 카테고리 배열에서 수수료율 추출
 *
 * @param categories - breadcrumb에서 추출한 카테고리 배열
 * @returns 매칭된 수수료율 (0~1 사이의 소수)
 */
export function getCategoryFeeRate(categories: string[]): number {
  if (!categories || categories.length === 0) {
    return DEFAULT_FEE_RATE;
  }

  // 카테고리 배열을 역순으로 검색 (더 구체적인 카테고리가 뒤에 있음)
  for (let i = categories.length - 1; i >= 0; i--) {
    const category = categories[i];

    // 카테고리 텍스트에서 키워드 매칭
    for (const [keyword, rate] of Object.entries(CATEGORY_FEE_RATES)) {
      if (category.includes(keyword)) {
        return rate;
      }
    }
  }

  return DEFAULT_FEE_RATE;
}

/**
 * 매칭된 카테고리 키워드 찾기 (UI 표시용)
 *
 * @param categories - breadcrumb에서 추출한 카테고리 배열
 * @returns 매칭된 카테고리 키워드 또는 '기타'
 */
export function getMatchedCategoryName(categories: string[]): string {
  if (!categories || categories.length === 0) {
    return '기타';
  }

  for (let i = categories.length - 1; i >= 0; i--) {
    const category = categories[i];
    for (const keyword of Object.keys(CATEGORY_FEE_RATES)) {
      if (category.includes(keyword)) {
        return keyword;
      }
    }
  }

  return categories[categories.length - 1] || '기타';
}

/**
 * 로켓그로스 상품 크기 단계
 *
 * 2025년 1월 6일부터 적용되는 6단계 크기 체계
 */
export type ProductSizeTier =
  | 'extra-small'  // 극소형
  | 'small'        // 소형
  | 'medium'       // 중형
  | 'large-1'      // 대형1
  | 'large-2'      // 대형2
  | 'extra-large'; // 특대형

/**
 * 크기별 로켓그로스 물류비 (입출고비 + 배송비)
 *
 * 참고: https://www.percenty.co.kr/blog/rocket-growth-fee-revision-key-details-sellers-need-to-know
 */
export const ROCKET_GROWTH_LOGISTICS_FEES: Record<ProductSizeTier, {
  inboundOutbound: number;  // 입출고 요금
  shipping: number;         // 배송 요금
  total: number;            // 합계
  label: string;            // 한글 레이블
  description: string;      // 설명
}> = {
  'extra-small': {
    inboundOutbound: 1650,
    shipping: 2200,
    total: 3850,
    label: '극소형',
    description: '매우 작은 상품 (예: 액세서리, 화장품 샘플)',
  },
  'small': {
    inboundOutbound: 1750,
    shipping: 2400,
    total: 4150,
    label: '소형',
    description: '작은 상품 (예: 화장품, 소형 전자제품)',
  },
  'medium': {
    inboundOutbound: 2000,
    shipping: 3000,
    total: 5000,
    label: '중형',
    description: '일반 크기 상품 (예: 의류, 신발, 주방용품)',
  },
  'large-1': {
    inboundOutbound: 2400,
    shipping: 4000,
    total: 6400,
    label: '대형1',
    description: '큰 상품 (예: 가전제품, 큰 가방)',
  },
  'large-2': {
    inboundOutbound: 2400,
    shipping: 5500,
    total: 7900,
    label: '대형2',
    description: '매우 큰 상품 (예: 대형 가전, 가구)',
  },
  'extra-large': {
    inboundOutbound: 2400,
    shipping: 9500,
    total: 11900,
    label: '특대형',
    description: '초대형 상품 (예: 대형 가구, 대형 가전)',
  },
};

/**
 * 로켓그로스 수수료 계산 파라미터
 */
export interface FeeCalculationParams {
  salePrice: number;           // 판매가
  categoryFeeRate: number;     // 카테고리 수수료율
  cost: number;                // 원가
  extraCost: number;           // 기타 비용
  productSize: ProductSizeTier; // 상품 크기
}

/**
 * 로켓그로스 수수료 계산 결과
 */
export interface FeeCalculationResult {
  // 판매 수수료 상세
  salesCommission: number;     // 판매 수수료
  vat: number;                 // 부가세 (수수료의 10%)
  totalSalesFee: number;       // 총 판매 수수료 (판매 수수료 + 부가세)

  // 물류비 상세
  logisticsInbound: number;    // 입출고 요금
  logisticsShipping: number;   // 배송 요금
  totalLogisticsFee: number;   // 총 물류비

  // 전체 수수료
  totalFee: number;            // 총 수수료 (판매 수수료 + 부가세 + 물류비)

  // 비용 상세
  cost: number;                // 원가
  extraCost: number;           // 기타 비용
  totalCost: number;           // 총 비용

  // 마진 계산
  netProfit: number;           // 예상 순이익
  marginRate: number;          // 마진율 (%)
  maxPurchasePrice: number;    // 최대 사입가 (마진 0% 기준)

  // 참고 정보
  categoryFeeRate: number;     // 적용된 카테고리 수수료율
  productSize: ProductSizeTier; // 상품 크기
}

/**
 * 로켓그로스 수수료 계산
 *
 * @param params - 계산 파라미터
 * @returns 수수료 계산 결과
 */
export function calculateRocketGrossFees(params: FeeCalculationParams): FeeCalculationResult {
  const {
    salePrice,
    categoryFeeRate,
    cost,
    extraCost,
    productSize,
  } = params;

  // 1. 판매 수수료 (카테고리별)
  const salesCommission = salePrice * categoryFeeRate;

  // 2. 부가세 (수수료의 10%)
  const vat = salesCommission * 0.1;

  // 3. 총 판매 수수료
  const totalSalesFee = salesCommission + vat;

  // 4. 물류비 (크기별)
  const logisticsFees = ROCKET_GROWTH_LOGISTICS_FEES[productSize];
  const logisticsInbound = logisticsFees.inboundOutbound;
  const logisticsShipping = logisticsFees.shipping;
  const totalLogisticsFee = logisticsFees.total;

  // 5. 총 수수료 (판매 수수료 + 물류비)
  const totalFee = totalSalesFee + totalLogisticsFee;

  // 6. 총 비용
  const totalCost = totalFee + cost + extraCost;

  // 7. 순이익
  const netProfit = salePrice - totalCost;

  // 8. 마진율
  const marginRate = salePrice > 0 ? (netProfit / salePrice) * 100 : 0;

  // 9. 최대 사입가 (마진 0%일 때 가능한 최대 원가)
  const maxPurchasePrice = salePrice - totalFee - extraCost;

  return {
    salesCommission,
    vat,
    totalSalesFee,
    logisticsInbound,
    logisticsShipping,
    totalLogisticsFee,
    totalFee,
    cost,
    extraCost,
    totalCost,
    netProfit,
    marginRate,
    maxPurchasePrice,
    categoryFeeRate,
    productSize,
  };
}
