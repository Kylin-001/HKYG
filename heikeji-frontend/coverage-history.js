#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// 配置
const config = {
  coverageDir: './coverage',
  historyDir: './coverage-history',
  historyLimit: 30, // 保留30天的历史记录
  colors: {
    success: '\x1b[32m', // 绿色
    error: '\x1b[31m', // 红色
    info: '\x1b[34m', // 蓝色
    reset: '\x1b[0m', // 重置
  },
}

function createDirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function copyCoverageReport() {
  console.log(`${config.colors.info}📊 开始处理测试覆盖率报告...${config.colors.reset}`)

  // 确保历史目录存在
  createDirIfNotExists(config.historyDir)

  // 检查当前覆盖率报告是否存在
  if (!fs.existsSync(`${config.coverageDir}/coverage-summary.json`)) {
    console.log(`${config.colors.error}❌ 未找到覆盖率报告，请先运行测试${config.colors.reset}`)
    return
  }

  // 生成当前日期
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0] // YYYY-MM-DD
  const timeStr = now.toTimeString().split(' ')[0] // HH:MM:SS
  const timestamp = `${dateStr}_${timeStr.replace(/:/g, '-')}`

  // 复制覆盖率报告到历史目录
  const historyFile = path.join(config.historyDir, `coverage-${timestamp}.json`)

  try {
    const coverageData = JSON.parse(
      fs.readFileSync(`${config.coverageDir}/coverage-summary.json`, 'utf8')

    // 添加时间戳信息
    const historyData = {
      timestamp: now.toISOString(),
      date: dateStr,
      time: timeStr,
      coverage: coverageData.total,
    }

    fs.writeFileSync(historyFile, JSON.stringify(historyData, null, 2))
    console.log(
      `${config.colors.success}✅ 覆盖率报告已保存到 ${historyFile}${config.colors.reset}`

    // 清理旧的历史记录
    cleanupOldHistory()

    // 生成趋势报告
    generateTrendReport()
  } catch (error) {
    console.log(
      `${config.colors.error}❌ 处理覆盖率报告时出错: ${error.message}${config.colors.reset}`
    )
  }
}

function cleanupOldHistory() {
  try {
    const files = fs.readdirSync(config.historyDir).filter(file => file.startsWith('coverage-'))

    if (files.length > config.historyLimit) {
      // 按时间排序，删除最旧的文件
      files.sort()
      const filesToDelete = files.slice(0, files.length - config.historyLimit)

      filesToDelete.forEach(file => {
        const filePath = path.join(config.historyDir, file)
        fs.unlinkSync(filePath)
        console.log(`${config.colors.info}🗑️  已删除旧的历史记录: ${file}${config.colors.reset}`)
      })
    }
  } catch (error) {
    console.log(
      `${config.colors.error}❌ 清理历史记录时出错: ${error.message}${config.colors.reset}`
    )
  }
}

function generateTrendReport() {
  try {
    const files = fs.readdirSync(config.historyDir).filter(file => file.startsWith('coverage-'))

    if (files.length === 0) {
      console.log(`${config.colors.info}ℹ️  无历史覆盖率数据${config.colors.reset}`)
      return
    }

    // 读取所有历史数据
    const historyData = files
      .map(file => {
        const filePath = path.join(config.historyDir, file)
        return JSON.parse(fs.readFileSync(filePath, 'utf8'))
      })
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    // 生成趋势报告
    const trendReport = {
      generatedAt: new Date().toISOString(),
      data: historyData,
      summary: {
        latest: historyData[historyData.length - 1],
        oldest: historyData[0],
        average: calculateAverage(historyData),
        trend: calculateTrend(historyData),
      },
    }

    const trendFile = path.join(config.historyDir, 'coverage-trend.json')
    fs.writeFileSync(trendFile, JSON.stringify(trendReport, null, 2))

    console.log(
      `${config.colors.success}✅ 覆盖率趋势报告已生成: ${trendFile}${config.colors.reset}`

    // 打印趋势摘要
    console.log(`${config.colors.info}📈 覆盖率趋势摘要:${config.colors.reset}`)
    console.log(
      `${config.colors.info}  最新覆盖率: ${trendReport.summary.latest.coverage.lines.pct}%${config.colors.reset}`
    )
    console.log(
      `${config.colors.info}  平均覆盖率: ${trendReport.summary.average.lines.pct}%${config.colors.reset}`
    )
    console.log(
      `${config.colors.info}  趋势: ${trendReport.summary.trend.lines}${config.colors.reset}`

  } catch (error) {
    console.log(
      `${config.colors.error}❌ 生成趋势报告时出错: ${error.message}${config.colors.reset}`
    )
  }
}

function calculateAverage(historyData) {
  const total = historyData.length
  const sum = historyData.reduce((acc, data) => {
    Object.keys(data.coverage).forEach(key => {
      if (!acc[key]) acc[key] = { pct: 0, covered: 0, total: 0 }
      acc[key].pct += data.coverage[key].pct
      acc[key].covered += data.coverage[key].covered
      acc[key].total += data.coverage[key].total
    })
    return acc
  }, {})

  Object.keys(sum).forEach(key => {
    sum[key].pct = (sum[key].pct / total).toFixed(2)
    sum[key].covered = sum[key].covered / total
    sum[key].total = sum[key].total / total
  })

  return sum
}

function calculateTrend(historyData) {
  if (historyData.length < 2) {
    return {
      lines: ' insufficient data',
      functions: ' insufficient data',
      branches: ' insufficient data',
      statements: ' insufficient data',
    }
  }

  const first = historyData[0]
  const last = historyData[historyData.length - 1]
  const trend = {}

  Object.keys(last.coverage).forEach(key => {
    const diff = parseFloat(last.coverage[key].pct) - parseFloat(first.coverage[key].pct)
    if (diff > 0) {
      trend[key] = `↑ ${diff.toFixed(2)}%`
    } else if (diff < 0) {
      trend[key] = `↓ ${Math.abs(diff).toFixed(2)}%`
    } else {
      trend[key] = '→ 0%'
    }
  })

  return trend
}

// 执行主函数
copyCoverageReport()
