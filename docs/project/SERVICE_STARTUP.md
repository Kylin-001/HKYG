# 服务启动指南

## 📋 概述

本文档说明了黑科易购项目中各个微服务的启动顺序和依赖关系。

## 🚀 服务启动顺序

### 第一阶段：基础设施服务

#### 1. 启动Nacos (服务注册中心)

**端口：** 8848

**启动命令：**
```bash
# 方式1：使用启动脚本
./start-all.sh nacos

# 方式2：手动启动
cd nacos/bin
./startup.sh -m standalone
```

**验证：**
```bash
curl http://localhost:8848/nacos
```

**说明：** Nacos是服务注册中心，所有微服务都需要先启动它。

---

### 第二阶段：网关服务

#### 2. 启动Gateway (API网关)

**端口：** 8080

**启动命令：**
```bash
# 方式1：使用启动脚本
./start-all.sh gateway

# 方式2：手动启动
cd heikeji-gateway
mvn spring-boot:run
```

**验证：**
```bash
curl http://localhost:8080/actuator/health
```

**说明：** Gateway是API网关，负责路由所有请求。

---

### 第三阶段：业务服务

#### 3. 启动用户服务

**端口：** 8081

**启动命令：**
```bash
cd heikeji-mall-service/service-user
mvn spring-boot:run
```

**验证：**
```bash
curl http://localhost:8081/actuator/health
```

#### 4. 启动商品服务

**端口：** 8082

**启动命令：**
```bash
cd heikeji-mall-service/service-product
mvn spring-boot:run
```

**验证：**
```bash
curl http://localhost:8082/actuator/health
```

#### 5. 启动订单服务

**端口：** 8083

**启动命令：**
```bash
cd heikeji-mall-service/service-order
mvn spring-boot:run
```

**验证：**
```bash
curl http://localhost:8083/actuator/health
```

#### 6. 启动配送服务

**端口：** 8001

**启动命令：**
```bash
cd heikeji-mall-service/service-delivery
mvn spring-boot:run
```

**验证：**
```bash
curl http://localhost:8001/actuator/health
```

#### 7. 启动校园服务

**端口：** 8003

**启动命令：**
```bash
cd heikeji-mall-service/service-campus
mvn spring-boot:run
```

**验证：**
```bash
curl http://localhost:8003/actuator/health
```

#### 8. 启动支付服务

**端口：** 8004

**启动命令：**
```bash
cd heikeji-mall-service/service-payment
mvn spring-boot:run
```

**验证：**
```bash
curl http://localhost:8004/actuator/health
```

#### 9. 启动外卖服务

**端口：** 8005

**启动命令：**
```bash
cd heikeji-mall-service/service-takeout
mvn spring-boot:run
```

**验证：**
```bash
curl http://localhost:8005/actuator/health
```

#### 10. 启动二手服务

**端口：** 8006

**启动命令：**
```bash
cd heikeji-mall-service/service-secondhand
mvn spring-boot:run
```

**验证：**
```bash
curl http://localhost:8006/actuator/health
```

#### 11. 启动失物招领服务

**端口：** 8007

**启动命令：**
```bash
cd heikeji-mall-service/service-lostfound
mvn spring-boot:run
```

**验证：**
```bash
curl http://localhost:8007/actuator/health
```

#### 12. 启动会员服务

**端口：** 8088

**启动命令：**
```bash
cd heikeji-mall-service/service-member
mvn spring-boot:run
```

**验证：**
```bash
curl http://localhost:8088/actuator/health
```

---

### 第四阶段：文档和管理服务

#### 13. 启动系统管理服务

**端口：** 8090

**启动命令：**
```bash
cd heikeji-system
mvn spring-boot:run
```

**验证：**
```bash
curl http://localhost:8090/actuator/health
```

#### 14. 启动API文档服务

**端口：** 8089

**启动命令：**
```bash
cd service-api-docs
mvn spring-boot:run
```

**验证：**
```bash
curl http://localhost:8089/actuator/health
```

**访问文档：**
```bash
# 在浏览器中打开
http://localhost:8089/swagger-ui.html
```

---

## 🎯 快速启动方法

### 使用启动脚本（推荐）

```bash
# 启动所有服务
./start-all.sh

# 仅启动后端服务
./start-all.sh backend

# 仅启动前端服务
./start-all.sh frontend
```

### 分步启动（用于调试）

```bash
# 1. 启动Nacos
./start-all.sh nacos

# 2. 启动Gateway
./start-all.sh gateway

# 3. 启动业务服务
./start-all.sh services

# 4. 启动文档服务
./start-all.sh docs
```

---

## 🔍 服务验证

### 使用健康检查脚本

```bash
# 运行健康检查
./health-check.sh

# 快速检查
./health-check.sh --quick

# 仅检查依赖
./health-check.sh --deps

# 持续监控
./health-check.sh --monitor 10
```

### 手动验证

```bash
# 检查Nacos
curl http://localhost:8848/nacos

# 检查Gateway
curl http://localhost:8080/actuator/health

# 检查用户服务
curl http://localhost:8081/actuator/health

# 检查API文档
curl http://localhost:8089/api/docs/health
```

---

## ⚠️ 常见问题

### 1. Nacos启动失败

**问题：** Nacos无法启动

**解决方案：**
```bash
# 检查Java版本
java -version

# 检查端口是否被占用
netstat -tuln | grep 8848

# 清理Nacos数据目录
rm -rf nacos/data/*
```

### 2. 服务注册失败

**问题：** 服务启动后无法在Nacos中注册

**解决方案：**
```bash
# 检查Nacos是否正常运行
curl http://localhost:8848/nacos

# 检查服务配置中的Nacos地址
grep -r "nacos.server-addr" heikeji-mall-service/*/src/main/resources/application.yml
```

### 3. 端口冲突

**问题：** 服务启动时提示端口被占用

**解决方案：**
```bash
# 查找占用端口的进程
lsof -i :8081

# 杀死占用端口的进程
kill -9 <PID>

# 或者修改服务端口配置
```

### 4. 内存不足

**问题：** 服务启动时内存溢出

**解决方案：**
```bash
# 增加JVM内存
export JAVA_OPTS="-Xms512m -Xmx1024m"

# 或者在启动脚本中配置
java -Xms512m -Xmx1024m -jar xxx.jar
```

---

## 📊 服务依赖关系图

```
MySQL (3306)
    ↓
Redis (6379)
    ↓
Nacos (8848) ← 服务注册中心
    ↓
Gateway (8080) ← API网关
    ↓
├── 用户服务 (8081)
├── 商品服务 (8082)
├── 订单服务 (8083)
├── 配送服务 (8001)
├── 校园服务 (8003)
├── 支付服务 (8004)
├── 外卖服务 (8005)
├── 二手服务 (8006)
├── 失物招领 (8007)
└── 会员服务 (8088)
    ↓
系统管理 (8090)
API文档 (8089)
```

---

## 🛠️ 停止服务

### 使用停止脚本

```bash
# 停止所有服务
./stop-all.sh
```

### 手动停止

```bash
# 查找Java进程
ps aux | grep java

# 停止特定服务
kill -15 <PID>

# 强制停止
kill -9 <PID>
```

---

## 📝 启动日志

### 查看启动日志

```bash
# Nacos日志
tail -f nacos/logs/start.out

# Gateway日志
tail -f heikeji-gateway/logs/heikeji-gateway.log

# 业务服务日志
tail -f heikeji-mall-service/service-user/logs/service-user.log
```

### 日志位置

- **Nacos**: `nacos/logs/`
- **Gateway**: `heikeji-gateway/logs/`
- **业务服务**: `heikeji-mall-service/service-*/logs/`
- **系统管理**: `heikeji-system/logs/`
- **API文档**: `service-api-docs/logs/`

---

## 🎯 最佳实践

1. **按顺序启动** - 严格按照启动顺序启动服务
2. **等待启动** - 每个服务启动后等待几秒再启动下一个
3. **验证状态** - 每个服务启动后验证其健康状态
4. **查看日志** - 启动失败时查看日志文件
5. **使用脚本** - 推荐使用启动脚本，避免手动错误

---

## 📚 相关文档

- [部署指南](file:///home/zky/HKYG/DEPLOYMENT.md)
- [服务端口配置](file:///home/zky/HKYG/SERVICE_PORTS.md)
- [API文档使用指南](file:///home/zky/HKYG/API_DOCS.md)
- [项目README](file:///home/zky/HKYG/README.md)

---

**文档版本：** 1.0.0  
**最后更新：** 2026-03-06  
**维护团队：** 黑科易购开发团队
