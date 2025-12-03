const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
      '/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/admin': '/admin',
        },
      },
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8081, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // 提高开发环境构建速度的设置
    devServer: {
      // 启用模块热替换
      hot: true,
      // 不显示打包信息日志
      noInfo: false,
      // 启用持久化缓存
      cache: {
        type: 'memory',
      },
      // 启用延迟编译，提高开发速度
      lazy: false,
      // 优化文件监听
      watchOptions: {
        ignored: /node_modules/, // 忽略node_modules目录
        aggregateTimeout: 300, // 防抖时间
        poll: false, // 使用文件系统事件而非轮询
      },
    },

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true,
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    // 是否使用CDN
    useCdn: false,

    // CDN配置
    cdn: {
      css: [
        // ElementUI CSS
        'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
        // NProgress CSS
        'https://unpkg.com/nprogress@0.2.0/nprogress.css',
      ],
      js: [
        // Vue
        'https://unpkg.com/vue@2.7.16/dist/vue.min.js',
        // Vue Router
        'https://unpkg.com/vue-router@3.6.5/dist/vue-router.min.js',
        // Vuex
        'https://unpkg.com/vuex@3.6.2/dist/vuex.min.js',
        // Axios
        'https://unpkg.com/axios@1.7.2/dist/axios.min.js',
        // ElementUI
        'https://unpkg.com/element-ui@2.15.14/lib/index.js',
        // ECharts
        'https://unpkg.com/echarts@5.5.1/dist/echarts.min.js',
        // js-cookie
        'https://unpkg.com/js-cookie@3.0.5/dist/js.cookie.min.js',
        // NProgress
        'https://unpkg.com/nprogress@0.2.0/nprogress.min.js',
      ],
    },

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip on for better static assets performance
    productionGzip: true,
    productionGzipExtensions: ['js', 'css', 'html'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,

    // 构建优化配置
    optimization: {
      // 启用并行构建
      parallel: true,
      // 启用持久化缓存
      cache: true,
      // 是否开启树摇
      treeShaking: true,
    },
  },
}
