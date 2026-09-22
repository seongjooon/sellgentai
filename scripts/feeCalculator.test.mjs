/**
 * feeCalculator.ts 회귀 테스트 (판매수수료·부가세 원 단위 반올림)
 *
 * 프로젝트에 테스트 러너(vitest 등)가 설정되어 있지 않아, Node.js의
 * --experimental-strip-types 로 TypeScript 소스를 직접 실행하는 assert 기반
 * 스모크 테스트로 작성했다.
 *
 * 실행: npm run test:fees
 */
import assert from 'node:assert/strict';
import { calculateRocketGrossFees, getLogisticsFee } from '../entrypoints/sidebar/feeCalculator.ts';

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`  ok - ${name}`);
}

console.log('feeCalculator.test.mjs');

test('원화 금액 필드는 모두 정수여야 한다 (반올림 오류 회귀 방지)', () => {
  const result = calculateRocketGrossFees({
    salePrice: 15900,
    categoryFeeRate: 0.105, // 패션 (15900 * 0.105 = 1669.5 → 소수점 발생 케이스)
    cost: 5000,
    extraCost: 0,
    productSize: 'medium',
  });

  const wonFields = [
    'salesCommission',
    'vat',
    'totalSalesFee',
    'logisticsInbound',
    'logisticsShipping',
    'totalLogisticsFee',
    'totalFee',
    'totalCost',
    'netProfit',
    'maxPurchasePrice',
  ];

  for (const field of wonFields) {
    assert.ok(
      Number.isInteger(result[field]),
      `${field} 는 정수여야 하는데 ${result[field]} 가 반환됨`
    );
  }
});

test('판매 수수료와 부가세는 원 단위로 반올림된다', () => {
  const result = calculateRocketGrossFees({
    salePrice: 15900,
    categoryFeeRate: 0.105,
    cost: 5000,
    extraCost: 0,
    productSize: 'medium',
  });

  // 15900 * 0.105 = 1669.5 → Math.round → 1670
  assert.equal(result.salesCommission, 1670);
  // 1670 * 0.1 = 167
  assert.equal(result.vat, 167);
  assert.equal(result.totalSalesFee, 1837);
});

test('물류비 입출고/배송 분할 합계는 총 물류비와 정확히 일치한다', () => {
  const result = calculateRocketGrossFees({
    salePrice: 33000,
    categoryFeeRate: 0.108,
    cost: 10000,
    extraCost: 500,
    productSize: 'large-1',
  });

  assert.equal(result.logisticsInbound + result.logisticsShipping, result.totalLogisticsFee);
});

test('총 수수료/총 비용/순이익 항등식이 성립한다', () => {
  const params = {
    salePrice: 27900,
    categoryFeeRate: 0.096, // 뷰티
    cost: 8000,
    extraCost: 1200,
    productSize: 'small',
  };
  const result = calculateRocketGrossFees(params);

  assert.equal(result.totalFee, result.totalSalesFee + result.totalLogisticsFee);
  assert.equal(result.totalCost, result.totalFee + result.cost + result.extraCost);
  assert.equal(result.netProfit, params.salePrice - result.totalCost);
  assert.equal(result.maxPurchasePrice, params.salePrice - result.totalFee - result.extraCost);
});

test('부동소수점 오차가 발생하기 쉬운 수수료율 조합에서도 정수를 반환한다', () => {
  // 0.1 + 0.2 = 0.30000000000000004 류의 부동소수점 오차를 유발하는 값들
  // expected: 반올림 결과를 고정한다. .5 경계(250*0.106=26.5, 900*0.045=40.5)는 부동소수점 표현
  // 오차로 26.499… 이 되면 26 으로 내려갈 수 있어, 실제로 올림 쪽으로 반올림되는지 확인한다.
  const cases = [
    { salePrice: 1234, categoryFeeRate: 0.058, commission: 72, vat: 7 },
    { salePrice: 9999, categoryFeeRate: 0.1188, commission: 1188, vat: 119 },
    { salePrice: 100001, categoryFeeRate: 0.078, commission: 7800, vat: 780 },
    { salePrice: 1, categoryFeeRate: 0.04, commission: 0, vat: 0 },
    { salePrice: 250, categoryFeeRate: 0.106, commission: 27, vat: 3 },
    { salePrice: 900, categoryFeeRate: 0.045, commission: 41, vat: 4 },
  ];

  for (const { salePrice, categoryFeeRate, commission, vat } of cases) {
    const result = calculateRocketGrossFees({
      salePrice,
      categoryFeeRate,
      cost: 0,
      extraCost: 0,
      productSize: 'extra-small',
    });
    assert.ok(
      Number.isInteger(result.salesCommission),
      `salePrice=${salePrice}, rate=${categoryFeeRate} → salesCommission=${result.salesCommission}`
    );
    assert.ok(
      Number.isInteger(result.vat),
      `salePrice=${salePrice}, rate=${categoryFeeRate} → vat=${result.vat}`
    );
    assert.equal(result.salesCommission, commission, `salePrice=${salePrice}, rate=${categoryFeeRate} 판매수수료`);
    assert.equal(result.vat, vat, `salePrice=${salePrice}, rate=${categoryFeeRate} 부가세`);
  }
});

test('salePrice가 0이면 마진율은 0이고 예외가 발생하지 않는다', () => {
  const result = calculateRocketGrossFees({
    salePrice: 0,
    categoryFeeRate: 0.1,
    cost: 0,
    extraCost: 0,
    productSize: 'extra-small',
  });
  assert.equal(result.marginRate, 0);
});

test('getLogisticsFee는 부가세 포함 정수를 반환한다 (기존 동작 유지 확인)', () => {
  const fee = getLogisticsFee(9900, 'medium');
  assert.ok(Number.isInteger(fee));
  // 4500 * 1.1 = 4950
  assert.equal(fee, 4950);
});

console.log(`\n${passed} passed`);
