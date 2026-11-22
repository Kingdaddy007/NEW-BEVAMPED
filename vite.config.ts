import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync } from 'node:fs';

export default defineConfig({
  plugins: [{
    name: 'studio-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        for (const part of ['footer', 'instrument']) {
          const slot = `<!-- studio-${part} -->`;
          if (html.includes(slot)) html = html.replace(slot, readFileSync(resolve(__dirname, 'src/showroom', part + '.html'), 'utf8'));
        }
        return html;
      },
    },
  }],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        commission: resolve(__dirname, 'commission/index.html'),
        bespoke: resolve(__dirname, 'work/studio-bespoke/index.html'),
        laterite: resolve(__dirname, 'work/laterite/index.html'),
        xbd: resolve(__dirname, 'work/xbd-collective/index.html'),
        flagship: resolve(__dirname, 'flagship/index.html'),
        flagshipWork: resolve(__dirname, 'flagship/work.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        legal: resolve(__dirname, 'legal.html'),
        moreThanAGallery: resolve(__dirname, 'more-than-a-gallery/index.html'),
      },
    },
  },
});

