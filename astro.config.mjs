// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://brocco.site',
  integrations: [mdx()],
  vite: {
    server: {
      watch: {
        usePolling: true,
        interval: 300,
      },
    },
  },
});
