import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import compression from 'vite-plugin-compression'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
        dirs: ['src/components', 'src/layout/components'],
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      // 压缩插件配置
      compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240,
        deleteOriginFile: false,
      }),
      // 同时使用brotli压缩
      compression({
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240,
        deleteOriginFile: false,
      }),
      // 构建分析
      // visualizer({
      //   open: process.env.NODE_ENV === 'production',
      //   gzipSize: true,
      //   brotliSize: true,
      //   filename: '../build-stats-optimized.html',
      // }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
      extensions: ['.vue', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    server: {
      port: Number(env.VITE_PORT || 3000),
      host: '0.0.0.0',
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      chunkSizeWarningLimit: 800,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: process.env.NODE_ENV === 'production',
          // 额外的压缩选项
          passes: 2,
          keep_fnames: false,
          keep_classnames: false,
        },
        format: {
          comments: false,
          beautify: false,
        },
      },
      rollupOptions: {
        output: {
          // 静态资源分类打包
          chunkFileNames: 'js/[name]-[hash:8].js',
          entryFileNames: 'js/[name]-[hash:8].js',
          assetFileNames: assetInfo => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'css/[name]-[hash:8][extname]'
            }
            if (/(png|jpe?g|gif|svg|webp)$/i.test(assetInfo.name || '')) {
              return 'images/[name]-[hash:8][extname]'
            }
            if (/(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
              return 'fonts/[name]-[hash:8][extname]'
            }
            return '[name]-[hash:8][extname]'
          },
          // 更精细的代码分割
          manualChunks: id => {
            // 第三方库单独打包
            if (id.includes('node_modules')) {
              const packageName = id.toString().split('node_modules/')[1].split('/')[0]
              if (['vue', 'vue-router', 'pinia'].includes(packageName)) {
                return 'vendor'
              } else if (['element-plus', '@element-plus/icons-vue'].includes(packageName)) {
                return 'element-plus'
              } else if (['echarts'].includes(packageName)) {
                return 'echarts'
              } else if (['axios'].includes(packageName)) {
                return 'axios'
              } else if (['js-cookie'].includes(packageName)) {
                return 'js-cookie'
              } else if (['nprogress'].includes(packageName)) {
                return 'nprogress'
              }
              return 'others'
            }
            // 按功能模块分割
            if (id.includes('src/views/product')) {
              return 'product'
            } else if (id.includes('src/views/order')) {
              return 'order'
            } else if (id.includes('src/views/user')) {
              return 'user'
            } else if (id.includes('src/views/dashboard')) {
              return 'dashboard'
            } else if (id.includes('src/views/cart')) {
              return 'cart'
            }
          },
          // 长期缓存策略
        },
      },
      // 增加构建缓存
      cacheDir: resolve(__dirname, 'node_modules/.vite'),
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *; @use "@/styles/mixins.scss" as *;`,
          api: 'modern-compiler',
        },
      },
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
    },
    define: {
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    },
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        '@element-plus/icons-vue',
        'axios',
        'js-cookie',
        'nprogress',
      ],
      force: true,
      esbuildOptions: {
        target: 'es2020',
        define: {
          global: 'globalThis',
        },
        // 额外的esbuild选项
        minify: true,
        minifyIdentifiers: true,
        minifySyntax: true,
        minifyWhitespace: true,
      },
    },
    // 性能优化配置
    performance: {
      hints: false,
      maxEntrypointSize: 400000,
      maxAssetSize: 300000,
    },
  }
})
