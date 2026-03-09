#!/usr/bin/env node

/**
 * 数据库性能监控和优化工具
 * 用于监控数据库性能、分析慢查询并提供优化建议
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 配置
const config = {
  projectDir: path.join(__dirname, '..'),
  reportDir: path.join(__dirname, '../performance-reports'),
  slowQueryThreshold: 1000, // 慢查询阈值（毫秒）
  maxReportEntries: 50, // 最大报告条目数
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
 * 执行数据库查询
 */
function executeDatabaseQuery(sql) {
  try {
    // 这里应该根据实际的数据库连接方式进行调整
    // 示例使用MySQL命令行工具
    const result = execSync(`mysql -u root -p -e "${sql}"`, { 
      encoding: 'utf8',
      stdio: 'pipe',
    })
    
    return result
  } catch (error) {
    console.error('❌ 数据库查询失败:', error.message)
    return null
  }
}

/**
 * 获取数据库表统计信息
 */
function getTableStats() {
  console.log('🔍 获取数据库表统计信息...')
  
  const sql = `
    SELECT 
      TABLE_NAME as tableName,
      TABLE_ROWS as tableRows,
      DATA_LENGTH as dataLength,
      INDEX_LENGTH as indexLength,
      (DATA_LENGTH + INDEX_LENGTH) as totalLength,
      ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) as totalSizeMB
    FROM 
      information_schema.TABLES 
    WHERE 
      TABLE_SCHEMA = 'heikeji_mall' 
    ORDER BY 
      (DATA_LENGTH + INDEX_LENGTH) DESC
  `
  
  const result = executeDatabaseQuery(sql)
  if (!result) return []
  
  const lines = result.split('\n').filter(line => line.trim())
  const headers = lines[0].split('\t')
  const data = lines.slice(1).map(line => {
    const values = line.split('\t')
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index]
    })
    return row
  })
  
  return data
}

/**
 * 获取慢查询日志
 */
function getSlowQueries() {
  console.log('🔍 获取慢查询日志...')
  
  const sql = `
    SELECT 
      start_time as startTime,
      query_time as queryTime,
      lock_time as lockTime,
      rows_sent as rowsSent,
      rows_examined as rowsExamined,
      sql_text as sqlText,
      db as database
    FROM 
      mysql.slow_log 
    WHERE 
      start_time > DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ORDER BY 
      query_time DESC 
    LIMIT ${config.maxReportEntries}
  `
  
  const result = executeDatabaseQuery(sql)
  if (!result) return []
  
  const lines = result.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  const headers = lines[0].split('\t')
  const data = lines.slice(1).map(line => {
    const values = line.split('\t')
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index]
    })
    return row
  })
  
  return data
}

/**
 * 分析表索引使用情况
 */
function analyzeIndexUsage() {
  console.log('🔍 分析表索引使用情况...')
  
  const sql = `
    SELECT 
      TABLE_NAME as tableName,
      INDEX_NAME as indexName,
      COLUMN_NAME as columnName,
      CARDINALITY as cardinality,
      SUB_PART as subPart,
      NULLABLE as nullable,
      INDEX_TYPE as indexType
    FROM 
      information_schema.STATISTICS 
    WHERE 
      TABLE_SCHEMA = 'heikeji_mall' 
    ORDER BY 
      TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX
  `
  
  const result = executeDatabaseQuery(sql)
  if (!result) return []
  
  const lines = result.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  const headers = lines[0].split('\t')
  const data = lines.slice(1).map(line => {
    const values = line.split('\t')
    const row = {}
    headers.forEach((header, index) => {
      row[header] = values[index]
    })
    return row
  })
  
  return data
}

/**
 * 生成表优化建议
 */
function generateTableOptimizationSuggestions(tableStats) {
  const suggestions = []
  
  for (const table of tableStats) {
    const tableSuggestion = {
      tableName: table.tableName,
      suggestions: []
    }
    
    // 检查表大小
    const tableSizeMB = parseFloat(table.totalSizeMB)
    if (tableSizeMB > 1000) {
      tableSuggestion.suggestions.push({
        type: 'large_table',
        message: `表过大(${tableSizeMBMB}MB)，建议考虑分区或归档历史数据`,
        priority: 'high'
      })
    }
    
    // 检查索引比例
    const indexRatio = parseFloat(table.indexLength) / (parseFloat(table.dataLength) + parseFloat(table.indexLength))
    if (indexRatio > 0.5) {
      tableSuggestion.suggestions.push({
        type: 'index_heavy',
        message: `索引比例过高(${(indexRatio * 100).toFixed(1)}%)，建议优化索引结构`,
        priority: 'medium'
      })
    }
    
    // 检查行数
    const rowCount = parseInt(table.tableRows)
    if (rowCount > 1000000) {
      tableSuggestion.suggestions.push({
        type: 'many_rows',
        message: `表行数过多(${rowCount.toLocaleString()})，建议考虑分表或分区`,
        priority: 'medium'
      })
    }
    
    if (tableSuggestion.suggestions.length > 0) {
      suggestions.push(tableSuggestion)
    }
  }
  
  return suggestions
}

/**
 * 生成慢查询优化建议
 */
function generateSlowQueryOptimizations(slowQueries) {
  const optimizations = []
  
  for (const query of slowQueries) {
    const queryTime = parseFloat(query.queryTime)
    const rowsExamined = parseInt(query.rowsExamined)
    const rowsSent = parseInt(query.rowsSent)
    
    const optimization = {
      sql: query.sqlText,
      queryTime: queryTime,
      suggestions: []
    }
    
    // 检查全表扫描
    if (rowsExamined > rowsSent * 10) {
      optimization.suggestions.push({
        type: 'full_table_scan',
        message: `可能存在全表扫描，检查了${rowsExamined}行但只返回${rowsSent}行`,
        solution: '添加适当的索引或优化查询条件'
      })
    }
    
    // 检查查询时间
    if (queryTime > config.slowQueryThreshold) {
      optimization.suggestions.push({
        type: 'slow_query',
        message: `查询时间过长(${queryTime}ms)`,
        solution: '优化查询语句或添加索引'
      })
    }
    
    // 检查SELECT *
    if (query.sqlText.includes('SELECT *')) {
      optimization.suggestions.push({
        type: 'select_all',
        message: '使用了SELECT *',
        solution: '只查询需要的字段'
      })
    }
    
    // 检查ORDER BY
    if (query.sqlText.includes('ORDER BY') && !query.sqlText.includes('LIMIT')) {
      optimization.suggestions.push({
        type: 'order_without_limit',
        message: 'ORDER BY没有LIMIT',
        solution: '添加LIMIT限制结果数量'
      })
    }
    
    if (optimization.suggestions.length > 0) {
      optimizations.push(optimization)
    }
  }
  
  return optimizations
}

/**
 * 生成索引优化建议
 */
function generateIndexOptimizations(indexUsage) {
  const optimizations = []
  const tableIndexes = {}
  
  // 按表分组索引
  for (const index of indexUsage) {
    if (!tableIndexes[index.tableName]) {
      tableIndexes[index.tableName] = []
    }
    tableIndexes[index.tableName].push(index)
  }
  
  // 分析每个表的索引
  for (const tableName in tableIndexes) {
    const indexes = tableIndexes[tableName]
    const tableOptimization = {
      tableName,
      suggestions: []
    }
    
    // 检查重复索引
    const indexGroups = {}
    for (const index of indexes) {
      const key = index.columnName
      if (!indexGroups[key]) {
        indexGroups[key] = []
      }
      indexGroups[key].push(index)
    }
    
    for (const columnName in indexGroups) {
      const columnIndexes = indexGroups[columnName]
      if (columnIndexes.length > 1) {
        tableOptimization.suggestions.push({
          type: 'duplicate_index',
          message: `列${columnName}存在${columnIndexes.length}个重复索引`,
          solution: '删除重复索引，保留最优的一个'
        })
      }
    }
    
    // 检查低选择性索引
    for (const index of indexes) {
      const cardinality = parseInt(index.cardinality)
      if (cardinality < 10 && index.indexType === 'BTREE') {
        tableOptimization.suggestions.push({
          type: 'low_selectivity',
          message: `索引${index.indexName}选择性过低(基数:${cardinality})`,
          solution: '考虑删除此索引或与其他字段组成复合索引'
        })
      }
    }
    
    if (tableOptimization.suggestions.length > 0) {
      optimizations.push(tableOptimization)
    }
  }
  
  return optimizations
}

/**
 * 生成性能报告
 */
function generatePerformanceReport(tableStats, slowQueries, indexUsage) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTables: tableStats.length,
      totalSizeMB: tableStats.reduce((sum, table) => sum + parseFloat(table.totalSizeMB), 0),
      slowQueriesCount: slowQueries.length,
      avgQueryTime: slowQueries.length > 0 
        ? slowQueries.reduce((sum, query) => sum + parseFloat(query.queryTime), 0) / slowQueries.length 
        : 0
    },
    tableStats,
    slowQueries,
    indexUsage,
    suggestions: {
      tableOptimizations: generateTableOptimizationSuggestions(tableStats),
      slowQueryOptimizations: generateSlowQueryOptimizations(slowQueries),
      indexOptimizations: generateIndexOptimizations(indexUsage)
    }
  }
  
  return report
}

/**
 * 生成HTML报告
 */
function generateHtmlReport(report) {
  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>数据库性能报告</title>
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
        h2 {
            color: #409eff;
            border-bottom: 2px solid #409eff;
            padding-bottom: 10px;
            margin-top: 30px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .summary-value {
            font-size: 2em;
            font-weight: bold;
            color: #409eff;
        }
        .summary-label {
            margin-top: 5px;
            color: #666;
        }
        .chart-container {
            position: relative;
            height: 400px;
            margin-bottom: 30px;
        }
        .table-container {
            overflow-x: auto;
            margin-bottom: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .suggestion {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .suggestion.high {
            background-color: #f8d7da;
            border-color: #f5c6cb;
        }
        .suggestion.medium {
            background-color: #fff3cd;
            border-color: #ffeaa7;
        }
        .suggestion-title {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .timestamp {
            text-align: center;
            color: #666;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>数据库性能报告</h1>
        <div class="timestamp">生成时间: ${new Date(report.timestamp).toLocaleString()}</div>
        
        <h2>性能概览</h2>
        <div class="summary-grid">
            <div class="summary-card">
                <div class="summary-value">${report.summary.totalTables}</div>
                <div class="summary-label">数据库表数量</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">${report.summary.totalSizeMB.toFixed(2)}</div>
                <div class="summary-label">总数据量(MB)</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">${report.summary.slowQueriesCount}</div>
                <div class="summary-label">慢查询数量</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">${report.summary.avgQueryTime.toFixed(2)}</div>
                <div class="summary-label">平均查询时间(ms)</div>
            </div>
        </div>
        
        <h2>表大小分布</h2>
        <div class="chart-container">
            <canvas id="tableSizeChart"></canvas>
        </div>
        
        <h2>表统计信息</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>表名</th>
                        <th>行数</th>
                        <th>数据大小(MB)</th>
                        <th>索引大小(MB)</th>
                        <th>总大小(MB)</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.tableStats.map(table => `
                    <tr>
                        <td>${table.tableName}</td>
                        <td>${parseInt(table.tableRows).toLocaleString()}</td>
                        <td>${(parseFloat(table.dataLength) / 1024 / 1024).toFixed(2)}</td>
                        <td>${(parseFloat(table.indexLength) / 1024 / 1024).toFixed(2)}</td>
                        <td>${table.totalSizeMB}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <h2>慢查询分析</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>查询时间</th>
                        <th>执行时间(ms)</th>
                        <th>检查行数</th>
                        <th>返回行数</th>
                        <th>SQL语句</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.slowQueries.map(query => `
                    <tr>
                        <td>${query.startTime}</td>
                        <td>${query.queryTime}</td>
                        <td>${query.rowsExamined}</td>
                        <td>${query.rowsSent}</td>
                        <td><code>${query.sqlText.substring(0, 100)}${query.sqlText.length > 100 ? '...' : ''}</code></td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <h2>优化建议</h2>
        
        <h3>表优化建议</h3>
        ${report.suggestions.tableOptimizations.map(table => `
        <div class="suggestion ${table.suggestions.some(s => s.priority === 'high') ? 'high' : 'medium'}">
            <div class="suggestion-title">表: ${table.tableName}</div>
            ${table.suggestions.map(suggestion => `
            <div>${suggestion.message}</div>
            <div><strong>解决方案:</strong> ${suggestion.solution}</div>
            `).join('')}
        </div>
        `).join('')}
        
        <h3>慢查询优化建议</h3>
        ${report.suggestions.slowQueryOptimizations.map(query => `
        <div class="suggestion ${query.suggestions.some(s => s.type === 'slow_query') ? 'high' : 'medium'}">
            <div class="suggestion-title">查询时间: ${query.queryTime}ms</div>
            <div><code>${query.sql}</code></div>
            ${query.suggestions.map(suggestion => `
            <div>${suggestion.message}</div>
            <div><strong>解决方案:</strong> ${suggestion.solution}</div>
            `).join('')}
        </div>
        `).join('')}
        
        <h3>索引优化建议</h3>
        ${report.suggestions.indexOptimizations.map(table => `
        <div class="suggestion medium">
            <div class="suggestion-title">表: ${table.tableName}</div>
            ${table.suggestions.map(suggestion => `
            <div>${suggestion.message}</div>
            <div><strong>解决方案:</strong> ${suggestion.solution}</div>
            `).join('')}
        </div>
        `).join('')}
    </div>
    
    <script>
        // 表大小分布图表
        const tableSizeCtx = document.getElementById('tableSizeChart').getContext('2d');
        const tableSizeChart = new Chart(tableSizeCtx, {
            type: 'pie',
            data: {
                labels: ${JSON.stringify(report.tableStats.map(table => table.tableName))},
                datasets: [{
                    data: ${JSON.stringify(report.tableStats.map(table => parseFloat(table.totalSizeMB)))},
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#FF6384',
                        '#C9CBCF',
                        '#4BC0C0',
                        '#FF6384'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.raw + ' MB';
                            }
                        }
                    }
                }
            }
        });
    </script>
</body>
</html>
`
  
  return html
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始数据库性能分析...')
  
  // 确保目录存在
  ensureDirectoryExists(config.reportDir)
  
  // 获取数据
  const tableStats = getTableStats()
  const slowQueries = getSlowQueries()
  const indexUsage = analyzeIndexUsage()
  
  // 生成报告
  const report = generatePerformanceReport(tableStats, slowQueries, indexUsage)
  
  // 保存JSON报告
  const jsonReportPath = path.join(config.reportDir, 'database-performance-report.json')
  try {
    fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2), 'utf8')
    console.log(`✅ 生成JSON报告: ${jsonReportPath}`)
  } catch (error) {
    console.error(`❌ 生成JSON报告失败:`, error.message)
  }
  
  // 生成HTML报告
  const htmlReport = generateHtmlReport(report)
  const htmlReportPath = path.join(config.reportDir, 'database-performance-report.html')
  try {
    fs.writeFileSync(htmlReportPath, htmlReport, 'utf8')
    console.log(`✅ 生成HTML报告: ${htmlReportPath}`)
  } catch (error) {
    console.error(`❌ 生成HTML报告失败:`, error.message)
  }
  
  console.log('\n📊 数据库性能分析结果:')
  console.log(`   数据库表数量: ${report.summary.totalTables}`)
  console.log(`   总数据量: ${report.summary.totalSizeMB.toFixed(2)} MB`)
  console.log(`   慢查询数量: ${report.summary.slowQueriesCount}`)
  console.log(`   平均查询时间: ${report.summary.avgQueryTime.toFixed(2)} ms`)
  
  console.log('\n📄 查看详细报告:')
  console.log(`   HTML报告: ${htmlReportPath}`)
  console.log(`   JSON报告: ${jsonReportPath}`)
  
  console.log('\n✅ 数据库性能分析完成！')
}

// 运行主函数
if (require.main === module) {
  main()
}

module.exports = {
  main,
  getTableStats,
  getSlowQueries,
  analyzeIndexUsage,
  generatePerformanceReport,
}