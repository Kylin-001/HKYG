import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import compression from 'vite-plugin-compression'
import path from 'path'

const prod = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~': path.resolve(__dirname, 'node_modules'),
    },
    extensions: ['.vue', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'element-plus', 'axios', 'echarts', 'dayjs'],
    exclude: ['demo.html', 'index.html', 'local-demo.html'],
  },
  esbuild: {
    legalComments: 'none',
    drop: prod ? ['console', 'debugger'] : [],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`,
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      input: './index.html',
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: assetInfo => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|gif|svg|webp)$/i.test(assetInfo.name)) {
            return 'img/[name].[hash][extname]'
          }
          if (/\.css$/.test(ext)) {
            return 'css/[name].[hash][extname]'
          }
          return '[ext]/[name].[hash][extname]'
        },
        manualChunks: id => {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
              return 'vue'
            }
            if (id.includes('element-plus')) {
              return 'element'
            }
            if (id.includes('echarts')) {
              return 'echarts'
            }
            if (id.includes('@element-plus/icons-vue')) {
              return 'icons'
            }
            return 'vendor'
          }
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  preview: {
    port: 4173,
    open: false,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
