# 黑科易购 - 本地开发环境配置指南

## 架构说明

本项目采用分离部署模式：
- **本地（你的电脑）**：运行项目代码（微服务、前端）
- **虚拟机（192.168.186.128）**：运行基础设施（MySQL、Redis、Nacos、RabbitMQ）

```
┌─────────────────────────────────────────────────────────────┐
│                        本地环境                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  API网关     │  │  用户服务    │  │  商品服务    │       │
│  │  (Port 8080) │  │  (Port 8081) │  │  (Port 8082) │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  订单服务    │  │  配送服务    │  │  会员服务    │       │
│  │  (Port 8083) │  │  (Port 8001) │  │  (Port 8088) │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  校园服务    │  │  二手服务    │  │  失物招领    │       │
│  │  (Port 8003) │  │  (Port 8006) │  │  (Port 8007) │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │  管理后台    │  │  前端应用    │                         │
│  │  (Port 8090) │  │  (Port 3000) │                         │
│  └──────────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 网络连接
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     虚拟机 (192.168.186.128)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   MySQL      │  │    Redis     │  │    Nacos     │       │
│  │  (Port 3306) │  │  (Port 6379) │  │  (Port 8848) │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│  ┌──────────────┐                                            │
│  │   RabbitMQ   │                                            │
│  │  (Port 5672) │                                            │
│  └──────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

## 虚拟机服务配置

### 已配置的服务访问信息

| 服务 | 地址 | 端口 | 用户名 | 密码 |
|------|------|------|--------|------|
| MySQL | 192.168.186.128 | 3306 | hkyg | Mysql@8Root!2025 |
| Redis | 192.168.186.128 | 6379 | - | Redis@hkyg |
| Nacos | 192.168.186.128 | 8848 | nacos | nacos |
| RabbitMQ | 192.168.186.128 | 5672 | admin | admin |

### 控制台访问

- **Nacos控制台**: http://192.168.186.128:8848/nacos
- **RabbitMQ管理界面**: http://192.168.186.128:15672

## 本地环境配置步骤

### 1. 确保本地已安装

- **Java 17+**
- **Maven 3.8+**
- **Node.js 18+** (前端开发需要)

### 2. 修改本地配置文件

为每个微服务创建 `application-local.yml` 配置文件，覆盖远程连接信息。

#### 2.1 API网关配置

创建文件：`heikeji-gateway/src/main/resources/application-local.yml`

```yaml
server:
  port: 8080

spring:
  cloud:
    nacos:
      discovery:
        server-addr: 192.168.186.128:8848
      config:
        server-addr: 192.168.186.128:8848
        enabled: false
    gateway:
      routes:
        - id: heikeji-mall-user
          uri: http://localhost:8081
          predicates:
            - Path=/api/user/**
        - id: heikeji-mall-product
          uri: http://localhost:8082
          predicates:
            - Path=/api/product/**
        - id: service-order
          uri: http://localhost:8083
          predicates:
            - Path=/api/order/**
        - id: heikeji-delivery-service
          uri: http://localhost:8001
          predicates:
            - Path=/api/delivery/**
        - id: service-member
          uri: http://localhost:8088
          predicates:
            - Path=/api/member/**
        - id: service-campus
          uri: http://localhost:8003
          predicates:
            - Path=/api/campus/**
        - id: service-secondhand
          uri: http://localhost:8006
          predicates:
            - Path=/api/secondhand/**
        - id: service-lostfound
          uri: http://localhost:8007
          predicates:
            - Path=/api/lostfound/**
        - id: heikeji-admin
          uri: http://localhost:8090
          predicates:
            - Path=/admin/**
```

#### 2.2 用户服务配置

创建文件：`heikeji-mall-service/service-user/src/main/resources/application-local.yml`

```yaml
server:
  port: 8081

spring:
  datasource:
    url: jdbc:mysql://192.168.186.128:3306/heikeji_mall?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: hkyg
    password: Mysql@8Root!2025
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  redis:
    host: 192.168.186.128
    port: 6379
    password: Redis@hkyg
    database: 0
    timeout: 10s
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
  
  cloud:
    nacos:
      discovery:
        server-addr: 192.168.186.128:8848
        enabled: false
      config:
        enabled: false
```

#### 2.3 商品服务配置

创建文件：`heikeji-mall-service/service-product/src/main/resources/application-local.yml`

```yaml
server:
  port: 8082

spring:
  datasource:
    url: jdbc:mysql://192.168.186.128:3306/heikeji_mall?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: hkyg
    password: Mysql@8Root!2025
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  redis:
    host: 192.168.186.128
    port: 6379
    password: Redis@hkyg
    database: 0
  
  cloud:
    nacos:
      discovery:
        server-addr: 192.168.186.128:8848
        enabled: false
      config:
        enabled: false
```

#### 2.4 订单服务配置

创建文件：`heikeji-mall-service/service-order/src/main/resources/application-local.yml`

```yaml
server:
  port: 8083

spring:
  datasource:
    url: jdbc:mysql://192.168.186.128:3306/heikeji_mall?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: hkyg
    password: Mysql@8Root!2025
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  redis:
    host: 192.168.186.128
    port: 6379
    password: Redis@hkyg
    database: 0
  
  rabbitmq:
    host: 192.168.186.128
    port: 5672
    username: admin
    password: admin
    virtual-host: /
  
  cloud:
    nacos:
      discovery:
        server-addr: 192.168.186.128:8848
        enabled: false
      config:
        enabled: false
```

#### 2.5 其他服务配置模板

其他服务（配送、会员、校园、二手、失物招领、管理后台）的配置类似，只需修改端口：

```yaml
server:
  port: {服务端口}

spring:
  datasource:
    url: jdbc:mysql://192.168.186.128:3306/heikeji_mall?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: hkyg
    password: Mysql@8Root!2025
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  redis:
    host: 192.168.186.128
    port: 6379
    password: Redis@hkyg
    database: 0
  
  cloud:
    nacos:
      discovery:
        server-addr: 192.168.186.128:8848
        enabled: false
      config:
        enabled: false
```

### 3. 本地启动脚本

创建本地启动脚本 `start-local.sh`：

```bash
#!/bin/bash

# 本地开发环境启动脚本
# 使用虚拟机上的基础设施服务

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查虚拟机连接
check_vm_connection() {
    print_info "检查虚拟机连接..."
    
    if ! ping -c 1 192.168.186.128 &> /dev/null; then
        print_error "无法连接到虚拟机 (192.168.186.128)"
        exit 1
    fi
    
    print_success "虚拟机连接正常"
}

# 检查虚拟机服务
check_vm_services() {
    print_info "检查虚拟机服务..."
    
    # 检查MySQL
    if ! nc -z 192.168.186.128 3306 &> /dev/null; then
        print_error "MySQL (3306) 未启动"
        return 1
    fi
    print_success "MySQL 运行正常"
    
    # 检查Redis
    if ! nc -z 192.168.186.128 6379 &> /dev/null; then
        print_error "Redis (6379) 未启动"
        return 1
    fi
    print_success "Redis 运行正常"
    
    # 检查Nacos
    if ! nc -z 192.168.186.128 8848 &> /dev/null; then
        print_error "Nacos (8848) 未启动"
        return 1
    fi
    print_success "Nacos 运行正常"
    
    # 检查RabbitMQ
    if ! nc -z 192.168.186.128 5672 &> /dev/null; then
        print_error "RabbitMQ (5672) 未启动"
        return 1
    fi
    print_success "RabbitMQ 运行正常"
}

# 编译项目
build_project() {
    print_info "编译项目..."
    mvn clean package -DskipTests -q
    print_success "项目编译完成"
}

# 启动服务
start_services() {
    print_info "启动本地微服务..."
    
    # 启动用户服务
    print_info "启动用户服务 (8081)..."
    java -jar heikeji-mall-service/service-user/target/service-user-1.0.0.jar \
        --spring.profiles.active=local &
    
    # 启动商品服务
    print_info "启动商品服务 (8082)..."
    java -jar heikeji-mall-service/service-product/target/service-product-1.0.0-exec.jar \
        --spring.profiles.active=local &
    
    # 启动订单服务
    print_info "启动订单服务 (8083)..."
    java -jar heikeji-mall-service/service-order/target/service-order-1.0.0.jar \
        --spring.profiles.active=local &
    
    # 启动配送服务
    print_info "启动配送服务 (8001)..."
    java -jar heikeji-mall-service/service-delivery/target/service-delivery-1.0.0.jar \
        --spring.profiles.active=local &
    
    # 启动会员服务
    print_info "启动会员服务 (8088)..."
    java -jar heikeji-mall-service/service-member/target/service-member-1.0.0.jar \
        --spring.profiles.active=local &
    
    # 启动校园服务
    print_info "启动校园服务 (8003)..."
    java -jar heikeji-mall-service/service-campus/target/heikeji-mall-service-campus-1.0.0.jar \
        --spring.profiles.active=local &
    
    # 启动二手服务
    print_info "启动二手服务 (8006)..."
    java -jar heikeji-mall-service/service-secondhand/target/service-secondhand-1.0.0.jar \
        --spring.profiles.active=local &
    
    # 启动失物招领服务
    print_info "启动失物招领服务 (8007)..."
    java -jar heikeji-mall-service/service-lostfound/target/service-lostfound-1.0.0.jar \
        --spring.profiles.active=local &
    
    # 启动管理后台
    print_info "启动管理后台 (8090)..."
    java -jar heikeji-admin/target/heikeji-admin-1.0.0.jar \
        --spring.profiles.active=local &
    
    # 等待服务启动
    sleep 30
    
    # 启动API网关
    print_info "启动API网关 (8080)..."
    java -jar heikeji-gateway/target/heikeji-gateway-1.0.0.jar \
        --spring.profiles.active=local &
    
    print_success "所有服务已启动"
}

# 显示帮助
show_help() {
    cat << EOF
本地开发环境启动脚本

用法: $0 [命令]

命令:
    check       检查虚拟机连接和服务
    build       编译项目
    start       启动所有服务
    stop        停止所有服务
    restart     重启所有服务
    status      查看服务状态

示例:
    $0 check    # 检查环境
    $0 start    # 启动服务
    $0 status   # 查看状态
EOF
}

# 停止服务
stop_services() {
    print_info "停止所有服务..."
    pkill -f "java.*heikeji" || true
    print_success "服务已停止"
}

# 查看状态
show_status() {
    print_info "本地服务状态:"
    
    local services=(
        "8080:API网关"
        "8090:管理后台"
        "8081:用户服务"
        "8082:商品服务"
        "8083:订单服务"
        "8001:配送服务"
        "8088:会员服务"
        "8003:校园服务"
        "8006:二手服务"
        "8007:失物招领"
    )
    
    for service in "${services[@]}"; do
        IFS=':' read -r port name <<< "$service"
        if nc -z localhost "$port" 2>/dev/null; then
            echo -e "  ${GREEN}✓${NC} $name (端口 $port)"
        else
            echo -e "  ${RED}✗${NC} $name (端口 $port)"
        fi
    done
}

# 主函数
main() {
    case "$1" in
        check)
            check_vm_connection
            check_vm_services
            ;;
        build)
            build_project
            ;;
        start)
            check_vm_connection
            check_vm_services
            build_project
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            stop_services
            sleep 5
            start_services
            ;;
        status)
            show_status
            ;;
        *)
            show_help
            ;;
    esac
}

main "$@"
```

赋予执行权限：
```bash
chmod +x start-local.sh
```

## 使用步骤

### 1. 确保虚拟机服务已启动

在虚拟机中执行：
```bash
cd /home/zky/HKYG
bash scripts/health-check.sh
```

### 2. 在本地创建配置文件

按照上面的模板，为每个服务创建 `application-local.yml` 文件。

### 3. 启动本地服务

```bash
# 检查环境
./start-local.sh check

# 编译并启动所有服务
./start-local.sh start

# 查看状态
./start-local.sh status

# 停止服务
./start-local.sh stop
```

### 4. 单独启动某个服务（开发调试）

```bash
# 只启动用户服务
java -jar heikeji-mall-service/service-user/target/service-user-1.0.0.jar \
    --spring.profiles.active=local
```

## 访问地址

服务启动后，可以通过以下地址访问：

| 服务 | 本地地址 |
|------|----------|
| API网关 | http://localhost:8080 |
| 管理后台 | http://localhost:8090 |
| 用户服务 | http://localhost:8081 |
| 商品服务 | http://localhost:8082 |
| 订单服务 | http://localhost:8083 |
| 配送服务 | http://localhost:8001 |
| 会员服务 | http://localhost:8088 |
| 校园服务 | http://localhost:8003 |
| 二手服务 | http://localhost:8006 |
| 失物招领 | http://localhost:8007 |

## 常见问题

### 1. 无法连接虚拟机

检查网络连接：
```bash
ping 192.168.186.128
```

### 2. 服务启动失败

检查端口是否被占用：
```bash
lsof -i :8080  # 查看8080端口占用
```

### 3. 数据库连接失败

检查MySQL远程访问配置：
```bash
# 在虚拟机中执行
mysql -u hkyg -p -h 192.168.186.128
```

### 4. 修改代码后重新部署

```bash
# 重新编译
mvn clean package -DskipTests -pl {服务名} -am

# 重启服务
./start-local.sh restart
```

## 注意事项

1. **确保虚拟机和本地在同一网络**，能够互相访问
2. **虚拟机IP变化时需要更新配置**
3. **本地服务端口不要冲突**
4. **修改代码后需要重新编译**
