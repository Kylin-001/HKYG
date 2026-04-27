import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'
import compression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  const enableMock = env.VITE_ENABLE_MOCK === 'true'

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: true,
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // Mock 插件 - 根据环境变量启用
      viteMockServe({
        mockPath: 'src/mock',
        enable: enableMock,
        watchFiles: true,
        logger: true,
      }),

      compression({
        algorithm: 'brotliCompress',
        threshold: 10240,
        deleteOriginFile: false,
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@views': resolve(__dirname, 'src/views'),
        '@stores': resolve(__dirname, 'src/stores'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@api': resolve(__dirname, 'src/api'),
        '@assets': resolve(__dirname, 'src/assets'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@types': resolve(__dirname, 'src/types'),
        '@styles': resolve(__dirname, 'src/styles'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/variables.scss" as *;',
        },
      },
    },
    server: {
      port: 5180,
      open: true,
      cors: true,
      strictPort: false,
      host: '0.0.0.0',
      // 优化热更新
      hmr: {
        host: 'localhost',
        overlay: false,
      },
      // 优化文件监听，减少CPU占用
      watch: {
        usePolling: false,
        interval: 1000,
      },
      // 如果启用了 Mock，则禁用代理
      proxy: enableMock ? undefined : {
        // 外卖相关接口 - 优先匹配
        '/api/takeout': {
          target: 'http://localhost:9999',
          changeOrigin: true,
          // 保持 /api/takeout 路径不变，因为后端控制器使用 @RequestMapping("/api/takeout/merchant")
          rewrite: (path) => path,
        },
        // 校园服务API接口（端口8003）- 必须放在 /campus 之前
        '/api/campus': {
          target: 'http://localhost:8003',
          changeOrigin: true,
          rewrite: (path) => path,
        },
        // 校园服务相关接口 - 宿舍管理（端口8003）
        '/campus': {
          target: 'http://localhost:8003',
          changeOrigin: true,
          rewrite: (path) => `/api${path}`,
        },
        // 用户相关接口
        '/user': {
          target: 'http://localhost:9999',
          changeOrigin: true,
          rewrite: (path) => `/api${path}`,
        },
        // 订单相关接口
        '/order': {
          target: 'http://localhost:9999',
          changeOrigin: true,
          rewrite: (path) => `/api${path}`,
        },
        // 支付相关接口
        '/payment': {
          target: 'http://localhost:9999',
          changeOrigin: true,
          rewrite: (path) => `/api${path}`,
        },
        // 商品相关接口
        '/products': {
          target: 'http://localhost:9999',
          changeOrigin: true,
          rewrite: (path) => `/api${path}`,
        },
        // 商品分页接口 (/product/page)
        '/product': {
          target: 'http://localhost:9999',
          changeOrigin: true,
          rewrite: (path) => `/api${path}`,
        },
        // 其他 API 接口
        '/api': {
          target: 'http://localhost:9999',
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },

    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.warn'],
        },
      },
      // 抑制 rolldown 警告
      rolldownOptions: {
        checks: {
          eval: false, // 禁用 eval 警告
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // 将 node_modules 中的依赖分包
            if (id.includes('node_modules')) {
              if (id.includes('element-plus')) {
                return 'element-plus'
              }
              if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
                return 'vue-vendor'
              }
              if (id.includes('@element-plus/icons-vue')) {
                return 'icons'
              }
              if (id.includes('axios')) {
                return 'axios'
              }
              if (id.includes('mockjs')) {
                return 'mock'
              }
              // 其他第三方库
              return 'vendor'
            }
            // 按路由分包
            if (id.includes('/views/campus/')) {
              return 'campus'
            }
            if (id.includes('/views/products/')) {
              return 'products'
            }
            if (id.includes('/views/takeout/')) {
              return 'takeout'
            }
            if (id.includes('/views/user/')) {
              return 'user'
            }
          },
          // 优化资源文件名
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            // 处理没有 name 的情况（如 CSS 文件）
            if (!assetInfo.name) {
              return 'assets/[name]-[hash][extname]'
            }
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
              return 'img/[name]-[hash][extname]'
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return 'fonts/[name]-[hash][extname]'
            }
            if (ext === 'css') {
              return 'css/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },
        },
      },
      chunkSizeWarningLimit: 500,
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      // 启用资源内联（小于 4KB 的资源内联为 base64）
      assetsInlineLimit: 4096,
    },

    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'element-plus',
        '@element-plus/icons-vue',
        'axios',
        'dayjs',
        'lodash-es',
      ],
      exclude: ['@/mock'],
      // 强制预构建，避免开发时卡顿
      force: true,
    },

    esbuild: {
      drop: ['debugger'],
      pure: ['console.log', 'console.info'],
    },
  }
})
