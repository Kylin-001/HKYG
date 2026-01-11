import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

// 导出 Vitest 配置
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.vue', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['/home/heikeji/heikeji-mall/heikeji-frontend/tests/setup.ts'],
    transformMode: {
      web: [/[jt]sx?$/],
    },
    // 配置处理 CSS 文件
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    // 处理依赖的 CSS 文件
    deps: {
      inline: [/element-plus/],
    },
    // 排除e2e目录，避免Playwright测试被执行
    exclude: ['**/e2e/**', '**/node_modules/**'],
    // 测试覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{vue,js,ts}'],
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
      ],
      // 暂时关闭覆盖率阈值检查，后续测试覆盖扩大后再启用
    },
  },
  // 配置 CSS 处理
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss"; @import "@/styles/mixins.scss";',
      },
    },
  },
})
