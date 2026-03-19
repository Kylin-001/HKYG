#!/usr/bin/env node

/**
 * 测试覆盖率监控脚本
 * 定期运行测试并记录覆盖率历史
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 配置
const config = {
  projectDir: path.join(__dirname, '..'),
  coverageDir: path.join(__dirname, '../coverage'),
  historyFile: path.join(__dirname, '../coverage-history.json'),
  reportDir: path.join(__dirname, '../coverage-reports'),
  maxHistoryEntries: 30, // 保留最近30次记录
}

/**
 * 确保目录存在
 */
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

/**
 * 运行测试并生成覆盖率报告
 */
function runTestCoverage() {
  try {
    console.log('🔍 运行测试覆盖率分析...')

    const testCommand = 'npm run test:coverage'
    const output = execSync(testCommand, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: config.projectDir,
    })

    console.log('✅ 测试覆盖率分析完成')
    return true
  } catch (error) {
    console.error('❌ 测试覆盖率分析失败:', error.message)
    return false
  }
}

/**
 * 解析覆盖率数据
 */
function parseCoverageData() {
  const coverageFile = path.join(config.coverageDir, 'coverage-summary.json')

  if (!fs.existsSync(coverageFile)) {
    console.error('❌ 覆盖率报告文件不存在:', coverageFile)
    return null
  }

  try {
    const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'))
    return coverageData
  } catch (error) {
    console.error('❌ 解析覆盖率数据失败:', error.message)
    return null
  }
}

/**
 * 计算总体覆盖率
 */
function calculateOverallCoverage(coverageData) {
  if (!coverageData) return null

  let totalLines = 0
  let coveredLines = 0
  let totalFunctions = 0
  let coveredFunctions = 0
  let totalBranches = 0
  let coveredBranches = 0
  let totalStatements = 0
  let coveredStatements = 0

  for (const filePath in coverageData) {
    const fileData = coverageData[filePath]

    if (fileData.lines) {
      totalLines += fileData.lines.total
      coveredLines += fileData.lines.covered
    }

    if (fileData.functions) {
      totalFunctions += fileData.functions.total
      coveredFunctions += fileData.functions.covered
    }

    if (fileData.branches) {
      totalBranches += fileData.branches.total
      coveredBranches += fileData.branches.covered
    }

    if (fileData.statements) {
      totalStatements += fileData.statements.total
      coveredStatements += fileData.statements.covered
    }
  }

  return {
    lines: {
      total: totalLines,
      covered: coveredLines,
      percentage: totalLines > 0 ? (coveredLines / totalLines) * 100 : 0,
    },
    functions: {
      total: totalFunctions,
      covered: coveredFunctions,
      percentage: totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 0,
    },
    branches: {
      total: totalBranches,
      covered: coveredBranches,
      percentage: totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0,
    },
    statements: {
      total: totalStatements,
      covered: coveredStatements,
      percentage: totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 0,
    },
  }
}

/**
 * 加载历史记录
 */
function loadHistory() {
  if (!fs.existsSync(config.historyFile)) {
    return []
  }

  try {
    const historyData = fs.readFileSync(config.historyFile, 'utf8')
    return JSON.parse(historyData)
  } catch (error) {
    console.error('❌ 加载历史记录失败:', error.message)
    return []
  }
}

/**
 * 保存历史记录
 */
function saveHistory(history) {
  try {
    // 限制历史记录数量
    if (history.length > config.maxHistoryEntries) {
      history = history.slice(-config.maxHistoryEntries)
    }

    fs.writeFileSync(config.historyFile, JSON.stringify(history, null, 2), 'utf8')
    console.log('✅ 保存历史记录成功')
  } catch (error) {
    console.error('❌ 保存历史记录失败:', error.message)
  }
}

/**
 * 生成覆盖率趋势报告
 */
function generateTrendReport(history) {
  if (history.length < 2) {
    console.log('⚠️  历史记录不足，无法生成趋势报告')
    return
  }

  const latest = history[history.length - 1]
  const previous = history[history.length - 2]

  const trend = {
    lines: latest.coverage.lines.percentage - previous.coverage.lines.percentage,
    functions: latest.coverage.functions.percentage - previous.coverage.functions.percentage,
    branches: latest.coverage.branches.percentage - previous.coverage.branches.percentage,
    statements: latest.coverage.statements.percentage - previous.coverage.statements.percentage,
  }

  console.log('\n📈 覆盖率趋势报告:')
  console.log(`   行覆盖率: ${trend.lines >= 0 ? '+' : ''}${trend.lines.toFixed(2)}%`)
  console.log(`   函数覆盖率: ${trend.functions >= 0 ? '+' : ''}${trend.functions.toFixed(2)}%`)
  console.log(`   分支覆盖率: ${trend.branches >= 0 ? '+' : ''}${trend.branches.toFixed(2)}%`)
  console.log(`   语句覆盖率: ${trend.statements >= 0 ? '+' : ''}${trend.statements.toFixed(2)}%`)

  // 生成HTML趋势报告
  generateHtmlTrendReport(history)
}

/**
 * 生成HTML趋势报告
 */
function generateHtmlTrendReport(history) {
  ensureDirectoryExists(config.reportDir)

  const htmlReport = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>测试覆盖率趋势报告</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .stat-value {
            font-size: 2em;
            font-weight: bold;
            color: #409eff;
        }
        .stat-label {
            margin-top: 5px;
            color: #666;
        }
        .chart-container {
            position: relative;
            height: 400px;
            margin-bottom: 30px;
        }
        .history-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .history-table th, .history-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }
        .history-table th {
            background-color: #f2f2f2;
        }
        .history-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>测试覆盖率趋势报告</h1>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${history.length > 0 ? history[history.length - 1].coverage.lines.percentage.toFixed(2) : '0'}%</div>
                <div class="stat-label">行覆盖率</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${history.length > 0 ? history[history.length - 1].coverage.functions.percentage.toFixed(2) : '0'}%</div>
                <div class="stat-label">函数覆盖率</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${history.length > 0 ? history[history.length - 1].coverage.branches.percentage.toFixed(2) : '0'}%</div>
                <div class="stat-label">分支覆盖率</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${history.length > 0 ? history[history.length - 1].coverage.statements.percentage.toFixed(2) : '0'}%</div>
                <div class="stat-label">语句覆盖率</div>
            </div>
        </div>
        
        <div class="chart-container">
            <canvas id="coverageChart"></canvas>
        </div>
        
        <h2>历史记录</h2>
        <table class="history-table">
            <thead>
                <tr>
                    <th>日期时间</th>
                    <th>行覆盖率</th>
                    <th>函数覆盖率</th>
                    <th>分支覆盖率</th>
                    <th>语句覆盖率</th>
                </tr>
            </thead>
            <tbody>
                ${history
                  .map(
                    entry => `
                <tr>
                    <td>${new Date(entry.timestamp).toLocaleString()}</td>
                    <td>${entry.coverage.lines.percentage.toFixed(2)}%</td>
                    <td>${entry.coverage.functions.percentage.toFixed(2)}%</td>
                    <td>${entry.coverage.branches.percentage.toFixed(2)}%</td>
                    <td>${entry.coverage.statements.percentage.toFixed(2)}%</td>
                </tr>
                `
                  )
                  .join('')}
            </tbody>
        </table>
    </div>
    
    <script>
        const ctx = document.getElementById('coverageChart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ${JSON.stringify(history.map(entry => new Date(entry.timestamp).toLocaleDateString()))},
                datasets: [
                    {
                        label: '行覆盖率',
                        data: ${JSON.stringify(history.map(entry => entry.coverage.lines.percentage))},
                        borderColor: '#409eff',
                        backgroundColor: 'rgba(64, 158, 255, 0.1)',
                        fill: true,
                    },
                    {
                        label: '函数覆盖率',
                        data: ${JSON.stringify(history.map(entry => entry.coverage.functions.percentage))},
                        borderColor: '#67c23a',
                        backgroundColor: 'rgba(103, 194, 58, 0.1)',
                        fill: true,
                    },
                    {
                        label: '分支覆盖率',
                        data: ${JSON.stringify(history.map(entry => entry.coverage.branches.percentage))},
                        borderColor: '#e6a23c',
                        backgroundColor: 'rgba(230, 162, 60, 0.1)',
                        fill: true,
                    },
                    {
                        label: '语句覆盖率',
                        data: ${JSON.stringify(history.map(entry => entry.coverage.statements.percentage))},
                        borderColor: '#f56c6c',
                        backgroundColor: 'rgba(245, 108, 108, 0.1)',
                        fill: true,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: '覆盖率 (%)',
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                    legend: {
                        position: 'top',
                    },
                },
            },
        });
    </script>
</body>
</html>
`

  const reportPath = path.join(config.reportDir, 'coverage-trend.html')
  try {
    fs.writeFileSync(reportPath, htmlReport, 'utf8')
    console.log(`✅ 生成HTML趋势报告: ${reportPath}`)
  } catch (error) {
    console.error(`❌ 生成HTML趋势报告失败:`, error.message)
  }
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始测试覆盖率监控...')

  // 确保目录存在
  ensureDirectoryExists(config.coverageDir)
  ensureDirectoryExists(config.reportDir)

  // 运行测试覆盖率
  const testSuccess = runTestCoverage()
  if (!testSuccess) {
    console.log('⚠️  测试运行失败，将尝试解析现有覆盖率数据')
  }

  // 解析覆盖率数据
  const coverageData = parseCoverageData()
  if (!coverageData) {
    console.error('❌ 无法获取覆盖率数据，退出')
    process.exit(1)
  }

  // 计算总体覆盖率
  const overallCoverage = calculateOverallCoverage(coverageData)

  // 加载历史记录
  const history = loadHistory()

  // 添加新记录
  const newEntry = {
    timestamp: new Date().toISOString(),
    coverage: overallCoverage,
  }

  history.push(newEntry)

  // 保存历史记录
  saveHistory(history)

  // 显示当前覆盖率
  console.log('\n📊 当前测试覆盖率:')
  console.log(
    `   行覆盖率: ${overallCoverage.lines.percentage.toFixed(2)}% (${overallCoverage.lines.covered}/${overallCoverage.lines.total})`
  )
  console.log(
    `   函数覆盖率: ${overallCoverage.functions.percentage.toFixed(2)}% (${overallCoverage.functions.covered}/${overallCoverage.functions.total})`
  )
  console.log(
    `   分支覆盖率: ${overallCoverage.branches.percentage.toFixed(2)}% (${overallCoverage.branches.covered}/${overallCoverage.branches.total})`
  )
  console.log(
    `   语句覆盖率: ${overallCoverage.statements.percentage.toFixed(2)}% (${overallCoverage.statements.covered}/${overallCoverage.statements.total})`

  // 生成趋势报告
  generateTrendReport(history)

  console.log('\n✅ 测试覆盖率监控完成！')
  console.log(`📄 查看HTML趋势报告: ${path.join(config.reportDir, 'coverage-trend.html')}`)

  // 检查覆盖率是否达标
  const threshold = 70
  const isBelowThreshold =
    overallCoverage.lines.percentage < threshold ||
    overallCoverage.functions.percentage < threshold ||
    overallCoverage.branches.percentage < threshold ||
    overallCoverage.statements.percentage < threshold

  if (isBelowThreshold) {
    console.log(`⚠️  警告: 测试覆盖率低于${threshold}%，请增加测试用例`)
    process.exit(1)
  } else {
    console.log(`🎉 恭喜: 测试覆盖率达到${threshold}%以上`)
  }
}

// 运行主函数
if (require.main === module) {
  main()
}

module.exports = {
  main,
  parseCoverageData,
  calculateOverallCoverage,
  generateTrendReport,
}
