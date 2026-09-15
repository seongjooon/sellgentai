// 쿠팡 상품 페이지 판매가 추출
//
// 화면의 혜택가(.final-price-amount)는 로그인한 사용자의 쿠폰이 적용된 값이라 0원이 될 수 있다.
// JSON-LD Offer.price 는 쿠폰 적용 전 판매가를 담는다.
// 2026-09-15 실측 (products/7749853225, 웰컴백 쿠폰 적용 계정):
//   화면 혜택가 0원 / Offer.price "28470" / priceSpecification StrikethroughPrice "32700"

export function toPositivePrice(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const numeric = String(value).replace(/[^\d.]/g, '');
  if (!numeric) return null;
  const parsed = Number(numeric);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function pickOfferPrice(jsonLdNodes: any[], vendorItemId: string | null): number | null {
  for (const node of jsonLdNodes) {
    const offers = Array.isArray(node?.offers) ? node.offers : node?.offers ? [node.offers] : [];
    if (offers.length === 0) continue;

    // 옵션별 Offer 가 여러 개면 현재 URL 의 vendorItemId 와 같은 Offer 를 먼저 본다
    const matched = vendorItemId
      ? offers.find((offer: any) => typeof offer?.url === 'string' && offer.url.includes(`vendorItemId=${vendorItemId}`))
      : undefined;

    for (const offer of matched ? [matched, ...offers] : offers) {
      const price = toPositivePrice(offer?.price) ?? toPositivePrice(offer?.lowPrice);
      if (price !== null) return price;
    }
  }
  return null;
}
