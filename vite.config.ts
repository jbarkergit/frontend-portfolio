import path from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import type { ViteUserConfig } from 'vitest/config';
import { defineConfig } from 'vitest/config';

/** https://vite.dev/config/ */
export default defineConfig({
  root: './',
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'app'),
    },
  },
  plugins: [tsconfigPaths(), ...(process.env['VITEST'] ? [] : [reactRouter()])],
  server: {
    host: '127.0.0.1',
    watch: { usePolling: true },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    include: ['**/*.test.{ts,tsx}'],
  },
  build: {
    copyPublicDir: false,
    cssMinify: true,
    ssr: false,
  },
}) satisfies ViteUserConfig;
