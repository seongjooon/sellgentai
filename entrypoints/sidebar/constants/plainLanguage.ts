/**
 * 평어 텍스트 변환 - 전문 용어를 초보자가 이해하기 쉬운 말로 설명
 * Plain Language Tooltips for Technical Terms
 */

export interface TermExplanation {
  term: string; // 전문 용어
  plain: string; // 쉬운 설명
  detail?: string; // 상세 설명 (선택)
}

export const PLAIN_TERMS: Record<string, TermExplanation> = {
  // 가격 관련
  판매가: {
    term: '판매가',
    plain: '쿠팡에서 고객에게 파는 가격',
    detail: '소비자가 실제로 지불하는 금액이에요',
  },
  사입가: {
    term: '사입가',
    plain: '내가 제품을 사는 가격',
    detail: '도매가 또는 제조사에서 구매하는 가격이에요',
  },
  최대사입가: {
    term: '최대 사입가',
    plain: '목표 마진을 남기려면 이 가격보다 싸게 사야 해요',
    detail: '이 가격 이하로 사입해야 원하는 마진율을 달성할 수 있어요',
  },

  // 수수료 관련
  판매수수료: {
    term: '판매 수수료',
    plain: '쿠팡에 내는 중개 수수료',
    detail: '카테고리마다 다르며, 보통 4%~12% 정도예요',
  },
  부가세: {
    term: '부가세',
    plain: '수수료에 붙는 세금 (10%)',
    detail: '판매 수수료의 10%를 추가로 내야 해요',
  },
  총수수료: {
    term: '총 수수료',
    plain: '판매 수수료 + 부가세를 합친 금액',
    detail: '쿠팡에 실제로 내는 전체 수수료예요',
  },

  // 물류비 관련
  물류비: {
    term: '물류비',
    plain: '쿠팡 창고 보관 + 배송 비용',
    detail: '로켓그로스는 쿠팡이 보관하고 배송해주는 대신 비용을 받아요',
  },
  입출고요금: {
    term: '입출고 요금',
    plain: '창고에 넣고 빼는 비용',
    detail: '상품을 쿠팡 창고에 입고하고 출고할 때 드는 비용이에요',
  },
  배송비: {
    term: '배송비',
    plain: '고객에게 배송하는 비용',
    detail: '쿠팡이 고객에게 상품을 배달하는 데 드는 비용이에요',
  },
  보관료: {
    term: '보관료',
    plain: '창고에 보관하는 비용',
    detail: '상품이 창고에 있는 동안 매일 조금씩 부과되는 비용이에요',
  },

  // 마진 관련
  마진율: {
    term: '마진율',
    plain: '100원 팔 때 순수익이 몇 원인지 (퍼센트)',
    detail: '판매가 대비 순이익의 비율이에요. 높을수록 수익성이 좋아요',
  },
  순이익: {
    term: '순이익',
    plain: '모든 비용을 빼고 내 손에 남는 돈',
    detail: '판매가 - 사입가 - 수수료 - 물류비 = 내가 버는 돈',
  },
  목표마진율: {
    term: '목표 마진율',
    plain: '내가 원하는 최소 수익률',
    detail: '이 비율 이상을 남기고 싶은 목표예요. 보통 20~25%를 목표로 해요',
  },

  // 카테고리 관련
  카테고리: {
    term: '카테고리',
    plain: '상품 종류 (예: 의류, 가전, 식품 등)',
    detail: '카테고리마다 판매 수수료가 달라요',
  },

  // 크기 관련
  상품크기: {
    term: '상품 크기',
    plain: '상품의 부피와 무게',
    detail: '크기가 클수록 물류비가 비싸요. 작고 가벼울수록 유리해요',
  },

  // 기타
  쿠팡직매입: {
    term: '쿠팡 직매입',
    plain: '쿠팡이 직접 사입해서 파는 상품',
    detail: '쿠팡이 이미 판매 중이므로 경쟁이 어려워요. 다른 상품을 찾는 게 좋아요',
  },
  로켓그로스: {
    term: '로켓그로스',
    plain: '쿠팡이 보관·배송을 대행해주는 서비스',
    detail: '내가 쿠팡 창고에 상품만 보내면, 쿠팡이 알아서 보관하고 배송해줘요',
  },
};

/**
 * 전문 용어를 쉬운 말로 변환
 */
export function getPlainTerm(term: string): string {
  const explanation = PLAIN_TERMS[term];
  return explanation ? explanation.plain : term;
}

/**
 * 상세 설명 가져오기
 */
export function getDetailExplanation(term: string): string | undefined {
  const explanation = PLAIN_TERMS[term];
  return explanation?.detail;
}

/**
 * 모든 용어 목록 가져오기
 */
export function getAllTerms(): string[] {
  return Object.keys(PLAIN_TERMS);
}
