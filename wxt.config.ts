import { defineConfig } from 'wxt';
import { existsSync } from 'node:fs';
import path from 'node:path';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    // 스토어 목록·검색에 쓰이는 이름과 요약은 public/_locales/{ko,en}/messages.json 에서 언어별로 관리한다
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    version: '1.2.1',
    default_locale: 'ko',
    permissions: ['activeTab'],
    host_permissions: ['*://*.coupang.com/*'],
    web_accessible_resources: [
      {
        resources: ['sidebar.html', 'chunks/*'],
        matches: ['*://*.coupang.com/*'],
      },
    ],
    action: {
      default_title: '__MSG_actionTitle__',
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
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './'),
        },
      },
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
