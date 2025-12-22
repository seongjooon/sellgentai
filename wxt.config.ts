import { defineConfig } from 'wxt';
import { existsSync } from 'node:fs';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    web_accessible_resources: [
      {
        resources: ['sidebar.html', 'chunks/*'],
        matches: ['*://*.coupang.com/*'],
      },
    ],
    action: {
      default_title: 'MarginScan Sidebar',
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
