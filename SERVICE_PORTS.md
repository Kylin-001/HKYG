# 服务端口配置说明

## 📋 概述

本文档说明了黑科易购项目中各个微服务的端口配置，以及如何统一管理这些配置。

## 🚨 当前问题

项目中存在端口配置不一致的问题，主要体现在：

1. **application.yml** 中的端口配置
2. **service-*.yml** 中的端口配置
3. **API文档聚合服务** 中的端口配置

这些配置文件中的端口可能不一致，导致服务启动和访问出现问题。

## 📊 服务端口配置表

### 推荐的统一端口配置

| 服务名称 | 推荐端口 | 说明 | 当前状态 |
|---------|---------|------|---------|
| API文档中心 | 8089 | API文档聚合服务 | ✅ 已统一 |
| Gateway | 8080 | API网关 | ✅ 已统一 |
| 用户服务 | 8081 | 用户管理服务 | ⚠️ 需要统一 |
| 商品服务 | 8082 | 商品管理服务 | ⚠️ 需要统一 |
| 订单服务 | 8083 | 订单管理服务 | ⚠️ 需要统一 |
| 配送服务 | 8001 | 配送管理服务 | ⚠️ 需要统一 |
| 校园服务 | 8003 | 校园服务 | ✅ 已统一 |
| 支付服务 | 8004 | 支付管理服务 | ✅ 已统一 |
| 外卖服务 | 8005 | 外卖管理服务 | ✅ 已统一 |
| 二手服务 | 8006 | 二手市场服务 | ⚠️ 需要统一 |
| 失物招领 | 8007 | 失物招领服务 | ⚠️ 需要统一 |
| 会员服务 | 8088 | 会员管理服务 | ⚠️ 需要统一 |
| 系统管理 | 8090 | 后台管理系统 | ✅ 已统一 |

### 当前端口配置详情

#### 用户服务 (service-user)

| 配置文件 | 当前端口 | 推荐端口 | 状态 |
|---------|---------|---------|------|
| application.yml | 8082 | 8081 | ❌ 不一致 |
| service-user.yml | 8081 | 8081 | ✅ 一致 |
| API文档配置 | 8081 | 8081 | ✅ 一致 |

**需要修改：** 将 application.yml 中的端口从 8082 改为 8081

#### 商品服务 (service-product)

| 配置文件 | 当前端口 | 推荐端口 | 状态 |
|---------|---------|---------|------|
| application.yml | 8083 | 8082 | ❌ 不一致 |
| service-product.yml | 8082 | 8082 | ✅ 一致 |
| API文档配置 | 8082 | 8082 | ✅ 一致 |

**需要修改：** 将 application.yml 中的端口从 8083 改为 8082

#### 订单服务 (service-order)

| 配置文件 | 当前端口 | 推荐端口 | 状态 |
|---------|---------|---------|------|
| application.yml | 8084 | 8083 | ❌ 不一致 |
| service-order.yml | 8083 | 8083 | ✅ 一致 |
| API文档配置 | 8083 | 8083 | ✅ 一致 |

**需要修改：** 将 application.yml 中的端口从 8084 改为 8083

#### 配送服务 (service-delivery)

| 配置文件 | 当前端口 | 推荐端口 | 状态 |
|---------|---------|---------|------|
| application.yml | 8085 | 8001 | ❌ 不一致 |
| service-delivery.yml | 8004 | 8001 | ❌ 不一致 |
| API文档配置 | 8001 | 8001 | ✅ 一致 |

**需要修改：** 
- 将 application.yml 中的端口从 8085 改为 8001
- 将 service-delivery.yml 中的端口从 8004 改为 8001

#### 二手服务 (service-secondhand)

| 配置文件 | 当前端口 | 推荐端口 | 状态 |
|---------|---------|---------|------|
| application.yml | 8088 | 8006 | ❌ 不一致 |
| service-secondhand.yml | 8088 | 8006 | ❌ 不一致 |
| API文档配置 | 8006 | 8006 | ✅ 一致 |

**需要修改：**
- 将 application.yml 中的端口从 8088 改为 8006
- 将 service-secondhand.yml 中的端口从 8088 改为 8006

#### 失物招领服务 (service-lostfound)

| 配置文件 | 当前端口 | 推荐端口 | 状态 |
|---------|---------|---------|------|
| application.yml | 8089 | 8007 | ❌ 不一致 |
| service-lostfound.yml | 8089 | 8007 | ❌ 不一致 |
| API文档配置 | 8007 | 8007 | ✅ 一致 |

**需要修改：**
- 将 application.yml 中的端口从 8089 改为 8007
- 将 service-lostfound.yml 中的端口从 8089 改为 8007

#### 会员服务 (service-member)

| 配置文件 | 当前端口 | 推荐端口 | 状态 |
|---------|---------|---------|------|
| application.yml | 8002 | 8088 | ❌ 不一致 |
| API文档配置 | 8088 | 8088 | ✅ 一致 |

**需要修改：** 将 application.yml 中的端口从 8002 改为 8088

## 🔧 修复方案

### 方案1：手动修改配置文件

按照上述表格中的"需要修改"说明，逐个修改对应的配置文件。

### 方案2：使用配置中心

使用Nacos配置中心统一管理所有服务的端口配置，避免配置文件不一致的问题。

### 方案3：使用环境变量

通过环境变量统一管理端口配置，在启动脚本中设置环境变量。

## 📝 修复步骤

### 步骤1：修改用户服务端口

```bash
# 编辑 service-user/src/main/resources/application.yml
# 将端口从 8082 改为 8081
```

### 步骤2：修改商品服务端口

```bash
# 编辑 service-product/src/main/resources/application.yml
# 将端口从 8083 改为 8082
```

### 步骤3：修改订单服务端口

```bash
# 编辑 service-order/src/main/resources/application.yml
# 将端口从 8084 改为 8083
```

### 步骤4：修改配送服务端口

```bash
# 编辑 service-delivery/src/main/resources/application.yml
# 将端口从 8085 改为 8001
# 编辑 service-delivery.yml
# 将端口从 8004 改为 8001
```

### 步骤5：修改二手服务端口

```bash
# 编辑 service-secondhand/src/main/resources/application.yml
# 将端口从 8088 改为 8006
# 编辑 service-secondhand.yml
# 将端口从 8088 改为 8006
```

### 步骤6：修改失物招领服务端口

```bash
# 编辑 service-lostfound/src/main/resources/application.yml
# 将端口从 8089 改为 8007
# 编辑 service-lostfound.yml
# 将端口从 8089 改为 8007
```

### 步骤7：修改会员服务端口

```bash
# 编辑 service-member/src/main/resources/application.yml
# 将端口从 8002 改为 8088
```

### 步骤8：验证配置

```bash
# 重启所有服务
./stop-all.sh
./start-all.sh

# 检查服务端口
netstat -tuln | grep -E '8080|8081|8082|8083|8001|8003|8004|8005|8006|8007|8088|8089|8090'
```

## ⚠️ 注意事项

1. **端口冲突**：确保修改后的端口没有被其他服务占用
2. **服务依赖**：修改端口后需要检查服务间的调用配置
3. **API文档**：修改端口后需要同步更新API文档聚合服务的配置
4. **启动脚本**：如果启动脚本中硬编码了端口，也需要同步修改
5. **防火墙**：确保防火墙规则允许新的端口访问

## 🎯 最佳实践

### 1. 使用配置中心

推荐使用Nacos配置中心统一管理所有服务的配置：

```yaml
# Nacos配置示例
spring:
  cloud:
    nacos:
      config:
        server-addr: localhost:8848
        file-extension: yml
        shared-configs:
          - data-id: common-config.yml
            refresh: true
```

### 2. 环境变量管理

通过环境变量管理端口配置：

```bash
# 在启动脚本中设置
export SERVICE_USER_PORT=8081
export SERVICE_PRODUCT_PORT=8082
export SERVICE_ORDER_PORT=8083
```

### 3. 配置文件模板

创建统一的配置文件模板，避免手动修改错误。

### 4. 端口范围规划

- 8000-8099：业务服务
- 8100-8199：管理服务
- 8200-8299：监控服务

## 📚 相关文档

- [部署指南](file:///home/zky/HKYG/DEPLOYMENT.md)
- [API文档使用指南](file:///home/zky/HKYG/API_DOCS.md)
- [项目README](file:///home/zky/HKYG/README.md)

## 🔄 更新日志

| 版本 | 日期 | 更新内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-06 | 初始版本，记录端口配置问题 |

---

**文档版本：** 1.0.0  
**最后更新：** 2026-03-06  
**维护团队：** 黑科易购开发团队
