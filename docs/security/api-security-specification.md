# 黑科易购 - API安全规范

> **版本**: v1.0.0 | **状态**: Active | **分类**: 安全
> **创建日期**: 2026-04-05 | **最后更新**: 2026-04-05
> **适用范围**: 所有对外暴露的API接口

---

## 1. 安全架构总览

```
客户端 → HTTPS → API Gateway (安全层) → 微服务
                    │
                    ├── 认证鉴权 (JWT)
                    ├── 限流熔断 (Sentinel)
                    ├── XSS/CSRF 防护
                    ├── 参数校验 (Validator)
                    └── 日志审计 (脱敏)
```

---

## 2. 认证与授权

### 2.1 JWT Token 规范

#### Token 结构
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "用户ID",
    "uid": "用户唯一标识",
    "roles": ["ROLE_USER"],
    "permissions": ["product:read", "order:create"],
    "iat": 1704400000,
    "exp": 1704486400,
    "device": "设备指纹哈希"
  }
}
```

#### Token 使用规则

| 规则 | 说明 |
|------|------|
| 传输方式 | Header: `Authorization: Bearer <token>` |
| Access Token 有效期 | 2小时 |
| Refresh Token 有效期 | 7天 |
| 签名算法 | HS256 (HMAC-SHA256) |
| 密钥长度 | ≥ 256 bits |

#### Token 刷新流程
```
客户端 → POST /auth/refresh
       Body: { "refreshToken": "xxx" }

服务端 → 验证 refreshToken
       → 生成新 accessToken + refreshToken
       → 返回 { accessToken, refreshToken, expiresIn }
```

### 2.2 RBAC 权限模型

#### 角色定义

| 角色 | 权限数 | 说明 |
|------|--------|------|
| ROLE_ANONYMOUS | 5 | 未登录用户（浏览公开接口） |
| ROLE_USER | 25 | 普通注册用户 |
| ROLE_MERCHANT | 32 | 商家用户（含USER权限） |
| ROLE_ADMIN | 42 | 系统管理员（全权限） |

#### 权限点命名规范
```
{模块}:{操作}

模块: user / product / order / cart / takeout /
      secondhand / community / campus / payment / admin / system

操作: create / read / update / delete / export / audit / manage

示例:
- product:create    创建商品
- order:read        查看订单
- admin:user:ban    封禁用户
```

#### 权限校验方式

**网关层** (粗粒度):
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: admin-api
          uri: lb://heikeji-admin
          predicates:
            - Path=/admin/**
          filters:
            - HasAuthority=ROLE_ADMIN
```

**服务层** (细粒度):
```java
@PreAuthorize("hasPermission('product', 'create')")
@PostMapping("/products")
public Result<ProductVO> createProduct(@RequestBody ProductDTO dto) { ... }
```

**前端指令级**:
```vue
<button v-if="can('product:create')">发布商品</button>
```

---

## 3. 接口安全策略

### 3.1 公开接口白名单

以下接口无需认证即可访问：

| 路径 | 方法 | 说明 |
|------|------|------|
| `/auth/login` | POST | 用户登录 |
| `/auth/register` | POST | 用户注册 |
| `/auth/refresh` | POST | Token刷新 |
| `/auth/captcha` | GET | 获取验证码 |
| `/public/products` | GET | 商品列表(公开) |
| `/public/products/{id}` | GET | 商品详情(公开) |
| `/public/takeout/merchants` | GET | 商家列表(公开) |
| `/public/secondhand/list` | GET | 二手列表(公开) |
| `/public/community/posts` | GET | 帖子列表(公开) |
| `/actuator/health` | GET | 健康检查 |

### 3.2 敏感操作二次验证

以下操作需要额外验证：

| 操作 | 二次验证方式 |
|------|-------------|
| 修改密码 | 原密码 + 短信验证码 |
| 修改手机号 | 原手机验证码 + 新手机验证码 |
| 退款申请 | 支付密码 / 短信确认 |
| 注销账号 | 密码 + 确认等待期(30天) |
| 提现 | 支付密码 + 短信验证码 |

### 3.3 接口限流策略

| 限流维度 | 阈值 | 窗口 | 超限处理 |
|----------|------|------|----------|
| 全局限流 | 10000 QPS | 1s | 429 Too Many Requests |
| 单IP限流 | 100 QPS | 1s | 429 + CAPTCHA |
| 登录接口 | 5次/分钟 | 1m | 锁定15分钟 |
| 注册接口 | 3次/小时 | 1h | 锁定1小时 |
| 短信发送 | 10次/天 | 1d | 次日重置 |
| 敏感查询 | 30次/分钟 | 1m | 429 |

---

## 4. 数据安全

### 4.1 敏感数据分类

| 分类级别 | 数据示例 | 处理要求 |
|----------|----------|----------|
| L1 绝密 | 支付密码、JWT密钥 | 加密存储，不记录日志 |
| L2 机密 | 手机号、身份证号、银行卡号 | 脱敏存储，日志掩码 |
| L3 内部 | 用户真实姓名、地址详情 | 内部可查看，API返回脱敏 |
| L4 公开 | 昵称、头像、商品信息 | 可公开展示 |

### 4.2 数据脱敏规则

| 字段类型 | 脱敏规则 | 示例 |
|----------|----------|------|
| 手机号 | 中间4位掩码 | 138****5678 |
| 身份证号 | 出生月日掩码 | 230***********1234 |
| 银行卡号 | 前4后4显示 | 6222 **** **** 1234 |
| 真实姓名 | 姓显示，名掩码 | 张* / 王** |
| 地址 | 详细地址部分掩码 | 黑龙江省哈尔滨市**** |

### 4.3 日志安全规范

**禁止记录的内容:**
- ❌ JWT Token 完整值
- ❌ 用户密码（明文或哈希）
- ❌ 手机号完整值
- ❌ 身份证号完整值
- ❌ 银行卡完整号
- ❌ 支付密码
- ❌ 会话Cookie/Session ID

**必须记录的内容:**
- ✅ 操作用户ID（非敏感）
- ✅ 操作时间戳
- ✅ 操作IP地址
- ✅ 接口路径和方法
- ✅ 请求参数（已脱敏）
- ✅ 响应状态码
- ✅ 异常堆栈（不含敏感数据）

---

## 5. 输入输出安全

### 5.1 输入校验

#### 通用校验注解
```java
public class ProductDTO {
    @NotBlank(message = "名称不能为空")
    @Length(min=2, max=50, message="名称长度2-50字符")
    private String name;

    @NotNull(message = "价格不能为空")
    @DecimalMin(value = "0.01", message = "价格最小0.01元")
    @DecimalMax(value = "99999.99", message = "价格最大99999.99元")
    private BigDecimal price;

    @Pattern(regexp = "^https?://.*$", message = "图片URL格式错误")
    private String imageUrl;
}
```

#### XSS 防护
```java
// 输入过滤
String safeInput = HtmlUtils.htmlEscape(userInput);

// 输出编码 (前端配合)
// <div v-text="content"></div>  // 推荐
// <div>{{ content }}</div>     // Vue自动转义
// <div v-html="sanitizedHtml"></div> // 必须先净化
```

### 5.2 SQL注入防护

```java
// ✅ 正确: 参数化查询
@Select("SELECT * FROM products WHERE id = #{id} AND status = #{status}")
Product findByIdAndStatus(@Param("id") Long id, @Param("status") Integer status);

// ❌ 危险: 字符串拼接
// @Select("SELECT * FROM products WHERE name = '" + name + "'")  // 禁止!
```

### 5.3 CSRF 防护

**实现方式:**
1. SameSite Cookie 属性 (`Strict` 模式)
2. CSRF Token (表单提交时验证)
3. Origin/Referer 白名单检查

```java
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            )
            .headers(headers -> headers
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'"))
            );
        return http.build();
    }
}
```

---

## 6. 通信安全

### 6.1 HTTPS 强制

| 环境 | 要求 |
|------|------|
| 生产环境 | 强制HTTPS, HSTS启用 (max-age=31536000) |
| 开发环境 | HTTP允许，但建议使用自签名证书 |
| 测试环境 | HTTP允许 |

### 6.2 安全响应头

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cache-Control: no-store (敏感接口)
```

---

## 7. 安全审计与监控

### 7.1 安全事件类型

| 事件类型 | 级别 | 说明 |
|----------|------|------|
| LOGIN_FAILURE | WARNING | 连续登录失败 |
| LOGIN_SUCCESS | INFO | 正常登录 |
| TOKEN_EXPIRED | INFO | Token过期刷新 |
| PERMISSION_DENIED | WARNING | 无权限访问 |
| RATE_LIMIT_EXCEEDED | WARNING | 触发限流 |
| SUSPICIOUS_REQUEST | CRITICAL | 可疑请求模式 |
| DATA_EXPORT | INFO | 批量数据导出 |

### 7.2 告警规则

| 规则 | 条件 | 动作 |
|------|------|------|
| 暴力破解告警 | 同一IP 1分钟内失败5次 | IP临时封禁 + 通知管理员 |
| 异地登录告警 | 账号新IP首次登录 | 发送短信通知 |
| 异常流量告警 | QPS突增超过阈值3倍 | 自动扩容 + 告警 |
| 敏感操作告警 | 批量导出/权限变更 | 实时通知管理员 |

---

*本文档应每季度评审一次，根据安全威胁变化及时更新*
