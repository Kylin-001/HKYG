#!/usr/bin/env node

/**
 * Lighthouse性能测试脚本
 * 用于自动化性能测试和报告生成
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 配置
const config = {
  // 测试URL列表
  urls: [
    'http://localhost:3000',
    'http://localhost:3000/dashboard',
    'http://localhost:3000/login',
    'http://localhost:3000/app/product/list',
  ],

  // 输出目录
  outputDir: path.join(__dirname, '../lighthouse-reports'),

  // Lighthouse配置
  lighthouseConfig: {
    extends: 'lighthouse:default',
    settings: {
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
      },
      emulatedFormFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        width: 1200,
        height: 800,
        deviceScaleFactor: 1,
        disabled: false,
      },
    },
  },

  // 性能预算
  budgets: [
    {
      path: '/*.js',
      resourceSizes: [
        {
          budget: 150 * 1024, // 150KB
          warningThreshold: 120 * 1024, // 120KB
          errorThreshold: 150 * 1024, // 150KB
        },
      ],
    },
    {
      path: '/*.css',
      resourceSizes: [
        {
          budget: 50 * 1024, // 50KB
          warningThreshold: 40 * 1024, // 40KB
          errorThreshold: 50 * 1024, // 50KB
        },
      ],
    },
  ],
}

// 确保输出目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// 运行Lighthouse测试
async function runLighthouse(url) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const reportName = `lighthouse-${url.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}`
  const reportPath = path.join(config.outputDir, reportName)

  try {
    console.log(`开始测试: ${url}`)

    // 构建Lighthouse命令
    const lighthouseCmd = [
      'npx',
      'lighthouse',
      url,
      '--output=json',
      '--output=html',
      `--output-path=${reportPath}`,
      '--chrome-flags="--headless"',
      '--quiet',
    ]

    // 添加配置
    const configPath = path.join(config.outputDir, 'lighthouse-config.json')
    fs.writeFileSync(configPath, JSON.stringify(config.lighthouseConfig, null, 2))
    lighthouseCmd.push(`--config-path=${configPath}`)

    // 添加预算
    const budgetsPath = path.join(config.outputDir, 'budgets.json')
    fs.writeFileSync(budgetsPath, JSON.stringify(config.budgets, null, 2))
    lighthouseCmd.push(`--budget-path=${budgetsPath}`)

    // 执行Lighthouse测试
    execSync(lighthouseCmd.join(' '), { stdio: 'inherit' })

    // 读取测试结果
    const resultsPath = `${reportPath}.report.json`
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'))

      // 生成摘要报告
      const summary = generateSummary(results, url)
      const summaryPath = `${reportPath}-summary.json`
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))

      console.log(`测试完成: ${url}`)
      console.log(`性能评分: ${summary.performanceScore}`)
      console.log(`报告路径: ${reportPath}.html`)

      return {
        url,
        results,
        summary,
        reportPath: `${reportPath}.html`,
        summaryPath,
      }
    } else {
      throw new Error('测试结果文件不存在')
    }
  } catch (error) {
    console.error(`测试失败: ${url}`, error)
    return {
      url,
      error: error.message,
    }
  }
}

// 生成测试摘要
function generateSummary(results, url) {
  const { lhr } = results

  // 提取关键指标
  const fcp = lhr.audits['first-contentful-paint']?.numericValue || 0
  const lcp = lhr.audits['largest-contentful-paint']?.numericValue || 0
  const tti = lhr.audits['interactive']?.numericValue || 0
  const cls = lhr.audits['cumulative-layout-shift']?.numericValue || 0
  const si = lhr.audits['speed-index']?.numericValue || 0

  // 计算性能评分
  const performanceScore = Math.round(lhr.categories.performance.score * 100)
  const accessibilityScore = Math.round(lhr.categories.accessibility.score * 100)
  const bestPracticesScore = Math.round(lhr.categories['best-practices'].score * 100)
  const seoScore = Math.round(lhr.categories.seo.score * 100)

  // 生成建议
  const recommendations = []

  // 性能建议
  if (fcp > 2000) {
    recommendations.push({
      type: 'performance',
      priority: 'high',
      title: '优化首屏绘制时间',
      description: '首屏绘制时间超过2秒，建议优化关键渲染路径',
    })
  }

  if (lcp > 2500) {
    recommendations.push({
      type: 'performance',
      priority: 'high',
      title: '优化最大内容绘制时间',
      description: '最大内容绘制时间超过2.5秒，建议优化图片和关键资源',
    })
  }

  if (tti > 3000) {
    recommendations.push({
      type: 'performance',
      priority: 'high',
      title: '优化交互时间',
      description: '页面可交互时间超过3秒，建议减少JavaScript执行时间',
    })
  }

  if (cls > 0.1) {
    recommendations.push({
      type: 'performance',
      priority: 'medium',
      title: '减少布局偏移',
      description: '累积布局偏移超过0.1，建议为动态内容预留空间',
    })
  }

  // 可访问性建议
  if (accessibilityScore < 90) {
    recommendations.push({
      type: 'accessibility',
      priority: 'medium',
      title: '提高可访问性',
      description: '可访问性评分低于90分，建议改进ARIA标签和键盘导航',
    })
  }

  // SEO建议
  if (seoScore < 80) {
    recommendations.push({
      type: 'seo',
      priority: 'low',
      title: '优化SEO',
      description: 'SEO评分低于80分，建议优化meta标签和结构化数据',
    })
  }

  return {
    url,
    timestamp: new Date().toISOString(),
    scores: {
      performance: performanceScore,
      accessibility: accessibilityScore,
      bestPractices: bestPracticesScore,
      seo: seoScore,
    },
    metrics: {
      firstContentfulPaint: fcp,
      largestContentfulPaint: lcp,
      timeToInteractive: tti,
      cumulativeLayoutShift: cls,
      speedIndex: si,
    },
    recommendations,
    grade: getGrade(performanceScore),
  }
}

// 获取性能等级
function getGrade(score) {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

// 生成综合报告
function generateAggregateReport(results) {
  const successfulResults = results.filter(r => !r.error)
  const failedResults = results.filter(r => r.error)

  if (successfulResults.length === 0) {
    return {
      success: false,
      message: '所有测试都失败了',
      errors: failedResults.map(r => r.error),
    }
  }

  // 计算平均分数
  const avgPerformanceScore = Math.round(
    successfulResults.reduce((sum, r) => sum + r.summary.scores.performance, 0) /
      successfulResults.length
  )
  const avgAccessibilityScore = Math.round(
    successfulResults.reduce((sum, r) => sum + r.summary.scores.accessibility, 0) /
      successfulResults.length
  )
  const avgBestPracticesScore = Math.round(
    successfulResults.reduce((sum, r) => sum + r.summary.scores.bestPractices, 0) /
      successfulResults.length
  )
  const avgSeoScore = Math.round(
    successfulResults.reduce((sum, r) => sum + r.summary.scores.seo, 0) / successfulResults.length
  )

  // 统计建议
  const allRecommendations = successfulResults.flatMap(r => r.summary.recommendations)
  const recommendationsByType = {}

  allRecommendations.forEach(rec => {
    if (!recommendationsByType[rec.type]) {
      recommendationsByType[rec.type] = []
    }
    recommendationsByType[rec.type].push(rec)
  })

  // 生成报告
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: results.length,
      successfulTests: successfulResults.length,
      failedTests: failedResults.length,
      averageScores: {
        performance: avgPerformanceScore,
        accessibility: avgAccessibilityScore,
        bestPractices: avgBestPracticesScore,
        seo: avgSeoScore,
      },
      grade: getGrade(avgPerformanceScore),
    },
    results: successfulResults.map(r => ({
      url: r.url,
      scores: r.summary.scores,
      metrics: r.summary.metrics,
      grade: r.summary.grade,
      reportPath: r.reportPath,
    })),
    errors: failedResults.map(r => ({
      url: r.url,
      error: r.error,
    })),
    recommendations: recommendationsByType,
  }

  // 保存报告
  const reportPath = path.join(config.outputDir, 'aggregate-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))

  return report
}

// 主函数
async function main() {
  console.log('开始Lighthouse性能测试...')

  // 确保输出目录存在
  ensureDir(config.outputDir)

  // 运行测试
  const results = []
  for (const url of config.urls) {
    const result = await runLighthouse(url)
    results.push(result)
  }

  // 生成综合报告
  const aggregateReport = generateAggregateReport(results)

  // 输出摘要
  console.log('\n=== 测试摘要 ===')
  console.log(`总测试数: ${aggregateReport.summary.totalTests}`)
  console.log(`成功测试数: ${aggregateReport.summary.successfulTests}`)
  console.log(`失败测试数: ${aggregateReport.summary.failedTests}`)
  console.log(`平均性能评分: ${aggregateReport.summary.averageScores.performance}`)
  console.log(`性能等级: ${aggregateReport.summary.grade}`)

  // 输出建议
  if (Object.keys(aggregateReport.recommendations).length > 0) {
    console.log('\n=== 优化建议 ===')
    Object.entries(aggregateReport.recommendations).forEach(([type, recs]) => {
      console.log(`\n${type.toUpperCase()}建议:`)
      recs.forEach(rec => {
        console.log(`- [${rec.priority.toUpperCase()}] ${rec.title}`)
        console.log(`  ${rec.description}`)
      })
    })
  }

  console.log(`\n详细报告已保存到: ${path.join(config.outputDir, 'aggregate-report.json')}`)

  // 如果有失败的测试，退出码为1
  if (aggregateReport.summary.failedTests > 0) {
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(error => {
    console.error('测试失败:', error)
    process.exit(1)
  })
}

module.exports = {
  runLighthouse,
  generateSummary,
  generateAggregateReport,
}
