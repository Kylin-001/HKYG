# Nacos部署问题解决方案

## 问题描述

在HKYG项目开发过程中，我们遇到了以下Nacos部署问题：

1. Docker网络连接问题，无法连接到Docker Hub和阿里云镜像仓库
2. docker-compose工具存在兼容性问题（Python distutils模块缺失）
3. Nacos服务无法通过Docker正常启动
4. 所有13个微服务因依赖Nacos而无法启动

## 解决方案

我们提供了一套嵌入式Nacos解决方案，使开发环境能够快速启动，无需依赖外部Docker环境。

### 方案概述

嵌入式Nacos解决方案包含以下组件：

1. **嵌入式Nacos启动脚本** (`scripts/linux/embedded-nacos.sh`)
   - 自动下载和安装Nacos
   - 配置内存数据库模式
   - 管理Nacos生命周期

2. **微服务启动脚本** (`scripts/linux/start-with-embedded-nacos.sh`)
   - 先启动嵌入式Nacos
   - 按顺序启动所有微服务
   - 提供统一的服务管理接口

3. **Nacos配置文件** (`config/nacos-embedded.properties`)
   - 优化的嵌入式Nacos配置
   - 内存数据库模式
   - 适合开发环境的安全设置

## 使用方法

### 1. 启动所有服务

```bash
cd /home/zky/HKYG
./scripts/linux/start-with-embedded-nacos.sh start
```

此命令会：
1. 检查Java环境
2. 启动嵌入式Nacos
3. 等待Nacos就绪
4. 启动所有微服务
5. 检查服务状态

### 2. 停止所有服务

```bash
./scripts/linux/start-with-embedded-nacos.sh stop
```

### 3. 重启所有服务

```bash
./scripts/linux/start-with-embedded-nacos.sh restart
```

### 4. 检查服务状态

```bash
./scripts/linux/start-with-embedded-nacos.sh status
```

### 5. 仅管理Nacos

```bash
# 启动Nacos
./scripts/linux/start-with-embedded-nacos.sh nacos start

# 停止Nacos
./scripts/linux/start-with-embedded-nacos.sh nacos stop

# 检查Nacos状态
./scripts/linux/start-with-embedded-nacos.sh nacos status

# 查看Nacos日志
./scripts/linux/start-with-embedded-nacos.sh nacos logs
```

### 6. 直接使用Nacos脚本

```bash
# 查看帮助
./scripts/linux/embedded-nacos.sh help

# 启动Nacos
./scripts/linux/embedded-nacos.sh start

# 停止Nacos
./scripts/linux/embedded-nacos.sh stop
```

## 访问地址

服务启动后，可以通过以下地址访问：

- **Nacos控制台**: http://localhost:8848/nacos
  - 默认用户名: nacos
  - 默认密码: nacos

- **API网关**: http://localhost:8080

- **管理后台**: http://localhost:8081

## 技术细节

### 嵌入式Nacos特点

1. **自动下载安装**: 首次运行时自动从GitHub或华为云镜像下载Nacos
2. **内存数据库**: 使用嵌入式数据库，无需MySQL
3. **单机模式**: 配置为standalone模式，适合开发环境
4. **轻量级配置**: 优化JVM参数，减少资源占用
5. **自动管理**: 提供启动、停止、状态检查等功能

### 微服务启动顺序

1. Nacos (服务注册中心)
2. Gateway (API网关)
3. 其他业务微服务并行启动

### 端口分配

| 服务 | 端口 | 说明 |
|------|------|------|
| Nacos | 8848 | 服务注册与配置中心 |
| Gateway | 8080 | API网关 |
| Admin | 8081 | 管理后台 |
| User Service | 8082 | 用户服务 |
| Product Service | 8083 | 商品服务 |
| Order Service | 8084 | 订单服务 |
| Payment Service | 8085 | 支付服务 |
| Takeout Service | 8086 | 外卖服务 |
| Secondhand Service | 8087 | 二手服务 |
| Lostfound Service | 8088 | 失物服务 |
| Campus Service | 8089 | 校园服务 |
| Delivery Service | 8090 | 配送服务 |
| Member Service | 8091 | 会员服务 |

## 故障排查

### 问题1: Nacos启动失败

**检查项**:
1. Java版本是否为17或更高
2. 端口8848是否被占用
3. 网络连接是否正常（首次下载需要）

**解决方案**:
```bash
# 检查Java版本
java -version

# 检查端口占用
netstat -tuln | grep 8848

# 查看Nacos日志
./scripts/linux/embedded-nacos.sh logs
```

### 问题2: 微服务启动失败

**检查项**:
1. Nacos是否正常运行
2. 服务JAR文件是否存在
3. 端口是否被占用

**解决方案**:
```bash
# 检查Nacos状态
./scripts/linux/embedded-nacos.sh status

# 检查服务状态
./scripts/linux/start-with-embedded-nacos.sh status

# 查看服务日志
tail -f heikeji-gateway/logs/startup.log
```

### 问题3: 服务无法注册到Nacos

**检查项**:
1. Nacos是否正常运行
2. 服务配置中的Nacos地址是否正确
3. 网络连接是否正常

**解决方案**:
1. 确保Nacos已启动并可访问
2. 检查各服务的application.yml配置
3. 重启相关服务

## 优势

1. **简单快速**: 一键启动所有服务，无需复杂配置
2. **独立运行**: 不依赖Docker或外部服务
3. **开发友好**: 适合开发环境快速迭代
4. **资源占用低**: 优化配置，减少资源消耗
5. **易于调试**: 所有服务在同一环境中，便于调试

## 注意事项

1. 此方案仅适用于开发环境
2. 生产环境应使用独立的Nacos集群
3. 内存模式的Nacos重启后数据会丢失
4. 确保系统资源充足（建议至少4GB内存）

## 后续优化计划

1. 添加健康检查和自动重启机制
2. 实现服务依赖管理和启动顺序优化
3. 添加日志收集和分析功能
4. 优化启动速度和资源占用
5. 支持配置文件热更新

## 总结

嵌入式Nacos解决方案成功解决了Docker网络连接和部署问题，使开发团队能够快速启动和调试微服务架构。此方案不仅解决了当前问题，还为未来的开发工作提供了稳定可靠的基础环境。