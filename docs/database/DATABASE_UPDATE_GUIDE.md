# 数据库更新指南

## 数据库连接信息

| 配置项 | 值 |
|--------|-----|
| 主机 | 192.168.186.128 |
| 端口 | 3306 |
| 数据库名 | heikeji_mall |
| 用户名 | hkyg |
| 密码 | Mysql@8Root!2025 |

## SQL文件结构

```
sql/
├── full_db.sql                    # 完整数据库（创建数据库+表结构+基础数据）
├── simple_db.sql                  # 简化版数据库
├── import_schema.sql              # Schema导入（需要配合其他文件）
│
├── schema/                        # 表结构定义
│   ├── tables/
│   │   ├── 01_schema_version.sql  # 版本控制表
│   │   ├── 02_user.sql            # 用户表
│   │   ├── 03_user_auth.sql       # 用户认证表
│   │   ├── 04_user_address.sql    # 用户地址表
│   │   ├── 05_store.sql           # 门店表
│   │   ├── 06_category.sql        # 商品分类表
│   │   ├── 07_product.sql         # 商品表
│   │   ├── ...
│   │   ├── 25_coupon_system.sql   # 优惠券系统表
│
├── data/                          # 数据文件
│   ├── basic/                     # 基础数据
│   │   ├── category_data.sql      # 分类数据
│   │   ├── store_data.sql         # 门店数据
│   │   ├── product_data.sql       # 商品数据
│   │   └── ...
│   └── test/                      # 测试数据
│       ├── user_test_data.sql     # 用户测试数据
│       ├── order_test_data.sql    # 订单测试数据
│       └── ...
│
├── migrations/                    # 数据库迁移
│   ├── create_product_comment_like_table.sql  # 添加评价点赞表
│   ├── create_order_review_table.sql          # 添加订单评价表
│   ├── add_product_indexes.sql                 # 商品表索引
│   ├── add_order_indexes.sql                   # 订单表索引
│   └── ...
│
├── root_scripts/updates/          # 更新脚本
│   ├── update_user_table.sql
│   ├── update_user_password_final.sql
│   ├── fix_user_table_final.sql
│   └── ...
│
├── maintenance/                  # 维护脚本
│   ├── performance_monitor.sql
│   ├── backup_database.sql
│   └── ...
│
└── security/                    # 安全脚本
    └── database_security_setup.sql
```

## 快速开始

### 方式一：使用Docker Compose（推荐）

如果使用Docker部署，数据库会在容器启动时自动初始化：

```bash
# 启动MySQL容器（会自动执行full_db.sql）
docker-compose up -d mysql
```

### 方式二：手动执行SQL

#### 1. 连接数据库

```bash
# 方法1：使用MySQL命令行
mysql -h 192.168.186.128 -P 3306 -u hkyg -p heikeji_mall

# 方法2：使用Docker
docker exec -it heikeji-mysql mysql -u hkyg -p heikeji_mall
```

#### 2. 执行完整数据库脚本

```sql
-- 方式1：直接在MySQL命令行执行
SOURCE /path/to/full_db.sql;

-- 方式2：使用mysql命令
mysql -h 192.168.186.128 -P 3306 -u hkyg -p heikeji_mall < sql/full_db.sql
```

#### 3. 执行迁移脚本

```sql
-- 评价点赞功能
SOURCE sql/migrations/create_product_comment_like_table.sql;

-- 订单评价功能
SOURCE sql/migrations/create_order_review_table.sql;

-- 添加索引优化
SOURCE sql/migrations/add_product_indexes.sql;
SOURCE sql/migrations/add_order_indexes.sql;
```

## 常用操作

### 查看所有表

```sql
SHOW TABLES;
```

### 查看表结构

```sql
DESC user;
-- 或
SHOW CREATE TABLE user;
```

### 查看数据库版本

```sql
SELECT * FROM schema_version;
```

### 插入版本记录

```sql
INSERT INTO schema_version (version, description) VALUES ('1.0.0', 'Initial schema');
```

## 重要表说明

### 核心业务表

| 表名 | 说明 |
|------|------|
| user | 用户基本信息 |
| user_auth | 用户认证信息（密码等） |
| user_address | 用户地址 |
| store | 商家门店 |
| category | 商品分类 |
| product | 商品信息 |
| order | 订单主表 |
| order_item | 订单明细 |
| cart | 购物车 |
| payment | 支付记录 |
| delivery_locker | 外卖柜 |

### 系统表

| 表名 | 说明 |
|------|------|
| role | 角色 |
| menu | 菜单权限 |
| system_log | 系统日志 |
| system_config | 系统配置 |

### 营销表

| 表名 | 说明 |
|------|------|
| coupon | 优惠券 |
| user_coupon | 用户优惠券 |
| points | 积分记录 |
| member_level | 会员等级 |

## 注意事项

1. 执行SQL前请先备份数据库
2. 迁移脚本可能需要按顺序执行
3. 某些表有依赖关系，请按顺序创建

---

*最后更新：2026-03-13*
