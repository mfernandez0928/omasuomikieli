import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: './',
  test: {
    /*
      `.backups/` holds file-level snapshots of `src/`, and `src/` now contains
      test files. Without this, every snapshot's copy of every test runs again
      against an old copy of the code: the run passes, the count quietly
      doubles with each snapshot taken, and a snapshot from before a fix keeps
      asserting the old behaviour. The same goes for a git worktree parked
      inside the project.
    */
    exclude: [...configDefaults.exclude, '.backups/**', '.claude/**'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png'],
      workbox: {
        // All learning content is bundled into the JS, so precaching the app
        // shell genuinely makes the whole app work offline.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Oma Suomi - Learn Finnish. Every Day.',
        short_name: 'Oma Suomi',
        description:
          'A personal Finnish learning app: trilingual Finnish-English-Tagalog dictionary, grammar lessons, phrases and spaced-repetition practice.',
        lang: 'fi',
        dir: 'ltr',
        theme_color: '#0b1220',
        background_color: '#0b1220',
        display: 'standalone',
        orientation: 'portrait',
        scope: './',
        start_url: './',
        categories: ['education', 'books'],
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
});
