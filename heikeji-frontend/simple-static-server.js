const express = require('express')
const path = require('path')
const app = express()
const port = 8084

// 处理/static/js/路径的请求，重定向到合适的bundle文件
app.use('/static/js', (req, res, next) => {
  // 获取请求的文件名
  const requestFilename = req.path.split('/').pop()

  // 提取文件名中的数字部分（例如从'6.3c735afb91f406bbb336.js'中提取'6'）
  const numberMatch = requestFilename.match(/^(\d+)/)

  if (numberMatch) {
    const number = numberMatch[1]
    // 尝试匹配对应的bundle文件
    const possibleFiles = [
      `${number}.bundle.js`, // 如 6.bundle.js
      'bundle.js', // 主bundle文件作为后备
    ]

    // 检查哪个文件存在
    for (const file of possibleFiles) {
      const filePath = path.join(__dirname, 'dist', file)
      try {
        // 检查文件是否存在
        if (require('fs').existsSync(filePath)) {
          console.log(`重定向请求 ${requestFilename} 到 ${file}`)
          return res.sendFile(filePath)
        }
      } catch (e) {
        console.error('文件检查错误:', e)
      }
    }
  }

  // 如果是manifest文件或者没有匹配到数字，尝试返回主bundle.js
  if (requestFilename.includes('manifest')) {
    const mainBundlePath = path.join(__dirname, 'dist', 'bundle.js')
    if (require('fs').existsSync(mainBundlePath)) {
      console.log(`重定向manifest请求到 bundle.js`)
      return res.sendFile(mainBundlePath)
    }
  }

  // 如果所有尝试都失败，让后续中间件处理
  next()
})

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'dist')))

// 处理所有路由，支持SPA单页应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// 启动服务器
app.listen(port, () => {
  console.log(`简单静态服务器运行在 http://localhost:${port}`)
  console.log('此服务器直接提供dist目录中的静态文件，不进行实时编译')
})
