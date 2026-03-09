# HKYG项目性能基准测试方案

## 概述

本文档提供了HKYG项目的性能基准测试方案，包括测试目标、测试方法、基准指标和性能优化建议。

## 性能目标

### 响应时间目标

| 场景 | 响应时间目标 | 说明 |
|------|------------|------|
| 页面加载 | < 2秒 | 首次加载 |
| API响应 | < 500ms | 简单查询 |
| 复杂查询 | < 2秒 | 多表关联查询 |
| 文件上传 | < 5秒 | 10MB文件 |
| 搜索查询 | < 1秒 | 商品搜索 |

### 吞吐量目标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| QPS | 500+ | 每秒查询数 |
| 并发用户 | 1000+ | 同时在线用户 |
| 数据库连接池 | 100+ | 最大连接数 |
| Redis命中率 | 80%+ | 缓存命中率 |

### 资源使用目标

| 资源 | 目标值 | 说明 |
|------|--------|------|
| CPU使用率 | < 70% | 正常负载下 |
| 内存使用率 | < 80% | 正常负载下 |
| 数据库CPU | < 60% | 正常负载下 |
| 网络带宽 | < 50% | 正常负载下 |

## 测试工具选择

### 1. 前端性能测试

| 工具 | 用途 | 说明 |
|------|------|------|
| Lighthouse | 页面性能审计 | Google官方工具 |
| WebPageTest | 真实环境测试 | 多地理位置测试 |
| Chrome DevTools | 调试分析 | 详细性能分析 |
| k6 | 负载测试 | 脚本化负载测试 |

### 2. 后端性能测试

| 工具 | 用途 | 说明 |
|------|------|------|
| JMeter | 功能和性能测试 | 强大的负载测试工具 |
| k6 | 现代化负载测试 | JavaScript脚本 |
| Locust | 分布式负载测试 | Python脚本 |
| Gatling | 高并发测试 | Scala DSL |

### 3. 数据库性能测试

| 工具 | 用途 | 说明 |
|------|------|------|
| sysbench | 数据库基准测试 | 标准基准测试 |
| mysqlslap | MySQL负载测试 | MySQL内置工具 |
| pgBench | PostgreSQL测试 | PostgreSQL内置工具 |
| Percona Toolkit | MySQL分析工具 | 性能分析和优化 |

## 测试场景设计

### 1. 用户场景测试

#### 1.1 首页浏览

```javascript
// k6测试脚本
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 100,
  duration: '2m',
};

export default function () {
  const response = http.get('https://test.heikeji.com/');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });
  sleep(1);
}
```

#### 1.2 商品搜索

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
};

const searchKeywords = ['手机', '电脑', '衣服', '鞋子', '书籍'];

export default function () {
  const keyword = searchKeywords[Math.floor(Math.random() * searchKeywords.length)];
  const response = http.get(`https://test.heikeji.com/api/product/search?keyword=${keyword}`);
  check(response, {
    'search status 200': (r) => r.status === 200,
    'search time < 1000ms': (r) => r.timings.duration < 1000,
  });
  sleep(0.5 + Math.random());
}
```

#### 1.3 下单流程

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,
  duration: '5m',
};

export default function () {
  // 1. 获取商品列表
  const products = http.get('https://test.heikeji.com/api/product/list');
  check(products, {
    'product list ok': (r) => r.status === 200,
  });
  
  sleep(1);
  
  // 2. 加入购物车
  const cartResponse = http.post('https://test.heikeji.com/api/cart/add', {
    productId: '1',
    quantity: 1,
  });
  check(cartResponse, {
    'add to cart ok': (r) => r.status === 200,
  });
  
  sleep(1);
  
  // 3. 创建订单
  const orderResponse = http.post('https://test.heikeji.com/api/order/create', {
    addressId: '1',
  });
  check(orderResponse, {
    'create order ok': (r) => r.status === 200,
    'order time < 3000ms': (r) => r.timings.duration < 3000,
  });
  
  sleep(2 + Math.random() * 2);
}
```

### 2. 系统压力测试

#### 2.1 渐进式压力测试

```javascript
import http from 'k6/http';
import { Trend } from 'k6/metrics';

const myTrend = new Trend('my_trend');

export const options = {
  stages: [
    { duration: '5m', target: 100 }, // 5分钟内增至100用户
    { duration: '10m', target: 100 }, // 保持100用户10分钟
    { duration: '5m', target: 200 }, // 5分钟内增至200用户
    { duration: '10m', target: 200 }, // 保持200用户10分钟
    { duration: '5m', target: 0 }, // 5分钟内降至0用户
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const response = http.get('https://test.heikeji.com/api/health');
  myTrend.add(response.timings.duration);
}
```

#### 2.2 峰值压力测试

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  executor: 'ramping-arrival-rate',
  startRate: 10,
  timeUnit: '1s',
  preAllocatedVUs: 100,
  maxVUs: 500,
  stages: [
    { duration: '2m', target: 100 }, // 快速升至100 rps
    { duration: '5m', target: 100 }, // 保持峰值
    { duration: '2m', target: 0 }, // 停止
  ],
};

export default function () {
  const responses = http.batch([
    ['GET', 'https://test.heikeji.com/api/product/list'],
    ['GET', 'https://test.heikeji.com/api/category/list'],
    ['GET', 'https://test.heikeji.com/api/user/profile'],
  ]);
  
  responses.forEach((res, i) => {
    check(res, {
      [`request ${i} status 200`]: (r) => r.status === 200,
    });
  });
}
```

## 性能监控指标

### 1. 前端监控指标

| 指标 | 说明 | 目标值 |
|------|------|--------|
| FCP (First Contentful Paint) | 首次内容绘制 | < 1.8秒 |
| LCP (Largest Contentful Paint) | 最大内容绘制 | < 2.5秒 |
| FID (First Input Delay) | 首次输入延迟 | < 100ms |
| CLS (Cumulative Layout Shift) | 累计布局偏移 | < 0.1 |
| TTI (Time to Interactive) | 可交互时间 | < 3秒 |

### 2. 后端监控指标

| 指标 | 说明 | 目标值 |
|------|------|--------|
| API响应时间 | 各接口平均响应时间 | < 500ms |
| API错误率 | 接口错误率 | < 1% |
| 数据库查询时间 | 数据库平均查询时间 | < 100ms |
| Redis命中率 | 缓存命中率 | > 80% |
| JVM堆内存使用 | JVM内存使用率 | < 70% |
| 数据库连接数 | 活跃连接数 | < 连接池80% |

### 3. 系统资源监控

| 指标 | 说明 | 告警阈值 |
|------|------|---------|
| CPU使用率 | 服务器CPU | > 80% |
| 内存使用率 | 服务器内存 | > 85% |
| 磁盘使用率 | 磁盘空间 | > 90% |
| 网络流量 | 网络带宽 | > 80% |
| 连接数 | TCP连接数 | > 10000 |

## 性能基准测试报告

### 测试报告模板

```markdown
# 性能基准测试报告

## 测试信息

- **测试日期**: 2026-03-07
- **测试环境**: 测试环境
- **测试人员**: 性能测试团队
- **测试工具**: k6 v0.46.0

## 测试目标

- [ ] 验证系统在正常负载下的性能
- [ ] 验证系统在峰值负载下的稳定性
- [ ] 验证系统资源使用情况
- [ ] 发现性能瓶颈

## 测试配置

- 虚拟用户数: 100
- 测试持续时间: 10分钟
- 测试场景: 商品搜索、下单流程、用户浏览

## 测试结果

### 前端性能

| 指标 | 测试值 | 目标值 | 是否达标 |
|------|--------|--------|---------|
| FCP | 1.2秒 | < 1.8秒 | ✅ |
| LCP | 1.8秒 | < 2.5秒 | ✅ |
| FID | 50ms | < 100ms | ✅ |
| CLS | 0.05 | < 0.1 | ✅ |

### 后端性能

| API | 平均响应时间 | P95响应时间 | 错误率 | QPS |
|-----|------------|------------|--------|-----|
| 商品列表 | 150ms | 250ms | 0.1% | 320 |
| 商品搜索 | 450ms | 680ms | 0.5% | 180 |
| 下单流程 | 1200ms | 1800ms | 0.2% | 80 |
| 用户登录 | 180ms | 320ms | 0.3% | 280 |

### 系统资源

| 资源 | 使用率 | 峰值 |
|------|--------|------|
| CPU | 45% | 68% |
| 内存 | 52% | 72% |
| 磁盘 | 35% | 38% |
| 网络 | 25% | 42% |

### 数据库性能

| 指标 | 数值 |
|------|------|
| 平均查询时间 | 65ms |
| 慢查询数 | 2 |
| Redis命中率 | 88% |
| 连接池使用率 | 45% |

## 性能瓶颈分析

### 发现的问题

1. **商品搜索响应时间较长**
   - 原因: 搜索查询未充分利用索引
   - 建议: 优化搜索查询，添加全文索引

2. **下单流程响应时间超过目标**
   - 原因: 涉及多个数据库操作和事务
   - 建议: 优化事务处理，增加缓存

3. **Redis缓存命中率有待提高**
   - 原因: 部分数据未缓存
   - 建议: 增加缓存范围，优化缓存策略

## 优化建议

### 短期优化 (1-2周)

1. 优化商品搜索查询，添加全文索引
2. 增加热点数据缓存
3. 优化下单流程的事务处理

### 中期优化 (1-2个月)

1. 实现数据库读写分离
2. 增加CDN加速静态资源
3. 优化前端资源加载

### 长期优化 (3-6个月)

1. 实现微服务架构
2. 引入消息队列
3. 实现分布式缓存

## 总结

本次性能基准测试验证了系统在正常负载下的性能表现，大部分指标达到了预期目标。同时也发现了一些性能瓶颈，需要通过优化来进一步提升系统性能。

**总体评价**: 系统性能良好，通过优化可以进一步提升。
```

## 性能优化建议

### 1. 前端优化

- 使用路由懒加载
- 实现图片懒加载
- 启用Gzip压缩
- 使用CDN加速静态资源
- 优化首屏加载

### 2. 后端优化

- 优化数据库索引
- 增加缓存层级
- 实现异步处理
- 使用连接池
- 优化SQL查询

### 3. 数据库优化

- 添加适当索引
- 优化查询语句
- 定期维护数据表
- 实现读写分离
- 考虑分库分表

### 4. 缓存优化

- 增加缓存命中率
- 设置合理的过期时间
- 使用多级缓存
- 实现缓存预热
- 处理缓存穿透

## 总结

通过系统化的性能基准测试，可以全面了解系统的性能表现，发现性能瓶颈，并通过持续优化来提升系统性能和用户体验。性能测试应该成为开发流程的一部分，定期进行以确保系统性能持续优化。