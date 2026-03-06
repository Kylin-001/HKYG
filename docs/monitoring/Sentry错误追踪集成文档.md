# Sentry错误追踪集成文档

## 概述

本文档描述了如何在项目中集成和使用Sentry错误追踪服务。

## 功能特性

### 1. 自动错误捕获
- 全局异常处理器自动捕获所有未处理的异常
- 自动上报到Sentry平台
- 包含完整的堆栈跟踪和上下文信息

### 2. 性能监控
- 自动追踪HTTP请求性能
- 支持自定义事务追踪
- 性能数据采样上报

### 3. 用户追踪
- 自动关联用户信息
- 支持手动设置用户上下文
- 用户行为面包屑记录

### 4. 自定义监控
- 支持@SentryMonitor注解
- 自定义错误上报
- 自定义消息上报

## 配置说明

### application.yml配置

```yaml
sentry:
  enabled: true  # 启用Sentry
  dsn: https://your-dsn@sentry.io/project-id  # Sentry DSN
  environment: production  # 环境：development, staging, production
  release: heikeji-mall@1.0.0  # 版本号
  traces-sample-rate: 0.1  # 性能追踪采样率（0-1）
  profiles-sample-rate: 0.1  # 性能分析采样率（0-1）
  debug: false  # 调试模式
  max-breadcrumbs: 50  # 最大面包屑数量
  attach-stacktrace: true  # 附加堆栈跟踪
  server-name: heikeji-server  # 服务器名称
```

### 环境变量配置

```bash
export SENTRY_DSN=https://your-dsn@sentry.io/project-id
export SENTRY_ENVIRONMENT=production
export SENTRY_RELEASE=heikeji-mall@1.0.0
export SERVER_NAME=heikeji-server
```

## 使用方法

### 1. 自动错误捕获

系统会自动捕获所有未处理的异常并上报到Sentry：

```java
@RestController
public class ExampleController {
    
    @GetMapping("/example")
    public void example() {
        // 这个异常会被自动捕获并上报到Sentry
        throw new RuntimeException("示例错误");
    }
}
```

### 2. 手动错误上报

使用SentryErrorTrackingService手动上报错误：

```java
@Autowired
private SentryErrorTrackingService sentryErrorTrackingService;

public void someMethod() {
    try {
        // 业务逻辑
    } catch (Exception e) {
        // 手动上报错误
        Map<String, Object> context = new HashMap<>();
        context.put("userId", "123");
        context.put("action", "someMethod");
        
        sentryErrorTrackingService.captureException(e, context);
    }
}
```

### 3. 使用@SentryMonitor注解

在方法上添加@SentryMonitor注解进行监控：

```java
@Service
public class ExampleService {
    
    @SentryMonitor(operation = "processOrder", description = "处理订单")
    public void processOrder(Order order) {
        // 方法执行会被自动监控
        // 异常会被自动捕获并上报
    }
}
```

### 4. 用户追踪

设置用户上下文：

```java
@Autowired
private SentryErrorTrackingService sentryErrorTrackingService;

public void login(String userId, String username, String email) {
    // 设置用户信息
    sentryErrorTrackingService.setUser(userId, username, email);
    
    // 用户相关的所有错误都会关联到该用户
}

public void logout() {
    // 清除用户信息
    sentryErrorTrackingService.clearUser();
}
```

### 5. 面包屑记录

添加用户行为面包屑：

```java
@Autowired
private SentryErrorTrackingService sentryErrorTrackingService;

public void userAction(String action) {
    // 添加面包屑
    sentryErrorTrackingService.addBreadcrumb(
        "user-action", 
        "用户执行了操作",
        Map.of("action", action, "timestamp", String.valueOf(System.currentTimeMillis()))
    );
}
```

### 6. 自定义标签和额外信息

```java
@Autowired
private SentryErrorTrackingService sentryErrorTrackingService;

public void customMonitoring() {
    // 设置标签
    sentryErrorTrackingService.setTag("feature", "checkout");
    sentryErrorTrackingService.setTag("version", "1.0.0");
    
    // 设置额外信息
    sentryErrorTrackingService.setExtra("customData", customObject);
}
```

### 7. 事务追踪

```java
@Autowired
private SentryErrorTrackingService sentryErrorTrackingService;

public void processTransaction() {
    // 开始事务
    sentryErrorTrackingService.startTransaction("checkout", "订单结账流程");
    
    try {
        // 执行业务逻辑
        step1();
        step2();
        step3();
    } finally {
        // 结束事务
        sentryErrorTrackingService.finishTransaction("completed");
    }
}
```

## API接口

### 测试接口

#### 1. 测试错误上报
```
POST /api/monitoring/sentry/test/error
参数: message (可选，默认"测试错误")
```

#### 2. 测试消息上报
```
POST /api/monitoring/sentry/test/message
参数: message (可选，默认"测试消息")
      level (可选，默认"INFO"，可选值: DEBUG, INFO, WARNING, ERROR, FATAL)
```

#### 3. 测试面包屑
```
POST /api/monitoring/sentry/test/breadcrumb
参数: category (可选，默认"test")
      message (可选，默认"测试面包屑")
```

#### 4. 测试用户设置
```
POST /api/monitoring/sentry/test/user
参数: userId (可选，默认"test-user-123")
      username (可选，默认"测试用户")
      email (可选，默认"test@example.com")
```

#### 5. 测试标签设置
```
POST /api/monitoring/sentry/test/tag
参数: key (必需)
      value (必需)
```

#### 6. 测试事务
```
POST /api/monitoring/sentry/test/transaction
参数: operation (可选，默认"test-operation")
      description (可选，默认"测试事务")
```

#### 7. 清除用户
```
POST /api/monitoring/sentry/user/clear
```

#### 8. 健康检查
```
GET /api/monitoring/sentry/health
```

## 最佳实践

### 1. 采样率设置
- 开发环境：traces-sample-rate = 1.0（全部采样）
- 测试环境：traces-sample-rate = 0.5（50%采样）
- 生产环境：traces-sample-rate = 0.1（10%采样）

### 2. 错误级别
- DEBUG：调试信息，仅在开发环境使用
- INFO：一般信息，正常业务流程
- WARNING：警告信息，不影响功能但需要注意
- ERROR：错误信息，需要关注和修复
- FATAL：致命错误，系统无法继续运行

### 3. 用户隐私
- 不要记录敏感信息（密码、信用卡号等）
- 对用户数据进行脱敏处理
- 遵守隐私保护法规

### 4. 性能影响
- 合理设置采样率，避免影响性能
- 避免在循环中频繁上报
- 使用异步上报机制

### 5. 错误分类
- 使用标签对错误进行分类
- 设置有意义的错误消息
- 提供足够的上下文信息

## 故障排查

### 1. Sentry未初始化
- 检查sentry.enabled是否为true
- 检查sentry.dsn是否正确配置
- 查看日志中的初始化信息

### 2. 错误未上报
- 检查网络连接
- 检查Sentry服务状态
- 查看本地日志

### 3. 性能问题
- 降低采样率
- 减少面包屑数量
- 优化上报频率

## 安全建议

1. **DSN保护**：不要将DSN提交到公开仓库
2. **敏感信息**：不要在错误上下文中包含敏感数据
3. **访问控制**：限制Sentry API的访问权限
4. **数据加密**：确保传输过程使用HTTPS

## 监控指标

建议监控以下指标：
- 错误率
- 错误类型分布
- 用户影响范围
- 性能指标
- 响应时间

## 相关文档

- [Sentry官方文档](https://docs.sentry.io/)
- [Spring Boot集成指南](https://docs.sentry.io/platforms/java/guides/spring-boot/)
- [项目架构文档](../architecture/架构文档.md)
