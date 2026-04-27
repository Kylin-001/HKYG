# 黑科易购微服务端口配置文档

> **版本**: v2.0.0 | **状态**: Active | **最后更新**: 2026-04-27
> **维护者**: 黑科易购开发团队

---

## 📋 统一端口配置表

### 基础设施服务

| 服务名称 | 端口 | 说明 | 配置文件路径 |
|---------|------|------|-------------|
| Nacos | 8848 | 服务注册与配置中心 | - |
| MySQL | 3306 | 数据库服务 | - |
| Redis | 6379 | 缓存服务 | - |

### 网关与文档服务

| 服务名称 | 端口 | 说明 | 配置文件路径 |
|---------|------|------|-------------|
| Gateway | **8080** | API网关 | `heikeji-gateway/src/main/resources/application.yml` |
| API文档 | **8089** | Swagger API文档聚合服务 | `service-api-docs/src/main/resources/application.yml` |

### 核心业务服务

| 服务名称 | 端口 | 说明 | 配置文件路径 |
|---------|------|------|-------------|
| 用户服务 | **8081** | 用户注册、登录、管理 | `heikeji-mall-service/service-user/src/main/resources/application.yml` |
| 商品服务 | **8082** | 商品管理、分类、搜索 | `heikeji-mall-service/service-product/src/main/resources/application.yml` |
| 订单服务 | **8083** | 订单创建、查询、支付 | `heikeji-mall-service/service-order/src/main/resources/application.yml` |
| 配送服务 | **8001** | 配送管理、路线规划 | `heikeji-mall-service/service-delivery/src/main/resources/application.yml` |
| 校园服务 | **8003** | 校园活动、通知公告 | `heikeji-mall-service/service-campus/src/main/resources/application.yml` |
| 支付服务 | **8004** | 微信支付、支付宝支付 | `heikeji-mall-service/service-payment/src/main/resources/application.yml` |
| 外卖服务 | **8005** | 外卖商家、订单管理 | `heikeji-mall-service/service-takeout/src/main/resources/application.yml` |
| 二手服务 | **8006** | 二手市场、商品发布 | `heikeji-mall-service/service-secondhand/src/main/resources/application.yml` |
| 失物招领 | **8007** | 失物招领发布与查询 | `heikeji-mall-service/service-lostfound/src/main/resources/application.yml` |
| 会员服务 | **8088** | 会员等级、积分、优惠券 | `heikeji-mall-service/service-member/src/main/resources/application.yml` |

### 管理后台服务

| 服务名称 | 端口 | 说明 | 配置文件路径 |
|---------|------|------|-------------|
| 系统管理 | **8090** | 用户权限、角色管理 | `heikeji-system/src/main/resources/application.yml` |
| Admin服务 | **8091** | 后台管理系统 | `heikeji-admin/src/main/resources/application.yml` |

---

## 🗺️ 服务端口分布图

```
                    ┌─────────────────┐
                    │     Nacos       │
                    │     8848        │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    Gateway      │
                    │     8080        │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼──────┐  ┌──────────▼──────────┐  ┌─────▼──────┐
│   用户服务    │  │      商品服务        │  │  订单服务   │
│    8081      │  │       8082          │  │   8083     │
└──────────────┘  └─────────────────────┘  └────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   配送服务    │  │   校园服务    │  │   支付服务    │  │   外卖服务    │
│    8001      │  │    8003      │  │    8004      │  │    8005      │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   二手服务    │  │   失物招领    │  │   会员服务    │  │   API文档    │
│    8006      │  │    8007      │  │    8088      │  │    8089      │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐
│   系统管理    │  │   Admin服务   │
│    8090      │  │    8091      │
└──────────────┘  └──────────────┘
```

---

## 🔧 Gateway 路由配置

Gateway 配置文件: `heikeji-gateway/src/main/resources/application.yml`

### 当前路由映射

| 路由ID | 目标URI | 路径匹配 | 说明 |
|--------|---------|---------|------|
| heikeji-admin | `http://127.0.0.1:8090` | `/admin/**` | 管理后台 |
| heikeji-admin-dashboard | `http://127.0.0.1:8090` | `/api/dashboard/**` | 仪表盘API |
| heikeji-mall-product | `http://127.0.0.1:8082` | `/api/product/**` | 商品服务 |
| heikeji-mall-products | `http://127.0.0.1:8082` | `/api/products/**` | 商品服务(复数) |
| heikeji-mall-category | `http://127.0.0.1:8082` | `/api/category/**` | 分类服务 |
| heikeji-mall-order-api | `http://127.0.0.1:8083` | `/api/order/**` | 订单服务 |
| heikeji-mall-order | `http://127.0.0.1:8083` | `/order/**` | 订单服务(旧) |
| heikeji-mall-auth | `http://127.0.0.1:8081` | `/api/auth/**` | 认证服务 |
| heikeji-mall-user | `http://127.0.0.1:8081` | `/api/user/**` | 用户服务 |
| heikeji-mall-payment | `http://127.0.0.1:8004` | `/api/payment/**` | 支付服务 |
| heikeji-mall-app | `http://127.0.0.1:8005` | `/api/app/**` | APP服务 |
| heikeji-secondhand | `http://127.0.0.1:8006` | `/api/secondhand/**` | 二手服务 |
| heikeji-delivery | `http://127.0.0.1:8001` | `/api/delivery/**` | 配送服务 |
| heikeji-lostfound | `http://127.0.0.1:8007` | `/api/lostfound/**` | 失物招领 |
| heikeji-campus | `http://127.0.0.1:8003` | `/campus/**` | 校园服务 |
| heikeji-takeout-api | `http://127.0.0.1:8005` | `/api/takeout/**` | 外卖服务 |

---

## 🚀 服务启动顺序

```
第一阶段: 基础设施
    Nacos (8848) → MySQL (3306) → Redis (6379)

第二阶段: 网关与文档
    Gateway (8080) → API文档 (8089)

第三阶段: 核心业务服务（可并行启动）
    用户服务 (8081)
    商品服务 (8082)
    订单服务 (8083)
    配送服务 (8001)
    校园服务 (8003)
    支付服务 (8004)
    外卖服务 (8005)
    二手服务 (8006)
    失物招领 (8007)
    会员服务 (8088)

第四阶段: 管理后台
    系统管理 (8090)
    Admin服务 (8091)
```

---

## 📝 修改历史

| 版本 | 日期 | 修改内容 | 修改者 |
|------|------|---------|--------|
| v2.0.0 | 2026-04-27 | 统一所有服务端口，修复端口不一致问题 | AI助手 |
| v1.0.0 | 2024-10-16 | 初始版本 | 开发团队 |

### v2.0.0 端口变更详情

| 服务 | 原端口 | 新端口 | 变更原因 |
|------|--------|--------|---------|
| Gateway | 9999 | **8080** | 与文档保持一致 |
| 用户服务 | 8085 | **8081** | 与文档保持一致 |
| 配送服务 | 8010 | **8001** | 与文档保持一致 |
| 系统管理 | 8002 | **8090** | 与文档保持一致 |

---

## ⚠️ 注意事项

1. **端口冲突**: 确保上述端口未被其他应用程序占用
2. **防火墙配置**: 确保防火墙允许这些端口的访问
3. **Nacos注册**: 所有服务都注册到 Nacos (192.168.186.128:8848)
4. **健康检查**: 各服务提供 `/actuator/health` 端点用于健康检查

---

## 🔍 快速检查命令

```bash
# 检查端口占用情况（Linux/Mac）
netstat -tuln | grep -E '8080|8081|8082|8083|8001|8003|8004|8005|8006|8007|8088|8089|8090|8091|8848'

# 检查服务健康状态
curl http://localhost:8080/actuator/health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
# ... 其他服务

# 查看 Nacos 服务列表
curl http://localhost:8848/nacos/v1/ns/service/list
```

---

**文档维护**: 当新增服务或修改端口时，请同步更新此文档。
