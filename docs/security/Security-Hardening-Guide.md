# 代码安全加固指南

## 概述

本指南提供了HKYG项目代码安全加固的全面方案，包括安全审计、漏洞扫描、数据脱敏和API速率限制等安全措施。

## 安全架构设计

### 1. 纵深防御策略

```
┌─────────────────────────────────────────────────────────┐
│                     应用层安全                          │
├─────────────────────────────────────────────────────────┤
│                   API速率限制                          │
│                   数据脱敏处理                          │
│                   输入验证过滤                          │
├─────────────────────────────────────────────────────────┤
│                   业务逻辑安全                          │
│                   权限控制检查                          │
│                   敏感操作审计                          │
├─────────────────────────────────────────────────────────┤
│                   数据传输安全                          │
│                   HTTPS加密传输                        │
│                   API签名验证                          │
├─────────────────────────────────────────────────────────┤
│                   数据存储安全                          │
│                   数据库加密                            │
│                   敏感数据脱敏                          │
└─────────────────────────────────────────────────────────┘
```

## 安全审计与漏洞扫描

### 1. 自动化安全审计

使用我们提供的安全审计工具定期扫描代码：

```bash
# 运行安全审计
npm run security:audit

# 生成安全报告
npm run security:report
```

### 2. 扫描内容

#### 2.1 敏感信息泄露检测

- **硬编码密码**: 检查代码中的硬编码密码、密钥等
- **API密钥暴露**: 检查暴露的API密钥和访问令牌
- **数据库连接**: 检查暴露的数据库连接字符串
- **调试信息**: 检查生产环境中的调试代码

#### 2.2 注入漏洞检测

- **SQL注入**: 检查可能的SQL注入点
- **XSS漏洞**: 检查跨站脚本攻击风险
- **代码注入**: 检查eval()等危险函数使用
- **命令注入**: 检查命令执行风险

#### 2.3 认证与授权漏洞

- **CSRF漏洞**: 检查跨站请求伪造风险
- **会话管理**: 检查会话安全问题
- **权限绕过**: 检查权限控制缺陷
- **认证弱点**: 检查认证机制问题

#### 2.4 第三方组件漏洞

- **依赖漏洞**: 使用npm audit扫描依赖漏洞
- **版本过时**: 检查过时的第三方库
- **已知漏洞**: 匹配已知CVE漏洞

### 3. 安全报告分析

安全审计工具会生成详细的HTML和JSON报告，包括：

- 漏洞严重程度分级
- 修复建议和最佳实践
- 代码位置和行号
- 漏洞类型和影响范围

## 数据脱敏策略

### 1. 脱敏原则

- **最小必要原则**: 只脱敏必要的敏感数据
- **保持格式一致**: 脱敏后保持数据格式一致性
- **可逆性考虑**: 生产环境使用不可逆脱敏，测试环境可使用可逆脱敏
- **性能影响**: 脱敏操作不应显著影响性能

### 2. 脱敏规则

#### 2.1 个人身份信息

| 字段类型 | 脱敏规则 | 示例 |
|----------|----------|------|
| 姓名 | 保留首尾字符，中间用*替代 | 张三 → 张* |
| 手机号 | 保留前3位和后4位，中间用*替代 | 13800138000 → 138****8000 |
| 邮箱 | 保留@前2位和@后域名，中间用*替代 | zhangsan@example.com → zh***@example.com |
| 身份证 | 保留前6位和后4位，中间用*替代 | 110101199001011234 → 110101********1234 |
| 银行卡 | 保留后4位，前面用*替代 | 6222021234567890 → **** **** **** 7890 |

#### 2.2 地址信息

| 字段类型 | 脱敏规则 | 示例 |
|----------|----------|------|
| 详细地址 | 保留前6位和后6位，中间用*替代 | 北京市朝阳区某某街道123号 → 北京市朝阳区***123号 |
| 经纬度 | 保留小数点后2位 | 116.397128 → 116.39*** |

#### 2.3 账户信息

| 字段类型 | 脱敏规则 | 示例 |
|----------|----------|------|
| 密码 | 完全隐藏 | 123456 → ****** |
| 支付密码 | 完全隐藏 | 123456 → ****** |
| 安全问题 | 部分隐藏 | 你的小学名称 → 你的*** |
| 支付密码答案 | 部分隐藏 | 答案 → *** |

### 3. 脱敏实现

#### 3.1 使用数据脱敏工具

```javascript
const { DataMasking } = require('@/utils/data-masking')

const masking = new DataMasking()

// 脱敏字符串
const maskedPhone = masking.maskString('13800138000', 'phone')
console.log(maskedPhone) // 138****8000

// 脱敏对象
const userData = {
  name: '张三',
  phone: '13800138000',
  email: 'zhangsan@example.com'
}

const maskedData = masking.maskObject(userData)
console.log(maskedData)
// {
//   name: '张*',
//   phone: '138****8000',
//   email: 'zh***@example.com'
// }
```

#### 3.2 数据库查询结果脱敏

```javascript
const { DatabaseQueryMasking } = require('@/utils/data-masking')

const dbMasking = new DatabaseQueryMasking()

// 脱敏查询结果
const result = await dbMasking.maskQueryResult(sqlResult, {
  includeFields: ['phone', 'email', 'idCard']
})
```

#### 3.3 API响应脱敏

```javascript
const { ApiResponseMasking } = require('@/utils/data-masking')

const apiMasking = new ApiResponseMasking()

// 脱敏API响应
const maskedResponse = apiMasking.maskApiResponse(response, {
  excludeFields: ['id', 'status'], // 排除不需要脱敏的字段
  deep: true // 深度脱敏嵌套对象
})
```

#### 3.4 日志脱敏

```javascript
const { LogMasking } = require('@/utils/data-masking')

const logMasking = new LogMasking()

// 脱敏日志消息
const maskedMessage = logMasking.maskLogMessage('用户登录: password=123456')
console.log(maskedMessage) // 用户登录: password=***

// 脱敏日志对象
const logObject = {
  user: {
    username: 'admin',
    password: '123456'
  }
}

const maskedLogObject = logMasking.maskLogObject(logObject)
```

## API速率限制

### 1. 速率限制策略

#### 1.1 基于用户的限制

| 用户类型 | 时间窗口 | 请求次数 | 说明 |
|----------|----------|----------|------|
| 普通用户 | 1分钟 | 100次 | 常规API调用 |
| VIP用户 | 1分钟 | 200次 | 更宽松的限制 |
| 管理员 | 1分钟 | 500次 | 最宽松的限制 |

#### 1.2 基于接口的限制

| 接口类型 | 时间窗口 | 请求次数 | 说明 |
|----------|----------|----------|------|
| 登录接口 | 15分钟 | 5次 | 防止暴力破解 |
| 注册接口 | 1小时 | 3次 | 防止恶意注册 |
| 短信接口 | 1小时 | 10次 | 防止短信轰炸 |
| 文件上传 | 1小时 | 20次 | 防止资源滥用 |

#### 1.3 基于IP的限制

| IP类型 | 时间窗口 | 请求次数 | 说明 |
|--------|----------|----------|------|
| 正常IP | 1分钟 | 200次 | 常规访问 |
| 可疑IP | 1分钟 | 50次 | 降低限制 |
| 恶意IP | 1小时 | 10次 | 严格限制 |

### 2. 速率限制实现

#### 2.1 Express中间件

```javascript
const { rateLimitMiddleware } = require('@/utils/rate-limit')

// 使用默认规则
app.use(rateLimitMiddleware())

// 使用自定义规则
app.use('/api/', rateLimitMiddleware({
  ruleGetter: (req) => {
    if (req.path.includes('/auth/login')) {
      return 'auth'
    }
    return 'api'
  },
  rules: [
    {
      name: 'auth',
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 5,
      message: '登录尝试过于频繁，请15分钟后再试'
    },
    {
      name: 'api',
      windowMs: 60 * 1000, // 1分钟
      max: 100,
      message: 'API调用过于频繁，请稍后再试'
    }
  ]
}))
```

#### 2.2 Koa中间件

```javascript
const { koaRateLimitMiddleware } = require('@/utils/rate-limit')

// 使用Koa中间件
app.use(koaRateLimitMiddleware({
  ruleGetter: (ctx) => {
    return ctx.path.includes('/auth') ? 'auth' : 'default'
  }
}))
```

#### 2.3 Vue路由守卫

```javascript
const { createVueRateLimitGuard } = require('@/utils/rate-limit')

// 使用Vue路由守卫
router.beforeEach(createVueRateLimitGuard(router, {
  ruleGetter: (to) => {
    return to.meta.requiresAuth ? 'auth' : 'default'
  }
}))
```

### 3. 速率限制响应

当触发速率限制时，返回标准化的错误响应：

```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "请求过于频繁，请稍后再试",
  "data": {
    "limit": 100,
    "remaining": 0,
    "resetTime": "2023-01-01T12:01:00.000Z",
    "retryAfter": 60
  }
}
```

## 输入验证与过滤

### 1. 输入验证原则

- **白名单验证**: 只允许已知安全的输入
- **长度限制**: 限制输入字段的最大长度
- **格式验证**: 验证输入格式是否符合预期
- **特殊字符过滤**: 过滤或转义特殊字符

### 2. 常见验证规则

#### 2.1 用户输入验证

```javascript
// 用户名验证
const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/
// 只允许字母、数字、下划线，长度4-20

// 密码验证
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
// 至少8位，包含大小写字母和数字

// 手机号验证
const phoneRegex = /^1[3-9]\d{9}$/
// 中国大陆手机号格式

// 邮箱验证
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
// 标准邮箱格式
```

#### 2.2 SQL注入防护

```javascript
// 使用参数化查询
const sql = 'SELECT * FROM users WHERE id = ?'
const result = db.query(sql, [userId])

// 输入过滤
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input
  }
  
  // 移除危险字符
  return input.replace(/['"\\;--]/g, '')
}
```

#### 2.3 XSS防护

```javascript
// 使用DOMPurify清理HTML
import DOMPurify from 'dompurify'

const cleanHtml = DOMPurify.sanitize(userInput)

// 转义输出
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
```

## 认证与授权安全

### 1. 密码安全

#### 1.1 密码策略

- **最小长度**: 至少8位
- **复杂度要求**: 包含大小写字母、数字和特殊字符
- **历史密码**: 不能与最近3次密码相同
- **常见密码**: 不能使用常见弱密码

#### 1.2 密码存储

```javascript
const bcrypt = require('bcryptjs')

// 密码哈希
const saltRounds = 10
const hashedPassword = await bcrypt.hash(password, saltRounds)

// 密码验证
const isValid = await bcrypt.compare(inputPassword, hashedPassword)
```

### 2. 会话管理

#### 2.1 会话安全配置

```javascript
// Express会话配置
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only
    httpOnly: true, // 防止XSS
    maxAge: 30 * 60 * 1000, // 30分钟过期
    sameSite: 'strict' // CSRF防护
  }
}))
```

#### 2.2 JWT令牌安全

```javascript
const jwt = require('jsonwebtoken')

// 生成JWT令牌
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { 
    expiresIn: '1h',
    issuer: 'heikeji',
    audience: 'heikeji-users'
  }
)

// 验证JWT令牌
const decoded = jwt.verify(token, process.env.JWT_SECRET)
```

### 3. 权限控制

#### 3.1 RBAC权限模型

```javascript
// 角色权限映射
const rolePermissions = {
  'admin': ['user:create', 'user:read', 'user:update', 'user:delete'],
  'merchant': ['product:create', 'product:read', 'product:update'],
  'user': ['product:read', 'order:create', 'order:read']
}

// 权限检查中间件
function requirePermission(permission) {
  return (req, res, next) => {
    const userRole = req.user?.role
    const userPermissions = rolePermissions[userRole] || []
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        code: 'PERMISSION_DENIED',
        message: '权限不足'
      })
    }
    
    next()
  }
}
```

## 数据传输安全

### 1. HTTPS配置

#### 1.1 强制HTTPS

```javascript
// Express强制HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`)
  } else {
    next()
  }
})
```

#### 1.2 HSTS头部

```javascript
// 设置HSTS头部
app.use((req, res, next) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )
  next()
})
```

### 2. API安全头部

```javascript
// 设置安全头部
app.use((req, res, next) => {
  // 防止XSS
  res.setHeader('X-XSS-Protection', '1; mode=block')
  
  // 防止MIME类型嗅探
  res.setHeader('X-Content-Type-Options', 'nosniff')
  
  // 防止点击劫持
  res.setHeader('X-Frame-Options', 'DENY')
  
  // 内容安全策略
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  )
  
  next()
})
```

## 安全监控与日志

### 1. 安全事件监控

```javascript
// 安全事件记录
function logSecurityEvent(event, details) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: details.ip,
    userAgent: details.userAgent,
    userId: details.userId
  }
  
  // 记录到安全日志
  logger.warn('SECURITY_EVENT', logEntry)
  
  // 发送告警
  if (isHighRiskEvent(event)) {
    sendSecurityAlert(logEntry)
  }
}

// 使用示例
app.post('/api/login', (req, res) => {
  // 登录逻辑...
  
  // 记录登录事件
  logSecurityEvent('LOGIN', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: user.id,
    success: true
  })
})
```

### 2. 异常监控

```javascript
// 异常处理中间件
app.use((err, req, res, next) => {
  // 记录异常
  logger.error('APPLICATION_ERROR', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })
  
  // 不暴露敏感错误信息
  res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: '服务器内部错误'
  })
})
```

## 安全最佳实践

### 1. 开发安全

- **代码审查**: 所有代码变更必须经过安全审查
- **安全培训**: 定期进行安全意识培训
- **依赖管理**: 定期更新依赖，修复已知漏洞
- **环境隔离**: 开发、测试、生产环境严格隔离

### 2. 部署安全

- **最小权限原则**: 应用程序只使用必要的权限
- **网络隔离**: 使用防火墙限制不必要的网络访问
- **定期备份**: 定期备份数据和配置
- **监控告警**: 部署安全监控和告警系统

### 3. 运维安全

- **访问控制**: 严格控制系统访问权限
- **日志审计**: 定期审计系统日志
- **漏洞扫描**: 定期进行安全漏洞扫描
- **应急响应**: 建立安全事件应急响应流程

## 安全检查清单

### 1. 代码安全

- [ ] 硬编码密码和密钥已移除
- [ ] SQL注入防护已实现
- [ ] XSS防护已实现
- [ ] 输入验证已实现
- [ ] 输出编码已实现

### 2. 认证授权

- [ ] 强密码策略已实现
- [ ] 会话管理安全
- [ ] JWT令牌安全
- [ ] 权限控制完善
- [ ] 多因素认证考虑

### 3. 数据保护

- [ ] 敏感数据已脱敏
- [ ] 数据传输加密
- [ ] 数据库访问控制
- [ ] 数据备份策略
- [ ] 数据销毁流程

### 4. 网络安全

- [ ] HTTPS已启用
- [ ] 安全头部已设置
- [ ] 防火墙规则配置
- [ ] DDoS防护考虑
- [ ] 网络监控实现

## 总结

通过实施本安全加固方案，HKYG项目将具备以下安全能力：

1. **全面的漏洞防护**: 防止常见的Web应用漏洞
2. **数据保护机制**: 确保敏感数据不被泄露
3. **访问控制体系**: 实现细粒度的权限管理
4. **安全监控能力**: 及时发现和响应安全事件
5. **合规性支持**: 满足相关安全法规要求

安全是一个持续的过程，需要定期评估和改进。建议每季度进行一次全面的安全审计，并根据新的威胁和漏洞及时调整安全策略。