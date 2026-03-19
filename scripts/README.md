# 项目脚本管理

## 脚本目录结构

```
├── scripts/
│   ├── README.md                 # 脚本说明文档
│   ├── linux/                    # Linux脚本
│   │   ├── api-docs-tool.sh      # API文档快速访问工具
│   │   ├── api-test.sh           # API自动化测试脚本
│   │   ├── convert_swagger_to_openapi.sh  # Swagger转OpenAPI脚本
│   │   ├── deploy.sh             # 项目部署脚本
│   │   ├── fix-ports.sh          # 端口配置修复脚本
│   │   ├── health-check.sh       # 服务健康检查工具
│   │   ├── production-health-check.sh  # 生产环境健康检查
│   │   ├── production-quick-start.sh   # 生产环境快速启动
│   │   ├── start-all.sh          # 启动所有服务
│   │   └── stop-all.sh           # 停止所有服务
│   ├── powershell/               # PowerShell脚本
│   │   ├── build.ps1             # 构建脚本
│   │   ├── build_order_with_java17.ps1  # 使用Java 17构建订单服务
│   │   ├── build_with_maven.ps1  # 使用Maven构建
│   │   ├── check_java_version.ps1  # 检查Java版本
│   │   ├── init_database_fixed.ps1  # 数据库初始化
│   │   ├── install_jdk17.ps1     # 安装JDK 17
│   │   ├── install_jdk17_en.ps1  # 英文版本JDK 17安装
│   │   ├── new_build.ps1         # 新构建脚本
│   │   ├── set_java17_env.ps1    # 设置Java 17环境
│   │   ├── set_permanent_java_env.ps1  # 永久设置Java环境
│   │   ├── setup_maven_here.ps1  # 在此目录设置Maven
│   │   ├── simple_build.ps1      # 简单构建脚本
│   │   ├── simple_test_data.ps1  # 简单测试数据
│   │   ├── start_all_services.ps1  # 启动所有服务
│   │   ├── update_paths.ps1      # 更新路径
│   │   └── update_paths_simple.ps1  # 简单更新路径
│   ├── windows/                  # Windows脚本
│   │   └── deploy.bat            # Windows部署脚本
│   ├── database-performance-monitor.js  # 数据库性能监控
│   └── security-audit.js         # 安全审计
```

## 脚本说明

### 1. Linux脚本

#### 1.1 服务管理脚本

##### start-all.sh
**路径**: `scripts/linux/start-all.sh`
**功能**: 启动所有服务（后端和前端）
**主要功能**:
- 检查系统环境（Java、Maven、Node.js、MySQL、Redis）
- 编译项目
- 启动Gateway、Admin和所有业务服务
- 可选启动前端服务
**使用方法**:
```bash
# 显示菜单
./start-all.sh

# 启动全部服务
./start-all.sh all

# 仅启动后端服务
./start-all.sh backend

# 仅启动前端服务
./start-all.sh frontend

# 检查系统环境
./start-all.sh check
```

##### stop-all.sh
**路径**: `scripts/linux/stop-all.sh`
**功能**: 停止所有服务（后端和前端）
**主要功能**:
- 停止所有后端服务
- 停止前端服务
- 清理进程
**使用方法**:
```bash
# 显示菜单
./stop-all.sh

# 停止全部服务
./stop-all.sh all

# 仅停止后端服务
./stop-all.sh backend

# 仅停止前端服务
./stop-all.sh frontend
```

##### health-check.sh
**路径**: `scripts/linux/health-check.sh`
**功能**: 服务健康检查工具
**主要功能**:
- 检查所有微服务的运行状态
- 检查依赖服务（MySQL、Redis、Nacos）
- 生成健康检查报告
**使用方法**:
```bash
./health-check.sh
```

#### 1.2 部署和测试脚本

##### deploy.sh
**路径**: `scripts/linux/deploy.sh`
**功能**: 项目部署脚本
**主要功能**:
- 支持传统部署和Docker Compose部署
- 环境配置（开发、测试、生产）
- 数据库初始化
- 后端服务构建
- 前端服务构建
**使用方法**:
```bash
# 查看帮助信息
./deploy.sh --help

# 传统部署（默认）
./deploy.sh

# Docker Compose部署
./deploy.sh --mode docker
```

##### api-test.sh
**路径**: `scripts/linux/api-test.sh`
**功能**: API自动化测试脚本
**主要功能**:
- 测试API接口
- 验证服务状态
**使用方法**:
```bash
./api-test.sh
```

##### api-docs-tool.sh
**路径**: `scripts/linux/api-docs-tool.sh`
**功能**: API文档快速访问工具
**主要功能**:
- 快速访问API文档
- 管理API文档服务
**使用方法**:
```bash
./api-docs-tool.sh
```

##### fix-ports.sh
**路径**: `scripts/linux/fix-ports.sh`
**功能**: 端口配置修复脚本
**主要功能**:
- 修复服务端口配置
- 统一端口管理
**使用方法**:
```bash
./fix-ports.sh
```

### 2. PowerShell脚本

#### 2.1 环境配置脚本

##### install_jdk17.ps1
**路径**: `scripts/powershell/install_jdk17.ps1`
**功能**: 安装JDK 17
**使用方法**:
```powershell
.nstall_jdk17.ps1
```

##### set_java17_env.ps1
**路径**: `scripts/powershell/set_java17_env.ps1`
**功能**: 设置Java 17环境变量
**使用方法**:
```powershell
.et_java17_env.ps1
```

##### check_java_version.ps1
**路径**: `scripts/powershell/check_java_version.ps1`
**功能**: 检查Java版本
**使用方法**:
```powershell
.heck_java_version.ps1
```

#### 2.2 构建和启动脚本

##### build_with_maven.ps1
**路径**: `scripts/powershell/build_with_maven.ps1`
**功能**: 使用Maven构建项目
**使用方法**:
```powershell
.uild_with_maven.ps1
```

##### start_all_services.ps1
**路径**: `scripts/powershell/start_all_services.ps1`
**功能**: 启动所有服务
**使用方法**:
```powershell
.tart_all_services.ps1
```

##### init_database_fixed.ps1
**路径**: `scripts/powershell/init_database_fixed.ps1`
**功能**: 数据库初始化
**使用方法**:
```powershell
.nit_database_fixed.ps1
```

### 3. 其他脚本

#### database-performance-monitor.js
**路径**: `scripts/database-performance-monitor.js`
**功能**: 数据库性能监控
**使用方法**:
```bash
node database-performance-monitor.js
```

#### security-audit.js
**路径**: `scripts/security-audit.js`
**功能**: 安全审计
**使用方法**:
```bash
node security-audit.js
```

## 脚本使用建议

1. **Linux环境**:
   - 使用 `scripts/linux/start-all.sh` 启动所有服务
   - 使用 `scripts/linux/stop-all.sh` 停止所有服务
   - 使用 `scripts/linux/health-check.sh` 检查服务状态

2. **Windows环境**:
   - 使用 `scripts/powershell/start_all_services.ps1` 启动所有服务
   - 使用 `scripts/powershell/build_with_maven.ps1` 构建项目
   - 使用 `scripts/powershell/init_database_fixed.ps1` 初始化数据库

3. **部署场景**:
   - 开发环境: 使用 `start-all.sh` 或 `start_all_services.ps1`
   - 生产环境: 使用 `deploy.sh` 或 `production-quick-start.sh`

4. **日志管理**:
   - 服务启动脚本会为每个服务生成独立的日志文件
   - 健康检查脚本会生成健康检查报告
   - 建议定期清理日志文件，避免占用过多磁盘空间

5. **服务管理**:
   - 可以使用 `ps -ef | grep java | grep -v grep` 查看服务运行状态（Linux）
   - 可以使用 `tail -f 服务名.log` 实时查看服务日志（Linux）
   - 可以使用任务管理器查看服务运行状态（Windows）

## 脚本维护

1. **更新日志**:
   - 每次修改脚本时，建议更新脚本头部的注释信息
   - 记录修改内容、修改时间和修改人

2. **版本管理**:
   - 建议将脚本纳入版本控制系统
   - 定期备份重要脚本

3. **权限管理**:
   - 确保脚本具有执行权限（chmod +x 脚本名）
   - 敏感配置（如数据库密码）建议通过环境变量或配置文件传递

4. **兼容性**:
   - 确保脚本在不同操作系统上都能正常运行
   - 测试脚本在不同环境下的兼容性

5. **错误处理**:
   - 脚本应包含完善的错误处理机制
   - 提供清晰的错误信息
   - 确保脚本在出错时能够优雅退出

## 注意事项

1. **部署前准备**:
   - 确保安装了所需的依赖（Java、Maven、Node.js、Docker等）
   - 配置好数据库和Nacos服务
   - 确保目标端口未被占用

2. **安全性**:
   - 不要在脚本中硬编码敏感信息
   - 定期更新脚本，修复安全漏洞
   - 限制脚本的执行权限

3. **性能考虑**:
   - 避免在脚本中执行耗时操作
   - 合理使用日志记录，避免过多日志影响性能
   - 优化脚本执行流程，提高执行效率

4. **可维护性**:
   - 保持脚本代码清晰易懂
   - 使用注释说明脚本功能和逻辑
   - 避免重复代码，提取通用功能
