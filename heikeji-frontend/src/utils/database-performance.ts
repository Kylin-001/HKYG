/**
 * 数据库性能分析工具
 * 用于分析数据库性能瓶颈和优化建议
 */

import { createCacheService } from './cache-service'

// 查询分析结果
interface QueryAnalysis {
  query: string
  executionTime: number
  rowsAffected: number
  indexUsed: string[]
  tableScanned: number
  explainPlan: any
  recommendations: string[]
}

// 表结构分析结果
interface TableAnalysis {
  tableName: string
  rowCount: number
  indexCount: number
  indexUsage: Array<{
    indexName: string
    cardinality: number
    usageCount: number
    efficiency: number
  }>
  missingIndexes: string[]
  duplicateIndexes: string[]
  unusedIndexes: string[]
  recommendations: string[]
}

// 索引优化建议
interface IndexRecommendation {
  tableName: string
  indexName: string
  actionType: 'new' | 'modify' | 'drop'
  columns: string[]
  indexType: 'BTREE' | 'HASH' | 'FULLTEXT'
  unique: boolean
  description: string
  estimatedImprovement: string
}

// 数据库性能分析器
class DatabasePerformanceAnalyzer {
  private cacheService = createCacheService({
    adapter: 'memory',
    ttl: 300, // 5分钟缓存
  })

  // 分析查询性能
  async analyzeQuery(
    query: string,
    executionTime: number,
    rowsAffected: number
  ): Promise<QueryAnalysis> {
    // 检查缓存
    const cacheKey = `query-analysis:${Buffer.from(query).toString('base64')}`
    let analysis = await this.cacheService.get<QueryAnalysis>(cacheKey)

    if (!analysis) {
      // 分析查询
      analysis = await this.performQueryAnalysis(query, executionTime, rowsAffected)

      // 缓存分析结果
      await this.cacheService.set(cacheKey, analysis, { ttl: 300 })
    }

    return analysis
  }

  // 执行查询分析
  private async performQueryAnalysis(
    query: string,
    executionTime: number,
    rowsAffected: number
  ): Promise<QueryAnalysis> {
    const recommendations: string[] = []
    const indexUsed: string[] = []

    // 检查查询是否使用了索引
    const hasIndex = this.checkIndexUsage(query)
    if (hasIndex) {
      indexUsed.push(...hasIndex)
    } else {
      recommendations.push('查询未使用索引，可能导致全表扫描')
    }

    // 检查查询性能
    if (executionTime > 1000) {
      recommendations.push('查询执行时间过长，建议优化查询或添加索引')
    }

    // 检查影响行数
    if (rowsAffected > 1000) {
      recommendations.push('影响行数过多，建议分页处理')
    }

    // 检查查询复杂度
    const complexity = this.analyzeQueryComplexity(query)
    if (complexity > 3) {
      recommendations.push('查询过于复杂，建议拆分为多个简单查询')
    }

    return {
      query,
      executionTime,
      rowsAffected,
      indexUsed,
      tableScanned: 0, // 需要从EXPLAIN获取
      explainPlan: null, // 需要从EXPLAIN获取
      recommendations,
    }
  }

  // 检查索引使用
  private checkIndexUsage(query: string): string[] {
    const indexPattern = /\b(idx_|index_|key_|unique_|fulltext_)\w+/gi
    const matches = query.match(indexPattern)

    if (matches) {
      return matches.map(match => match.replace(/[\'\"]/g, ''))
    }

    return []
  }

  // 分析查询复杂度
  private analyzeQueryComplexity(query: string): number {
    // 简单的复杂度计算
    const joinCount = (query.match(/\bJOIN\b/gi) || []).length
    const whereCount = (query.match(/\bWHERE\b/gi) || []).length
    const subqueryCount = (query.match(/\bSELECT\b.*\bFROM\b.*\bSELECT\b/gi) || []).length - 1

    return joinCount + whereCount + subqueryCount
  }

  // 分析表结构
  async analyzeTable(tableName: string): Promise<TableAnalysis> {
    // 检查缓存
    const cacheKey = `table-analysis:${tableName}`
    let analysis = await this.cacheService.get<TableAnalysis>(cacheKey)

    if (!analysis) {
      // 分析表结构
      analysis = await this.performTableAnalysis(tableName)

      // 缓存分析结果
      await this.cacheService.set(cacheKey, analysis, { ttl: 600 }) // 10分钟缓存
    }

    return analysis
  }

  // 执行表结构分析
  private async performTableAnalysis(tableName: string): Promise<TableAnalysis> {
    // 这里应该查询数据库获取表结构和索引信息
    // 由于是前端项目，我们模拟分析结果
    const mockAnalysis = this.generateMockTableAnalysis(tableName)

    return mockAnalysis
  }

  // 生成模拟表分析
  private generateMockTableAnalysis(tableName: string): TableAnalysis {
    const rowCount = Math.floor(Math.random() * 10000) + 1000
    const indexCount = Math.floor(Math.random() * 10) + 5

    const indexUsage = Array.from({ length: indexCount }, (_, i) => ({
      indexName: `idx_${i + 1}`,
      cardinality: Math.floor(Math.random() * 1000) + 100,
      usageCount: Math.floor(Math.random() * 100) + 10,
      efficiency: Math.random() * 0.5 + 0.5,
    }))

    const missingIndexes = ['user_id', 'product_id', 'order_id'].slice(
      0,
      Math.floor(Math.random() * 3)
    )
    const duplicateIndexes = ['idx_status', 'idx_create_time'].slice(
      0,
      Math.floor(Math.random() * 2)
    )
    const unusedIndexes = ['idx_unused', 'idx_old'].slice(0, Math.floor(Math.random() * 2))

    const recommendations = this.generateTableRecommendations(tableName, {
      rowCount,
      indexCount,
      indexUsage,
      missingIndexes,
      duplicateIndexes,
      unusedIndexes,
    })

    return {
      tableName,
      rowCount,
      indexCount,
      indexUsage,
      missingIndexes,
      duplicateIndexes,
      unusedIndexes,
      recommendations,
    }
  }

  // 生成表优化建议
  private generateTableRecommendations(tableName: string, stats: any): string[] {
    const recommendations: string[] = []

    // 检查缺失索引
    if (stats.missingIndexes && stats.missingIndexes.length > 0) {
      recommendations.push(`表 ${tableName} 缺少索引: ${stats.missingIndexes.join(', ')}`)
    }

    // 检查重复索引
    if (stats.duplicateIndexes && stats.duplicateIndexes.length > 0) {
      recommendations.push(`表 ${tableName} 存在重复索引: ${stats.duplicateIndexes.join(', ')}`)
    }

    // 检查未使用索引
    if (stats.unusedIndexes && stats.unusedIndexes.length > 0) {
      recommendations.push(`表 ${tableName} 存在未使用索引: ${stats.unusedIndexes.join(', ')}`)
    }

    // 检查索引使用效率
    const lowEfficiencyIndexes = stats.indexUsage.filter((index: any) => index.efficiency < 0.1)

    if (lowEfficiencyIndexes.length > 0) {
      recommendations.push(
        `表 ${tableName} 存在低效索引: ${lowEfficiencyIndexes.map((i: any) => i.indexName).join(', ')}`
      )
    }

    // 检查行数过多
    if (stats.rowCount > 100000) {
      recommendations.push(`表 ${tableName} 行数过多(${stats.rowCount})，建议考虑分表或归档`)
    }

    return recommendations
  }

  // 生成索引优化建议
  generateIndexRecommendations(tableName: string): IndexRecommendation[] {
    const recommendations: IndexRecommendation[] = []

    // 基于表名生成常见索引建议
    if (tableName.includes('user')) {
      recommendations.push({
        tableName,
        indexName: 'idx_user_email',
        actionType: 'new',
        indexType: 'BTREE',
        columns: ['email'],
        unique: true,
        description: '用户邮箱唯一索引',
        estimatedImprovement: '邮箱登录查询性能提升50%',
      })

      recommendations.push({
        tableName,
        indexName: 'idx_user_phone',
        actionType: 'new',
        indexType: 'BTREE',
        columns: ['phone'],
        unique: true,
        description: '用户手机号唯一索引',
        estimatedImprovement: '手机号登录查询性能提升50%',
      })

      recommendations.push({
        tableName,
        indexName: 'idx_user_status',
        actionType: 'new',
        indexType: 'BTREE',
        columns: ['status'],
        unique: false,
        description: '用户状态索引',
        estimatedImprovement: '状态筛选查询性能提升30%',
      })
    }

    if (tableName.includes('product')) {
      recommendations.push({
        tableName,
        indexName: 'idx_product_status',
        actionType: 'new',
        indexType: 'BTREE',
        columns: ['status'],
        unique: false,
        description: '商品状态索引',
        estimatedImprovement: '状态筛选查询性能提升40%',
      })

      recommendations.push({
        tableName,
        indexName: 'idx_product_sales',
        actionType: 'new',
        indexType: 'BTREE',
        columns: ['sales'],
        unique: false,
        description: '商品销量索引，用于热门商品排序',
        estimatedImprovement: '热门商品查询性能提升60%',
      })

      recommendations.push({
        tableName,
        indexName: 'idx_product_price',
        actionType: 'new',
        indexType: 'BTREE',
        columns: ['price'],
        unique: false,
        description: '商品价格索引，用于价格排序',
        estimatedImprovement: '价格排序查询性能提升30%',
      })

      recommendations.push({
        tableName,
        indexName: 'idx_merchant_category',
        actionType: 'new',
        indexType: 'BTREE',
        columns: ['merchant_id', 'category_id'],
        unique: false,
        description: '商家分类复合索引',
        estimatedImprovement: '分类查询性能提升50%',
      })

      recommendations.push({
        tableName,
        indexName: 'idx_product_fulltext',
        actionType: 'new',
        indexType: 'FULLTEXT',
        columns: ['name', 'description', 'keywords'],
        unique: false,
        description: '商品全文搜索索引，提升搜索性能',
        estimatedImprovement: '搜索性能提升80%',
      })
    }

    if (tableName.includes('order')) {
      recommendations.push({
        tableName,
        indexName: 'idx_order_user',
        actionType: 'new',
        indexType: 'BTREE',
        columns: ['user_id'],
        unique: false,
        description: '用户ID索引',
        estimatedImprovement: '用户订单查询性能提升50%',
      })

      recommendations.push({
        tableName,
        indexName: 'idx_order_status',
        actionType: 'new',
        indexType: 'BTREE',
        columns: ['status'],
        unique: false,
        description: '订单状态索引',
        estimatedImprovement: '状态筛选查询性能提升30%',
      })

      recommendations.push({
        tableName,
        indexName: 'idx_order_create_time',
        actionType: 'new',
        indexType: 'BTREE',
        columns: ['create_time'],
        unique: false,
        description: '订单创建时间索引',
        estimatedImprovement: '时间范围查询性能提升40%',
      })

      recommendations.push({
        tableName,
        indexName: 'idx_order_user_status',
        actionType: 'new',
        indexType: 'BTREE',
        columns: ['user_id', 'status'],
        unique: false,
        description: '用户-状态复合索引',
        estimatedImprovement: '用户状态查询性能提升60%',
      })
    }

    return recommendations
  }
}

// 数据库优化建议生成器
export class DatabaseOptimizationGenerator {
  // 生成索引优化SQL
  static generateIndexOptimizationSQL(recommendations: IndexRecommendation[]): string {
    const sqlStatements = recommendations.map(rec => {
      if (rec.actionType === 'drop') {
        return `DROP INDEX ${rec.indexName}; -- ${rec.description}`
      }

      if (rec.actionType === 'modify') {
        return `ALTER TABLE ${rec.tableName} DROP INDEX ${rec.indexName};`
      }

      let sql = `ALTER TABLE ${rec.tableName} ADD INDEX ${rec.indexName} (${rec.columns.join(', ')})`

      if (rec.unique) {
        sql += ' UNIQUE'
      }

      sql += ` USING ${rec.indexType}`
      sql += ` COMMENT '${rec.description}';`

      return sql
    })

    return sqlStatements.join(';\n')
  }

  // 生成表优化报告
  static generateOptimizationReport(analyses: TableAnalysis[]): string {
    const timestamp = new Date().toISOString()

    const summary = {
      totalTables: analyses.length,
      totalIndexes: analyses.reduce((sum, analysis) => sum + analysis.indexCount, 0),
      totalMissingIndexes: analyses.reduce(
        (sum, analysis) => sum + analysis.missingIndexes.length,
        0
      ),
      totalDuplicateIndexes: analyses.reduce(
        (sum, analysis) => sum + analysis.duplicateIndexes.length,
        0
      ),
      totalUnusedIndexes: analyses.reduce(
        (sum, analysis) => sum + analysis.unusedIndexes.length,
        0
      ),
    }

    const tableSections = analyses
      .map(analysis => {
        const indexUsageStr = analysis.indexUsage
          .map(index => `${index.indexName} (效率: ${(index.efficiency * 100).toFixed(1)}%)`)
          .join('\n')

        return `
### ${analysis.tableName}
- **行数**: ${analysis.rowCount}
- **索引数**: ${analysis.indexCount}
- **缺失索引**: ${analysis.missingIndexes.join(', ') || '无'}
- **重复索引**: ${analysis.duplicateIndexes.join(', ') || '无'}
- **未使用索引**: ${analysis.unusedIndexes.join(', ') || '无'}

#### 索引使用情况
${indexUsageStr}

#### 优化建议
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}
`
      })
      .join('\n')

    return `
# 数据库优化报告

## 基本信息
- 生成时间: ${new Date(timestamp).toLocaleString()}
- 分析表数: ${summary.totalTables}
- 总索引数: ${summary.totalIndexes}
- 缺失索引数: ${summary.totalMissingIndexes}
- 重复索引数: ${summary.totalDuplicateIndexes}
- 未使用索引数: ${summary.totalUnusedIndexes}

## 详细分析
${tableSections}

## 优化建议
1. 定期执行 \`ANALYZE TABLE\` 更新表统计信息
2. 根据查询模式优化索引
3. 删除未使用的索引
4. 定期监控慢查询日志
5. 考虑使用分区表处理大数据量
6. 优化查询语句，避免全表扫描
7. 使用适当的存储引擎（InnoDB）
8. 调整数据库配置参数

## 生成时间
${timestamp}
    `
  }
}

// 数据库性能监控器
class DatabasePerformanceMonitor {
  private slowQueries: any[] = []
  private queryStats: any[] = []
  private alertThresholds = {
    slowQueryThreshold: 1000, // 慢查询阈值（毫秒）
    lowHitRateThreshold: 0.7, // 低命中率阈值
    highMemoryUsageThreshold: 0.9, // 高内存使用阈值
  }

  // 记录慢查询
  recordSlowQuery(query: string, executionTime: number, rowsAffected: number): void {
    this.slowQueries.push({
      query,
      executionTime,
      rowsAffected,
      timestamp: Date.now(),
    })

    // 保持最近100条慢查询
    if (this.slowQueries.length > 100) {
      this.slowQueries.shift()
    }

    // 检查是否需要告警
    if (executionTime > this.alertThresholds.slowQueryThreshold) {
      this.sendAlert('slow_query', {
        query,
        executionTime,
        threshold: this.alertThresholds.slowQueryThreshold,
      })
    }
  }

  // 记录查询统计
  recordQueryStat(query: string, executionTime: number, hitCache: boolean): void {
    this.queryStats.push({
      query,
      executionTime,
      hitCache,
      timestamp: Date.now(),
    })

    // 计算平均执行时间
    const recentStats = this.queryStats.slice(-100)
    const avgExecutionTime =
      recentStats.reduce((sum, stat) => sum + stat.executionTime, 0) / recentStats.length
    const cacheHitRate = recentStats.filter(stat => stat.hitCache).length / recentStats.length

    // 检查是否需要告警
    if (cacheHitRate < this.alertThresholds.lowHitRateThreshold) {
      this.sendAlert('low_cache_hit_rate', {
        rate: cacheHitRate,
        threshold: this.alertThresholds.lowHitRateThreshold,
      })
    }
  }

  // 发送告警
  private sendAlert(type: string, data: any): void {
    console.warn(`数据库性能告警: ${type}`, data)

    // 这里可以集成告警系统
    // alertSystem.send({
    //   type,
    //   data,
    //   timestamp: Date.now(),
    // })
  }

  // 获取慢查询
  getSlowQueries(limit: number = 10): any[] {
    return this.slowQueries.slice(-limit)
  }

  // 获取查询统计
  getQueryStats(limit: number = 100): any[] {
    return this.queryStats.slice(-limit)
  }

  // 清除历史记录
  clearHistory(): void {
    this.slowQueries = []
    this.queryStats = []
  }
}

// 创建全局实例
export const databasePerformanceAnalyzer = new DatabasePerformanceAnalyzer()
export const databaseOptimizationGenerator = new DatabaseOptimizationGenerator()
export const databasePerformanceMonitor = new DatabasePerformanceMonitor()

export default databasePerformanceAnalyzer
