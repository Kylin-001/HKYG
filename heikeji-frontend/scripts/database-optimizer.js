#!/usr/bin/env node

/**
 * 数据库优化脚本
 * 用于自动分析和优化数据库性能
 */

const fs = require('fs')
const path = require('path')
const { databasePerformanceAnalyzer, databaseOptimizationGenerator } = require('./database-performance')

// 配置
const config = {
  // 分析的表
  tables: [
    'user',
    'admin_user',
    'product',
    'category',
    'order',
    'order_item',
    'payment',
    'cart',
    'delivery',
    'locker',
    'address',
    'merchant',
  ],
  
  // 输出目录
  outputDir: path.join(__dirname, '../database-reports'),
  
  // 索引优化配置
  indexOptimization: {
    // 是否自动应用优化建议
    autoApply: process.env.AUTO_APPLY_OPTIMIZATIONS === 'true',
    
    // 是否生成SQL文件
    generateSQL: process.env.GENERATE_SQL === 'true',
    
    // 是否执行SQL
    executeSQL: process.env.EXECUTE_SQL === 'true',
    
    // 数据库连接配置
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '3306',
    dbUser: process.env.DB_USER || 'root',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'heikeji_mall',
  },
}

// 确保输出目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// 分析表性能
async function analyzeTables() {
  console.log('开始分析数据库表性能...')
  
  const analyses = []
  
  for (const tableName of config.tables) {
    console.log(`分析表: ${tableName}`)
    
    try {
      const analysis = await databasePerformanceAnalyzer.analyzeTable(tableName)
      analyses.push(analysis)
      
      console.log(`  - 行数: ${analysis.rowCount}`)
      console.log(`  - 索引数: ${analysis.indexCount}`)
      console.log(`  - 缺失索引: ${analysis.missingIndexes.length}`)
      console.log(`  - 重复索引: ${analysis.duplicateIndexes.length}`)
      console.log(`  - 未使用索引: ${analysis.unusedIndexes.length}`)
    } catch (error) {
      console.error(`分析表 ${tableName} 失败:`, error)
    }
  }
  
  return analyses
}

// 生成索引优化建议
async function generateIndexRecommendations(analyses) {
  console.log('生成索引优化建议...')
  
  const allRecommendations = []
  
  for (const analysis of analyses) {
    const recommendations = databasePerformanceAnalyzer.generateIndexRecommendations(analysis.tableName)
    allRecommendations.push(...recommendations)
  }
  
  // 按优先级排序
  allRecommendations.sort((a, b) => {
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
  
  return allRecommendations
}

// 生成优化SQL
function generateOptimizationSQL(recommendations) {
  console.log('生成优化SQL...')
  
  const sqlStatements = databaseOptimizationGenerator.generateIndexOptimizationSQL(recommendations)
  
  // 按类型分组
  const groupedRecommendations = {
    new: recommendations.filter(rec => rec.indexType === 'new'),
    modify: recommendations.filter(rec => rec.indexType === 'modify'),
    drop: recommendations.filter(rec => rec.indexType === 'drop'),
  }
  
  let sql = '-- 数据库索引优化SQL\n'
  sql += '-- 生成时间: ' + new Date().toISOString() + '\n\n'
  
  // 新建索引
  if (groupedRecommendations.new.length > 0) {
    sql += '-- 新建索引\n'
    sql += groupedRecommendations.new.map(rec => 
      `ALTER TABLE ${rec.tableName} ADD INDEX ${rec.indexName} (${rec.columns.join(', ')}) USING ${rec.indexType} COMMENT '${rec.description}';`
    ).join('\n')
    sql += '\n'
  }
  
  // 修改索引
  if (groupedRecommendations.modify.length > 0) {
    sql += '-- 修改索引\n'
    sql += groupedRecommendations.modify.map(rec => 
      `ALTER TABLE ${rec.tableName} DROP INDEX ${rec.indexName};`
    ).join('\n')
    sql += '\n'
  }
  
  // 删除索引
  if (groupedRecommendations.drop.length > 0) {
    sql += '-- 删除索引\n'
    sql += groupedRecommendations.drop.map(rec => 
      `DROP INDEX ${rec.indexName}; -- ${rec.description}`
    ).join('\n')
    sql += '\n'
  }
  
  return sql
}

// 执行SQL
async function executeSQL(sql) {
  if (!config.indexOptimization.executeSQL) {
    console.log('SQL执行已禁用')
    return
  }
  
  console.log('执行优化SQL...')
  
  try {
    // 这里应该连接数据库执行SQL
    // 由于是前端项目，我们模拟执行结果
    console.log('模拟执行SQL:')
    console.log(sql)
    
    // 模拟执行结果
    const results = [
      { table: 'user', statement: 'ADD INDEX idx_user_email', status: 'success' },
      { table: 'product', statement: 'ADD INDEX idx_product_status', status: 'success' },
      { table: 'order', statement: 'ADD INDEX idx_order_create_time', status: 'success' },
    ]
    
    results.forEach(result => {
      console.log(`  ${result.table}: ${result.statement} - ${result.status}`)
    })
    
    return results
  } catch (error) {
    console.error('执行SQL失败:', error)
    return []
  }
}

// 生成优化报告
async function generateReport(analyses, recommendations, sqlResults) {
  console.log('生成优化报告...')
  
  const report = databaseOptimizationGenerator.generateOptimizationReport(analyses)
  
  // 保存报告
  ensureDir(config.outputDir)
  
  const reportPath = path.join(config.outputDir, `optimization-report-${new Date().toISOString().split('T')[0]}.md`)
  fs.writeFileSync(reportPath, report)
  
  // 保存SQL文件
  if (config.indexOptimization.generateSQL) {
    const sqlPath = path.join(config.outputDir, `optimization-${new Date().toISOString().split('T')[0]}.sql`)
    fs.writeFileSync(sqlPath, sql)
  }
  
  console.log(`优化报告已生成: ${reportPath}`)
  
  return reportPath
}

// 主函数
async function main() {
  console.log('开始数据库性能优化分析...')
  
  try {
    // 分析表性能
    const analyses = await analyzeTables()
    
    // 生成优化建议
    const recommendations = await generateIndexRecommendations(analyses)
    
    // 生成优化SQL
    const sql = generateOptimizationSQL(recommendations)
    
    // 执行SQL（如果启用）
    const sqlResults = await executeSQL(sql)
    
    // 生成报告
    const reportPath = await generateReport(analyses, recommendations, sqlResults)
    
    console.log('数据库性能优化完成!')
    console.log(`报告路径: ${reportPath}`)
    
    // 如果有高优先级建议，退出码为1
    const highPriorityCount = recommendations.filter(rec => rec.priority === 'high').length
    if (highPriorityCount > 0 && !config.indexOptimization.autoApply) {
      console.log(`发现 ${highPriorityCount} 个高优先级优化建议`)
      process.exit(1)
    }
    
  } catch (error) {
    console.error('数据库性能优化失败:', error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main().catch(error => {
    console.error('脚本执行失败:', error)
    process.exit(1)
  })
}

module.exports = {
  analyzeTables,
  generateIndexRecommendations,
  generateOptimizationSQL,
  executeSQL,
  generateReport,
}