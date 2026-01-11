# 黑科易购数据库SQL文件说明

## 目录结构

```
sql/
├── schema/                  # 数据库结构相关文件
│   ├── 00_create_database.sql  # 创建数据库
│   ├── tables/              # 表结构文件
│   │   ├── 01_schema_version.sql
│   │   ├── 02_user.sql
│   │   ├── ...
│   │   └── 21_user_role.sql
│   └── init_schema.sql      # 初始化数据库结构的主脚本
├── data/                    # 数据相关文件
│   ├── basic/               # 基础数据
│   │   ├── init_basic_data.sql  # 初始化基础数据的主脚本
│   │   ├── category_data.sql
│   │   ├── delivery_locker_data.sql
│   │   ├── dict_data.sql
│   │   ├── product_data.sql
│   │   ├── role_permission_data.sql
│   │   ├── store_data.sql
│   │   └── system_config_data.sql
│   └── test/                # 测试数据
│       ├── init_test_data.sql    # 初始化测试数据的主脚本
│       ├── cart_test_data.sql
│       ├── order_test_data.sql
│       └── user_test_data.sql
├── migrations/              # 数据库迁移文件
├── maintenance/             # 数据库维护脚本
├── deployment/              # 部署相关脚本
└── security/                # 数据库安全相关脚本
```

## 使用方法

### 1. 初始化数据库结构

```bash
# 执行数据库结构初始化脚本
mysql -u root -p < sql/schema/init_schema.sql
```

该脚本会：
- 创建数据库 `heikeji_mall`
- 创建所有表结构
- 初始化版本信息

### 2. 插入基础数据

```bash
# 执行基础数据初始化脚本
mysql -u root -p < sql/data/basic/init_basic_data.sql
```

基础数据包括：
- 商品分类
- 外卖柜信息
- 商家信息
- 商品信息
- 数据字典（订单状态、支付状态等）
- 系统配置
- 角色与权限

### 3. 插入测试数据（可选）

```bash
# 执行测试数据初始化脚本
mysql -u root -p < sql/data/test/init_test_data.sql
```

测试数据包括：
- 测试用户
- 测试订单
- 购物车数据

## 注意事项

1. 请确保MySQL服务已启动
2. 请使用具有创建数据库权限的用户执行脚本
3. 执行顺序：先执行schema脚本，再执行data脚本
4. 测试数据仅用于开发和测试环境
5. 生产环境请勿使用测试数据

## 文件说明

### 表结构文件
- 每个表结构独立存放在 `sql/schema/tables/` 目录下
- 文件命名格式：`{序号}_{表名}.sql`
- 序号表示创建顺序，确保外键依赖正确

### 数据文件
- 基础数据：系统运行必需的核心数据
- 测试数据：开发和测试环境使用的模拟数据

## 维护与更新

### 添加新表
1. 在 `sql/schema/tables/` 目录下创建新的表结构文件
2. 更新 `sql/schema/init_schema.sql` 脚本，添加新表的引用

### 添加新数据
1. 根据数据类型，在 `data/basic/` 或 `data/test/` 目录下创建数据文件
2. 更新对应目录下的 `init_*.sql` 脚本，添加新数据文件的引用

## 数据库版本管理

通过 `schema_version` 表记录数据库结构版本，便于后续的迁移和升级管理。

## 联系方式

如有问题，请联系项目开发团队。