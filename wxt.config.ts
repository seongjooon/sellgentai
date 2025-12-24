import { defineConfig } from 'wxt';
import { existsSync } from 'node:fs';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Sellgent AI - 로켓그로스 마진 계산기',
    description: '쿠팡 로켓그로스 셀러를 위한 실시간 마진 계산 도구. 카테고리별 수수료와 물류비를 자동으로 계산하여 예상 수익을 분석합니다.',
    version: '1.0.0',
    default_locale: 'ko',
    permissions: ['storage', 'activeTab'],
    host_permissions: ['*://*.coupang.com/*'],
    web_accessible_resources: [
      {
        resources: ['sidebar.html', 'chunks/*'],
        matches: ['*://*.coupang.com/*'],
      },
    ],
    action: {
      default_title: '로켓그로스 마진 계산기',
    },
  },
  vite: () => {
    const hasCert = existsSync('./localhost.pem') && existsSync('./localhost-key.pem');
    const baseServer = {
      host: '127.0.0.1',
      port: 3000,
      strictPort: true,
    };
    return {
      server: hasCert
        ? {
            ...baseServer,
            https: {
              cert: './localhost.pem',
              key: './localhost-key.pem',
            },
          }
        : baseServer,
    };
  },
});
