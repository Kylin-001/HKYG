#!/usr/bin/env node

/**
 * 测试监控脚本
 * 用于监控测试结果和性能指标
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 配置
const config = {
  coverageThreshold: 70,
  performanceThreshold: {
    firstContentfulPaint: 1500,
    largestContentfulPaint: 2500,
    cumulativeLayoutShift: 0.1,
    totalBlockingTime: 300,
  },
  testResultsDir: path.join(__dirname, '../test-results'),
  coverageDir: path.join(__dirname, '../coverage'),
  reportsDir: path.join(__dirname, '../test-reports'),
}

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// 读取测试覆盖率
function readCoverage() {
  try {
    const coverageFile = path.join(config.coverageDir, 'coverage-summary.json')
    if (fs.existsSync(coverageFile)) {
      const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'))
      return {
        lines: coverageData.total.lines.pct,
        functions: coverageData.total.functions.pct,
        branches: coverageData.total.branches.pct,
        statements: coverageData.total.statements.pct,
      }
    }
  } catch (error) {
    console.error('读取测试覆盖率失败:', error)
  }
  return null
}

// 读取性能测试结果
function readPerformanceResults() {
  try {
    const performanceDir = path.join(config.testResultsDir, 'performance')
    if (fs.existsSync(performanceDir)) {
      const files = fs.readdirSync(performanceDir)
      const results = []

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(performanceDir, file)
          const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
          results.push(data)
        }
      }

      return results
    }
  } catch (error) {
    console.error('读取性能测试结果失败:', error)
  }
  return []
}

// 读取E2E测试结果
function readE2EResults() {
  try {
    const e2eResultsFile = path.join(config.testResultsDir, 'e2e-results.json')
    if (fs.existsSync(e2eResultsFile)) {
      return JSON.parse(fs.readFileSync(e2eResultsFile, 'utf8'))
    }
  } catch (error) {
    console.error('读取E2E测试结果失败:', error)
  }
  return null
}

// 生成测试报告
function generateTestReport() {
  const timestamp = new Date().toISOString()
  const coverage = readCoverage()
  const performanceResults = readPerformanceResults()
  const e2eResults = readE2EResults()

  const report = {
    timestamp,
    coverage,
    performance: performanceResults,
    e2e: e2eResults,
    status: 'unknown',
  }

  // 确定整体状态
  let status = 'passed'

  // 检查测试覆盖率
  if (coverage && coverage.lines < config.coverageThreshold) {
    status = 'failed'
  }

  // 检查性能指标
  for (const result of performanceResults) {
    if (result.lhr) {
      const fcp = result.lhr.audits['first-contentful-paint'].numericValue
      const lcp = result.lhr.audits['largest-contentful-paint'].numericValue
      const cls = result.lhr.audits['cumulative-layout-shift'].numericValue
      const ttb = result.lhr.audits['total-blocking-time'].numericValue

      if (
        fcp > config.performanceThreshold.firstContentfulPaint ||
        lcp > config.performanceThreshold.largestContentfulPaint ||
        cls > config.performanceThreshold.cumulativeLayoutShift ||
        ttb > config.performanceThreshold.totalBlockingTime
      ) {
        status = 'failed'
      }
    }
  }

  // 检查E2E测试
  if (e2eResults && e2eResults.failed > 0) {
    status = 'failed'
  }

  report.status = status

  // 保存报告
  ensureDir(config.reportsDir)
  const reportFile = path.join(
    config.reportsDir,
    `test-report-${timestamp.replace(/[:.]/g, '-')}.json`
  )
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2))

  // 生成HTML报告
  generateHtmlReport(report)

  return report
}

// 生成HTML报告
function generateHtmlReport(report) {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试监控报告</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    .header {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .status-${report.status} {
      color: ${report.status === 'passed' ? '#28a745' : '#dc3545'};
      font-weight: bold;
    }
    .section {
      margin-bottom: 30px;
      border: 1px solid #e1e5e9;
      border-radius: 8px;
      overflow: hidden;
    }
    .section-header {
      background-color: #f8f9fa;
      padding: 15px;
      border-bottom: 1px solid #e1e5e9;
      font-weight: bold;
    }
    .section-content {
      padding: 15px;
    }
    .coverage-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .coverage-bar {
      height: 20px;
      background-color: #e9ecef;
      border-radius: 10px;
      overflow: hidden;
      margin-top: 5px;
    }
    .coverage-fill {
      height: 100%;
      background-color: #28a745;
    }
    .performance-item {
      margin-bottom: 15px;
    }
    .performance-value {
      font-weight: bold;
    }
    .performance-good {
      color: #28a745;
    }
    .performance-bad {
      color: #dc3545;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f8f9fa;
    }
    .test-passed {
      color: #28a745;
    }
    .test-failed {
      color: #dc3545;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>测试监控报告</h1>
    <p>生成时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}</p>
    <p>整体状态: <span class="status-${report.status}">${report.status === 'passed' ? '✅ 通过' : '❌ 失败'}</span></p>
  </div>
  
  ${
    report.coverage
      ? `
  <div class="section">
    <div class="section-header">测试覆盖率</div>
    <div class="section-content">
      <div class="coverage-item">
        <span>行覆盖率</span>
        <span>${report.coverage.lines}%</span>
      </div>
      <div class="coverage-bar">
        <div class="coverage-fill" style="width: ${report.coverage.lines}%"></div>
      </div>
      
      <div class="coverage-item">
        <span>函数覆盖率</span>
        <span>${report.coverage.functions}%</span>
      </div>
      <div class="coverage-bar">
        <div class="coverage-fill" style="width: ${report.coverage.functions}%"></div>
      </div>
      
      <div class="coverage-item">
        <span>分支覆盖率</span>
        <span>${report.coverage.branches}%</span>
      </div>
      <div class="coverage-bar">
        <div class="coverage-fill" style="width: ${report.coverage.branches}%"></div>
      </div>
      
      <div class="coverage-item">
        <span>语句覆盖率</span>
        <span>${report.coverage.statements}%</span>
      </div>
      <div class="coverage-bar">
        <div class="coverage-fill" style="width: ${report.coverage.statements}%"></div>
      </div>
    </div>
  </div>
  `
      : ''
  }
  
  ${
    report.performance && report.performance.length > 0
      ? `
  <div class="section">
    <div class="section-header">性能测试结果</div>
    <div class="section-content">
      ${report.performance
        .map(
          result => `
        <div class="performance-item">
          <h4>${result.url || '未知页面'}</h4>
          <p>首次内容绘制 (FCP): <span class="performance-value ${result.lhr.audits['first-contentful-paint'].numericValue <= config.performanceThreshold.firstContentfulPaint ? 'performance-good' : 'performance-bad'}">${Math.round(result.lhr.audits['first-contentful-paint'].numericValue)}ms</span></p>
          <p>最大内容绘制 (LCP): <span class="performance-value ${result.lhr.audits['largest-contentful-paint'].numericValue <= config.performanceThreshold.largestContentfulPaint ? 'performance-good' : 'performance-bad'}">${Math.round(result.lhr.audits['largest-contentful-paint'].numericValue)}ms</span></p>
          <p>累积布局偏移 (CLS): <span class="performance-value ${result.lhr.audits['cumulative-layout-shift'].numericValue <= config.performanceThreshold.cumulativeLayoutShift ? 'performance-good' : 'performance-bad'}">${result.lhr.audits['cumulative-layout-shift'].numericValue}</span></p>
          <p>总阻塞时间 (TBT): <span class="performance-value ${result.lhr.audits['total-blocking-time'].numericValue <= config.performanceThreshold.totalBlockingTime ? 'performance-good' : 'performance-bad'}">${Math.round(result.lhr.audits['total-blocking-time'].numericValue)}ms</span></p>
        </div>
      `
        )
        .join('')}
    </div>
  </div>
  `
      : ''
  }
  
  ${
    report.e2e
      ? `
  <div class="section">
    <div class="section-header">E2E测试结果</div>
    <div class="section-content">
      <table>
        <tr>
          <th>测试套件</th>
          <th>通过</th>
          <th>失败</th>
          <th>跳过</th>
          <th>总计</th>
        </tr>
        <tr>
          <td>E2E测试</td>
          <td class="test-passed">${report.e2e.passed}</td>
          <td class="test-failed">${report.e2e.failed}</td>
          <td>${report.e2e.skipped || 0}</td>
          <td>${report.e2e.total}</td>
        </tr>
      </table>
    </div>
  </div>
  `
      : ''
  }
</body>
</html>
  `

  ensureDir(config.reportsDir)
  const reportFile = path.join(
    config.reportsDir,
    `test-report-${new Date(report.timestamp).getTime()}.html`
  )
  fs.writeFileSync(reportFile, html)

  return reportFile
}

// 主函数
function main() {
  console.log('开始生成测试监控报告...')

  const report = generateTestReport()

  console.log(`测试监控报告已生成，状态: ${report.status}`)
  console.log(
    `报告文件: ${path.join(config.reportsDir, `test-report-${new Date(report.timestamp).getTime()}.html`)}`

  // 如果测试失败，退出码为1
  if (report.status === 'failed') {
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

module.exports = {
  generateTestReport,
  readCoverage,
  readPerformanceResults,
  readE2EResults,
}
