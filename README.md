# 🤖 Sellgent AI - 로켓그로스 마진 계산기

[한국어](#한국어) | [English](#english)

---

## 한국어

쿠팡 로켓그로스 셀러를 위한 AI 기반 실시간 마진 계산 크롬 확장 프로그램

## 📋 목차

- [소개](#소개)
- [주요 기능](#주요-기능)
- [설치 방법](#설치-방법)
- [사용 방법](#사용-방법)
- [기술 스택](#기술-스택)
- [개발](#개발)
- [빌드](#빌드)
- [라이선스](#라이선스)

## 소개

**Sellgent AI**는 쿠팡에서 제품을 찾아 로켓그로스로 판매하려는 셀러들을 위한 AI 기반 스마트 도구입니다. 쿠팡 상품 페이지에서 자동으로 제품 정보를 스크래핑하여 실시간으로 마진을 계산해줍니다.

### 타겟 사용자

- 쿠팡 로켓그로스 셀러
- 온라인 리셀러
- 이커머스 사업자

## 주요 기능

### ✨ 핵심 기능

- **자동 상품 정보 스크래핑**
  - 제품명, 판매가, 배송비, 카테고리 자동 추출
  - 판매자 정보 및 리뷰 데이터 수집

- **정확한 수수료 계산**
  - 50+ 카테고리별 판매 수수료율 (4% ~ 10.8%)
  - 부가세 자동 계산 (수수료의 10%)
  - 로켓그로스 물류비 계산 (6단계 크기 체계)

- **실시간 마진 분석**
  - 예상 순이익 계산
  - 마진율 퍼센티지
  - 최대 사입가 추천 (마진 0% 기준)

- **직관적인 UI/UX**
  - 사이드바 방식으로 쿠팡 페이지와 함께 사용
  - 실시간 계산 결과 업데이트
  - 색상 코딩으로 수익성 시각화

### 🎯 세부 기능

#### 1. 상품 크기 선택 (6단계)
- 극소형: 3,850원 (입출고 1,650원 + 배송 2,200원)
- 소형: 4,150원
- 중형: 5,000원
- 대형1: 6,400원
- 대형2: 7,900원
- 특대형: 11,900원

#### 2. 가격 및 비용 입력
- **판매가**: 자동 스크래핑 + 수동 수정 가능
- **원가**: 사입가 입력
- **기타 비용**: 추가 비용 입력

#### 3. 수수료 상세 분석
```
📊 로켓그로스 수수료
├─ 판매 수수료 (카테고리별)
├─ 부가세 (10%)
├─ 입출고 요금 (크기별)
├─ 배송 요금 (크기별)
└─ 총 수수료
```

#### 4. 마진 계산 결과
- 총 비용
- 예상 순이익
- 마진율 (%)
- 최대 사입가

#### 5. 스마트 알림
- ⚠️ 쿠팡 직매입 상품 경고
- 🔄 로딩 상태 표시
- ❌ 에러 처리 및 재시도

## 설치 방법

### 개발 모드 (권장)

1. **저장소 클론**
```bash
git clone <repository-url>
cd marginscan
```

2. **의존성 설치**
```bash
npm install
```

3. **개발 서버 실행**
```bash
npm run dev
```

4. **크롬에 확장 프로그램 로드**
   - Chrome 브라우저에서 `chrome://extensions/` 접속
   - 우측 상단 "개발자 모드" 활성화
   - "압축해제된 확장 프로그램 로드" 클릭
   - `.output/chrome-mv3-dev` 폴더 선택

### 프로덕션 빌드

```bash
npm run build
npm run zip
```

생성된 `.output/*.zip` 파일을 Chrome Web Store에 업로드할 수 있습니다.

## 사용 방법

### 기본 사용법

1. **쿠팡 상품 페이지 방문**
   ```
   예: https://www.coupang.com/vp/products/[product-id]
   ```

2. **확장 프로그램 아이콘 클릭**
   - 브라우저 우측 상단의 MarginScan 아이콘 클릭
   - 사이드바가 자동으로 열림

3. **자동 스크래핑 확인**
   - 상품 정보가 자동으로 채워짐
   - 카테고리 및 수수료율 자동 감지

4. **정보 입력**
   - 상품 크기 선택 (6단계 중 선택)
   - 원가(사입가) 입력
   - 기타 비용 입력 (선택사항)

5. **결과 확인**
   - 실시간으로 마진 계산 결과 확인
   - 수익성에 따라 색상 코딩 확인

### 고급 사용법

#### 판매가 수정
쿠팡 가격과 다른 가격으로 판매하려면:
1. "판매가" 필드에서 원하는 가격 입력
2. 자동으로 재계산됨

#### 새로고침
상품 정보가 업데이트되지 않으면:
1. 우측 상단 🔄 새로고침 버튼 클릭
2. 페이지 정보 재스크래핑

## 기술 스택

### 프레임워크 & 라이브러리
- **WXT** (0.20.6) - Web Extension Tools
- **React** (19.1.1) - UI 라이브러리
- **TypeScript** (5.9.2) - 타입 안정성
- **Vite** - 빌드 도구

### 아키텍처
```
marginscan/
├── entrypoints/
│   ├── background.ts         # Background service worker
│   ├── content.ts            # Content script (스크래핑)
│   └── sidebar/
│       ├── main.tsx          # React 앱
│       ├── types.ts          # TypeScript 타입
│       └── feeCalculator.ts  # 수수료 계산 로직
├── public/
│   └── icon/                 # 확장 프로그램 아이콘
├── wxt.config.ts             # WXT 설정
└── package.json
```

### 주요 기능별 파일

| 기능 | 파일 | 설명 |
|------|------|------|
| 스크래핑 | `entrypoints/content.ts` | DOM에서 상품 정보 추출 |
| 수수료 계산 | `entrypoints/sidebar/feeCalculator.ts` | 카테고리별 수수료 및 물류비 계산 |
| UI | `entrypoints/sidebar/main.tsx` | React 컴포넌트 |
| 메시징 | `entrypoints/background.ts` | 확장 프로그램 이벤트 처리 |

## 개발

### 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (핫 리로드)
npm run dev

# TypeScript 타입 체크
npm run compile
```

### 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (Chrome) |
| `npm run dev:firefox` | 개발 서버 실행 (Firefox) |
| `npm run build` | 프로덕션 빌드 (Chrome) |
| `npm run build:firefox` | 프로덕션 빌드 (Firefox) |
| `npm run zip` | Chrome Web Store용 패키징 |
| `npm run compile` | TypeScript 타입 체크 |

### 코드 구조

#### 스크래핑 로직
```typescript
// content.ts
const scrapeProductData = (): CommonProductData => {
  // 1. DOM에서 정보 추출
  const title = parseText('.prod-buy-header__title');
  const price = parseNumber(parseText('.total-price'));

  // 2. JSON-LD 구조화 데이터 파싱
  const jsonLd = parseJsonLd();

  // 3. 카테고리 breadcrumb 추출
  const category = parseCategoryPath();

  return { title, price, category, ... };
};
```

#### 수수료 계산
```typescript
// feeCalculator.ts
export function calculateRocketGrossFees(params: FeeCalculationParams) {
  // 1. 판매 수수료 = 판매가 × 카테고리 수수료율
  const salesCommission = salePrice * categoryFeeRate;

  // 2. 부가세 = 판매 수수료 × 10%
  const vat = salesCommission * 0.1;

  // 3. 물류비 = 크기별 고정 요금
  const logisticsFee = ROCKET_GROWTH_LOGISTICS_FEES[productSize].total;

  // 4. 순이익 계산
  const netProfit = salePrice - totalCost;

  return { netProfit, marginRate, ... };
}
```

### 카테고리 수수료율 테이블

주요 카테고리 수수료율:

```typescript
const CATEGORY_FEE_RATES = {
  '가전': 0.078,      // 7.8%
  '컴퓨터': 0.05,     // 5%
  '모니터': 0.045,    // 4.5%
  '패션': 0.105,      // 10.5%
  '가구': 0.108,      // 10.8%
  '식품': 0.106,      // 10.6%
  '주얼리': 0.04,     // 4%
  // ... 50+ 카테고리
};
```

## 빌드

### 프로덕션 빌드

```bash
npm run build
```

빌드 결과:
```
.output/chrome-mv3/
├── manifest.json
├── background.js
├── content-scripts/
│   └── content.js
├── chunks/
│   └── sidebar-*.js
└── icon/
    ├── 16.png
    ├── 32.png
    ├── 48.png
    ├── 96.png
    └── 128.png
```

### 배포 패키징

```bash
npm run zip
```

`.output/marginscan-1.0.0-chrome.zip` 파일 생성

## 문제 해결

### 자주 발생하는 문제

**Q: 상품 정보가 스크래핑되지 않아요**
- A: 쿠팡 상품 페이지인지 확인하세요 (`*.coupang.com/vp/products/*`)
- A: 새로고침 버튼(🔄)을 클릭해보세요
- A: 페이지가 완전히 로드된 후 확장 프로그램을 실행하세요

**Q: 수수료 계산이 정확하지 않아요**
- A: 상품 크기를 정확히 선택했는지 확인하세요
- A: 카테고리가 올바르게 감지되었는지 확인하세요

**Q: 사이드바가 열리지 않아요**
- A: 브라우저 확장 프로그램 아이콘을 클릭하세요
- A: 쿠팡 페이지가 아닌 다른 페이지에서는 동작하지 않습니다

## 로드맵

### 향후 계획

- [ ] 계산 결과 히스토리 저장
- [ ] 여러 상품 비교 기능
- [ ] 엑셀 내보내기
- [ ] 다크 모드
- [ ] 네이버 스마트스토어 지원
- [ ] 쿠팡 WOW 회원가 고려

## 기여하기

기여는 언제나 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 면책 조항

이 도구는 비공식 도구이며 쿠팡과 관련이 없습니다. 수수료율과 물류비는 변경될 수 있으므로 반드시 [쿠팡 셀러센터](https://wing.coupang.com)에서 최신 정보를 확인하세요.

## 참고 자료

- [쿠팡 로켓그로스 공식 페이지](https://sell.coupang.com/ko-kr)
- [2025 로켓그로스 수수료 개편](https://www.percenty.co.kr/blog/rocket-growth-fee-revision-key-details-sellers-need-to-know)
- [WXT 문서](https://wxt.dev)

---

**Made with ❤️ for Coupang Rocket Growth Sellers**

---

## English

AI-powered real-time margin calculator Chrome extension for Coupang Rocket Growth sellers

## 📋 Table of Contents

- [About](#about)
- [Key Features](#key-features)
- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Development](#development)
- [Build](#build)
- [License](#license)

## About

**Sellgent AI** is an AI-powered smart tool for sellers who want to find products on Coupang and sell them through Rocket Growth. It automatically scrapes product information from Coupang product pages and calculates margins in real-time.

### Target Users

- Coupang Rocket Growth sellers
- Online resellers
- E-commerce businesses

## Key Features

### ✨ Core Features

- **Automatic Product Information Scraping**
  - Auto-extract product name, price, shipping fee, category
  - Collect seller information and review data

- **Accurate Fee Calculation**
  - 50+ category-specific sales commission rates (4% ~ 11.88%)
  - Automatic VAT calculation (10% of commission)
  - Rocket Growth logistics fee calculation (11 price tiers × 6 size tiers)

- **Target Margin Rate Analysis**
  - Set target margin rate (0~50%)
  - Recommended maximum purchase price to achieve target margin
  - Real-time profitability analysis

- **Real-time Margin Analysis**
  - Estimated net profit calculation
  - Margin rate percentage
  - Maximum purchase price recommendation (0% margin basis)

- **Intuitive UI/UX**
  - Sidebar mode for use alongside Coupang pages
  - Real-time calculation result updates
  - Color coding for profitability visualization

### 🎯 Detailed Features

#### 1. Product Size Selection (6 tiers)
Logistics fees vary by price and size:
- Extra Small
- Small
- Medium
- Large 1
- Large 2
- Extra Large

#### 2. Price and Cost Input
- **Sale Price**: Auto-scraped + manual adjustment
- **Cost**: Purchase price input
- **Extra Cost**: Additional cost input

#### 3. Fee Details
```
📊 Rocket Growth Fees
├─ Sales Commission (by category)
├─ VAT (10%)
├─ Inbound Fee (by size)
├─ Shipping Fee (by size)
└─ Total Fee
```

#### 4. Margin Calculation Results
- Total cost
- Estimated net profit
- Margin rate (%)
- Maximum purchase price

#### 5. Smart Alerts
- ⚠️ Coupang direct purchase product warning
- 🔄 Loading status indicator
- ❌ Error handling and retry

## Installation

### Development Mode (Recommended)

1. **Clone Repository**
```bash
git clone <repository-url>
cd marginscan
```

2. **Install Dependencies**
```bash
npm install
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Load Extension in Chrome**
   - Open `chrome://extensions/` in Chrome browser
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select `.output/chrome-mv3-dev` folder

### Production Build

```bash
npm run build
npm run zip
```

Upload the generated `.output/*.zip` file to Chrome Web Store.

## Usage

### Basic Usage

1. **Visit Coupang Product Page**
   ```
   Example: https://www.coupang.com/vp/products/[product-id]
   ```

2. **Click Extension Icon**
   - Click MarginScan icon in the top right of browser
   - Sidebar opens automatically

3. **Verify Auto-scraping**
   - Product information is automatically filled
   - Category and commission rate auto-detected

4. **Enter Information**
   - Select product size (choose from 6 tiers)
   - Enter cost (purchase price)
   - Enter extra cost (optional)

5. **Check Results**
   - Real-time margin calculation results
   - Color coding based on profitability

## Tech Stack

### Frameworks & Libraries
- **WXT** (0.20.6) - Web Extension Tools
- **React** (19.1.1) - UI library
- **TypeScript** (5.9.2) - Type safety
- **Vite** - Build tool

### Architecture
```
marginscan/
├── entrypoints/
│   ├── background.ts         # Background service worker
│   ├── content.ts            # Content script (scraping)
│   └── sidebar/
│       ├── main.tsx          # React app
│       ├── types.ts          # TypeScript types
│       └── feeCalculator.ts  # Fee calculation logic
├── public/
│   ├── icon/                 # Extension icons
│   └── _locales/             # Internationalization
├── wxt.config.ts             # WXT configuration
└── package.json
```

## Development

### Development Environment Setup

```bash
# Install dependencies
npm install

# Run development server (hot reload)
npm run dev

# TypeScript type check
npm run compile
```

### Scripts

| Command | Description |
|--------|------|
| `npm run dev` | Run development server (Chrome) |
| `npm run dev:firefox` | Run development server (Firefox) |
| `npm run build` | Production build (Chrome) |
| `npm run build:firefox` | Production build (Firefox) |
| `npm run zip` | Package for Chrome Web Store |
| `npm run compile` | TypeScript type check |

## Build

### Production Build

```bash
npm run build
```

Build output:
```
.output/chrome-mv3/
├── manifest.json
├── background.js
├── content-scripts/
│   └── content.js
├── chunks/
│   └── sidebar-*.js
└── icon/
    ├── 16.png
    ├── 32.png
    ├── 48.png
    ├── 96.png
    └── 128.png
```

### Deployment Package

```bash
npm run zip
```

Creates `.output/marginscan-1.0.0-chrome.zip` file

## Roadmap

### Future Plans

- [ ] Save calculation result history
- [ ] Multi-product comparison feature
- [ ] Excel export
- [ ] Dark mode
- [ ] Naver Smart Store support
- [ ] Coupang WOW member price consideration

## Contributing

Contributions are always welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is distributed under the MIT License.

## Disclaimer

This is an unofficial tool and is not affiliated with Coupang. Commission rates and logistics fees may change, so always check the latest information at [Coupang Seller Center](https://wing.coupang.com).

## Privacy Policy

Sellgent AI does not collect any personal information. All data is processed locally in your browser and is never transmitted to external servers. For more details, see [PRIVACY_POLICY.md](PRIVACY_POLICY.md).

## References

- [Coupang Rocket Growth Official Page](https://sell.coupang.com/ko-kr)
- [2025 Rocket Growth Fee Update](https://www.percenty.co.kr/blog/rocket-growth-fee-revision-key-details-sellers-need-to-know)
- [WXT Documentation](https://wxt.dev)

---

**Made with ❤️ for Coupang Rocket Growth Sellers**
