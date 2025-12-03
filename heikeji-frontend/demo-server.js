const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = 8080

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)

  let filePath
  if (req.url === '/' || req.url === '/index.html') {
    filePath = path.join(__dirname, 'local-demo.html')
  } else if (req.url === '/demo.html') {
    filePath = path.join(__dirname, 'demo.html')
  } else {
    filePath = path.join(__dirname, req.url)
  }

  const extname = path.extname(filePath)
  let contentType = 'text/html'

  switch (extname) {
    case '.js':
      contentType = 'text/javascript'
      break
    case '.css':
      contentType = 'text/css'
      break
    case '.json':
      contentType = 'application/json'
      break
    case '.png':
      contentType = 'image/png'
      break
    case '.jpg':
      contentType = 'image/jpg'
      break
    case '.wav':
      contentType = 'audio/wav'
      break
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end('<h1>404 - 文件未找到</h1>', 'utf-8')
      } else {
        res.writeHead(500)
        res.end(`服务器内部错误: ${error.code}`, 'utf-8')
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
      })
      res.end(content, 'utf-8')
    }
  })
})

server.listen(PORT, () => {
  console.log(`🎉 黑科易购管理系统演示服务器运行在 http://localhost:${PORT}/`)
  console.log(`📱 可直接访问: http://localhost:${PORT}/demo.html`)
  console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`)
})

server.on('error', err => {
  console.error('服务器启动失败:', err)
})
