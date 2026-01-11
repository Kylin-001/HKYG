# 前端性能监控API接口文档

## 接口概述

本API用于接收和处理前端发送的性能监控数据，支持批量数据收集、Web Vitals监控、错误追踪等功能。

## 接口详情

### 1. 性能数据收集接口

**接口地址:** `/api/performance/collect`

**请求方法:** `POST`

**请求头:**
```
Content-Type: application/json
```

**请求参数:**

```json
{
  "batch": [
    {
      "id": "唯一标识符",
      "type": "性能指标类型",
      "name": "指标名称",
      "value": "数值",
      "rating": "评级(good/needs-improvement/poor)",
      "timestamp": "时间戳",
      "url": "页面URL",
      "userAgent": "用户代理",
      "connection": "网络连接信息",
      "metadata": {
        // 附加元数据
      }
    }
  ],
  "timestamp": "批量数据时间戳",
  "version": "监控版本号"
}
```

**性能指标类型说明:**

| 类型 | 说明 | 示例 |
|------|------|------|
| `largest-contentful-paint` | 最大内容绘制 | LCP指标 |
| `first-input-delay` | 首次输入延迟 | FID指标 |
| `layout-shift-score` | 累积布局偏移 | CLS指标 |
| `first-contentful-paint` | 首次内容绘制 | FCP指标 |
| `navigation` | 导航性能 | 页面加载时间 |
| `resource` | 资源加载性能 | JS/CSS/图片加载时间 |
| `error` | JavaScript错误 | 代码错误信息 |
| `custom` | 自定义指标 | 业务自定义性能指标 |

**响应示例:**

```json
{
  "success": true,
  "message": "数据已接收",
  "receivedCount": 10,
  "processedAt": "2024-01-01T00:00:00.000Z"
}
```

## 数据存储结构

### 性能指标表 (performance_metrics)

```sql
CREATE TABLE performance_metrics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    metric_type VARCHAR(100) NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    rating ENUM('good', 'needs-improvement', 'poor'),
    url TEXT,
    user_agent TEXT,
    connection_info JSON,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_type (session_id, metric_type),
    INDEX idx_created_at (created_at)
);
```

### 错误记录表 (error_logs)

```sql
CREATE TABLE error_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    error_type VARCHAR(100) NOT NULL,
    error_message TEXT,
    error_stack TEXT,
    filename VARCHAR(500),
    lineno INT,
    colno INT,
    url TEXT,
    user_agent TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at)
);
```

### 性能报告表 (performance_reports)

```sql
CREATE TABLE performance_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(255) NOT NULL,
    report_data JSON NOT NULL,
    report_type VARCHAR(50) DEFAULT 'summary',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id)
);
```

## 数据处理逻辑

### 1. 数据接收处理
- 验证请求参数完整性
- 数据清洗和格式化
- 生成会话ID（基于用户IP + User-Agent）
- 批量数据分割和存储

### 2. 性能分析
```javascript
// 性能评级标准
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  TTFB: { good: 200, needsImprovement: 500 },
  FCP: { good: 1800, needsImprovement: 3000 }
}
```

### 3. 告警机制
- 实时监控核心Web指标
- 异常指标自动告警
- 错误率阈值监控
- 性能回归检测

## 接口使用示例

### 前端发送数据示例

```javascript
import { performanceMonitor } from '@/utils/performance-monitor'

// 发送自定义性能指标
performanceMonitor.collectMetric({
  type: 'custom',
  name: 'API Response Time',
  value: 150,
  rating: 'good',
  metadata: {
    endpoint: '/api/users',
    method: 'GET'
  }
})

// 监控组件渲染性能
const measureRender = performanceMonitor.measureComponentRender('UserList', 
  function renderUserList() {
    // 组件渲染逻辑
    this.users = this.fetchUsers()
    this.renderUserCards()
  }
)
```

### 后端处理示例

```javascript
// Node.js/Express示例
app.post('/api/performance/collect', async (req, res) => {
  try {
    const { batch, timestamp, version } = req.body
    
    // 数据验证
    if (!batch || !Array.isArray(batch)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid batch data'
      })
    }
    
    // 生成会话ID
    const sessionId = generateSessionId(req.ip, req.get('User-Agent'))
    
    // 批量插入数据库
    const insertPromises = batch.map(metric => 
      insertPerformanceMetric({
        sessionId,
        ...metric,
        userAgent: req.get('User-Agent'),
        url: metric.url
      })
    )
    
    await Promise.all(insertPromises)
    
    // 触发实时分析
    await analyzePerformanceMetrics(sessionId, batch)
    
    res.json({
      success: true,
      message: 'Data received successfully',
      receivedCount: batch.length,
      processedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Performance data processing error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})
```

## 安全考虑

1. **数据脱敏**: 移除敏感信息，如用户隐私数据
2. **频率限制**: 限制单个IP的请求频率
3. **数据验证**: 严格验证输入数据格式和类型
4. **访问控制**: API访问权限控制
5. **数据加密**: 敏感数据传输加密

## 监控和告警

### 关键指标监控
- 平均LCP > 4秒触发警告
- 平均FID > 300ms触发警告  
- 平均CLS > 0.25触发警告
- 错误率 > 1%触发严重告警

### 告警通知方式
- 邮件通知
- Slack/钉钉机器人
- 短信告警
- 钉钉工作群通知

## 性能优化建议

1. **数据压缩**: 使用gzip压缩传输数据
2. **分批处理**: 大批量数据分批处理
3. **缓存优化**: 热点数据缓存
4. **异步处理**: 非关键数据异步处理
5. **数据清理**: 历史数据定期清理