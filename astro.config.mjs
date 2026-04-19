// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  site: 'https://your-site.ru',
  base: '/',
  trailingSlash: 'never',

  vite: {
    plugins: [tailwindcss()]
  },

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp', // самый быстрый и качественный обработчик
    },
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark',               // тёмная тема подсветки кода (под твою GNOME-тему)
      wrap: true,
    },
  },

  devToolbar: {
    enabled: true,                        // панель разработчика в dev-режиме
  },
});
