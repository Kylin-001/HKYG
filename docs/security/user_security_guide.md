# 用户安全模块配置指南

## 概述

用户安全模块为黑科易购项目提供了完整的用户安全管理功能，包括用户认证、密码安全、登录历史、权限管理等功能。

## 模块结构

### 1. 数据库表结构

#### 角色权限表 (sys_role)
```sql
-- 存储系统角色信息
- id: 角色ID (主键)
- role_name: 角色名称
- description: 角色描述
- status: 状态 (1=启用, 0=禁用)
- create_time: 创建时间
- update_time: 更新时间
```

#### 权限表 (sys_permission)
```sql
-- 存储系统权限信息
- id: 权限ID (主键)
- permission_code: 权限编码
- permission_name: 权限名称
- description: 权限描述
- resource_type: 资源类型 (menu=菜单, button=按钮, api=接口)
- create_time: 创建时间
- update_time: 更新时间
```

#### 用户角色关联表 (sys_user_role)
```sql
-- 用户角色关联关系
- user_id: 用户ID
- role_id: 角色ID
- create_time: 创建时间
```

#### 角色权限关联表 (sys_role_permission)
```sql
-- 角色权限关联关系
- role_id: 角色ID
- permission_id: 权限ID
- create_time: 创建时间
```

#### 用户登录历史表 (user_login_history)
```sql
-- 用户登录历史记录
- user_id: 用户ID
- login_time: 登录时间
- logout_time: 登出时间
- ip_address: IP地址
- location: 地理位置
- device_info: 设备信息
- device_type: 设备类型
- os_info: 操作系统信息
- browser_info: 浏览器信息
- login_status: 登录状态 (1=成功, 0=失败)
- failure_reason: 失败原因
- session_id: 会话ID
- user_agent: User-Agent
- is_online: 是否在线 (1=在线, 0=离线)
- create_time: 创建时间
- update_time: 更新时间
```

### 2. 核心组件

#### EnhancedAuthorizationInterceptor
- **功能**: 权限验证拦截器
- **特性**: 
  - 用户状态检查
  - 角色权限验证 (支持ALL/ANY检查类型)
  - 用户访问日志记录

#### UserSecurityService
- **功能**: 用户安全服务接口
- **方法**: 登录、登出、修改密码、重置密码等14个接口方法

#### PasswordStrengthChecker
- **功能**: 密码强度验证
- **特性**: 
  - 支持密码强度评分
  - 弱密码检测
  - 随机强密码生成

#### CaptchaComponent
- **功能**: 验证码组件
- **特性**: 
  - 图形验证码生成
  - Redis存储验证码
  - 验证码过期机制

#### NotificationComponent
- **功能**: 通知组件
- **特性**: 
  - 邮件验证码发送
  - 短信验证码发送
  - 登录/密码重置/账户锁定通知

### 3. 配置参数

#### 密码安全配置 (PasswordConfig)
```java
MIN_LENGTH = 8                    // 最小密码长度
MAX_LENGTH = 50                   // 最大密码长度
MIN_STRENGTH_SCORE = 7            // 最小强度分数
EXPIRE_DAYS = 90                  // 密码过期天数
CANNOT_REUSE_COUNT = 5            // 不能重复使用的历史密码数量
```

#### 登录安全配置 (LoginConfig)
```java
MAX_FAILURE_COUNT = 5             // 最大失败次数
LOCK_DURATION_MINUTES = 30        // 锁定时间（分钟）
SESSION_TIMEOUT_MINUTES = 30      // 会话超时时间（分钟）
MAX_IP_FAILURE_COUNT = 10         // IP最大失败次数
CAPTCHA_FAILURE_THRESHOLD = 3     // 验证码阈值
```

#### 验证码配置 (CaptchaConfig)
```java
EXPIRE_TIME = 300                 // 验证码过期时间（秒）
WIDTH = 120                       // 验证码图片宽度
HEIGHT = 40                       // 验证码图片高度
LENGTH = 4                        // 验证码长度
```

#### 验证码配置 (VerificationCodeConfig)
```java
EXPIRE_TIME = 300                 // 验证码过期时间（秒）
MAX_SEND_COUNT_PER_HOUR = 5       // 每小时最大发送次数
```

## 使用指南

### 1. 权限验证

#### 注解方式
```java
@PreAuthorize("hasRole('ADMIN')")
public Result<?> adminMethod() {
    return Result.success();
}

@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
public Result<?> multiRoleMethod() {
    return Result.success();
}

@PreAuthorize("hasPermission('/api/users', 'READ')")
public Result<?> permissionMethod() {
    return Result.success();
}
```

#### 拦截器方式
```java
// 在拦截器中自动验证用户权限
// 支持ALL模式：用户必须拥有所有指定权限
// 支持ANY模式：用户只需拥有任一指定权限
```

### 2. 用户认证

#### 登录流程
```java
// 1. 验证用户凭据
UserSecurityService.login();

// 2. 记录登录历史
LoginRecordComponent.recordLogin();

// 3. 生成会话
// 自动管理Redis会话状态
```

#### 密码管理
```java
// 1. 密码强度检查
PasswordStrengthChecker.checkPasswordStrength(password);

// 2. 修改密码
UserSecurityService.changePassword(userId, oldPassword, newPassword);

// 3. 重置密码
UserSecurityService.resetPassword(resetPasswordDTO);
```

### 3. 验证码服务

#### 生成验证码
```java
// 生成图形验证码
String captchaImage = captchaComponent.generateCaptcha(sessionId);

// 验证验证码
boolean result = captchaComponent.verifyCaptcha(sessionId, inputCode);
```

### 4. 通知服务

#### 发送验证邮件
```java
// 生成邮箱验证码
String code = notificationComponent.generateEmailVerificationCode(email, "register");

// 发送登录通知
notificationComponent.sendLoginNotification(email, phone, loginTime, ipAddress, deviceInfo);
```

## Redis缓存配置

### Key前缀约定
- `captcha:` - 验证码缓存
- `verification_code:` - 验证吗缓存
- `session:` - 会话缓存
- `login_failure:user:` - 用户登录失败缓存
- `login_failure:ip:` - IP登录失败缓存
- `account_lock:user:` - 用户账户锁定缓存
- `online_session:` - 在线会话缓存

## 安全注意事项

### 1. 密码安全
- 使用BCrypt加密存储密码
- 定期检查密码强度
- 设置密码过期策略
- 防止密码重用

### 2. 会话安全
- 设置合理的会话超时时间
- 支持并发会话限制
- 记录会话创建和销毁时间
- 及时清理过期会话

### 3. 访问控制
- 多层权限验证
- 防止权限提升攻击
- 审计权限变更
- 限制敏感操作频率

### 4. 监控告警
- 异常登录检测
- 频繁失败登录告警
- 可疑IP监控
- 账户安全状态变更通知

## 扩展配置

### 1. 自定义密码策略
```java
@Component
public class CustomPasswordPolicy extends PasswordPolicy {
    // 实现自定义密码验证规则
}
```

### 2. 通知渠道扩展
```java
@Component
public class WeChatNotificationService implements NotificationChannel {
    // 集成微信通知
}
```

### 3. 第三方认证
```java
@Component
public class OAuth2AuthenticationProvider {
    // 集成OAuth2认证
}
```

## 监控和维护

### 1. 性能监控
- 接口响应时间
- 缓存命中率
- 数据库查询性能
- 并发用户数

### 2. 安全监控
- 登录成功率
- 密码修改频率
- 权限使用情况
- 异常访问模式

### 3. 定期维护
- 清理过期数据
- 更新安全策略
- 备份重要配置
- 审计日志分析

## 故障排除

### 1. 常见问题

#### 登录失败
- 检查用户名密码是否正确
- 验证用户账户状态
- 检查是否存在账户锁定
- 查看登录历史记录

#### 权限验证失败
- 确认用户角色配置
- 检查权限编码是否正确
- 验证权限验证模式(ALL/ANY)
- 查看拦截器配置

#### 验证码问题
- 检查Redis连接状态
- 验证验证码是否过期
- 确认会话ID有效性
- 查看验证码生成逻辑

### 2. 调试方法
- 启用详细日志
- 使用Redis监控工具
- 查看SQL执行日志
- 分析网络请求详情

---

本配置指南涵盖了用户安全模块的完整使用方法。如有问题，请参考相关代码实现或联系开发团队。