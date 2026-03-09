# HKYG项目新功能开发规划

## 概述

本文档提供了HKYG项目新功能的开发规划，包括校园信息服务、二手市场、失物招领、积分系统和优惠券系统等新功能的详细设计和实现方案。

## 功能开发路线图

### 第一阶段：校园信息服务（1-2个月）

| 功能模块 | 优先级 | 预计工期 |
|---------|--------|---------|
| 空教室查询 | P0 | 2周 |
| 校园公告 | P0 | 2周 |
| 校园活动 | P1 | 3周 |
| 校园地图 | P1 | 3周 |

### 第二阶段：二手市场完善（1-2个月）

| 功能模块 | 优先级 | 预计工期 |
|---------|--------|---------|
| 商品搜索优化 | P0 | 1周 |
| 商品推荐 | P0 | 2周 |
| 在线沟通 | P1 | 2周 |
| 交易保障 | P1 | 3周 |

### 第三阶段：失物招领完善（1个月）

| 功能模块 | 优先级 | 预计工期 |
|---------|--------|---------|
| 物品分类管理 | P0 | 1周 |
| 智能匹配 | P0 | 2周 |
| 消息通知 | P1 | 1周 |
| 物品归还流程 | P1 | 2周 |

### 第四阶段：积分系统（1-2个月）

| 功能模块 | 优先级 | 预计工期 |
|---------|--------|---------|
| 积分获取规则 | P0 | 2周 |
| 积分消费规则 | P0 | 2周 |
| 积分商城 | P1 | 3周 |
| 积分记录 | P1 | 1周 |

### 第五阶段：优惠券系统（1-2个月）

| 功能模块 | 优先级 | 预计工期 |
|---------|--------|---------|
| 优惠券创建 | P0 | 2周 |
| 优惠券发放 | P0 | 2周 |
| 优惠券使用 | P1 | 2周 |
| 优惠券统计 | P1 | 1周 |

---

## 功能详细设计

### 1. 校园信息服务

#### 1.1 空教室查询系统

**功能描述：**
- 查看各教学楼教室使用情况
- 查询特定时间段的空教室
- 教室预订功能
- 教室使用统计

**数据库设计：**

```sql
-- 教学楼表
CREATE TABLE campus_building (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '教学楼名称',
  location VARCHAR(200) COMMENT '位置描述',
  floor_count INT COMMENT '楼层数',
  description TEXT COMMENT '描述',
  status TINYINT DEFAULT 1 COMMENT '状态:1-正常,0-停用',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教学楼表';

-- 教室表
CREATE TABLE campus_classroom (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  building_id BIGINT NOT NULL COMMENT '教学楼ID',
  name VARCHAR(50) NOT NULL COMMENT '教室名称',
  floor INT COMMENT '楼层',
  capacity INT COMMENT '容纳人数',
  equipment TEXT COMMENT '设备信息(JSON)',
  description TEXT COMMENT '描述',
  status TINYINT DEFAULT 1 COMMENT '状态:1-可用,0-停用',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (building_id) REFERENCES campus_building(id),
  INDEX idx_building (building_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教室表';

-- 教室使用记录表
CREATE TABLE campus_classroom_schedule (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  classroom_id BIGINT NOT NULL COMMENT '教室ID',
  date DATE NOT NULL COMMENT '日期',
  start_time TIME NOT NULL COMMENT '开始时间',
  end_time TIME NOT NULL COMMENT '结束时间',
  course_name VARCHAR(100) COMMENT '课程名称',
  teacher_name VARCHAR(50) COMMENT '教师姓名',
  booked_by BIGINT COMMENT '预订用户ID',
  booking_type TINYINT COMMENT '预订类型:1-课程,2-活动,3-自习',
  status TINYINT DEFAULT 1 COMMENT '状态:1-已确认,2-取消',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (classroom_id) REFERENCES campus_classroom(id),
  INDEX idx_classroom_date (classroom_id, date),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='教室使用记录表';
```

**API接口设计：**

```typescript
// src-vue3/api/campus.ts
import request from '@/utils/request'

// 获取教学楼列表
export function getBuildings() {
  return request({
    url: '/campus/buildings',
    method: 'get'
  })
}

// 获取教室列表
export function getClassrooms(buildingId) {
  return request({
    url: `/campus/classrooms/${buildingId}`,
    method: 'get'
  })
}

// 查询空教室
export function searchAvailableClassrooms(params) {
  return request({
    url: '/campus/classrooms/available',
    method: 'get',
    params
  })
}

// 预订教室
export function bookClassroom(data) {
  return request({
    url: '/campus/classrooms/book',
    method: 'post',
    data
  })
}

// 取消预订
export function cancelBooking(id) {
  return request({
    url: `/campus/classrooms/book/${id}/cancel`,
    method: 'put'
  })
}

// 获取教室使用记录
export function getClassroomSchedule(classroomId, date) {
  return request({
    url: `/campus/classrooms/${classroomId}/schedule`,
    method: 'get',
    params: { date }
  })
}
```

#### 1.2 校园公告系统

**功能描述：**
- 发布校园公告
- 公告分类管理
- 公告搜索和筛选
- 公告阅读统计

**数据库设计：**

```sql
-- 校园公告表
CREATE TABLE campus_announcement (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL COMMENT '公告标题',
  content TEXT NOT NULL COMMENT '公告内容',
  category_id BIGINT COMMENT '分类ID',
  priority TINYINT DEFAULT 1 COMMENT '优先级:1-普通,2-重要,3-紧急',
  is_top TINYINT DEFAULT 0 COMMENT '是否置顶:0-否,1-是',
  publish_time DATETIME COMMENT '发布时间',
  expire_time DATETIME COMMENT '过期时间',
  publisher_id BIGINT COMMENT '发布人ID',
  view_count INT DEFAULT 0 COMMENT '阅读次数',
  status TINYINT DEFAULT 1 COMMENT '状态:0-草稿,1-已发布,2-已下架',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category_id),
  INDEX idx_status (status),
  INDEX idx_publish_time (publish_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='校园公告表';

-- 公告分类表
CREATE TABLE campus_announcement_category (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL COMMENT '分类名称',
  icon VARCHAR(200) COMMENT '分类图标',
  sort_order INT DEFAULT 0 COMMENT '排序',
  status TINYINT DEFAULT 1 COMMENT '状态:1-启用,0-禁用',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告分类表';
```

---

### 2. 二手市场完善

#### 2.1 商品推荐系统

**功能描述：**
- 基于用户浏览历史推荐
- 基于用户购买历史推荐
- 相似商品推荐
- 热门商品推荐

**推荐算法设计：**

```javascript
// src-vue3/utils/recommendation.js
class ProductRecommender {
  constructor() {
    this.userHistory = new Map();
    this.productSimilarity = new Map();
  }

  // 基于浏览历史推荐
  recommendByBrowsingHistory(userId, limit = 10) {
    const history = this.userHistory.get(userId) || [];
    const recommendations = new Set();
    
    // 获取浏览过的商品的相似商品
    history.forEach(productId => {
      const similarProducts = this.productSimilarity.get(productId) || [];
      similarProducts.forEach(p => recommendations.add(p));
    });
    
    // 移除已浏览的商品
    history.forEach(productId => recommendations.delete(productId));
    
    return Array.from(recommendations).slice(0, limit);
  }

  // 基于协同过滤推荐
  recommendByCollaborativeFiltering(userId, limit = 10) {
    // 简化的协同过滤算法
    // 实际实现中应该使用更复杂的算法
    return this.getHotProducts(limit);
  }

  // 获取热门商品
  getHotProducts(limit = 10) {
    // 基于销量、浏览量等指标排序
    return []; // 实际从数据库获取
  }

  // 计算商品相似度
  calculateProductSimilarity(product1, product2) {
    // 基于分类、价格、标签等计算相似度
    let similarity = 0;
    
    // 分类相似度
    if (product1.categoryId === product2.categoryId) {
      similarity += 0.5;
    }
    
    // 价格相似度
    const priceDiff = Math.abs(product1.price - product2.price);
    const maxPrice = Math.max(product1.price, product2.price);
    similarity += (1 - priceDiff / maxPrice) * 0.3;
    
    // 标签相似度
    const commonTags = product1.tags.filter(tag => product2.tags.includes(tag)).length;
    const totalTags = new Set([...product1.tags, ...product2.tags]).size;
    similarity += (commonTags / totalTags) * 0.2;
    
    return similarity;
  }
}

export default ProductRecommender;
```

---

### 3. 失物招领完善

#### 3.1 智能匹配系统

**功能描述：**
- 丢失物品与招领物品自动匹配
- 基于物品特征的相似度计算
- 匹配结果推送通知
- 人工审核匹配结果

**匹配算法设计：**

```javascript
// src-vue3/utils/lost-found-matcher.js
class LostFoundMatcher {
  constructor() {
    this.lostItems = [];
    this.foundItems = [];
  }

  // 添加丢失物品
  addLostItem(item) {
    this.lostItems.push({
      ...item,
      type: 'lost',
      createTime: new Date()
    });
  }

  // 添加招领物品
  addFoundItem(item) {
    this.foundItems.push({
      ...item,
      type: 'found',
      createTime: new Date()
    });
  }

  // 计算两个物品的相似度
  calculateSimilarity(item1, item2) {
    let score = 0;
    const weights = {
      category: 0.3,
      name: 0.25,
      color: 0.15,
      location: 0.15,
      time: 0.1,
      description: 0.05
    };

    // 分类匹配
    if (item1.categoryId === item2.categoryId) {
      score += weights.category;
    }

    // 名称相似度
    const nameSimilarity = this.calculateTextSimilarity(item1.name, item2.name);
    score += nameSimilarity * weights.name;

    // 颜色匹配
    if (item1.color === item2.color) {
      score += weights.color;
    }

    // 地点相似度
    const locationSimilarity = this.calculateLocationSimilarity(item1.location, item2.location);
    score += locationSimilarity * weights.location;

    // 时间相似度
    const timeSimilarity = this.calculateTimeSimilarity(item1.time, item2.time);
    score += timeSimilarity * weights.time;

    // 描述相似度
    const descSimilarity = this.calculateTextSimilarity(
      item1.description || '',
      item2.description || ''
    );
    score += descSimilarity * weights.description;

    return score;
  }

  // 计算文本相似度（简化版）
  calculateTextSimilarity(text1, text2) {
    if (!text1 || !text2) return 0;
    
    // 实际应用中应该使用更复杂的算法
    // 如Levenshtein距离、余弦相似度等
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    
    const commonWords = words1.filter(word => words2.includes(word)).length;
    const allWords = new Set([...words1, ...words2]).size;
    
    return allWords > 0 ? commonWords / allWords : 0;
  }

  // 计算地点相似度
  calculateLocationSimilarity(loc1, loc2) {
    if (!loc1 || !loc2) return 0;
    
    // 简化的地点相似度
    if (loc1 === loc2) return 1;
    if (loc1.includes(loc2) || loc2.includes(loc1)) return 0.5;
    
    return 0;
  }

  // 计算时间相似度
  calculateTimeSimilarity(time1, time2) {
    if (!time1 || !time2) return 0;
    
    const t1 = new Date(time1).getTime();
    const t2 = new Date(time2).getTime();
    const diff = Math.abs(t1 - t2);
    
    // 时间差越小，相似度越高
    const maxDiff = 7 * 24 * 60 * 60 * 1000; // 7天
    return Math.max(0, 1 - diff / maxDiff);
  }

  // 查找匹配
  findMatches(lostItem, threshold = 0.5) {
    const matches = [];
    
    this.foundItems.forEach(foundItem => {
      const similarity = this.calculateSimilarity(lostItem, foundItem);
      if (similarity >= threshold) {
        matches.push({
          item: foundItem,
          similarity: similarity
        });
      }
    });
    
    // 按相似度排序
    matches.sort((a, b) => b.similarity - a.similarity);
    
    return matches;
  }

  // 批量匹配
  batchMatch() {
    const allMatches = [];
    
    this.lostItems.forEach(lostItem => {
      const matches = this.findMatches(lostItem);
      if (matches.length > 0) {
        allMatches.push({
          lostItem,
          matches
        });
      }
    });
    
    return allMatches;
  }
}

export default LostFoundMatcher;
```

---

### 4. 积分系统

#### 4.1 积分获取规则

**功能描述：**
- 每日签到积分
- 消费积分奖励
- 评价积分奖励
- 邀请好友积分
- 活动积分奖励

**数据库设计：**

```sql
-- 积分规则表
CREATE TABLE points_rule (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '规则名称',
  type VARCHAR(50) NOT NULL COMMENT '规则类型:sign-签到,consume-消费,review-评价,invite-邀请,activity-活动',
  points INT NOT NULL COMMENT '积分数量',
  max_points INT COMMENT '最大积分限制',
  condition TEXT COMMENT '条件(JSON)',
  description TEXT COMMENT '描述',
  status TINYINT DEFAULT 1 COMMENT '状态:1-启用,0-禁用',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分规则表';

-- 用户积分表
CREATE TABLE user_points (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL COMMENT '用户ID',
  total_points INT DEFAULT 0 COMMENT '总积分',
  available_points INT DEFAULT 0 COMMENT '可用积分',
  frozen_points INT DEFAULT 0 COMMENT '冻结积分',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户积分表';

-- 积分记录表
CREATE TABLE points_record (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL COMMENT '用户ID',
  type VARCHAR(50) NOT NULL COMMENT '类型:earn-获取,consume-消费,expire-过期',
  points INT NOT NULL COMMENT '积分数量(正为获取,负为消费)',
  balance INT NOT NULL COMMENT '变动后余额',
  rule_id BIGINT COMMENT '规则ID',
  order_id BIGINT COMMENT '关联订单ID',
  description TEXT COMMENT '描述',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_time (user_id, create_time),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分记录表';
```

---

### 5. 优惠券系统

#### 5.1 优惠券创建和发放

**功能描述：**
- 创建优惠券模板
- 设置优惠券使用条件
- 批量发放优惠券
- 优惠券领取
- 优惠券使用

**数据库设计：**

```sql
-- 优惠券模板表
CREATE TABLE coupon_template (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT '优惠券名称',
  type VARCHAR(50) NOT NULL COMMENT '类型:fixed-满减,percentage-折扣,shipping-免邮',
  discount_value DECIMAL(10,2) NOT NULL COMMENT '优惠值',
  min_amount DECIMAL(10,2) DEFAULT 0 COMMENT '最低使用金额',
  max_discount DECIMAL(10,2) COMMENT '最大优惠金额',
  total_count INT NOT NULL COMMENT '发放总量',
  used_count INT DEFAULT 0 COMMENT '已使用数量',
  per_limit INT DEFAULT 1 COMMENT '每人限领数量',
  valid_type VARCHAR(50) NOT NULL COMMENT '有效期类型:fixed-固定日期,relative-相对天数',
  valid_days INT COMMENT '有效天数',
  start_time DATETIME COMMENT '开始时间',
  end_time DATETIME COMMENT '结束时间',
  category_ids TEXT COMMENT '适用分类ID列表',
  product_ids TEXT COMMENT '适用商品ID列表',
  description TEXT COMMENT '描述',
  status TINYINT DEFAULT 1 COMMENT '状态:0-未开始,1-进行中,2-已结束',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券模板表';

-- 用户优惠券表
CREATE TABLE user_coupon (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL COMMENT '用户ID',
  template_id BIGINT NOT NULL COMMENT '模板ID',
  coupon_code VARCHAR(50) NOT NULL COMMENT '优惠券码',
  status VARCHAR(50) DEFAULT 'unused' COMMENT '状态:unused-未使用,used-已使用,expired-已过期',
  receive_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '领取时间',
  use_time DATETIME COMMENT '使用时间',
  order_id BIGINT COMMENT '使用订单ID',
  start_time DATETIME NOT NULL COMMENT '开始时间',
  end_time DATETIME NOT NULL COMMENT '结束时间',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_code (coupon_code),
  INDEX idx_user_status (user_id, status),
  INDEX idx_template (template_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券表';
```

---

## 实施建议

### 开发优先级

1. **第一阶段（必须）**: 空教室查询、校园公告
2. **第二阶段（重要）**: 二手市场优化、失物招领优化
3. **第三阶段（推荐）**: 积分系统、优惠券系统

### 技术要点

- 使用微服务架构开发新功能
- 遵循现有代码规范
- 完善的单元测试和集成测试
- 详细的API文档
- 性能优化考虑

### 质量保证

- 代码审查
- 自动化测试
- 性能测试
- 安全测试
- 用户体验测试

## 总结

新功能开发将显著提升HKYG平台的用户体验和商业价值。通过系统化的规划和实施，可以确保新功能的质量和交付时间。建议采用敏捷开发方法，分阶段交付，快速迭代，持续优化。