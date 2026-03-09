import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { databasePerformanceAnalyzer, databasePerformanceMonitor, DatabaseOptimizationGenerator } from '@/utils/database-performance'

// 模拟数据库查询结果
const mockQueryResults = {
  // 慢查询
  'SELECT * FROM user WHERE status = 1': {
    executionTime: 1500,
    rowsAffected: 100,
    indexUsed: ['idx_status'],
    tableScanned: 5000,
    explainPlan: {
      id: 1,
      select_type: 'SIMPLE',
      table: 'user',
      possible_keys: ['idx_status'],
      key_len: 15,
      rows: 100,
      filtered: 100,
      Extra: {
        Using where: ((status = 1) and (create_time > '2023-01-01'))
      },
    },
    recommendations: [
      '查询使用了索引，但执行时间过长',
      '考虑添加复合索引',
    ],
  },
  
  // 全表扫描
  'SELECT * FROM product WHERE description LIKE "%手机%"': {
    executionTime: 2500,
    rowsAffected: 5000,
    indexUsed: [],
    tableScanned: 50000,
    explainPlan: {
      id: 1,
      select_type: 'ALL',
      table: 'product',
      rows: 5000,
      filtered: 5000,
      Extra: {
        Using where: ((description LIKE '%手机%'))
      },
    },
    recommendations: [
      '查询未使用索引，导致全表扫描',
      '建议添加全文索引',
      '考虑使用更精确的匹配条件',
    ],
  },
  
  // 复杂查询
  'SELECT * FROM order o JOIN order_item oi ON o.id = oi.order_id JOIN user u ON o.user_id = u.id WHERE o.status = 1 AND o.create_time > "2023-01-01"': {
    executionTime: 800,
    rowsAffected: 50,
    indexUsed: ['idx_order_user_status', 'idx_create_time'],
    tableScanned: 200,
    explainPlan: {
      id: 1,
      select_type: 'SIMPLE',
      table: 'order',
      possible_keys: ['idx_order_user_status', 'idx_create_time'],
      key_len: 30,
      rows: 50,
      filtered: 50,
    },
    recommendations: [
      '查询使用了合适的索引',
      '查询效率良好',
    ],
  },
}

// 模拟表结构分析结果
const mockTableAnalyses = {
  user: {
    tableName: 'user',
    rowCount: 10000,
    indexCount: 5,
    indexUsage: [
      {
        indexName: 'idx_user_id',
        cardinality: 10000,
        usageCount: 8000,
        efficiency: 0.8,
      },
      {
        indexName: 'idx_user_email',
        cardinality: 9500,
        usageCount: 5000,
        efficiency: 0.53,
      },
      {
        indexName: 'idx_user_phone',
        cardinality: 9800,
        usageCount: 7000,
        efficiency: 0.71,
      },
      {
        indexName: 'idx_user_status',
        cardinality: 10000,
        usageCount: 9000,
        efficiency: 0.9,
      },
    ],
    missingIndexes: ['last_login_time', 'avatar'],
    duplicateIndexes: ['idx_status', 'idx_create_time'],
    unusedIndexes: ['idx_old', 'idx_unused'],
    recommendations: [
      '表 user 缺少索引: last_login_time, avatar',
      '表 user 存在重复索引: idx_status, idx_create_time',
      '表 user 存在未使用索引: idx_old, idx_unused',
      '索引 idx_user_phone 效率较低，建议优化',
    ],
  },
  
  product: {
    tableName: 'product',
    rowCount: 50000,
    indexCount: 8,
    indexUsage: [
      {
        indexName: 'idx_product_status',
        cardinality: 50000,
        usageCount: 30000,
        efficiency: 0.6,
      },
      {
        indexName: 'idx_product_sales',
        cardinality: 50000,
        usageCount: 20000,
        efficiency: 0.4,
      },
      {
        indexName: 'idx_product_price',
        cardinality: 50000,
        usageCount: 15000,
        efficiency: 0.3,
      },
      {
        indexName: 'idx_merchant_category',
        cardinality: 1000,
        usageCount: 5000,
        efficiency: 0.5,
      },
      {
        indexName: 'idx_product_fulltext',
        cardinality: 50000,
        usageCount: 1000,
        efficiency: 0.02,
      },
    ],
    missingIndexes: ['category_id', 'brand_id', 'specifications'],
    duplicateIndexes: ['idx_status', 'idx_create_time'],
    unusedIndexes: ['idx_unused', 'idx_old'],
    recommendations: [
      '表 product 缺少索引: category_id, brand_id, specifications',
      '表 product 存在重复索引: idx_status, idx_create_time',
      '表 product 存在未使用索引: idx_unused, idx_old',
      '全文索引 idx_product_fulltext 效率极低，建议优化',
      '索引 idx_product_sales 效率较低，建议优化',
    ],
  },
}

describe('Database Performance Analyzer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Query Analysis', () => {
    it('should analyze slow query', async () => {
      const query = 'SELECT * FROM user WHERE status = 1'
      const mockResult = mockQueryResults[query]
      
      // 模拟缓存未命中
      vi.spyOn(databasePerformanceAnalyzer, 'analyzeQuery').mockResolvedValue(mockResult)
      
      const analysis = await databasePerformanceAnalyzer.analyzeQuery(query, 1500, 100)
      
      expect(analysis.query).toBe(query)
      expect(analysis.executionTime).toBe(1500)
      expect(analysis.rowsAffected).toBe(100)
      expect(analysis.indexUsed).toEqual(['idx_status'])
      expect(analysis.tableScanned).toBe(5000)
      expect(analysis.explainPlan).toBeDefined()
      expect(analysis.recommendations).toContain('查询使用了索引，但执行时间过长')
    })
    
    it('should analyze full table scan query', async () => {
      const query = 'SELECT * FROM product WHERE description LIKE "%手机%"'
      const mockResult = mockQueryResults[query]
      
      // 模拟缓存未命中
      vi.spyOn(databasePerformanceAnalyzer, 'analyzeQuery').mockResolvedValue(mockResult)
      
      const analysis = await databasePerformanceAnalyzer.analyzeQuery(query, 2500, 5000)
      
      expect(analysis.query).toBe(query)
      expect(analysis.executionTime).toBe(2500)
      expect(analysis.rowsAffected).toBe(5000)
      expect(analysis.indexUsed).toEqual([])
      expect(analysis.tableScanned).toBe(50000)
      expect(analysis.explainPlan).toBeDefined()
      expect(analysis.recommendations).toContain('查询未使用索引，导致全表扫描')
      expect(analysis.recommendations).toContain('建议添加全文索引')
    })
    
    it('should analyze complex query', async () => {
      const query = 'SELECT * FROM order o JOIN order_item oi ON o.id = oi.order_id JOIN user u ON o.user_id = u.id WHERE o.status = 1 AND o.create_time > "2023-01-01"'
      const mockResult = mockQueryResults[query]
      
      // 模拟缓存命中
      vi.spyOn(databasePerformanceAnalyzer, 'analyzeQuery').mockResolvedValue(mockResult)
      
      const analysis = await databasePerformanceAnalyzer.analyzeQuery(query, 800, 50)
      
      expect(analysis.query).toBe(query)
      expect(analysis.executionTime).toBe(800)
      expect(analysis.rowsAffected).toBe(50)
      expect(analysis.indexUsed).toEqual(['idx_order_user_status', 'idx_create_time'])
      expect(analysis.tableScanned).toBe(200)
      expect(analysis.explainPlan).toBeDefined()
      expect(analysis.recommendations).toContain('查询使用了合适的索引')
    })
    
    it('should handle query analysis errors', async () => {
      // 模拟分析错误
      vi.spyOn(databasePerformanceAnalyzer, 'analyzeQuery').mockRejectedValue(new Error('分析失败'))
      
      const analysis = await databasePerformanceAnalyzer.analyzeQuery('SELECT * FROM user', 100, 10)
      
      expect(analysis).toBeNull()
    })
  })
  
  describe('Table Analysis', () => {
    it('should analyze user table', async () => {
      // 模拟表分析
      vi.spyOn(databasePerformanceAnalyzer, 'analyzeTable').mockResolvedValue(mockTableAnalyses.user)
      
      const analysis = await databasePerformanceAnalyzer.analyzeTable('user')
      
      expect(analysis.tableName).toBe('user')
      expect(analysis.rowCount).toBe(10000)
      expect(analysis.indexCount).toBe(5)
      expect(analysis.missingIndexes).toContain('last_login_time')
      expect(analysis.duplicateIndexes).toContain('idx_status')
      expect(analysis.unusedIndexes).toContain('idx_old')
      expect(analysis.recommendations.length).toBeGreaterThan(0)
    })
    
    it('should analyze product table', async () => {
      // 模拟表分析
      vi.spyOn(databasePerformanceAnalyzer, 'analyzeTable').mockResolvedValue(mockTableAnalyses.product)
      
      const analysis = await databasePerformanceAnalyzer.analyzeTable('product')
      
      expect(analysis.tableName).toBe('product')
      expect(analysis.rowCount).toBe(50000)
      expect(analysis.indexCount).toBe(8)
      expect(analysis.missingIndexes).toContain('category_id')
      expect(analysis.recommendations.length).toBeGreaterThan(0)
    })
    
    it('should handle table analysis errors', async () => {
      // 模拟分析错误
      vi.spyOn(databasePerformanceAnalyzer, 'analyzeTable').mockRejectedValue(new Error('分析失败'))
      
      const analysis = await databasePerformanceAnalyzer.analyzeTable('user')
      
      expect(analysis).toBeNull()
    })
  })
  
  describe('Index Recommendations', () => {
    it('should generate user table recommendations', () => {
      const recommendations = databasePerformanceAnalyzer.generateIndexRecommendations('user')
      
      expect(recommendations).toHaveLength(5)
      
      // 检查推荐类型
      const types = recommendations.map(rec => rec.indexType)
      expect(types).toContain('BTREE')
      
      // 检查唯一索引
      const uniqueIndexes = recommendations.filter(rec => rec.unique)
      expect(uniqueIndexes.length).toBeGreaterThan(0)
      
      // 检查列定义
      const columns = recommendations.flatMap(rec => rec.columns)
      expect(columns).toContain('email')
      expect(columns).toContain('phone')
      expect(columns).toContain('status')
    })
    
    it('should generate product table recommendations', () => {
      const recommendations = databasePerformanceAnalyzer.generateIndexRecommendations('product')
      
      expect(recommendations).toHaveLength(7)
      
      // 检查全文索引
      const fulltextIndexes = recommendations.filter(rec => rec.indexType === 'FULLTEXT')
      expect(fulltextIndexes.length).toBe(1)
      
      // 检查复合索引
      const compositeIndexes = recommendations.filter(rec => rec.columns.length > 1)
      expect(compositeIndexes.length).toBeGreaterThan(0)
      
      // 检查覆盖索引
      const coverageIndexes = recommendations.filter(rec => rec.columns.includes('status'))
      expect(coverageIndexes.length).toBeGreaterThan(0)
    })
  })
  
  describe('Database Optimization Generator', () => {
    it('should generate optimization SQL', () => {
      const recommendations = [
        {
          tableName: 'user',
          indexName: 'idx_user_email',
          indexType: 'new',
          columns: ['email'],
          unique: true,
          description: '用户邮箱唯一索引',
          estimatedImprovement: '邮箱登录查询性能提升50%',
        },
        {
          tableName: 'user',
          indexName: 'idx_user_phone',
          indexType: 'new',
          columns: ['phone'],
          unique: true,
          description: '用户手机号唯一索引',
          estimatedImprovement: '手机号登录查询性能提升50%',
        },
      ]
      
      const sql = databaseOptimizationGenerator.generateOptimizationSQL(recommendations)
      
      expect(sql).toContain('ALTER TABLE user ADD INDEX idx_user_email (email) USING BTREE COMMENT \'用户邮箱唯一索引\'')
      expect(sql).toContain('ALTER TABLE user ADD INDEX idx_user_phone (phone) USING BTREE COMMENT \'用户手机号唯一索引\'')
      expect(sql).toContain('USING BTREE')
    })
    
    it('should generate optimization report', () => {
      const analyses = [mockTableAnalyses.user, mockTableAnalyses.product]
      const recommendations = [
        ...databasePerformanceAnalyzer.generateIndexRecommendations('user'),
        ...databasePerformanceAnalyzer.generateIndexRecommendations('product'),
      ]
      
      const report = databaseOptimizationGenerator.generateOptimizationReport(analyses, recommendations, [])
      
      expect(report).toContain('基本信息')
      expect(report).toContain('详细分析')
      expect(report).toContain('优化建议')
    })
  })
  
  describe('Database Performance Monitor', () => {
    let monitor: any
    
    beforeEach(() => {
      monitor = databasePerformanceMonitor
      monitor.clearHistory()
    })
    
    afterEach(() => {
      monitor = databasePerformanceMonitor
    })
    
    it('should record slow query', () => {
      const query = 'SELECT * FROM user WHERE status = 1'
      const executionTime = 1500
      const rowsAffected = 100
      
      monitor.recordSlowQuery(query, executionTime, rowsAffected)
      
      const slowQueries = monitor.getSlowQueries()
      expect(slowQueries).toHaveLength(1)
      expect(slowQueries[0].query).toBe(query)
      expect(slowQueries[0].executionTime).toBe(executionTime)
      expect(slowQueries[0].rowsAffected).toBe(rowsAffected)
    })
    
    it('should record query statistics', () => {
      const query = 'SELECT * FROM user WHERE id = 1'
      const executionTime = 50
      const hitCache = true
      
      monitor.recordQueryStat(query, executionTime, hitCache)
      
      const stats = monitor.getQueryStats()
      expect(stats).toHaveLength(1)
      expect(stats[0].query).toBe(query)
      expect(stats[0].executionTime).toBe(executionTime)
      expect(stats[0].hitCache).toBe(hitCache)
    })
    
    it('should trigger alert for low cache hit rate', () => {
      const query = 'SELECT * FROM user WHERE id = 1'
      const executionTime = 50
      const hitCache = false
      
      // 记录多次低命中率
      monitor.recordQueryStat(query, executionTime, hitCache)
      monitor.recordQueryStat(query, executionTime, hitCache)
      monitor.recordQueryStat(query, executionTime, hitCache)
      monitor.recordQueryStat(query, executionTime, hitCache)
      
      const stats = monitor.getQueryStats()
      const hitRate = stats.filter(stat => stat.hitCache).length / stats.length
      
      // 低命中率应该触发告警
      expect(monitor.sendAlert).toHaveBeenCalledWith('low_cache_hit_rate', {
        rate: hitRate,
        threshold: 0.7,
      })
    })
    
    it('should trigger alert for slow query', () => {
      const query = 'SELECT * FROM user WHERE status = 1'
      const executionTime = 1500
      
      monitor.recordSlowQuery(query, executionTime, 100)
      
      const slowQueries = monitor.getSlowQueries()
      expect(slowQueries).toHaveLength(1)
      expect(slowQueries[0].query).toBe(query)
      expect(monitor.sendAlert).toHaveBeenCalledWith('slow_query', {
        query,
        executionTime,
        threshold: 1000,
      })
    })
  })
})