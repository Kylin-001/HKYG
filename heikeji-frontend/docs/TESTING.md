# 测试框架和CI/CD流程文档

## 概述

本项目已经建立了完整的测试框架和CI/CD流程，包括单元测试、E2E测试、性能测试和自动化测试监控。

## 测试框架

### 单元测试

使用Vitest作为单元测试框架，配置了以下特性：

- **测试环境**: jsdom
- **覆盖率要求**: 70%
- **报告格式**: JSON、HTML、LCOV、Cobertura
- **测试文件**: `src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,vue}`

#### 运行命令

```bash
# 运行所有单元测试
npm run test:unit

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监视模式运行测试
npm run test:watch
```

### E2E测试

使用Playwright作为E2E测试框架，支持多浏览器测试：

- **支持浏览器**: Chromium、Firefox、WebKit
- **重试次数**: 2
- **超时时间**: 30秒
- **报告格式**: HTML、JSON、JUnit、Line、Allure
- **测试文件**: `e2e/**/*.spec.ts`

#### 运行命令

```bash
# 运行所有E2E测试
npm run test:e2e

# 运行特定浏览器的测试
npm run test:e2e:chrome
npm run test:e2e:firefox
npm run test:e2e:webkit

# 交互式运行测试
npm run test:e2e:ui

# 调试模式运行测试
npm run test:e2e:debug
```

### 性能测试

使用Lighthouse CI进行性能测试，监控以下指标：

- **首次内容绘制 (FCP)**: ≤ 1500ms
- **最大内容绘制 (LCP)**: ≤ 2500ms
- **累积布局偏移 (CLS)**: ≤ 0.1
- **总阻塞时间 (TBT)**: ≤ 300ms

#### 运行命令

```bash
# 运行性能测试
npm run test:performance

# 在CI环境中运行性能测试
npm run test:performance:ci
```

## CI/CD流程

### 主CI/CD流程 (`.github/workflows/ci-cd.yml`)

触发条件：
- 推送到main或develop分支
- 创建Pull Request到main或develop分支

流程步骤：
1. **代码检查**: ESLint和Prettier检查
2. **单元测试**: 运行所有单元测试并检查覆盖率
3. **E2E测试**: 在多个浏览器上运行E2E测试
4. **性能测试**: 运行性能测试
5. **构建**: 构建生产版本
6. **部署**: 部署到生产环境（仅main分支）
7. **报告汇总**: 生成综合测试报告

### 定时测试流程 (`.github/workflows/scheduled-tests.yml`)

触发条件：
- 每天凌晨2点自动运行
- 手动触发（可选择测试类型）

功能：
- 可选择运行全部测试或特定类型测试
- 生成定时测试报告
- 发送测试结果通知

### PR测试流程 (`.github/workflows/pr-tests.yml`)

触发条件：
- 创建、更新或重新打开Pull Request

功能：
- 运行代码检查、类型检查、单元测试和关键E2E测试
- 在PR中添加测试结果评论
- 检查测试覆盖率是否达标

## 测试监控

### 测试监控脚本 (`scripts/test-monitor.js`)

功能：
- 读取测试覆盖率、性能测试和E2E测试结果
- 生成综合测试报告（JSON和HTML格式）
- 检查测试结果是否达标

运行命令：
```bash
npm run test:monitor
```

### 测试覆盖率历史记录脚本 (`scripts/coverage-history.js`)

功能：
- 记录每次测试的覆盖率数据
- 生成覆盖率趋势报告
- 分析覆盖率变化趋势

运行命令：
```bash
npm run test:coverage:history
```

## 测试报告

### 报告类型

1. **单元测试报告**: `coverage/index.html`
2. **E2E测试报告**: `playwright-report/index.html`
3. **性能测试报告**: `test-results/performance/`
4. **综合测试报告**: `test-reports/`
5. **覆盖率趋势报告**: `test-reports/coverage-trend-*.html`

### 查看报告

```bash
# 查看单元测试报告
npm run test:coverage && open coverage/index.html

# 查看E2E测试报告
npm run test:e2e && npm run test:e2e:report

# 查看性能测试报告
npm run test:performance && open test-results/performance/index.html

# 查看综合测试报告
npm run test:monitor && open test-reports/test-report-*.html

# 查看覆盖率趋势报告
npm run test:coverage:history && open test-reports/coverage-trend-*.html
```

## 测试配置

测试相关配置统一在 `test.config.json` 文件中管理，包括：

- 测试覆盖率配置
- 单元测试配置
- E2E测试配置
- 性能测试配置
- 监控配置
- CI/CD配置

## 最佳实践

1. **编写测试**: 为新功能编写单元测试和E2E测试
2. **保持覆盖率**: 确保测试覆盖率不低于70%
3. **本地测试**: 提交前运行 `npm run test:ci` 进行完整测试
4. **查看报告**: 定期查看测试报告和覆盖率趋势
5. **性能监控**: 关注性能测试结果，确保应用性能达标

## 故障排除

### 常见问题

1. **测试覆盖率不达标**
   - 检查测试文件是否覆盖所有关键代码路径
   - 使用 `npm run test:coverage` 查看详细覆盖率报告

2. **E2E测试失败**
   - 检查应用是否正常运行
   - 使用 `npm run test:e2e:debug` 调试测试
   - 检查测试选择器是否正确

3. **性能测试不达标**
   - 检查应用性能瓶颈
   - 优化资源加载和渲染
   - 考虑代码分割和懒加载

4. **CI/CD流程失败**
   - 检查GitHub Actions日志
   - 确认所有依赖和配置正确
   - 检查环境变量和密钥设置

### 获取帮助

如果遇到问题，可以：

1. 查看测试报告获取详细错误信息
2. 使用调试模式运行测试
3. 检查GitHub Actions日志
4. 查看项目文档或联系开发团队