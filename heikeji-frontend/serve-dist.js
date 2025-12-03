// 生产级服务器脚本，用于提供Vue构建后的静态文件，具备错误处理和性能监控
// 功能：1. 提供静态文件服务 2. 支持SPA路由回退 3. 增强型DOMContentLoaded实现
//      4. 生产环境错误处理 5. 性能监控 6. 日志级别控制

const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

// 环境配置
const isProduction = process.env.NODE_ENV === 'production'
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
}
const currentLogLevel = isProduction ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG

// 性能监控统计
const performanceStats = {
  requestCount: 0,
  errorCount: 0,
  totalResponseTime: 0,
  slowRequests: [],
  slowRequestThreshold: 500, // 毫秒
  lastStatsReset: Date.now(),
}

// 错误统计
const errorStats = {
  types: {},
  urls: {},
  total: 0,
}

// 日志函数，根据日志级别控制输出
function log(level, message) {
  if (level <= currentLogLevel) {
    const levelName = Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level)
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] [${levelName}] ${message}`)
  }
}

// 错误处理函数
function handleError(error, request, response, url) {
  // 记录错误统计
  const errorType = error.name || 'UnknownError'
  const errorUrl = url || request.url

  if (!errorStats.types[errorType]) {
    errorStats.types[errorType] = 0
  }
  if (!errorStats.urls[errorUrl]) {
    errorStats.urls[errorUrl] = 0
  }

  errorStats.types[errorType]++
  errorStats.urls[errorUrl]++
  errorStats.total++

  // 日志记录
  log(LOG_LEVELS.ERROR, `Request error [${errorUrl}]: ${error.message}`)

  // 在开发环境下记录详细堆栈
  if (!isProduction && error.stack) {
    log(LOG_LEVELS.DEBUG, `Error stack: ${error.stack}`)
  }

  // 向客户端返回适当的错误响应
  if (!response.headersSent) {
    try {
      // 对于SPA路由，即使出错也返回index.html以保持客户端路由功能
      if (isSpaRoute(errorUrl)) {
        serveEnhancedIndex(response, errorUrl)
      } else {
        // 对于静态资源错误，返回404
        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
        response.end('404 Not Found')
      }
    } catch (e) {
      // 如果连错误响应都失败了，尝试发送一个非常基本的响应
      try {
        response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
        response.end('Internal Server Error')
      } catch (finalError) {
        // 最后的手段，记录但不尝试更多操作
        console.error('Failed to send error response:', finalError)
      }
    }
  }
}

// 重置统计信息
function resetStats() {
  performanceStats.requestCount = 0
  performanceStats.errorCount = 0
  performanceStats.totalResponseTime = 0
  performanceStats.slowRequests = []
  performanceStats.lastStatsReset = Date.now()

  errorStats.types = {}
  errorStats.urls = {}
  errorStats.total = 0

  log(LOG_LEVELS.INFO, 'Performance and error statistics reset')
}

// 打印统计信息
function printStats() {
  const uptime = Math.floor((Date.now() - performanceStats.lastStatsReset) / 1000)
  const avgResponseTime =
    performanceStats.requestCount > 0
      ? (performanceStats.totalResponseTime / performanceStats.requestCount).toFixed(2)
      : 0

  log(LOG_LEVELS.INFO, '====== PERFORMANCE STATS ======')
  log(LOG_LEVELS.INFO, `Uptime: ${uptime}s`)
  log(LOG_LEVELS.INFO, `Total requests: ${performanceStats.requestCount}`)
  log(LOG_LEVELS.INFO, `Total errors: ${errorStats.total}`)
  log(LOG_LEVELS.INFO, `Average response time: ${avgResponseTime}ms`)
  log(
    LOG_LEVELS.INFO,
    `Slow requests (${performanceStats.slowRequestThreshold}ms+): ${performanceStats.slowRequests.length}`

  if (errorStats.total > 0) {
    log(LOG_LEVELS.WARN, 'Error types:')
    Object.entries(errorStats.types)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) // 只显示前5种最常见的错误
      .forEach(([type, count]) => log(LOG_LEVELS.WARN, `  - ${type}: ${count}`))

    log(LOG_LEVELS.WARN, 'Problematic URLs:')
    Object.entries(errorStats.urls)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) // 只显示前5个最常见的错误URL
      .forEach(([url, count]) => log(LOG_LEVELS.WARN, `  - ${url}: ${count}`))
  }
  log(LOG_LEVELS.INFO, '==============================')
}

// 服务器配置
const port = 8080
const distDir = path.join(__dirname, 'dist')
const requestTimeout = 10000 // 10秒请求超时
const MAX_RETRY_ATTEMPTS = 3 // 最大重试次数
const RETRY_INTERVAL_MS = 200 // 重试间隔

// 性能监控常量
const SLOW_REQUEST_THRESHOLD = 500 // 毫秒
const STATS_PRINT_INTERVAL = 60000 // 1分钟打印一次统计信息

// MIME types mapping
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'font/eot',
}

/**
 * 检查是否为SPA路由（非静态资源）
 */
function isSpaRoute(requestUrl) {
  // 检查URL是否指向静态资源文件
  const staticExtensions = [
    '.js',
    '.css',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.ico',
    '.svg',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot',
  ]
  const urlPath = url.parse(requestUrl).pathname

  // 排除以静态文件扩展名结尾的URL
  for (const ext of staticExtensions) {
    if (urlPath.toLowerCase().endsWith(ext)) {
      return false
    }
  }

  // 排除API路径
  if (urlPath.startsWith('/api/')) {
    return false
  }

  return true
}

/**
 * 提供增强型index.html
 */
function serveEnhancedIndex(response, requestUrl) {
  const indexPath = path.join(distDir, 'index.html')
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      log(LOG_LEVELS.ERROR, `Failed to read index.html: ${err.message}`)
      try {
        response.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' })
        response.end('<h1>服务器错误</h1><p>无法读取首页文件</p>')
      } catch (e) {
        log(LOG_LEVELS.ERROR, `Failed to send error response: ${e.message}`)
      }
      return
    }

    // 清理HTML中的一些开发相关引用，但保留基本结构
    let cleanedHtml = data

    // 只移除特定的静态资源引用，不影响其他内容
    cleanedHtml = cleanedHtml.replace(/<link[^>]*\/static\/css\/[^>]*>/g, '')
    cleanedHtml = cleanedHtml.replace(/<script[^>]*\/static\/js\/[^>]*><\/script>/g, '')
    cleanedHtml = cleanedHtml.replace(/<script[^>]*@vite\/client[^>]*><\/script>/g, '')

    // 使用增强型HTML处理函数，注入健壮的DOM加载逻辑
    cleanedHtml = processHtmlForEnhancedLoading(cleanedHtml, requestUrl)

    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    response.end(cleanedHtml)
    log(LOG_LEVELS.INFO, `Served enhanced index.html for: ${requestUrl}`)
  })
}

/**
 * 增强型DOMContentLoaded脚本生成函数
 * 生成在DOM完全加载后安全加载Vue应用的脚本
 */
function generateEnhancedLoadScript() {
  return `<script>
  // 增强型Vue应用加载逻辑
  (function() {
    console.log('🔄 开始增强型Vue应用加载流程');
    
    // Retry mechanism configuration
      const maxRetries = ${MAX_RETRY_ATTEMPTS};
      const retryInterval = ${RETRY_INTERVAL_MS};
      let retryCount = 0;
      
      // Function to check if #app element exists
      function checkAppElement() {
        const appElement = document.getElementById('app');
        if (appElement) {
          console.log('✅ #app element found, preparing to load Vue app');
          loadVueApp();
        } else {
          console.warn('⚠️ #app element not found, DOM might not be fully ready');
          console.log('📄 Current document state:', document.readyState);
          
          if (retryCount < maxRetries) {
            retryCount++;
            console.log('⏳ Retry ' + retryCount + '/' + maxRetries + ', retrying in ' + retryInterval + 'ms...');
            setTimeout(checkAppElement, retryInterval);
          } else {
            console.error('❌ Failed to find #app element after multiple attempts');
            // Try to create #app element as last resort
            try {
              console.log('🔧 Attempting to create #app element as fallback');
              const body = document.body || document.querySelector('body');
              if (body) {
                const appDiv = document.createElement('div');
                appDiv.id = 'app';
                body.appendChild(appDiv);
                console.log('✅ #app element created manually');
                loadVueApp();
              }
            } catch (e) {
              console.error('❌ Failed to create #app element:', e.message);
            }
          }
        }
      }
      
      // Function to load Vue app
      function loadVueApp() {
        const script = document.createElement('script');
        script.src = '/bundle.js';
        script.type = 'text/javascript';
        script.async = true;
        
        // Script load success handler
        script.onload = function() {
          console.log('✅ Vue app script loaded successfully');
        };
        
        // Script load error handler
        script.onerror = function() {
          console.error('❌ Vue app script failed to load, retrying...');
          // Remove existing script and retry
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
          setTimeout(function() {
            document.body.appendChild(script);
          }, 1000);
        };
        
        // Safely add script to document
        try {
          document.body.appendChild(script);
          console.log('📄 Vue app script added to document');
        } catch (e) {
          console.error('❌ Failed to add script to document:', e.message);
        }
      }
      
      // Listen for DOMContentLoaded event
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('✅ DOM is already interactive, starting #app element check immediately');
        checkAppElement();
      } else {
        console.log('⏳ Waiting for DOMContentLoaded event...');
        document.addEventListener('DOMContentLoaded', function() {
          console.log('✅ DOMContentLoaded event triggered, DOM fully loaded');
          checkAppElement();
        });
        
        // Add extra fallback check - if DOMContentLoaded is delayed
        setTimeout(function() {
          if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
            console.warn('⚠️ DOMContentLoaded delayed, manually checking DOM state');
            checkAppElement();
          }
        }, 2000);
    }
  })();
</script>`
}

/**
 * 处理HTML文件，注入增强型加载逻辑
 * @param {string} html - 原始HTML内容
 * @param {string} url - 请求的URL，用于日志记录
 * @returns {string} - 处理后的HTML内容
 */
function processHtmlForEnhancedLoading(html, url) {
  // 移除现有的bundle.js引用
  let processedHtml = html.replace(/<script src=["']bundle\.js["']><\/script>/g, '')

  // Check and log app element status
  const hasAppElement =
    processedHtml.includes('<div id=app></div>') || processedHtml.includes('<div id="app"></div>')

  if (hasAppElement) {
    console.log(`✅ App element check [${url}]: HTML contains valid <div id=app></div> element`)
  } else {
    console.warn(
      `⚠️ App element check [${url}]: Standard <div id=app></div> element not found in HTML`
    )
    // Try to add app element inside body as fallback
    if (processedHtml.includes('</body>')) {
      console.log('🔧 Attempting to add missing #app element to HTML')
      processedHtml = processedHtml.replace(/<\/body>/i, '<div id="app"></div></body>')
      console.log('✅ Added #app element to HTML')
    }
  }

  // 注入增强型加载脚本
  const enhancedScript = generateEnhancedLoadScript()
  processedHtml = processedHtml.replace(/<\/body>/i, `${enhancedScript}</body>`)

  return processedHtml
}

const express = require('express')
const app = express()

// 添加中间件确保正确的MIME类型
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8')
  } else if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8')
  }
  next()
})

// 静态文件服务 - 添加缓存控制
// 处理/static/js/路径的重定向 - 优化版本，支持所有数字编号的bundle文件
app.use('/static/js/', (req, res) => {
  const {url} = req;
  console.log(`[DEBUG] 接收到请求: ${url}`)

  // 直接指定dist目录路径
  const distDir = path.join(__dirname, 'dist')

  // 步骤1: 处理manifest文件请求
  if (url.includes('manifest')) {
    console.log('[DEBUG] 处理manifest请求，发送bundle.js')
    const mainBundlePath = path.join(distDir, 'bundle.js')
    if (fs.existsSync(mainBundlePath)) {
      return res.sendFile(mainBundlePath)
    }
  }

  // 步骤2: 提取URL中的数字部分，尝试匹配对应的bundle文件
  // 支持多种格式：/6.js, /6.xxx.js, /static/js/6.xxx.js等
  const numberMatch = url.match(/\/(\d+)\.?/)
  if (numberMatch && numberMatch[1]) {
    const number = numberMatch[1]
    const bundlePath = path.join(distDir, `${number}.bundle.js`)

    if (fs.existsSync(bundlePath)) {
      console.log(`[DEBUG] 找到数字bundle文件: ${bundlePath}，发送给请求: ${url}`)
      return res.sendFile(bundlePath)
    }
  }

  // 步骤3: 调试信息 - 列出所有可用的bundle文件
  try {
    const files = fs.readdirSync(distDir)
    const bundleFiles = files.filter(f => f.endsWith('.bundle.js'))
    console.log(`[DEBUG] dist目录中的bundle文件: ${bundleFiles.join(', ')}`)
  } catch (err) {
    console.error(`[ERROR] 无法读取dist目录: ${err.message}`)
  }

  // 步骤4: 最终后备 - 发送主bundle.js
  const mainBundlePath = path.join(distDir, 'bundle.js')
  if (fs.existsSync(mainBundlePath)) {
    console.log(`[DEBUG] 使用主bundle.js作为最终后备`)
    return res.sendFile(mainBundlePath)
  }

  // 步骤5: 所有尝试都失败，返回404
  console.log(`[ERROR] 所有文件发送尝试都失败，返回404`)
  res.status(404).send('Not Found')
})

// 提供静态文件服务
app.use(
  express.static(path.join(__dirname, 'dist'), {
    maxAge: '1d',
    etag: false,
    lastModified: false,
  })
)

// 为SPA路由添加重定向
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html')
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    res.status(404).send('App not found. Please build the application first.')
  }
})

// 添加性能监控
let requestCount = 0
const startTime = Date.now()

app.use((req, res, next) => {
  requestCount++
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    const uptime = Date.now() - startTime

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms) - Total: ${requestCount} requests, Uptime: ${Math.floor(uptime / 1000)}s`
    )
  })

  next()
})

// 设置定期打印统计信息的定时器
setInterval(printStats, STATS_PRINT_INTERVAL)

// 启动时打印初始统计信息
setTimeout(() => {
  log(LOG_LEVELS.INFO, 'Server initialized, starting statistics collection')
}, 5000)

// 启动服务器
const server = app.listen(port, '127.0.0.1', () => {
  console.log(`🚀 Vue Build Server running at http://127.0.0.1:${port}`)
  console.log(`📁 Serving files from: ${path.join(__dirname, 'dist')}`)
  console.log(`⚡ Current log level: DEBUG`)
  console.log(`📊 Server started at: ${new Date().toISOString()}`)
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('🛑 Shutting down gracefully...')
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

// 增强的错误处理
server.on('error', err => {
  log(LOG_LEVELS.ERROR, `❌ Server error: ${err.message}`)
  log(LOG_LEVELS.DEBUG, `❌ Error details: ${err.stack}`)

  // 处理特定类型的错误
  if (err.code === 'EADDRINUSE') {
    log(
      LOG_LEVELS.ERROR,
      `❌ Port ${port} is already in use. Please ensure no other service is using this port.`
    )
  } else if (err.code === 'ECONNRESET') {
    log(LOG_LEVELS.ERROR, `❌ Client connection reset.`)
  } else if (err.code === 'ECONNREFUSED') {
    log(LOG_LEVELS.ERROR, `❌ Connection refused.`)
  }

  // 更新错误统计
  errorStats.total++
  const errorType = err.code || 'ServerError'
  errorStats.types[errorType] = (errorStats.types[errorType] || 0) + 1
})

// 连接错误处理
server.on('connection', socket => {
  socket.on('error', err => {
    log(LOG_LEVELS.ERROR, `❌ Socket error: ${err.message}`)

    // 更新错误统计
    errorStats.total++
    const errorType = 'SocketError'
    errorStats.types[errorType] = (errorStats.types[errorType] || 0) + 1
  })
})

// 监听未捕获的异常
process.on('uncaughtException', err => {
  log(LOG_LEVELS.ERROR, `🚨 Uncaught exception: ${err.message}`)
  log(LOG_LEVELS.DEBUG, `🚨 Exception stack: ${err.stack}`)

  // 更新错误统计
  errorStats.total++
  const errorType = err.name || 'UncaughtException'
  errorStats.types[errorType] = (errorStats.types[errorType] || 0) + 1
})

// 监听未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  const errorMessage = reason instanceof Error ? reason.message : String(reason)
  log(LOG_LEVELS.ERROR, `🚨 Unhandled Promise rejection: ${errorMessage}`)

  // 更新错误统计
  errorStats.total++
  const errorType = 'UnhandledPromiseRejection'
  errorStats.types[errorType] = (errorStats.types[errorType] || 0) + 1
})
