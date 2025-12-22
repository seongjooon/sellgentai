import type { CommonProductData } from './sidebar/types';

export default defineContentScript({
  matches: ['*://*.coupang.com/*'],
  main() {
    const SIDEBAR_ID = 'marginscan-sidebar';
    const SIDEBAR_WIDTH = 360;
    const sidebarUrl = chrome.runtime.getURL('sidebar.html');
    const sidebarOrigin = new URL(sidebarUrl).origin;
    const initialHtmlPaddingRight = getComputedStyle(document.documentElement).paddingRight;
    // const initialBodyPaddingRight = getComputedStyle(document.body).paddingRight;

    const getSidebar = () => document.getElementById(SIDEBAR_ID) as HTMLIFrameElement | null;

    const applyPageOffset = (visible: boolean) => {
      const adjust = (el: HTMLElement | null, basePadding: string) => {
        if (!el) return;
        const base = parseFloat(basePadding) || 0;
        el.style.paddingRight = visible ? `${base + SIDEBAR_WIDTH}px` : basePadding;
      };
      adjust(document.documentElement, initialHtmlPaddingRight);
      // adjust(document.body, initialBodyPaddingRight);
    };

    const mountSidebar = () => {
      const existing = getSidebar();
      if (existing) return existing;

      const iframe = document.createElement('iframe');
      iframe.id = SIDEBAR_ID;
      iframe.src = sidebarUrl;
      Object.assign(iframe.style, {
        position: 'fixed',
        top: '0',
        right: '0',
        width: '360px',
        height: '100vh',
        border: 'none',
        zIndex: '2147483647',
        boxShadow: '0 0 12px rgba(0, 0, 0, 0.15)',
        background: '#fff',
        display: 'none',
      });

      document.body.appendChild(iframe);
      return iframe;
    };

    const toggleSidebar = () => {
      const iframe = getSidebar() ?? mountSidebar();
      if (!iframe) return;
      const willShow = iframe.style.display === 'none';
      iframe.style.display = willShow ? 'block' : 'none';
      applyPageOffset(willShow);
    };

    const parseText = (selector: string): string | null => {
      const el = document.querySelector<HTMLElement>(selector);
      return el?.textContent?.trim() || null;
    };

    const parseNumber = (value: string | null): number | null => {
      if (!value) return null;
      const numeric = value.replace(/[^\d.]/g, '');
      if (!numeric) return null;
      const parsed = Number(numeric);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const parseMetaContent = (property: string): string | null => {
      const meta = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
      return meta?.content?.trim() || null;
    };

    const parseJsonLd = (): any[] => {
      const scripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'));
      const parsed: any[] = [];
      for (const script of scripts) {
        if (!script.textContent) continue;
        try {
          const json = JSON.parse(script.textContent);
          if (Array.isArray(json)) {
            parsed.push(...json);
          } else {
            parsed.push(json);
          }
        } catch {
          // ignore invalid JSON
        }
      }
      return parsed;
    };

    const parseSellerName = (): string | null => {
      // 우선 상세 판매자 테이블(product-seller)에서 추출 시도
      const table = document.querySelector<HTMLTableElement>('.product-seller table');
      if (table) {
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        for (const row of rows) {
          const thText = row.querySelector('th')?.textContent?.trim() ?? '';
          if (thText.includes('상호') || thText.includes('대표자') || thText.includes('판매자')) {
            const tdText = row.querySelector('td')?.textContent?.trim() ?? '';
            if (tdText) return tdText;
          }
        }
      }
      // 폴백: 기존 셀렉터
      return parseText('.prod-seller-name a') || parseText('.prod-seller-name');
    };

    const buildProductFromDom = (): CommonProductData => {
      const title =
        parseText('h2.prod-buy-header__title') ||
        parseText('h1.prod-buy-header__title') ||
        parseMetaContent('og:title');

      const priceString =
        parseText('.final-price-amount') ||
        parseMetaContent('og:price:amount') ||
        parseText('.total-price strong') ||
        parseText('.prod-price .total-price .value');
      const salePrice = parseNumber(priceString);

      const shippingText =
        parseText('.prod-shipping-fee .delivery-fee') ||
        parseText('.prod-shipping-fee .price') ||
        parseText('.delivery-price strong') ||
        parseText('.delivery__price');
      const shippingFee = parseNumber(shippingText);

      let isFreeShipping: boolean | null = null;
      if (shippingText || shippingFee !== null) {
        const freeText = shippingText ? /무료/.test(shippingText) : false;
        const zeroFee = shippingFee === 0;
        isFreeShipping = freeText || zeroFee ? true : false;
      }

      const sellerName = parseSellerName();

      const selectedOptions = Array.from(
        document.querySelectorAll<HTMLElement>(
          '.prod-option__item.selected, .prod-option__item--selected, .prod-option__selected, .prod-buy__option-box .selected, .prod-selected-option .prod-option__item',
        ),
      )
        .map((el) => el.textContent?.trim())
        .filter((text): text is string => Boolean(text));

      return {
        productId: null,
        itemId: null,
        vendorItemId: null,
        url: window.location.href || null,
        title,
        thumbnail: '',
        salePrice,
        shippingFee,
        isFreeShipping,
        isRocket: null,
        sellerName,
        rating: (() => {
          const jsonLd = parseJsonLd();
          const productNode = jsonLd.find((node) => node?.['@type'] === 'Product' || node?.['@type']?.includes?.('Product'));
          const fromJson = productNode?.aggregateRating?.ratingValue
            ? parseNumber(String(productNode.aggregateRating.ratingValue))
            : null;
          return fromJson ?? parseNumber(parseText('.js-review-score')) ?? parseNumber(parseText('.rating-star-num'));
        })(),
        reviewCount: (() => {
          const jsonLd = parseJsonLd();
          const productNode = jsonLd.find((node) => node?.['@type'] === 'Product' || node?.['@type']?.includes?.('Product'));
          const fromJson = productNode?.aggregateRating?.reviewCount
            ? parseNumber(String(productNode.aggregateRating.reviewCount))
            : null;
          return fromJson ?? parseNumber(parseText('.js-review-count')) ?? parseNumber(parseText('.count'));
        })(),
        categoryPath: (() => {
          const crumbs = Array.from(
            document.querySelectorAll<HTMLElement>('.prod-crumb a, .prod-breadcrumb a, .breadcrumb a'),
          )
            .map((el) => el.textContent?.trim())
            .filter((text): text is string => Boolean(text));
          if (crumbs.length) return crumbs;

          const jsonLd = parseJsonLd();
          const breadcrumbNode = jsonLd.find((node) => node?.['@type'] === 'BreadcrumbList');
          if (breadcrumbNode?.itemListElement && Array.isArray(breadcrumbNode.itemListElement)) {
            const names = breadcrumbNode.itemListElement
              .map((item: any) => item?.name || item?.item?.name)
              .filter((text: unknown): text is string => typeof text === 'string' && text.trim().length > 0)
              .map((text: string) => text.trim());
            if (names.length) return names;
          }

          return [];
        })(),
        selectedOptions,
      };
    };

    const respondWithDummyData = () => {
      const iframe = getSidebar();
      if (!iframe?.contentWindow) return;
      iframe.contentWindow.postMessage(
        { type: 'SCRAPE_RESULT', payload: buildProductFromDom() },
        sidebarOrigin,
      );
    };

    const handleSidebarMessage = (event: MessageEvent) => {
      if (event.origin !== sidebarOrigin) return;
      if (event.source !== getSidebar()?.contentWindow) return;
      if (typeof event.data !== 'object' || !event.data) return;
      const { type } = event.data as { type?: string };
      if (type === 'REQUEST_SCRAPE') {
        respondWithDummyData();
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountSidebar, { once: true });
    } else {
      mountSidebar();
    }

    chrome.runtime.onMessage.addListener((message) => {
      if (message?.type === 'toggle-sidebar') {
        toggleSidebar();
      }
    });

    window.addEventListener('message', handleSidebarMessage);
  },
});
