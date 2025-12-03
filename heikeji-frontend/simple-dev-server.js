const express = require('express')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const baseConfig = require('./build/webpack.base.conf.js')
const utils = require('./build/utils')
const config = require('./config')

// 创建简化的webpack配置
const devConfig = {
  ...baseConfig,
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  performance: {
    hints: false,
  },
  module: {
    ...baseConfig.module,
    rules: [
      ...(baseConfig.module?.rules || []),
      // CSS加载器
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      // SCSS加载器
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    ...(baseConfig.plugins || []),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
}

// 添加热更新客户端
if (devConfig.entry && typeof devConfig.entry === 'object') {
  Object.keys(devConfig.entry).forEach(key => {
    if (!Array.isArray(devConfig.entry[key])) {
      devConfig.entry[key] = [devConfig.entry[key]]
    }
    devConfig.entry[key].unshift('webpack-hot-middleware/client?reload=true')
  })
}

const app = express()
const compiler = webpack(devConfig)

// 获取正确的publicPath
const publicPath = devConfig.output.publicPath || config.dev.assetsPublicPath

// 配置开发中间件（兼容webpack-dev-middleware 3.x）
app.use(
  webpackDevMiddleware(compiler, {
    publicPath,
    quiet: false,
    stats: {
      colors: true,
      chunks: false,
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: false,
    },
  })
)

// 配置热更新中间件（兼容webpack-hot-middleware 2.x）
app.use(webpackHotMiddleware(compiler))

// 静态文件服务
app.use(express.static(path.join(__dirname, 'static')))

// 所有请求都返回index.html以支持SPA路由
app.get('*', (req, res) => {
  const filename = path.join(compiler.outputPath, 'index.html')
  const fs = compiler.outputFileSystem
  fs.readFile(filename, (err, result) => {
    if (err) {
      return res.send('Error loading index.html')
    }
    res.set('content-type', 'text/html')
    res.send(result)
    res.end()
  })
})

const port = 8083
app.listen(port, () => {
  console.log(`简易开发服务器运行在 http://localhost:${port}`)
})
