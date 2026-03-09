# API安全文档

## 概述

本文档描述了黑科易购校园服务平台前端项目的API安全措施，包括速率限制和数据加密功能。

## 功能特性

### 1. API速率限制

API速率限制用于防止API请求过于频繁，保护服务器免受滥用和DDoS攻击。

#### 预定义的速率限制

| API类型 | 时间窗口 | 最大请求数 | 说明 |
|---------|---------|-----------|------|
| 通用API | 60秒 | 60次 | 适用于大多数API |
| 登录API | 60秒 | 5次 | 防止暴力破解 |
| 注册API | 3600秒 | 3次 | 防止恶意注册 |
| 敏感操作API | 60秒 | 10次 | 用户信息、订单、支付等 |
| 文件上传API | 60秒 | 5次 | 防止资源滥用 |
| 搜索API | 60秒 | 30次 | 防止搜索滥用 |

#### 使用方法

```typescript
// 默认启用速率限制
await request.post('/api/login', { username, password })

// 禁用速率限制
await request.post('/api/login', { username, password }, { rateLimit: false })

// 自定义速率限制键
await request.post('/api/custom', data, { rateLimitKey: 'custom-key' })
```

#### 环境变量配置

```bash
# 是否启用速率限制
VITE_APP_ENABLE_RATE_LIMITING=true

# 通用API速率限制
VITE_APP_RATE_LIMIT_WINDOW=60
VITE_APP_RATE_LIMIT_MAX_REQUESTS=100

# 登录API速率限制
VITE_APP_LOGIN_RATE_LIMIT_WINDOW=60
VITE_APP_LOGIN_RATE_LIMIT_MAX_REQUESTS=5
```

### 2. 数据加密

数据加密用于保护敏感信息在传输过程中的安全性。

#### 加密类型

1. **字段级加密**: 只加密指定的字段
2. **对象级加密**: 加密整个数据对象
3. **响应解密**: 解密服务器返回的加密数据

#### 使用方法

```typescript
// 字段级加密
await request.post('/api/login', { 
  username, 
  password 
}, {
  encrypt: true,
  encryptFields: ['password'] // 只加密密码字段
})

// 对象级加密
await request.post('/api/sensitive', data, {
  encrypt: true // 加密整个数据对象
})

// 响应解密
const result = await request.get('/api/user/info', {}, {
  decryptResponse: true // 解密响应数据
})
```

#### 加密工具

```typescript
import { defaultEncryption, sensitiveDataEncryption } from '@/utils/encryption'

// 加密字符串
const encrypted = defaultEncryption.encrypt('sensitive data')

// 解密字符串
const decrypted = defaultEncryption.decrypt(encrypted)

// 加密对象
const encryptedObj = defaultEncryption.encryptObject({ key: 'value' })

// 解密对象
const decryptedObj = defaultEncryption.decryptObject(encryptedObj)

// 生成哈希
const hash = defaultEncryption.hash('data to hash')
```

#### 安全存储

```typescript
import { secureStorage } from '@/utils/encryption'

// 设置加密的本地存储
secureStorage.setItem('key', 'value')

// 获取加密的本地存储
const value = secureStorage.getItem('key')

// 设置加密的会话存储
secureStorage.setSessionItem('key', 'value')

// 获取加密的会话存储
const value = secureStorage.getSessionItem('key')
```

#### 环境变量配置

```bash
# 默认加密密钥
VITE_APP_ENCRYPTION_KEY=default-encryption-key-32

# 敏感数据加密密钥
VITE_APP_SENSITIVE_DATA_KEY=sensitive-data-encryption-key-64

# 本地存储加密密钥
VITE_APP_LOCAL_STORAGE_KEY=local-storage-encryption-key-48

# 是否启用请求加密
VITE_APP_ENABLE_REQUEST_ENCRYPTION=true

# 是否启用响应解密
VITE_APP_ENABLE_RESPONSE_DECRYPTION=true
```

## 最佳实践

### 1. 速率限制

1. **合理设置限制**: 根据API的重要性和资源消耗设置合适的限制
2. **差异化限制**: 对不同类型的API设置不同的限制
3. **用户友好提示**: 当触发限制时，提供清晰的等待时间提示
4. **监控和调整**: 定期监控API使用情况，调整限制参数

### 2. 数据加密

1. **最小化加密**: 只对必要的敏感数据进行加密，减少性能开销
2. **密钥管理**: 使用环境变量管理密钥，定期更换密钥
3. **加密强度**: 根据数据敏感性选择合适的加密强度
4. **错误处理**: 妥善处理加密和解密错误，避免信息泄露

### 3. 安全配置

1. **环境隔离**: 不同环境使用不同的密钥和配置
2. **密钥安全**: 确保密钥的安全存储和传输
3. **配置审查**: 定期审查安全配置，确保没有漏洞
4. **日志记录**: 记录安全相关事件，便于审计和排查

## 示例代码

### 登录API示例

```typescript
import { userApi } from '@/api/user'

// 登录请求（自动应用速率限制和密码加密）
const login = async (username: string, password: string) => {
  try {
    const result = await userApi.login({ username, password })
    // 处理登录成功
    return result
  } catch (error) {
    // 处理登录失败
    if (error.message.includes('请求过于频繁')) {
      // 显示速率限制提示
      console.error('登录请求过于频繁，请稍后再试')
    } else {
      // 其他错误处理
      console.error('登录失败:', error.message)
    }
    throw error
  }
}
```

### 敏感数据操作示例

```typescript
import request from '@/utils/request'

// 更新用户信息（加密敏感字段）
const updateProfile = async (profile: { 
  nickname: string
  email: string
  phone: string
}) => {
  return request.put('/api/user/profile', profile, {
    encrypt: true,
    encryptFields: ['phone'] // 只加密手机号
  })
}

// 获取用户信息（解密响应数据）
const getUserInfo = async () => {
  return request.get('/api/user/info', {}, {
    decryptResponse: true
  })
}
```

### 自定义速率限制示例

```typescript
import { createRateLimiter } from '@/utils/rate-limiter'

// 创建自定义速率限制器
const customLimiter = createRateLimiter({
  windowMs: 30 * 1000, // 30秒
  maxRequests: 10 // 最多10次请求
})

// 检查是否允许请求
if (customLimiter.isAllowed('custom-action')) {
  // 执行操作
  performCustomAction()
} else {
  // 显示限制提示
  const remainingTime = Math.ceil(
    (customLimiter.getResetTime('custom-action') - Date.now()) / 1000
  )
  console.log(`请等待${remainingTime}秒后再试`)
}
```

## 错误处理

### 速率限制错误

```typescript
try {
  await request.post('/api/login', { username, password })
} catch (error) {
  if (error.message.includes('请求过于频繁')) {
    // 处理速率限制错误
    const waitTime = parseInt(error.message.match(/\d+/)?.[0] || '60')
    showRateLimitMessage(waitTime)
  } else {
    // 其他错误处理
    handleOtherErrors(error)
  }
}
```

### 加密解密错误

```typescript
try {
  const encrypted = defaultEncryption.encrypt(sensitiveData)
  // 处理加密成功
} catch (error) {
  // 处理加密错误
  console.error('数据加密失败:', error)
  showErrorMessage('数据加密失败，请重试')
}

try {
  const decrypted = defaultEncryption.decrypt(encryptedData)
  // 处理解密成功
} catch (error) {
  // 处理解密错误
  console.error('数据解密失败:', error)
  showErrorMessage('数据解密失败，请重试')
}
```

## 测试

### 运行安全测试

```bash
# 运行所有安全相关测试
npm run test:security

# 运行特定测试文件
npm run test:unit src/api/security.test.ts
```

### 测试覆盖率

确保安全功能的测试覆盖率达到90%以上：

```bash
# 生成测试覆盖率报告
npm run test:coverage
```

## 监控和日志

### 速率限制监控

```typescript
import { rateLimiters } from '@/utils/rate-limiter'

// 获取速率限制状态
const getStatus = () => {
  return {
    general: rateLimiters.general.getStatus(),
    login: rateLimiters.login.getStatus(),
    register: rateLimiters.register.getStatus(),
    sensitive: rateLimiters.sensitive.getStatus(),
    upload: rateLimiters.upload.getStatus(),
    search: rateLimiters.search.getStatus(),
  }
}

// 定期记录速率限制状态
setInterval(() => {
  const status = getStatus()
  console.log('速率限制状态:', status)
}, 60000) // 每分钟记录一次
```

### 加密操作日志

```typescript
import logger from '@/utils/logger'

// 记录加密操作
logger.info('数据加密', { 
  operation: 'encrypt',
  dataType: 'user-password',
  timestamp: Date.now()
})

// 记录解密操作
logger.info('数据解密', { 
  operation: 'decrypt',
  dataType: 'user-info',
  timestamp: Date.now()
})
```

## 常见问题

### Q: 如何自定义速率限制？

A: 使用`createRateLimiter`函数创建自定义速率限制器：

```typescript
import { createRateLimiter } from '@/utils/rate-limiter'

const customLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1分钟
  maxRequests: 20 // 最多20次请求
})
```

### Q: 如何在不加密的情况下发送敏感数据？

A: 在请求配置中设置`encrypt: false`：

```typescript
await request.post('/api/safe-endpoint', sensitiveData, {
  encrypt: false
})
```

### Q: 如何处理加密密钥的轮换？

A: 更新环境变量中的密钥，并确保新旧密钥在过渡期内都可用：

```typescript
// 支持多个密钥的解密
const decryptWithMultipleKeys = (encryptedData: string, keys: string[]) => {
  for (const key of keys) {
    try {
      const encryption = new DataEncryption({ key })
      return encryption.decrypt(encryptedData)
    } catch (error) {
      // 尝试下一个密钥
      continue
    }
  }
  throw new Error('所有密钥都无法解密数据')
}
```

### Q: 如何提高加密性能？

A: 1) 只加密必要的字段；2) 使用较短的加密密钥；3) 缓存加密结果；4) 使用Web Worker进行加密操作。

---

**注意**: 本文档会随着功能更新而变化，请定期查看最新版本。如有问题，请联系安全团队。