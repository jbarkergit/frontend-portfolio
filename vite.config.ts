/// <reference types="vitest/config" />

import path from 'node:path';
import { reactRouter } from '@react-router/dev/vite';
import browserslist from 'browserslist';
import { browserslistToTargets } from 'lightningcss';
import type { UserConfig } from 'vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: '.',
  // https://www.npmjs.com/package/vite-tsconfig-paths
  // https://www.npmjs.com/package/@react-router/dev
  plugins: [tsconfigPaths(), reactRouter()],
  publicDir: false,
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'app'),
    },
  },
  // https://lightningcss.dev/docs.html
  css: {
    transformer: 'lightningcss',
    // https://github.com/parcel-bundler/lightningcss/blob/master/node/index.d.ts
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%')),
    },
  },
  json: {
    stringify: true,
  },
  clearScreen: false,
  appType: 'spa',
  server: {
    host: '127.0.0.1',
    port: 5173,
    watch: { usePolling: true },
  },
  build: {
    cssMinify: 'lightningcss',
    minify: 'esbuild',
    copyPublicDir: false,
  },
  // https://vitest.dev/config/
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./setupTests.ts'],
    include: ['**/*.test.{ts,tsx}'],
  },
}) satisfies UserConfig;
