#!/usr/bin/env node

/**
 * 测试覆盖率历史记录脚本
 * 用于跟踪测试覆盖率的变化趋势
 */

const fs = require('fs')
const path = require('path')

// 配置
const config = {
  coverageHistoryFile: path.join(__dirname, '../test-reports/coverage-history.json'),
  coverageDir: path.join(__dirname, '../coverage'),
  reportsDir: path.join(__dirname, '../test-reports'),
  maxHistoryEntries: 100, // 最大历史记录条数
}

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// 读取当前测试覆盖率
function readCurrentCoverage() {
  try {
    const coverageFile = path.join(config.coverageDir, 'coverage-summary.json')
    if (fs.existsSync(coverageFile)) {
      const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'))
      return {
        timestamp: new Date().toISOString(),
        lines: coverageData.total.lines.pct,
        functions: coverageData.total.functions.pct,
        branches: coverageData.total.branches.pct,
        statements: coverageData.total.statements.pct,
      }
    }
  } catch (error) {
    console.error('读取当前测试覆盖率失败:', error)
  }
  return null
}

// 读取历史覆盖率数据
function readCoverageHistory() {
  try {
    if (fs.existsSync(config.coverageHistoryFile)) {
      return JSON.parse(fs.readFileSync(config.coverageHistoryFile, 'utf8'))
    }
  } catch (error) {
    console.error('读取历史覆盖率数据失败:', error)
  }
  return []
}

// 保存覆盖率历史
function saveCoverageHistory(history) {
  try {
    ensureDir(config.reportsDir)
    fs.writeFileSync(config.coverageHistoryFile, JSON.stringify(history, null, 2))
    return true
  } catch (error) {
    console.error('保存覆盖率历史失败:', error)
    return false
  }
}

// 添加当前覆盖率到历史记录
function addCoverageToHistory() {
  const currentCoverage = readCurrentCoverage()
  if (!currentCoverage) {
    console.error('无法获取当前覆盖率数据')
    return false
  }

  const history = readCoverageHistory()

  // 添加当前覆盖率到历史记录
  history.push(currentCoverage)

  // 限制历史记录数量
  if (history.length > config.maxHistoryEntries) {
    history.splice(0, history.length - config.maxHistoryEntries)
  }

  // 保存历史记录
  return saveCoverageHistory(history)
}

// 生成覆盖率趋势报告
function generateCoverageTrendReport() {
  const history = readCoverageHistory()

  if (history.length < 2) {
    console.log('历史数据不足，无法生成趋势报告')
    return null
  }

  const latest = history[history.length - 1]
  const previous = history[history.length - 2]

  // 计算变化
  const linesChange = latest.lines - previous.lines
  const functionsChange = latest.functions - previous.functions
  const branchesChange = latest.branches - previous.branches
  const statementsChange = latest.statements - previous.statements

  // 计算平均变化率
  let avgLinesChange = 0
  let avgFunctionsChange = 0
  let avgBranchesChange = 0
  let avgStatementsChange = 0

  if (history.length > 1) {
    for (let i = 1; i < history.length; i++) {
      avgLinesChange += history[i].lines - history[i - 1].lines
      avgFunctionsChange += history[i].functions - history[i - 1].functions
      avgBranchesChange += history[i].branches - history[i - 1].branches
      avgStatementsChange += history[i].statements - history[i - 1].statements
    }

    const divisor = history.length - 1
    avgLinesChange /= divisor
    avgFunctionsChange /= divisor
    avgBranchesChange /= divisor
    avgStatementsChange /= divisor
  }

  return {
    latest,
    previous,
    changes: {
      lines: linesChange,
      functions: functionsChange,
      branches: branchesChange,
      statements: statementsChange,
    },
    avgChanges: {
      lines: avgLinesChange,
      functions: avgFunctionsChange,
      branches: avgBranchesChange,
      statements: avgStatementsChange,
    },
    trend: {
      lines: avgLinesChange >= 0 ? 'up' : 'down',
      functions: avgFunctionsChange >= 0 ? 'up' : 'down',
      branches: avgBranchesChange >= 0 ? 'up' : 'down',
      statements: avgStatementsChange >= 0 ? 'up' : 'down',
    },
  }
}

// 生成HTML趋势报告
function generateHtmlTrendReport() {
  const history = readCoverageHistory()
  const trend = generateCoverageTrendReport()

  if (!trend) {
    return null
  }

  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>测试覆盖率趋势报告</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
    .chart-container {
      height: 400px;
      margin-bottom: 20px;
    }
    .trend-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .trend-up {
      color: #28a745;
    }
    .trend-down {
      color: #dc3545;
    }
    .trend-neutral {
      color: #6c757d;
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
    .positive {
      color: #28a745;
    }
    .negative {
      color: #dc3545;
    }
    .neutral {
      color: #6c757d;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>测试覆盖率趋势报告</h1>
    <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
    <p>历史记录数: ${history.length}</p>
  </div>
  
  <div class="section">
    <div class="section-header">覆盖率趋势图表</div>
    <div class="section-content">
      <div class="chart-container">
        <canvas id="coverageChart"></canvas>
      </div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-header">最新变化</div>
    <div class="section-content">
      <table>
        <tr>
          <th>指标</th>
          <th>当前值</th>
          <th>上次值</th>
          <th>变化</th>
          <th>趋势</th>
        </tr>
        <tr>
          <td>行覆盖率</td>
          <td>${trend.latest.lines}%</td>
          <td>${trend.previous.lines}%</td>
          <td class="${trend.changes.lines >= 0 ? 'positive' : 'negative'}">${trend.changes.lines >= 0 ? '+' : ''}${trend.changes.lines.toFixed(2)}%</td>
          <td class="trend-${trend.trend.lines}">${trend.trend.lines === 'up' ? '↑ 上升' : trend.trend.lines === 'down' ? '↓ 下降' : '→ 稳定'}</td>
        </tr>
        <tr>
          <td>函数覆盖率</td>
          <td>${trend.latest.functions}%</td>
          <td>${trend.previous.functions}%</td>
          <td class="${trend.changes.functions >= 0 ? 'positive' : 'negative'}">${trend.changes.functions >= 0 ? '+' : ''}${trend.changes.functions.toFixed(2)}%</td>
          <td class="trend-${trend.trend.functions}">${trend.trend.functions === 'up' ? '↑ 上升' : trend.trend.functions === 'down' ? '↓ 下降' : '→ 稳定'}</td>
        </tr>
        <tr>
          <td>分支覆盖率</td>
          <td>${trend.latest.branches}%</td>
          <td>${trend.previous.branches}%</td>
          <td class="${trend.changes.branches >= 0 ? 'positive' : 'negative'}">${trend.changes.branches >= 0 ? '+' : ''}${trend.changes.branches.toFixed(2)}%</td>
          <td class="trend-${trend.trend.branches}">${trend.trend.branches === 'up' ? '↑ 上升' : trend.trend.branches === 'down' ? '↓ 下降' : '→ 稳定'}</td>
        </tr>
        <tr>
          <td>语句覆盖率</td>
          <td>${trend.latest.statements}%</td>
          <td>${trend.previous.statements}%</td>
          <td class="${trend.changes.statements >= 0 ? 'positive' : 'negative'}">${trend.changes.statements >= 0 ? '+' : ''}${trend.changes.statements.toFixed(2)}%</td>
          <td class="trend-${trend.trend.statements}">${trend.trend.statements === 'up' ? '↑ 上升' : trend.trend.statements === 'down' ? '↓ 下降' : '→ 稳定'}</td>
        </tr>
      </table>
    </div>
  </div>
  
  <div class="section">
    <div class="section-header">平均变化率</div>
    <div class="section-content">
      <div class="trend-item">
        <span>行覆盖率平均变化</span>
        <span class="${trend.avgChanges.lines >= 0 ? 'positive' : 'negative'}">${trend.avgChanges.lines >= 0 ? '+' : ''}${trend.avgChanges.lines.toFixed(2)}%/次</span>
      </div>
      <div class="trend-item">
        <span>函数覆盖率平均变化</span>
        <span class="${trend.avgChanges.functions >= 0 ? 'positive' : 'negative'}">${trend.avgChanges.functions >= 0 ? '+' : ''}${trend.avgChanges.functions.toFixed(2)}%/次</span>
      </div>
      <div class="trend-item">
        <span>分支覆盖率平均变化</span>
        <span class="${trend.avgChanges.branches >= 0 ? 'positive' : 'negative'}">${trend.avgChanges.branches >= 0 ? '+' : ''}${trend.avgChanges.branches.toFixed(2)}%/次</span>
      </div>
      <div class="trend-item">
        <span>语句覆盖率平均变化</span>
        <span class="${trend.avgChanges.statements >= 0 ? 'positive' : 'negative'}">${trend.avgChanges.statements >= 0 ? '+' : ''}${trend.avgChanges.statements.toFixed(2)}%/次</span>
      </div>
    </div>
  </div>
  
  <script>
    // 准备图表数据
    const history = ${JSON.stringify(history)};
    const labels = history.map(entry => new Date(entry.timestamp).toLocaleDateString());
    
    const ctx = document.getElementById('coverageChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '行覆盖率',
            data: history.map(entry => entry.lines),
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            fill: false,
            tension: 0.1
          },
          {
            label: '函数覆盖率',
            data: history.map(entry => entry.functions),
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            fill: false,
            tension: 0.1
          },
          {
            label: '分支覆盖率',
            data: history.map(entry => entry.branches),
            borderColor: '#ffc107',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            fill: false,
            tension: 0.1
          },
          {
            label: '语句覆盖率',
            data: history.map(entry => entry.statements),
            borderColor: '#dc3545',
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            fill: false,
            tension: 0.1
          }
        ]
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
              text: '覆盖率 (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: '日期'
            }
          }
        },
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false
          },
          legend: {
            position: 'top'
          }
        }
      }
    });
  </script>
</body>
</html>
  `

  ensureDir(config.reportsDir)
  const reportFile = path.join(config.reportsDir, `coverage-trend-${new Date().getTime()}.html`)
  fs.writeFileSync(reportFile, html)

  return reportFile
}

// 主函数
function main() {
  console.log('开始更新测试覆盖率历史记录...')

  if (!addCoverageToHistory()) {
    console.error('更新测试覆盖率历史记录失败')
    process.exit(1)
  }

  console.log('测试覆盖率历史记录已更新')

  const trendReport = generateHtmlTrendReport()
  if (trendReport) {
    console.log(`覆盖率趋势报告已生成: ${trendReport}`)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

module.exports = {
  addCoverageToHistory,
  generateCoverageTrendReport,
  generateHtmlTrendReport,
  readCoverageHistory,
}
