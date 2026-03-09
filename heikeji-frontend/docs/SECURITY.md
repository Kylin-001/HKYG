# 安全文档

## 概述

本文档描述了黑科易购校园服务平台前端项目的安全措施、最佳实践和指南。

## 安全措施

### 1. 依赖安全

- **npm audit**: 定期检查依赖漏洞
- **自动化扫描**: 使用CI/CD流程自动扫描安全漏洞
- **及时更新**: 定期更新依赖包到最新安全版本

### 2. 代码安全

- **ESLint安全规则**: 使用`eslint-plugin-security`插件检测不安全代码
- **安全审计脚本**: 自定义脚本检测敏感信息泄露
- **代码审查**: 所有代码变更必须经过安全审查

### 3. 敏感信息管理

- **环境变量**: 敏感信息通过环境变量管理
- **测试配置**: 测试用敏感信息统一管理在配置文件中
- **禁止硬编码**: 严禁在代码中硬编码密码、令牌等敏感信息

### 4. 前端安全

- **XSS防护**: 使用Vue.js内置的XSS防护机制
- **CSRF防护**: 实现CSRF令牌验证
- **内容安全策略**: 配置CSP头部限制资源加载
- **HTTPS**: 生产环境强制使用HTTPS

## 安全配置

### ESLint安全配置

项目使用`.eslintrc.security.js`文件配置安全规则，包括：

- 禁用不安全的函数（`eval`, `Function`等）
- 检测对象注入风险
- 检测非字面量文件名
- 检测不安全的正则表达式
- 检测子进程使用

### 环境变量配置

项目使用`.env.test`文件管理测试环境变量：

```bash
# 测试用户账号
TEST_USER_PHONE=13800138001
TEST_USER_PASSWORD=test_password_secure_123
TEST_USER_TOKEN=test_token_secure_123456789
```

### 测试配置

项目使用`src/config/test.ts`文件管理测试配置：

```typescript
export const testConfig = {
  user: {
    phone: process.env.TEST_USER_PHONE || '13800138001',
    password: process.env.TEST_USER_PASSWORD || 'test_password_secure_123',
    token: process.env.TEST_USER_TOKEN || 'test_token_secure_123456789',
  },
  // ...
};
```

## 安全脚本

### 安全审计脚本

`scripts/security-audit.js`用于检测项目中的安全问题：

- 检测敏感信息泄露
- 检测不安全的代码模式
- 检测不安全的HTTP请求
- 生成安全报告

运行命令：
```bash
npm run security:audit
```

### 安全修复脚本

`scripts/security-fix.js`用于修复常见的安全问题：

- 替换硬编码密码和令牌
- 添加必要的导入语句
- 统一使用测试配置

运行命令：
```bash
node scripts/security-fix.js
```

## CI/CD安全流程

### 安全审计工作流

`.github/workflows/security-audit.yml`定义了安全审计流程：

- 定期运行安全审计
- 检测高危漏洞
- 发送安全通知
- 上传安全报告

### PR安全检查

Pull Request会自动触发安全检查：

- 运行npm audit
- 运行ESLint安全检查
- 检测敏感信息泄露
- 阻止有高危问题的PR合并

## 安全最佳实践

### 1. 密码和令牌管理

- **禁止硬编码**: 不要在代码中硬编码密码和令牌
- **使用环境变量**: 敏感信息通过环境变量管理
- **定期轮换**: 定期更换密码和令牌
- **最小权限**: 使用最小权限原则

### 2. API安全

- **HTTPS**: 所有API请求使用HTTPS
- **认证**: 实现适当的认证机制
- **授权**: 实现基于角色的访问控制
- **输入验证**: 验证所有输入数据

### 3. 前端安全

- **XSS防护**: 避免使用`v-html`，如必须使用，确保内容已清理
- **CSRF防护**: 实现CSRF令牌验证
- **内容安全策略**: 配置适当的CSP头部
- **敏感数据**: 避免在前端存储敏感数据

### 4. 依赖安全

- **定期更新**: 定期更新依赖到最新版本
- **安全扫描**: 使用工具扫描依赖漏洞
- **最小依赖**: 只使用必要的依赖包
- **审查新依赖**: 添加新依赖前进行安全审查

## 安全检查清单

### 开发阶段

- [ ] 是否使用了环境变量管理敏感信息？
- [ ] 是否避免了硬编码密码和令牌？
- [ ] 是否实现了适当的认证和授权？
- [ ] 是否验证了所有输入数据？
- [ ] 是否使用了HTTPS？
- [ ] 是否实现了CSRF防护？
- [ ] 是否配置了适当的CSP头部？

### 测试阶段

- [ ] 是否运行了安全审计脚本？
- [ ] 是否检查了依赖漏洞？
- [ ] 是否测试了认证和授权？
- [ ] 是否测试了输入验证？
- [ ] 是否进行了安全测试？

### 部署阶段

- [ ] 是否禁用了调试功能？
- [ ] 是否配置了适当的安全头部？
- [ ] 是否使用了HTTPS？
- [ ] 是否设置了适当的日志级别？
- [ ] 是否配置了监控和警报？

## 应急响应

### 发现安全漏洞

1. **立即报告**: 向安全团队报告漏洞
2. **评估风险**: 评估漏洞的影响和风险
3. **制定计划**: 制定修复计划和时间表
4. **实施修复**: 尽快实施修复
5. **测试验证**: 测试修复是否有效
6. **部署更新**: 部署修复到生产环境
7. **事后分析**: 分析漏洞原因和改进措施

### 安全事件响应

1. **识别事件**: 确认安全事件
2. **控制损害**: 限制事件影响范围
3. **消除威胁**: 消除安全威胁
4. **恢复系统**: 恢复系统正常运行
5. **总结经验**: 总结经验教训
6. **改进措施**: 改进安全措施

## 安全资源

### 工具和框架

- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit): Node.js依赖安全审计
- [ESLint Security Plugin](https://github.com/nodesecurity/eslint-plugin-security): ESLint安全规则
- [Snyk](https://snyk.io/): 开源依赖安全扫描
- [OWASP ZAP](https://www.zaproxy.org/): Web应用安全扫描
- [Semgrep](https://semgrep.dev/): 静态代码分析

### 学习资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/): Web应用安全风险
- [MDN Web安全](https://developer.mozilla.org/zh-CN/docs/Web/Security): Web安全指南
- [Vue.js安全](https://vuejs.org/guide/best-practices/security.html): Vue.js安全最佳实践

## 联系方式

如有安全问题或建议，请联系安全团队：

- 邮箱: security@heikeji.com
- 内部安全平台: [安全平台链接]

---

**注意**: 本文档会随着项目发展和安全需求的变化而更新。请定期查看最新版本。