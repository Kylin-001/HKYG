# 项目脚本管理

## 脚本目录结构

```
├── deploy.sh                     # 项目部署脚本（位于项目根目录）
├── scripts/
│   └── README.md                 # 脚本说明文档
└── heikeji-mall-service/
    ├── start_services_debug.sh   # 调试模式启动脚本（仅启动用户服务）
    └── start_services_final.sh   # 最终版本启动脚本（启动所有服务）
```

## 脚本说明

### 1. 部署脚本 (deploy.sh)

**路径**: `/home/heikeji/heikeji-mall/deploy.sh`

**功能**: 黑科易购项目的部署脚本，支持传统部署和Docker Compose部署两种方式。

**主要功能**:
- 支持传统部署和Docker Compose部署
- 环境配置（开发、测试、生产）
- 数据库初始化
- 后端服务构建
- 前端服务构建
- 后端服务启动（调用start_services_final.sh脚本）
- Nginx配置
- Docker Compose服务管理

**使用方法**:
```bash
# 查看帮助信息
./deploy.sh --help

# 传统部署（默认）
./deploy.sh

# Docker Compose部署
./deploy.sh --mode docker

# 指定环境
./deploy.sh --mode docker --environment dev

# 自定义数据库配置
./deploy.sh --db-host 127.0.0.1 --db-port 3306 --db-user root --db-pass root
```

### 2. 后端服务启动脚本

#### 2.1 调试模式启动脚本 (start_services_debug.sh)

**路径**: `/home/heikeji/heikeji-mall/heikeji-mall-service/start_services_debug.sh`

**功能**: 用于调试目的的启动脚本，仅启动用户服务，并添加调试信息。

**主要功能**:
- 停止所有正在运行的业务服务
- 仅启动用户服务
- 添加调试信息
- 显示服务日志

**使用方法**:
```bash
# 在后端服务目录下执行
cd heikeji-mall-service
./start_services_debug.sh
```

#### 2.2 最终版本启动脚本 (start_services_final.sh)

**路径**: `/home/heikeji/heikeji-mall/heikeji-mall-service/start_services_final.sh`

**功能**: 最终版本的服务启动脚本，用于启动所有后端服务。

**主要功能**:
- 停止所有正在运行的业务服务
- 定义服务列表
- 启动所有服务
- 显示启动信息和日志路径

**使用方法**:
```bash
# 在后端服务目录下执行
cd heikeji-mall-service
./start_services_final.sh

# 也可通过deploy.sh脚本间接调用
./deploy.sh --mode traditional
```

## 脚本整合说明

### 整合情况

1. **deploy.sh 与 start_services_final.sh 的整合**:
   - 修改了 `deploy.sh` 脚本中的 `start_backend_services` 函数
   - 现在 `deploy.sh` 不再创建临时启动脚本，而是直接调用现有的 `start_services_final.sh` 脚本
   - 这样避免了重复代码，提高了脚本的维护性

2. **保留了两个启动脚本**:
   - `start_services_debug.sh`: 用于开发调试，仅启动用户服务
   - `start_services_final.sh`: 用于完整启动，启动所有后端服务
   - 这两个脚本各有不同的用途，因此保留了它们

## 脚本使用建议

1. **部署脚本**: 建议在项目根目录下直接使用，根据部署环境选择合适的部署模式。

2. **后端服务启动脚本**:
   - 开发调试: 使用 `start_services_debug.sh`，仅启动用户服务，便于调试
   - 完整启动: 使用 `start_services_final.sh`，启动所有后端服务
   - 自动化部署: 通过 `deploy.sh` 脚本间接调用 `start_services_final.sh`

3. **日志管理**:
   - `deploy.sh` 会生成部署日志 `deploy.log`
   - 后端服务启动脚本会为每个服务生成独立的日志文件
   - 建议定期清理日志文件，避免占用过多磁盘空间

4. **服务管理**:
   - 可以使用 `ps -ef | grep java | grep -v grep` 查看服务运行状态
   - 可以使用 `tail -f 服务名.log` 实时查看服务日志

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

## 注意事项

1. **部署前准备**:
   - 确保安装了所需的依赖（Java、Maven、Node.js、Docker等）
   - 配置好数据库和Nacos服务
   - 确保目标端口未被占用

2. **安全性**:
   - 不要在脚本中硬编码敏感信息
   - 定期更新脚本，修复安全漏洞
   - 限制脚本的执行权限

3. **兼容性**:
   - 确保脚本在不同操作系统上都能正常运行
   - 测试脚本在不同环境下的兼容性

4. **错误处理**:
   - 脚本应包含完善的错误处理机制
   - 提供清晰的错误信息
   - 确保脚本在出错时能够优雅退出
