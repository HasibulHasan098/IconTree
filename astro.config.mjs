import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platform: { type: 'pages' },
    compatibilityDate: '2024-11-01',
    compatibilityFlags: ['nodejs_compat'],
  }),
  server: { port: 4321 },
  trailingSlash: 'ignore',
});
