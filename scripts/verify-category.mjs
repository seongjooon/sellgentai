// 카테고리 수수료 키워드 매칭 검증
// 실행: npm run test:category
import assert from 'node:assert/strict';
import {
  DEFAULT_FEE_RATE,
  getCategoryFeeRate,
  getMatchedCategoryName,
} from '../entrypoints/sidebar/feeCalculator.ts';

const check = (path, expectedName, expectedRate, label) => {
  const name = getMatchedCategoryName(path);
  const rate = getCategoryFeeRate(path);
  assert.equal(name, expectedName, `${label} — 이름: ${name} !== ${expectedName}`);
  assert.ok(Math.abs(rate - expectedRate) < 1e-9, `${label} — 수수료율: ${rate} !== ${expectedRate}`);
  console.log(`PASS ${label}: ${name} (${rate})`);
};

// 2026-09-15 실측 오탐: products/7749853225 의 '홈카페' 가 자동차 키워드 '카' 에 매칭됨
check(['쿠팡 홈', '홈카페', '원두/커피', '캡슐커피'], '캡슐커피', DEFAULT_FEE_RATE, '홈카페 캡슐커피가 카 에 매칭되지 않음');

// 한 글자 키워드 부분 문자열 오탐 방지
check(['패션의류', '카디건'], '패션', 0.105, '카디건 → 카 오탐 방지');
check(['홈인테리어', '카펫'], '홈인테리어', 0.108, '카펫 → 펫 오탐 방지');
check(['가구', '책상'], '가구', 0.108, '책상 → 책 오탐 방지');
check(['책'], '책', 0.1188, '한 글자 키워드는 정확히 같을 때 매칭');

// 기존 매칭 유지
check(['헬스/건강식품'], '건강식품', 0.106, '건강식품이 건강보다 우선');
check(['자동차용품', '카시트'], '카시트', 0.10, '카시트 정확 매칭');
check(['노트북/PC'], 'PC', 0.05, '대소문자 정규화');
check(['스포츠', '골프공'], '골프', 0.076, '구체적인 단계의 부분 일치 우선');
check(['남성의류'], '의류', 0.105, '두 글자 이상 키워드 부분 일치 유지');
check(['가전디지털'], '디지털', 0.078, '같은 단계에서는 긴 키워드 우선');
check([], '기타', DEFAULT_FEE_RATE, '빈 경로');

console.log('ALL PASS');
