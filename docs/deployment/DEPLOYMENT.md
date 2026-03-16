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
- Admin：http://localhost:8081

## 服务说明

### 后端服务

| 服务名称 | 端口 | 说明 |
|---------|------|------|
| Nacos | 8848 | 服务注册与配置中心 |
| Gateway | 8080 | API网关 |
| Admin | 8081 | 管理后台 |
| User Service | 8082 | 用户服务 |
| Product Service | 8083 | 商品服务 |
| Order Service | 8084 | 订单服务 |
| Payment Service | 8085 | 支付服务 |
| Member Service | 8086 | 会员服务 |

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
