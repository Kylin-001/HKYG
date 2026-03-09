import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,vue}', 'src-vue3/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,vue}', 'tests/api/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}'],
    exclude: ['**/node_modules/**', '**/e2e/**', '**/dist/**'],
    pool: 'forks',
    singleFork: true,
    reporters: ['default', 'json', 'html'],
    outputFile: {
      json: './test-results/test-results.json',
      html: './test-results/test-results.html',
    },
    environmentMatchGlobs: [
      ['tests/api/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts}', 'node'],
      ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,vue}', 'jsdom'],
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'cobertura'],
      include: ['src/**/*.{vue,js,ts}', 'src-vue3/**/*.{vue,js,ts}', 'tests/api/**/*.{js,ts}'],
      exclude: [
        'node_modules/**',
        '**/*.d.ts',
        'src/main.ts',
        'src/App.vue',
        'src/SimpleApp.vue',
        'src/stories/**',
        'src/views/**',
        'src/layout/**',
        'src/router/**',
        'src/store/**',
        'src-vue3/views/**',
        'src-vue3/components/**',
        '**/test/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.integration.test.ts',
      ],
      all: true,
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
      reportsDirectory: './coverage',
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
    watch: false,
    bail: 1,
    onFail: 'fail',
    setupFiles: ['./src/vitest-env.d.ts'],
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    isolate: false,
    allowOnly: false,
    testLocationInResults: true,
    maxConcurrency: 1,
    minThreads: 1,
    maxThreads: 1,
    benchmark: {
      include: ['**/*.benchmark.test.ts'],
      outputJson: './benchmark-results/benchmark-results.json',
      outputHtml: './benchmark-results/benchmark-results.html',
    },
  },
})
