# 黑科易购项目 SQL 一键执行脚本

## 🚀 快速执行指南

### 开发环境快速搭建

```bash
# 进入MySQL命令行或客户端
# 执行以下命令一键搭建开发环境：

source sql/migrations/V001__Create_Initial_Schema.sql
source sql/deployment/scripts/setup_dev_environment.sql
source sql/security/database_security_setup.sql
```

### 生产环境部署

```bash
# 1. 数据库迁移
source sql/migrations/V001__Create_Initial_Schema.sql

# 2. 安全配置
source sql/security/database_security_setup.sql

# 3. 索引优化
source sql/optimize_indexes.sql

# 4. 基础数据
source sql/basic_data.sql
```

### 数据完整性检查

```bash
# 一键检查数据完整性
source sql/maintenance/data_integrity_check.sql
```

### 日常维护任务

```bash
# 执行日常维护（建议每日执行）
source sql/maintenance/daily_maintenance.sql

# 性能监控（建议每周执行）
source sql/maintenance/performance_monitor.sql

# 备份数据库（建议每日执行）
source sql/maintenance/backup_database.sql
```

## 📋 SQL脚本执行顺序

### 首次部署（按顺序执行）

1. **架构创建**
   ```sql
   -- 创建数据库和基础表结构
   source sql/migrations/V001__Create_Initial_Schema.sql
   ```

2. **安全配置**
   ```sql
   -- 创建用户和权限
   source sql/security/database_security_setup.sql
   ```

3. **性能优化**
   ```sql
   -- 创建索引
   source sql/optimize_indexes.sql
   ```

4. **数据初始化**
   ```sql
   -- 基础数据
   source sql/basic_data.sql
   
   -- 用户数据
   source sql/heikeji_user_data.sql
   ```

### 日常操作

- **每日任务**: `daily_maintenance.sql`
- **每周检查**: `performance_monitor.sql`
- **每月深度检查**: `data_integrity_check.sql`
- **定期备份**: `backup_database.sql`

### 故障排查

- **数据完整性**: `data_integrity_check.sql`
- **性能问题**: `performance_monitor.sql`
- **用户权限**: 执行安全配置脚本查看用户状态

## ⚠️ 注意事项

1. **执行权限**: 某些脚本需要DBA权限（特别是安全配置）
2. **备份重要**: 执行任何修改数据的操作前先备份
3. **测试环境**: 生产环境执行前先在测试环境验证
4. **监控日志**: 关注执行结果和任何错误信息

## 📞 支持信息

如遇到问题：
1. 查看 SQL_Complete_Guide.md 详细文档
2. 检查 MySQL 错误日志
3. 运行数据完整性检查脚本诊断问题