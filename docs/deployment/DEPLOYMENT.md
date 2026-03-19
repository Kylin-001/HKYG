# 黑科易购项目部署指南

## 环境要求

### 后端环境
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Redis 6.0+
- Nacos 2.0+

### 前端环境
- Node.js 16+
- npm 8+
- 现代浏览器（Chrome、Firefox、Edge、Safari）

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd HKYG
```

### 2. 数据库配置
```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE heikeji_mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 导入表结构
mysql -u root -p heikeji_mall < sql/schema/tables/01_user.sql
mysql -u root -p heikeji_mall < sql/schema/tables/02_user.sql
mysql -u root -p heikeji_mall < sql/marketing_tables.sql
```

### 3. 后端配置
修改各模块的 `application.yml` 文件，配置数据库和Redis连接：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/heikeji_mall?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
  redis:
    host: localhost
    port: 6379
    password: 
```

### 4. 启动服务

#### Linux/Mac
```bash
# 启动全部服务
./start-all.sh

# 或选择启动方式
./start-all.sh all      # 启动全部服务
./start-all.sh backend  # 仅启动后端
./start-all.sh frontend # 仅启动前端

# 停止服务
./stop-all.sh
```

#### Windows
```cmd
# 启动全部服务
start-all.bat

# 停止服务
stop-all.bat
```

### 5. 访问应用
- 前端：http://localhost:5173
- 后端API：http://localhost:8080
- Nacos控制台：http://localhost:8848/nacos
- Gateway：http://localhost:8080
- Admin：http://localhost:8090

## 服务说明

### 后端服务

| 服务名称 | 端口 | 说明 |
|---------|------|------|
| Nacos | 8848 | 服务注册与配置中心 |
| Gateway | 8080 | API网关 |
| Admin | 8090 | 管理后台 |
| User Service | 8081 | 用户服务 |
| Product Service | 8082 | 商品服务 |
| Order Service | 8083 | 订单服务 |
| Delivery Service | 8001 | 配送服务 |
| Member Service | 8088 | 会员服务 |
| Campus Service | 8003 | 校园服务 |
| Secondhand Service | 8006 | 二手交易 |
| Lostfound Service | 8007 | 失物招领 |

### 前端服务

| 服务名称 | 端口 | 说明 |
|---------|------|------|
| Frontend | 5173 | 前端开发服务器 |

## 日志查看

### 后端日志
```bash
# Nacos日志
tail -f heikeji-system/nacos.log

# Gateway日志
tail -f heikeji-gateway/gateway.log

# Admin日志
tail -f heikeji-admin/admin.log

# 各服务日志
tail -f heikeji-mall-service/service-user/service-user.log
tail -f heikeji-mall-service/service-product/service-product.log
tail -f heikeji-mall-service/service-order/service-order.log
tail -f heikeji-mall-service/service-payment/service-payment.log
tail -f heikeji-mall-service/service-member/service-member.log
```

### 前端日志
```bash
# 前端日志
tail -f heikeji-frontend/frontend.log
```

## 开发模式

### 后端开发
```bash
# 启动Nacos
cd heikeji-system
mvn spring-boot:run

# 启动Gateway
cd heikeji-gateway
mvn spring-boot:run

# 启动Admin
cd heikeji-admin
mvn spring-boot:run

# 启动各服务
cd heikeji-mall-service/service-user
mvn spring-boot:run

cd heikeji-mall-service/service-product
mvn spring-boot:run

cd heikeji-mall-service/service-order
mvn spring-boot:run

cd heikeji-mall-service/service-payment
mvn spring-boot:run

cd heikeji-mall-service/service-member
mvn spring-boot:run
```

### 前端开发
```bash
cd heikeji-frontend
npm install
npm run dev
```

## 生产部署

### 1. 编译打包

#### 后端打包
```bash
# 编译所有模块
mvn clean package -DskipTests

# 单独编译模块
cd heikeji-admin
mvn clean package -DskipTests
```

#### 前端打包
```bash
cd heikeji-frontend
npm run build
```

### 2. 部署后端
```bash
# 复制JAR文件到服务器
scp target/*.jar user@server:/opt/heikeji/

# 启动服务
ssh user@server
cd /opt/heikeji
java -jar heikeji-admin-1.0.0.jar
```

### 3. 部署前端
```bash
# 复制dist目录到服务器
scp -r dist/* user@server:/var/www/html/

# 配置Nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 常见问题

### 1. 端口被占用
```bash
# 查找占用端口的进程
lsof -i :8080

# 杀死进程
kill -9 <PID>
```

### 2. 数据库连接失败
- 检查MySQL是否运行
- 检查数据库用户名密码
- 检查防火墙设置

### 3. Redis连接失败
- 检查Redis是否运行
- 检查Redis配置
- 检查防火墙设置

### 4. 前端启动失败
- 清除node_modules：`rm -rf node_modules`
- 重新安装依赖：`npm install`
- 检查Node.js版本：`node -v`

### 5. 后端启动失败
- 检查Java版本：`java -version`
- 清理Maven缓存：`mvn clean`
- 重新编译：`mvn clean package`

## 性能优化

### 1. JVM参数优化
```bash
java -Xms512m -Xmx1024m -jar app.jar
```

### 2. 数据库优化
- 添加索引
- 优化SQL查询
- 使用连接池

### 3. 前端优化
- 启用Gzip压缩
- 使用CDN
- 代码分割

## 监控与维护

### 1. 系统监控
- 使用Sentry错误追踪
- 查看系统监控仪表板
- 定期检查日志

### 2. 数据备份
- 定期备份数据库
- 备份Redis数据
- 备份上传文件

### 3. 日志管理
- 定期清理旧日志
- 配置日志轮转
- 监控日志大小

## 分离部署架构

### 架构说明
本项目采用分离部署架构，将核心服务部署在虚拟机中，其余服务在本地运行：

#### 虚拟机中运行的服务
- **MySQL**：数据库服务
- **Redis**：缓存服务
- **Nacos**：服务注册与配置中心
- **RabbitMQ**：消息队列服务

#### 本地运行的服务
- **API Gateway**：API网关
- **User Service**：用户服务
- **Product Service**：商品服务
- **Order Service**：订单服务
- **Admin**：管理后台
- **其他业务服务**

### 虚拟机配置

#### 虚拟机信息
- **IP地址**：192.168.186.128
- **操作系统**：Linux
- **内存**：建议4GB以上
- **磁盘**：建议50GB以上

#### 服务配置

| 服务 | 端口 | 配置文件 |
|------|------|----------|
| MySQL | 3306 | 数据库：heikeji_mall |
| Redis | 6379 | 无密码 |
| Nacos | 8848 | 默认配置 |
| RabbitMQ | 5672 | 默认用户：guest/guest |

### 本地服务配置

所有本地服务需要更新以下配置，指向虚拟机IP：

#### 数据库配置
```yaml
spring:
  datasource:
    url: jdbc:mysql://192.168.186.128:3306/heikeji_mall?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: hkyg
    password: Mysql@8Root!2025
```

#### Redis配置
```yaml
spring:
  redis:
    host: 192.168.186.128
    port: 6379
    password: 
    database: 0
    timeout: 3000
```

#### Nacos配置
```yaml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: 192.168.186.128:8848
```

#### RabbitMQ配置
```yaml
spring:
  rabbitmq:
    host: 192.168.186.128
    port: 5672
    username: guest
    password: guest
    virtual-host: /
    connection-timeout: 30000
```

### 部署步骤

#### 1. 虚拟机环境准备
1. 安装并配置MySQL、Redis、Nacos、RabbitMQ
2. 创建数据库：`CREATE DATABASE heikeji_mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
3. 导入数据库脚本

#### 2. 本地服务配置
1. 更新所有服务的配置文件，指向虚拟机IP
2. 编译打包服务
3. 启动本地服务

#### 3. 验证服务
1. 检查服务注册状态：访问Nacos控制台
2. 测试API接口：使用Postman或Swagger UI
3. 验证消息队列：发送测试消息

## 安全建议

### 1. 网络安全
- 使用HTTPS
- 配置防火墙
- 限制访问IP

### 2. 应用安全
- 定期更新依赖
- 使用强密码
- 启用安全头

### 3. 数据安全
- 数据加密
- 定期备份
- 访问控制

## 联系方式

如有问题，请联系：
- 技术支持：support@heikeji.com
- 项目文档：https://docs.heikeji.com
- 问题反馈：https://github.com/heikeji/HKYG/issues
