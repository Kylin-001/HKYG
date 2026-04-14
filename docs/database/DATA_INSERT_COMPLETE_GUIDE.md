# 数据库批量插入功能 - 完整实现文档

## 📋 功能概述

本实现为 **黑科易购 (heikeji-mall)** 项目提供了完整的**数据库数据添加功能**，支持**用户表 (user)** 和 **商品表 (product)** 的**单条/批量数据插入**，包含：

✅ 完整的事务处理机制
✅ 严格的数据类型和约束验证
✅ 外键关联检查
✅ 唯一性约束冲突检测
✅ 密码加密存储（用户模块）
✅ 批量操作统计和详细错误报告
✅ 全局异常处理和友好提示
✅ Swagger API 文档注解

---

## 🎯 目标数据库信息

| 属性 | 值 |
|------|-----|
| **数据库名称** | `heikeji_mall` |
| **数据库类型** | MySQL 8.0+ |
| **字符集** | utf8mb4 |
| **存储引擎** | InnoDB |
| **事务支持** | ✅ 支持 |

### 核心表结构

#### 1. 用户表 (`user`)

```sql
CREATE TABLE `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) UNIQUE COMMENT '用户名（唯一）',
  `password` VARCHAR(255) COMMENT '密码（BCrypt加密）',
  `student_no` VARCHAR(20) NOT NULL UNIQUE COMMENT '学号（唯一）',
  `nickname` VARCHAR(50) NOT NULL COMMENT '昵称',
  `phone` VARCHAR(20) COMMENT '手机号（唯一）',
  `sex` TINYINT(1) COMMENT '性别：0-未知, 1-男, 2-女',
  `avatar` VARCHAR(255) COMMENT '头像URL',
  `email` VARCHAR(100) COMMENT '邮箱（唯一）',
  `status` TINYINT(1) DEFAULT 0 COMMENT '状态：0-正常, 1-禁用',
  `is_verified` TINYINT(1) DEFAULT 0 COMMENT '认证状态：0-未认证, 1-已认证',
  `balance` DECIMAL(10,2) DEFAULT 0.00 COMMENT '账户余额',
  `score` INT DEFAULT 0 COMMENT '用户积分',
  `college` VARCHAR(100) COMMENT '学院',
  `major` VARCHAR(100) COMMENT '专业',
  `grade` VARCHAR(20) COMMENT '年级',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  UNIQUE KEY `uk_student_no` (`student_no`),
  KEY `idx_phone` (`phone`),
  KEY `idx_email` (`email`)
);
```

#### 2. 商品表 (`product`)

```sql
CREATE TABLE `product` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `name` VARCHAR(200) NOT NULL COMMENT '商品名称',
  `category_id` BIGINT NOT NULL COMMENT '分类ID（外键→category.id）',
  `store_id` BIGINT NOT NULL COMMENT '商家ID（外键→store.id）',
  `price` DECIMAL(10,2) NOT NULL COMMENT '商品价格',
  `original_price` DECIMAL(10,2) COMMENT '原价',
  `stock` INT DEFAULT 0 COMMENT '库存数量',
  `sales_count` INT DEFAULT 0 COMMENT '销量',
  `images` TEXT COMMENT '商品图片',
  `description` TEXT COMMENT '商品描述',
  `specifications` TEXT COMMENT '商品规格',
  `status` TINYINT(1) DEFAULT 1 COMMENT '状态：0-下架, 1-上架',
  `is_featured` TINYINT(1) DEFAULT 0 COMMENT '是否推荐：0-否, 1-是',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category_id` (`category_id`),
  KEY `idx_store_id` (`store_id`),
  CONSTRAINT `fk_product_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_product_store_id` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`) ON DELETE CASCADE
);
```

---

## 🏗️ 架构设计

### 分层架构

```
Controller Layer (REST API)
    ↓ 参数验证 (@Valid)
Service Layer (业务逻辑 + 事务)
    ↓ 数据转换 + 唯一性校验
Mapper Layer (MyBatis-Plus)
    ↓ SQL执行
MySQL Database
    ↓ 约束检查
Global Exception Handler (统一异常响应)
```

### 核心组件

| 组件 | 类名 | 职责 |
|------|------|------|
| **DTO** | `UserBatchInsertDTO` | 用户数据传输对象，包含验证注解 |
| **DTO** | `ProductBatchInsertDTO` | 商品数据传输对象，包含验证注解 |
| **Service接口** | `UserBatchInsertService` | 定义用户插入操作契约 |
| **Service接口** | `ProductBatchInsertService` | 定义商品插入操作契约 |
| **Service实现** | `UserBatchInsertServiceImpl` | 用户插入逻辑实现（含事务） |
| **Service实现** | `ProductBatchInsertServiceImpl` | 商品插入逻辑实现（含事务） |
| **Controller** | `UserBatchInsertController` | 用户插入REST API端点 |
| **Controller** | `ProductBatchInsertController` | 商品插入REST API端点 |
| **异常处理** | `DataInsertGlobalExceptionHandler` | 全局统一异常捕获和处理 |

---

## 🔌 API 接口说明

### 用户数据管理接口

基础路径: `/api/admin/user`
权限要求: `@RequiresAdmin` (管理员权限)

#### 1. 添加单个用户

```http
POST /api/admin/user/insert
Content-Type: application/json

{
  "username": "newuser001",
  "password": "SecurePass123",
  "studentNo": "2026990001",
  "nickname": "新用户001",
  "phone": "13900001111",
  "sex": 1,
  "email": "user001@example.com",
  "college": "计算机学院",
  "major": "软件工程",
  "grade": "2026"
}
```

**成功响应 (200 OK):**
```json
{
  "code": 200,
  "message": "用户添加成功",
  "data": {
    "id": 100,
    "username": "newuser001",
    "nickname": "新用户001",
    "studentId": "2026990001",
    ...
  }
}
```

**参数验证失败 (400 Bad Request):**
```json
{
  "code": 400,
  "message": "参数验证失败",
  "data": {
    "username": "用户名长度必须在3-50个字符之间",
    "studentNo": "学号格式不正确，应为8-20位数字"
  }
}
```

**数据重复冲突 (409 Conflict):**
```json
{
  "code": 409,
  "message": "用户名已存在，请使用其他用户名"
}
```

---

#### 2. 批量添加用户

```http
POST /api/admin/user/insert/batch
Content-Type: application/json

[
  {
    "username": "batch_user_01",
    "password": "Pass123456",
    "studentNo": "2026990101",
    "nickname": "批量用户01",
    "phone": "13901010101",
    "sex": 1,
    "college": "理学院",
    "major": "数学",
    "grade": "2026"
  },
  {
    "username": "batch_user_02",
    "password": "Pass123456",
    "studentNo": "2026990102",
    "nickname": "批量用户02",
    "phone": "13901010202",
    "sex": 2,
    "college": "文学院",
    "major": "中文",
    "grade": "2026"
  }
]
```

**成功响应 (200 OK):**
```json
{
  "code": 200,
  "message": "成功插入2条用户数据",
  "data": {
    "success": true,
    "totalCount": 2,
    "successCount": 2,
    "failCount": 0,
    "data": [
      { "id": 101, "username": "batch_user_01", ... },
      { "id": 102, "username": "batch_user_02", ... }
    ]
  }
}
```

**部分成功响应 (200 OK):**
```json
{
  "code": 200,
  "message": "部分成功：成功1条，失败1条。失败详情：第2条(username=batch_user_dup): 数据重复 - 用户名",
  "data": {
    "success": true,
    "totalCount": 2,
    "successCount": 1,
    "failCount": 1,
    "data": [{ "id": 103, "username": "batch_user_ok", ... }]
  }
}
```

---

#### 3. 预检查用户数据

```http
POST /api/admin/user/validate
Content-Type: application/json

{
  "username": "check_user",
  "studentNo": "2026990999"
}
```

---

### 商品数据管理接口

基础路径: `/api/admin/product`
权限要求: `@RequiresAdmin` (管理员权限)

#### 1. 添加单个商品

```http
POST /api/admin/product/insert
Content-Type: application/json

{
  "name": "高性能笔记本电脑",
  "categoryId": 1,
  "storeId": 1,
  "price": 4999.00,
  "originalPrice": 5999.00,
  "stock": 100,
  "salesCount": 0,
  "description": "最新款笔记本电脑，性能强劲",
  "specifications": "{\"cpu\": \"Intel i7\", \"ram\": \"16GB\", \"ssd\": \"512GB\"}",
  "status": 1,
  "isFeatured": 0
}
```

**成功响应 (200 OK):**
```json
{
  "code": 200,
  "message": "商品添加成功",
  "data": {
    "id": 500,
    "name": "高性能笔记本电脑",
    "categoryId": 1,
    "storeId": 1,
    "price": 4999.00,
    "stock": 100,
    ...
  }
}
```

**外键约束失败 (400 Bad Request):**
```json
{
  "code": 400,
  "message": "分类ID 999 不存在"
}
```

---

#### 2. 批量添加商品

```http
POST /api/admin/product/insert/batch
Content-Type: application/json

[
  {
    "name": "无线鼠标",
    "categoryId": 1,
    "storeId": 1,
    "price": 79.90,
    "stock": 500,
    "status": 1
  },
  {
    "name": "机械键盘",
    "categoryId": 1,
    "storeId": 1,
    "price": 299.00,
    "stock": 200,
    "isFeatured": 1
  }
]
```

---

#### 3. 预检查商品数据

```http
POST /api/admin/product/validate
Content-Type: application/json

{
  "name": "测试商品",
  "categoryId": 1,
  "storeId": 1
}
```

---

## ⚙️ 核心特性详解

### 1️⃣ 事务处理机制

```java
@Transactional(rollbackFor = Exception.class)
public Result<User> insertSingle(UserBatchInsertDTO dto) {
    // 所有数据库操作在同一个事务中执行
    // 如果发生任何异常，自动回滚所有操作
    validateUserUniqueness(dto);  // 可能抛出DuplicateKeyException
    User user = convertToEntity(dto);
    save(user);  // MyBatis-Plus的保存操作
    return Result.success(user);
}
```

**事务保证：**
- ✅ 单条插入：原子性操作，成功或完全回滚
- ✅ 批量插入：逐条处理，单条失败不影响其他记录
- ✅ 异常回滚：任何未捕获异常都会触发回滚
- ✅ 缓存清除：`@CacheEvict` 清理相关缓存

---

### 2️⃣ 数据验证体系

#### DTO层验证（Jakarta Validation）

```java
public class UserBatchInsertDTO {
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 50, message = "用户名长度必须在3-50个字符之间")
    @Pattern(regexp = "^[a-zA-Z0-9_\\u4e00-\\u9fa5]+$", message = "用户名格式不合法")
    private String username;

    @NotBlank(message = "学号不能为空")
    @Pattern(regexp = "^\\d{8,20}$", message = "学号应为8-20位数字")
    private String studentNo;

    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    @Email(message = "邮箱格式不正确")
    private String email;
}
```

#### Service层业务验证

```java
private void validateUserUniqueness(UserBatchInsertDTO dto) {
    if (existsByUsername(dto.getUsername())) {
        throw new DuplicateKeyException("用户名已存在");
    }
    if (existsByStudentNo(dto.getStudentNo())) {
        throw new DuplicateKeyException("学号已存在");
    }
    if (dto.getPhone() != null && existsByPhone(dto.getPhone())) {
        throw new DuplicateKeyException("手机号已被注册");
    }
}
```

#### 外键约束验证（商品模块）

```java
private void validateForeignKeys(ProductBatchInsertDTO dto) {
    Category category = categoryMapper.selectById(dto.getCategoryId());
    if (category == null) {
        throw new IllegalArgumentException("分类ID不存在");
    }

    Store store = storeMapper.selectById(dto.getStoreId());
    if (store == null) {
        throw new IllegalArgumentException("商家ID不存在");
    }
}
```

---

### 3️⃣ 异常处理策略

#### 全局异常处理器

```java
@RestControllerAdvice
public class DataInsertGlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public R<?> handleValidationException(MethodArgumentNotValidException e) {
        // 提取字段级错误信息
        Map<String, String> errors = e.getBindingResult()
            .getFieldErrors().stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                FieldError::getDefaultMessage
            ));
        return R.error(400, "参数验证失败", errors);
    }

    @ExceptionHandler(DuplicateKeyException.class)
    public R<?> handleDuplicateKeyException(DuplicateKeyException e) {
        // 返回友好的重复提示
        String message = extractDuplicateKeyMessage(e.getMessage());
        return R.error(409, message);
    }
}
```

**HTTP状态码规范：**

| 状态码 | 含义 | 触发场景 |
|--------|------|----------|
| **200 OK** | 操作成功 | 数据成功插入 |
| **400 Bad Request** | 参数错误 | 字段验证失败、外键不存在 |
| **409 Conflict** | 数据冲突 | 唯一约束违反 |
| **500 Internal Error** | 服务器错误 | 未预期的系统异常 |

---

### 4️⃣ 安全措施

#### 密码加密存储

```java
private User convertToEntity(UserBatchInsertDTO dto) {
    User user = new User();
    BeanUtils.copyProperties(dto, user);

    // 使用BCrypt算法加密密码
    user.setPassword(passwordEncoder.encode(dto.getPassword()));

    return user;
}
```

#### 权限控制

```java
@PostMapping("/insert")
@RequiresAdmin  // 仅管理员可访问
@Operation(summary = "添加单个用户")
public R<User> insertSingleUser(@Valid @RequestBody UserBatchInsertDTO dto) {
    // 业务逻辑...
}
```

---

## 🧪 测试验证

### SQL测试脚本

位置: [data_insert_test.sql](../sql/data/test/data_insert_test.sql)

**使用方法：**

```bash
# 连接MySQL数据库
mysql -u root -p heikeji_mall < sql/data/test/data_insert_test.sql
```

**测试内容：**

1. ✅ 单条用户数据插入
2. ✅ 批量用户数据插入（5条）
3. ✅ 商品数据插入（3条）
4. ✅ 唯一性约束验证查询
5. ✅ 外键完整性检查
6. ✅ 数据统计汇总

**预期输出：**

```
✅ 单条用户插入验证: record_count=1
✅ 批量用户插入验证: inserted_count=5
✅ 商品插入验证: inserted_count=3
✅ 用户名唯一性检查: 无重复记录
✅ 学号唯一性检查: 无重复记录
✅ 手机号唯一性检查: 无重复记录
✅ 商品-分类外键检查: 全部有效
✅ 商品-商家外键检查: 全部有效
```

---

## 📊 性能指标

| 操作类型 | 单次最大数量 | 预期耗时 | 事务策略 |
|----------|--------------|----------|----------|
| 单条用户插入 | 1 | < 100ms | 自动提交 |
| 批量用户插入 | ≤100 | < 2s | 逐条处理 |
| 单条商品插入 | 1 | < 100ms | 自动提交 |
| 批量商品插入 | ≤200 | < 3s | 逐条处理 |

**优化建议：**
- 批量插入建议分批处理（每批50-100条）
- 高并发场景考虑使用消息队列异步处理
- 大数据量导入建议使用MySQL的LOAD DATA命令

---

## 🔍 故障排查指南

### 常见问题及解决方案

#### 问题1: 用户名已存在

**错误信息:** `409 - 用户名已存在，请使用其他用户名`

**原因:** 违反了`username`字段的UNIQUE约束

**解决方案:**
```sql
-- 检查是否存在
SELECT * FROM user WHERE username = '目标用户名';

-- 如需删除旧记录
DELETE FROM user WHERE username = '目标用户名';
```

---

#### 问题2: 分类ID不存在

**错误信息:** `400 - 分类ID 999 不存在`

**原因:** 插入商品时引用了不存在的分类

**解决方案:**
```sql
-- 查看可用分类
SELECT id, name FROM category;

-- 或先创建分类
INSERT INTO category (name, parent_id) VALUES ('新分类', 0);
```

---

#### 问题3: 外键约束冲突

**错误信息:** `Cannot add or update a child row: a foreign key constraint fails`

**原因:** 关联的主表记录被删除或不存在

**解决方案:**
```sql
SET FOREIGN_KEY_CHECKS = 0;  -- 临时禁用外键检查
-- 执行插入操作
SET FOREIGN_KEY_CHECKS = 1;  -- 重新启用
```

---

#### 问题4: 事务回滚

**现象:** 批量插入部分失败后，成功的数据也消失了

**原因:** 默认事务配置会在任何异常时回滚整个批次

**解决方案:**
当前实现采用**逐条独立处理**模式，单条失败不会影响其他记录。如需严格事务一致性，可修改配置。

---

## 📝 使用示例

### 示例1: 通过cURL插入用户

```bash
# 单条插入
curl -X POST http://localhost:8080/api/admin/user/insert \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "username": "demo_user",
    "password": "Demo123456",
    "studentNo": "2026990001",
    "nickname": "演示用户",
    "phone": "13800138000",
    "sex": 1,
    "college": "计算机学院",
    "major": "软件工程"
  }'

# 批量插入
curl -X POST http://localhost:8080/api/admin/user/insert/batch \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '[{"username":"user1","password":"Pass123","studentNo":"2026010001","nickname":"用户1"}, {"username":"user2","password":"Pass123","studentNo":"2026010002","nickname":"用户2"}]'
```

### 示例2: 通过Swagger UI测试

1. 启动服务后访问: `http://localhost:8080/swagger-ui.html`
2. 找到"用户数据管理接口（管理员）"分组
3. 展开"添加单个用户"或"批量添加用户"
4. 点击"Try it out"，输入测试数据
5. 点击"Execute"查看结果

---

## 🎓 最佳实践

### ✅ 推荐做法

1. **生产环境前必做:**
   - 在测试环境充分验证批量插入功能
   - 准备好数据备份方案
   - 设置合理的批量大小限制

2. **数据质量保证:**
   - 先调用`/validate`接口预检数据
   - 处理好NULL值和默认值
   - 确保外键关联数据已存在

3. **性能优化:**
   - 批量操作避免高峰期执行
   - 监控数据库连接池状态
   - 定期清理历史测试数据

### ❌ 避免事项

1. 不要在生产环境直接执行未经验证的批量插入
2. 不要忽略异常日志中的警告信息
3. 不要在事务中执行耗时的外部调用
4. 不要超过单次批量插入的数量限制

---

## 🔄 版本更新记录

| 版本 | 日期 | 更新内容 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-04-07 | 初始版本，实现完整的用户和商品批量插入功能 | AI Assistant |

---

## 📞 技术支持

如遇到问题，请检查：
1. 应用日志: `logs/heikeji-mall.log`
2. MySQL慢查询日志
3. Swagger API文档中的接口说明
4. 本文档的故障排查章节

---

**文档结束** | 最后更新: 2026-04-07 | 状态: ✅ 已完成并经过验证
