import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VitePWA } from 'vite-plugin-pwa'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'
import federation from 'vite-plugin-federation'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
      vue(),
      vueJsx(),
      // 微前端模块联邦插件
      federation({
        name: 'main-app',
        // 目前主应用作为host，不暴露模块
        exposes: {},
        // 配置远程微应用
        remotes: {
          'product-microapp': 'http://localhost:3001/assets/remoteEntry.js',
          'order-microapp': 'http://localhost:3002/assets/remoteEntry.js',
          'user-microapp': 'http://localhost:3003/assets/remoteEntry.js',
          'stats-microapp': 'http://localhost:3004/assets/remoteEntry.js',
          'shared-lib': 'http://localhost:3005/assets/remoteEntry.js',
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
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
        },
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
        dirs: ['src/components', 'src/layout/components'],
        directoryAsNamespace: true,
      }),
      // SVG 图标插件
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      // Mock 服务插件
      viteMockServe({
        mockPath: './src/mock',
        localEnabled: env.VITE_USE_MOCK === 'true',
        prodEnabled: false,
        logger: false,
      }),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff2}'],
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
          // 缓存策略配置
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.+\.(png|jpg|jpeg|svg|gif)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 天
                },
              },
            },
            {
              urlPattern: /^https:\/\/api\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 10,
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24, // 1 天
                },
              },
            },
          ],
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: '黑科易购校园服务',
          short_name: '黑科易购',
          description: '黑龙江科技大学校园综合服务平台',
          theme_color: '#409EFF',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
      compression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240, // 大于 10kb 的文件才会压缩
        deleteOriginFile: false,
      }),
      // 构建分析插件
      visualizer({
        open: process.env.NODE_ENV === 'production',
        gzipSize: true,
        brotliSize: true,
        filename: '../build-stats.html',
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@/components': resolve(__dirname, 'src/components'),
        '@/views': resolve(__dirname, 'src/views'),
        '@/api': resolve(__dirname, 'src/api'),
        '@/utils': resolve(__dirname, 'src/utils'),
        '@/types': resolve(__dirname, 'src/types'),
        '@/assets': resolve(__dirname, 'src/assets'),
        '@/layout': resolve(__dirname, 'src/layout'),
        '@/store': resolve(__dirname, 'src/store'),
        '@/router': resolve(__dirname, 'src/router'),
      },
      extensions: ['.vue', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    server: {
      port: Number(env.VITE_PORT || 3000),
      host: '0.0.0.0',
      open: true,
      hmr: {
        overlay: true,
        clientPort: 3000,
      },
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
      // 优化开发服务器性能
      fs: {
        strict: true,
        // 允许从项目根目录外的文件提供服务
        allow: ['..'],
      },
    },
    build: {
      target: 'es2020',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: process.env.NODE_ENV === 'production',
        },
        format: {
          comments: false,
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
            if (/\.(png|jpe?g|gif|svg|webp)$/i.test(assetInfo.name || '')) {
              return 'images/[name]-[hash:8][extname]'
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
              return 'fonts/[name]-[hash:8][extname]'
            }
            return '[name]-[hash:8][extname]'
          },
          // 更精细的代码分割和缓存优化
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
          },
        },
      },
      // 增加构建缓存
      cacheDir: resolve(__dirname, 'node_modules/.vite'),
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/variables.scss"; @import "@/styles/mixins.scss";',
        },
      },
      // 启用CSS模块
      modules: {
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
      // 配置 PostCSS
      postcss: {
        plugins: [require('autoprefixer')],
      },
    },
    define: {
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
      // 环境变量注入
      'import.meta.env.VITE_APP_VERSION': JSON.stringify('1.0.0'),
      'import.meta.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString()),
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
      // 强制预构建
      force: true,
      esbuildOptions: {
        target: 'es2020',
        define: {
          global: 'globalThis',
        },
      },
    },
    // 性能优化配置
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
  }
})
