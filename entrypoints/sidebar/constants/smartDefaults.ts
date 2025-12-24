/**
 * 스마트 기본값 설정
 * 사용자가 입력하지 않아도 바로 결과를 볼 수 있도록 자동으로 추정
 */

import type { ProductSizeTier } from '../feeCalculator';

/**
 * 자동 추정 사입가 비율
 * 일반적으로 도매가는 판매가의 50-70%
 * 기본값으로 60%를 사용
 */
export const DEFAULT_COST_RATIO = 0.6;

/**
 * 카테고리별 추천 상품 크기
 * 카테고리 특성에 따라 일반적인 크기를 추정
 */
export const CATEGORY_SIZE_DEFAULTS: Record<string, ProductSizeTier> = {
  // 작은 크기 (small, extraSmall)
  화장품: 'small',
  뷰티: 'small',
  향수: 'small',
  액세서리: 'small',
  귀걸이: 'extraSmall',
  반지: 'extraSmall',
  목걸이: 'small',
  팔찌: 'small',
  시계: 'small',
  안경: 'small',
  선글라스: 'small',

  // 중간 크기 (medium)
  의류: 'medium',
  패션잡화: 'medium',
  신발: 'medium',
  가방: 'medium',
  완구: 'medium',
  주방용품: 'medium',
  생활용품: 'medium',
  문구: 'medium',
  도서: 'medium',

  // 큰 크기 (large, extraLarge)
  가전제품: 'large',
  스포츠: 'large',
  캠핑: 'extraLarge',
  가구: 'extraLarge',
  침구: 'large',
  인테리어: 'large',
};

/**
 * 기본 목표 마진율
 * 대부분의 성공하는 셀러들이 목표로 하는 마진율
 */
export const DEFAULT_TARGET_MARGIN_RATE = 20;

/**
 * 카테고리 이름으로 추천 크기 가져오기
 * @param categoryPath 카테고리 경로 배열
 * @returns 추천 상품 크기
 */
export function getRecommendedSize(categoryPath: string[]): ProductSizeTier {
  // 카테고리 경로에서 키워드 찾기
  for (const category of categoryPath) {
    for (const [keyword, size] of Object.entries(CATEGORY_SIZE_DEFAULTS)) {
      if (category.includes(keyword)) {
        return size;
      }
    }
  }

  // 기본값: medium
  return 'medium';
}

/**
 * 판매가 기반 자동 사입가 추정
 * @param salePrice 판매가
 * @returns 추정 사입가
 */
export function estimateCost(salePrice: number): number {
  if (salePrice === 0) return 0;
  return Math.round(salePrice * DEFAULT_COST_RATIO);
}

/**
 * 사입가 입력 힌트 메시지
 */
export const COST_HINT_MESSAGE = '💡 일반적인 도매가는 판매가의 50-70%예요';

/**
 * 목표 마진율 힌트 메시지
 */
export const TARGET_MARGIN_HINT_MESSAGE = '💡 대부분의 셀러가 20-25%를 목표로 해요';
