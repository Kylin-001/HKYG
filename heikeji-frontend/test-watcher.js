#!/usr/bin/env node

const chokidar = require('chokidar')
const { execSync } = require('child_process')
const path = require('path')

// 配置
const config = {
  watchPaths: ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.js', 'test/**/*.ts', 'test/**/*.js'],
  testCommand: 'npm run test:unit',
  debounceDelay: 500,
  colors: {
    success: '\x1b[32m', // 绿色
    error: '\x1b[31m', // 红色
    info: '\x1b[34m', // 蓝色
    reset: '\x1b[0m', // 重置
  },
}

let debounceTimer

function runTests() {
  console.log(`${config.colors.info}🔍 开始运行测试...${config.colors.reset}`)

  try {
    const result = execSync(config.testCommand, {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
    console.log(`${config.colors.success}✅ 测试通过！${config.colors.reset}`)
  } catch (error) {
    console.log(`${config.colors.error}❌ 测试失败！${config.colors.reset}`)
  }

  console.log(`${config.colors.info}⏰ 等待文件变化...${config.colors.reset}`)
}

function handleFileChange(event, filePath) {
  const relativePath = path.relative(process.cwd(), filePath)
  console.log(`${config.colors.info}📄 文件 ${relativePath} 发生变化${config.colors.reset}`)

  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(runTests, config.debounceDelay)
}

console.log(`${config.colors.info}🚀 启动实时测试监控...${config.colors.reset}`)
console.log(
  `${config.colors.info}📁 监控路径: ${config.watchPaths.join(', ')}${config.colors.reset}`
)
console.log(`${config.colors.info}🔧 测试命令: ${config.testCommand}${config.colors.reset}`)
console.log(`${config.colors.info}⏰ 防抖延迟: ${config.debounceDelay}ms${config.colors.reset}`)
console.log(`${config.colors.info}====================================${config.colors.reset}`)

// 初始运行一次测试
runTests()

// 启动文件监控
const watcher = chokidar.watch(config.watchPaths, {
  ignored: /(^|[/\\])\../,
  persistent: true,
  ignoreInitial: true,
})

watcher
  .on('add', path => handleFileChange('add', path))
  .on('change', path => handleFileChange('change', path))
  .on('unlink', path => handleFileChange('unlink', path))
  .on('error', error => console.error('文件监控错误:', error))
  .on('ready', () => {
    console.log(`${config.colors.success}✅ 文件监控已就绪！${config.colors.reset}`)
  })

// 处理退出信号
process.on('SIGINT', () => {
  console.log(`${config.colors.info}\n👋 停止实时测试监控...${config.colors.reset}`)
  watcher.close()
  process.exit(0)
})
