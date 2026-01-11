import { defineConfig, resolve } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import federation from 'vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // 微前端模块联邦插件
    federation({
      name: 'shared-lib',
      // 暴露共享模块
      exposes: {
        './components': './src/components/index.ts',
        './utils': './src/utils/index.ts',
        './store': './src/store/index.ts'
      },
      // 配置共享依赖
      shared: {
        vue: {
          requiredVersion: '^3.5.1',
          singleton: true,
        },
        'vue-router': {
          requiredVersion: '^4.2.5',
          singleton: true,
        },
        pinia: {
          requiredVersion: '^2.1.7',
          singleton: true,
        },
        'element-plus': {
          requiredVersion: '^2.4.4',
          singleton: true,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.vue', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    port: 3005,
    host: '0.0.0.0',
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
