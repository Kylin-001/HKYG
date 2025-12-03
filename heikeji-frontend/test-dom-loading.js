// 测试脚本：验证增强型DOM加载逻辑在各种场景下的工作情况
// 用途：测试根路径、子路由访问、app元素检测和SPA路由回退功能

const http = require('http')
const fs = require('fs')
const path = require('path')

// 服务器基础URL
const BASE_URL = 'http://127.0.0.1:8080'

// 测试用例配置
const testCases = [
  {
    name: '根路径访问测试',
    url: '/',
    description: '测试根路径访问是否正常工作',
  },
  {
    name: '登录路由测试',
    url: '/login',
    description: '测试/login子路由的SPA回退功能',
  },
  {
    name: '产品路由测试',
    url: '/products',
    description: '测试/products子路由的SPA回退功能',
  },
  {
    name: '深度嵌套路由测试',
    url: '/admin/users/profile',
    description: '测试深度嵌套路由的SPA回退功能',
  },
  {
    name: '静态资源测试',
    url: '/bundle.js',
    description: '测试静态资源文件是否可正常访问',
  },
]

// 运行测试
async function runTests() {
  console.log('========== 开始测试增强型DOM加载逻辑 ==========\n')

  // 测试结果统计
  const totalTests = testCases.length;
  let passedTests = 0
  let failedTests = 0
  const results = [];

  for (const testCase of testCases) {
    console.log(`📋 正在测试: ${testCase.name}`)
    console.log(`   描述: ${testCase.description}`)
    console.log(`   URL: ${BASE_URL}${testCase.url}`)

    try {
      const result = await makeRequest(testCase.url)
      results.push({
        testCase,
        result,
        passed: true,
      })
      passedTests++
      console.log(`✅ 测试通过: ${testCase.name}`)
      console.log(`   状态码: ${result.statusCode}`)
      console.log(`   内容长度: ${result.contentLength} bytes`)

      // 对于HTML响应，检查是否包含#app元素
      if (result.isHtml) {
        const hasAppElement = checkAppElementInHtml(result.body)
        console.log(`   #app元素检测: ${hasAppElement ? '✅ 存在' : '❌ 不存在'}`)
      }
    } catch (error) {
      results.push({
        testCase,
        error: error.message,
        passed: false,
      })
      failedTests++
      console.log(`❌ 测试失败: ${testCase.name}`)
      console.log(`   错误: ${error.message}`)
    }

    console.log('----------------------------------------')
  }

  // 生成测试报告
  console.log('\n========== 测试报告 ==========')
  console.log(`总测试用例: ${totalTests}`)
  console.log(`通过: ${passedTests}`)
  console.log(`失败: ${failedTests}`)

  // 生成详细报告
  const reportPath = path.join(__dirname, 'test-results.json')
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        summary: {
          total: totalTests,
          passed: passedTests,
          failed: failedTests,
        },
        results: results.map(r => ({
          name: r.testCase.name,
          url: r.testCase.url,
          passed: r.passed,
          statusCode: r.result?.statusCode,
          error: r.error,
        })),
      },
      null,
      2
    )

  console.log(`\n详细测试报告已保存至: ${reportPath}`)
}

// 发送HTTP请求
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http
      .get(`${BASE_URL}${url}`, res => {
        const { statusCode } = res
        const contentType = res.headers['content-type'] || ''

      let error;
        if (statusCode !== 200) {
          error = new Error(`请求失败，状态码: ${statusCode}`)
        } else if (contentType && !/^(text\/html|application\/javascript)/i.test(contentType)) {
          error = new Error(`内容类型不匹配，期望HTML或JavaScript，但收到: ${contentType}`)
        }

        if (error) {
          res.resume()
          reject(error)
          return
        }

        let rawData = ''
        res.on('data', chunk => {
          rawData += chunk
        })

      res.on('end', () => {
          resolve({
            statusCode,
            contentType,
            isHtml: contentType.includes('text/html'),
            isScript: contentType.includes('javascript'),
            contentLength: rawData.length,
            body: rawData,
          })
        })
      })
      .on('error', e => {
        reject(new Error(`请求错误: ${e.message}`))
      })
  })
}

// 检查HTML中是否包含#app元素
function checkAppElementInHtml(html) {
  // 简单的正则表达式检测#app元素
  const appElementRegex =
    /<div\s+id=(?:"|\')?app(?:"|\')?\s*>|<div\s+[^>]*id=(?:"|\')?app(?:"|\')?/i
  return appElementRegex.test(html)
}

// 执行测试
runTests().catch(error => {
  console.error('测试过程中发生错误:', error)
})

// 添加命令行帮助信息
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('用法: node test-dom-loading.js')
  console.log('')
  console.log('此脚本用于测试增强型DOM加载逻辑在各种场景下的工作情况。')
  console.log('')
  console.log('注意事项:')
  console.log('1. 确保服务器已在 http://127.0.0.1:8080 启动')
  console.log('2. 测试结果将显示在控制台并保存至 test-results.json')
  console.log('3. 支持测试根路径、子路由、深度嵌套路由和静态资源')
  process.exit(0)
}
