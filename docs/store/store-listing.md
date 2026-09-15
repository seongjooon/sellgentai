# Chrome Web Store 등록 정보 (SEO)

- 작성일: 2026-09-15
- 대상 버전: 1.2.1
- 스토어 ID: `dfpmlhjkcdhhffmplnpbfemkjnmaapjd`

## 원칙 (공식 가이드 근거)

- 스토어 순위는 평점과 사용 통계(설치 대비 제거 등)의 영향이 크다. 문구 최적화만으로 순위가 크게 오르지는 않는다. — [Creating a great listing page](https://developer.chrome.com/docs/webstore/best-listing)
- 제목에 키워드를 채워 넣지 않는다. 설명에서 키워드를 반복하거나 무관한 키워드를 쓰면 스토어에서 정지될 수 있다. — 같은 문서
- 요약(manifest `description`)은 최대 132자, 이름은 최대 75자. — [description](https://developer.chrome.com/docs/extensions/reference/manifest/description), [name](https://developer.chrome.com/docs/extensions/reference/manifest/name)
- 기능 설명은 코드에 실제로 있는 것만 쓴다. (보관료·반품비·광고비 자동 계산은 없음)

## 코드에서 관리하는 항목 (업로드 시 자동 반영)

`wxt.config.ts` 는 `__MSG_extName__`, `__MSG_extDescription__`, `__MSG_actionTitle__` 를 쓰고, 실제 문구는 `public/_locales/{ko,en}/messages.json` 에 있다. 이전에는 매니페스트에 한국어가 직접 적혀 있어 영어 locale 문구가 쓰이지 않았다. — [chrome.i18n](https://developer.chrome.com/docs/extensions/reference/api/i18n)

| 항목 | 한국어 | English |
|---|---|---|
| 이름 | Sellgent AI - 쿠팡 로켓그로스 마진 계산기 | Sellgent AI - Coupang Rocket Growth Margin Calculator |
| 요약 | 쿠팡 상품 페이지에서 로켓그로스 판매수수료·부가세·사이즈별 물류비를 자동 반영해 예상 순이익과 마진율을 바로 계산합니다. 목표 마진을 맞추는 최대 사입가도 알려드려요. | See net profit and margin on Coupang product pages, with Rocket Growth category fees, VAT and size-based logistics fees applied. |

한국어 스토어 제목은 기존 배포본과 같다(사용자 혼란 방지).

## 대시보드에 직접 입력하는 항목

### 상세 설명 (한국어)

```
쿠팡 로켓그로스로 팔 상품, 남는 게 있을까요?
Sellgent AI는 쿠팡 상품 페이지에서 아이콘 한 번만 누르면 판매수수료·부가세·물류비를 반영한 예상 순이익과 마진율을 사이드바에 바로 보여주는 마진 계산기입니다.

■ 주요 기능
• 상품 정보 자동 인식: 상품명, 판매가, 배송비, 카테고리, 판매자, 평점, 리뷰 수
• 카테고리별 로켓그로스 판매수수료 자동 적용
• 상품 크기 6단계에 따른 입출고·배송비와 부가세 10% 반영
• 예상 순이익·마진율과 비용 구성 비율 차트
• 목표 마진율 설정과 추천 최대 사입가 안내
• 쿠팡 직매입 상품 경고
• 최근 계산 기록 10개 저장, 쉬운 용어(초보 모드), 다크 모드

■ 사용 방법
1. 쿠팡 상품 페이지를 엽니다.
2. 브라우저 오른쪽 위의 Sellgent AI 아이콘을 누릅니다.
3. 원가(사입가)와 상품 크기를 조정하면 결과가 바로 다시 계산됩니다.

■ 알아두세요
• 보관료, 반품비, 광고비는 자동 계산에 포함되지 않는 예상치입니다. 정확한 금액은 쿠팡 WING 정산 내역을 확인해 주세요.
• 계산은 브라우저 안에서만 처리되며 입력한 원가나 결과를 서버로 보내지 않습니다.
• 사이드바에 선택 참여 설문(Google Forms)이 표시될 수 있습니다.

개인정보처리방침: https://seongjooon.github.io/sellgentai/privacy.html
문의: tovvcorp@gmail.com
```

### Detailed description (English)

```
Selling on Coupang Rocket Growth? Sellgent AI shows the expected net profit and margin of a Coupang product in a sidebar, with category sales fees, 10% VAT and size-based logistics fees applied.

Features
• Reads product name, price, shipping fee, category, seller, rating and review count
• Applies Rocket Growth sales fees by category
• Inbound and delivery fees for 6 size tiers, plus 10% VAT
• Net profit, margin and cost breakdown chart
• Target margin with a recommended maximum purchase price
• Warning for products sold directly by Coupang

Notes
• Storage, return and advertising fees are not included; results are estimates.
• Calculations run in your browser. Your costs and results are not sent to any server.
• An optional survey (Google Forms) may appear in the sidebar.

Privacy policy: https://seongjooon.github.io/sellgentai/privacy.html
```

### 기타 필드

| 필드 | 권장값 |
|---|---|
| 웹사이트 | `https://seongjooon.github.io/sellgentai/` (랜딩 페이지 `index.html`) |
| 개인정보처리방침 URL | `https://seongjooon.github.io/sellgentai/privacy.html` |
| 지원 | `tovvcorp@gmail.com` |
| 스크린샷 | 1280×800 또는 640×400. 결과 사이드바, 목표 마진·최대 사입가, 비용 구성 차트, 직매입 경고 순 |

## 웹 검색 (GitHub Pages)

- Pages 는 **master 브랜치 루트**에서 배포된다(`https://seongjooon.github.io/sellgentai/`). `index.html`, `privacy.html`, `sitemap.xml` 변경은 master 에 반영되어야 공개된다.
- 루트에 `index.html` 이 생기면 README 대신 랜딩 페이지가 표시된다.
- `robots.txt` 는 호스트 최상위에만 유효해 프로젝트 페이지(`/sellgentai/`)에서는 쓸 수 없다. 사이트맵은 Search Console 에 직접 제출한다. — [robots.txt 사양](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt)
- meta description 은 페이지마다 다르게, 키워드 나열이 아닌 문장으로 쓴다. — [스니펫 가이드](https://developers.google.com/search/docs/appearance/snippet)

### 운영자가 할 일

- [ ] master 반영 후 Search Console 에 `https://seongjooon.github.io/sellgentai/` 등록(URL 접두어 방식, HTML 태그 인증) 및 `sitemap.xml` 제출
- [ ] 스토어 대시보드 상세 설명·웹사이트·개인정보처리방침 URL 갱신
- [ ] 링크 미리보기용 1200×630 이미지가 필요하면 제작 후 `og:image` 교체 (현재 128px 아이콘)
