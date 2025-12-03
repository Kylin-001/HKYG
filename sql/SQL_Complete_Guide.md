# 黑科易购项目 SQL 管理完整指南

## 项目概述

本指南为黑科易购项目提供完整的数据库管理和维护解决方案，包括架构管理、数据完整性、安全配置、性能监控等各个方面。

## 📁 SQL 文件结构

```
sql/
├── migrations/                    # 数据库迁移脚本
│   └── V001__Create_Initial_Schema.sql
├── deployment/                    # 部署脚本
│   └── scripts/
│       ├── setup_dev_environment.sql
│       └── setup_test_environment.sql
├── maintenance/                   # 维护工具
│   ├── backup_database.sql
│   ├── performance_monitor.sql
│   └── data_integrity_check.sql
├── security/                      # 安全配置
│   └── database_security_setup.sql
├── existing/                      # 现有SQL文件
│   ├── schema.sql                 # 主表结构
│   ├── basic_data.sql             # 基础数据
│   ├── heikeji_user_data.sql      # 用户数据
│   ├── clean_schema.sql           # 清洁表结构
│   ├── init_data.sql              # 初始数据
│   ├── optimize_indexes.sql       # 索引优化
│   └── ... (其他现有文件)
└── SQL_Management_Plan.md         # 管理计划文档
```

## 🚀 快速开始

### 1. 开发环境初始化

```bash
# 在MySQL客户端中执行
source sql/migrations/V001__Create_Initial_Schema.sql
```

### 2. 数据完整性检查

```bash
# 检查数据质量和一致性
source sql/maintenance/data_integrity_check.sql
```

### 3. 安全配置

```bash
# 配置用户权限和安全策略（需要DBA权限）
source sql/security/database_security_setup.sql
```

## 📋 详细操作指南

### 数据库迁移

**新增表结构**：
1. 在 `migrations/` 目录创建新脚本：`V002__Add_New_Table.sql`
2. 遵循版本号命名规范
3. 记录迁移历史到 `schema_version` 表

**修改现有表结构**：
```sql
-- 在迁移脚本中
ALTER TABLE `user` ADD COLUMN `new_field` VARCHAR(50) NULL COMMENT '新字段';

-- 记录迁移
INSERT INTO `schema_version` (`version`, `description`) VALUES ('V002', '添加新字段到用户表');
```

### 数据完整性检查

运行完整性检查脚本，检查以下项目：

1. **基础数据一致性**
   - 孤儿记录检查
   - 外键约束验证

2. **业务规则验证**
   - 价格一致性
   - 用户余额检查
   - 库存检查
   - 订单状态一致性

3. **数据质量**
   - 必填字段检查
   - 格式规范性（手机号、邮箱）
   - 重复数据检查

4. **统计信息**
   - 表记录数统计
   - 业务数据统计

### 性能监控

**表级别监控**：
```sql
-- 查看表大小和记录数
source sql/maintenance/performance_monitor.sql
```

**索引效率分析**：
```sql
-- 查看未使用的索引
SELECT 
    s.TABLE_SCHEMA,
    s.TABLE_NAME,
    s.INDEX_NAME,
    s.CARDINALITY
FROM information_schema.STATISTICS s
LEFT JOIN information_schema.INDEX_STATISTICS i 
    ON s.TABLE_SCHEMA = i.TABLE_SCHEMA 
    AND s.TABLE_NAME = i.TABLE_NAME 
    AND s.INDEX_NAME = i.INDEX_NAME
WHERE i.INDEX_NAME IS NULL;
```

### 数据备份

**完整数据库备份**：
```sql
-- 设置备份路径
SET @backup_path = '/var/backups/heikeji_mall_2025_11_18.sql';

-- 执行备份脚本
source sql/maintenance/backup_database.sql
```

**增量备份（基于时间戳）**：
```sql
-- 备份指定时间后的数据
SELECT * INTO OUTFILE '/var/backups/incremental_2025_11_18.sql'
FROM `user` 
WHERE create_time >= '2025-11-18 00:00:00';
```

### 安全配置

**用户权限管理**：

1. **应用用户** (`heikeji_app`)
   - 权限：SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX
   - 使用场景：应用程序数据库操作

2. **只读用户** (`heikeji_read`)
   - 权限：SELECT
   - 使用场景：报表查询、数据分析

3. **管理用户** (`heikeji_admin`)
   - 权限：ALL PRIVILEGES
   - 使用场景：DBA运维操作

**数据脱敏**：

使用内置函数进行数据脱敏：
```sql
-- 手机号脱敏
SELECT phone_mask(phone) FROM user;

-- 姓名脱敏
SELECT name_mask(nickname) FROM user;

-- 身份证脱敏
SELECT id_card_mask(id_card) FROM delivery_person;
```

**安全视图**：

- `user_info_security`: 用户信息安全视图
- `order_info_security`: 订单信息脱敏视图
- `payment_info_security`: 支付信息安全视图

### 审计跟踪

**自动审计**：
- 用户表更新自动记录到 `data_audit_log`
- 订单状态变更自动跟踪
- 支付状态变更自动记录

**手动审计查询**：
```sql
-- 查看特定表的所有变更
SELECT * FROM data_audit_log 
WHERE table_name = 'user' 
ORDER BY create_time DESC 
LIMIT 100;
```

## 🔧 最佳实践

### 1. 日常维护

**每日检查**：
- 检查数据库性能指标
- 查看错误日志
- 验证备份完整性

**每周检查**：
- 运行数据完整性检查
- 分析索引使用情况
- 清理过期审计日志

**每月检查**：
- 评估表空间使用
- 优化查询性能
- 更新统计信息

### 2. 变更管理

1. **测试环境验证**
   - 所有变更先在测试环境验证
   - 完整性检查通过后部署到生产环境

2. **版本控制**
   - 每个迁移脚本都有版本号
   - 详细记录变更描述和影响范围

3. **回滚策略**
   - 每次重大变更前创建完整备份
   - 准备回滚脚本

### 3. 安全规范

1. **密码策略**
   - 定期更换数据库密码
   - 使用复杂密码组合

2. **权限最小化**
   - 只授予必要权限
   - 定期审查用户权限

3. **敏感数据保护**
   - 生产环境查看敏感数据使用脱敏视图
   - 审计日志保留至少6个月

## 📊 监控指标

### 性能指标

- **响应时间**：< 100ms（查询）< 500ms（事务）
- **吞吐量**：> 1000 QPS
- **连接数**：< 200（活跃连接）
- **慢查询**：< 5%（超过1秒）

### 资源指标

- **CPU使用率**：< 80%
- **内存使用率**：< 85%
- **磁盘I/O**：< 80%
- **网络延迟**：< 10ms

### 业务指标

- **用户活跃度**：日活跃用户数
- **订单成功率**：> 99%
- **支付成功率**：> 99.5%
- **系统可用性**：> 99.9%

## 🛠️ 故障恢复

### 数据恢复步骤

1. **确定故障范围**
   - 确认受影响的数据表
   - 确定故障时间点

2. **执行恢复操作**
   ```sql
   -- 恢复指定时间点的数据
   SET @recovery_time = '2025-11-18 14:30:00';
   
   -- 恢复用户表
   SOURCE /var/backups/user_table_backup.sql;
   ```

3. **验证数据完整性**
   ```sql
   -- 运行完整性检查
   SOURCE sql/maintenance/data_integrity_check.sql;
   ```

4. **功能测试**
   - 验证关键业务功能
   - 检查数据一致性

### 性能问题排查

1. **慢查询诊断**
   ```sql
   -- 启用慢查询日志
   SET GLOBAL slow_query_log = 'ON';
   SET GLOBAL long_query_time = 1;
   
   -- 查看慢查询
   SELECT * FROM mysql.slow_log 
   ORDER BY start_time DESC LIMIT 10;
   ```

2. **锁等待分析**
   ```sql
   -- 查看锁等待
   SELECT * FROM information_schema.INNODB_LOCKS;
   SELECT * FROM information_schema.INNODB_LOCK_WAITS;
   ```

3. **连接数监控**
   ```sql
   -- 查看连接数
   SHOW STATUS LIKE 'Threads_connected';
   SHOW STATUS LIKE 'Max_used_connections';
   ```

## 📞 技术支持

如果在使用过程中遇到问题，请按以下方式获取支持：

1. **检查日志文件**：查看MySQL错误日志和应用日志
2. **运行诊断脚本**：执行数据完整性检查和性能监控脚本
3. **查看监控指标**：确认系统和业务指标是否正常
4. **联系技术团队**：提供详细的问题描述和日志信息

---

**最后更新**：2025-11-18  
**版本**：1.0  
**维护者**：黑科易购开发团队