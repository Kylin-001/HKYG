# 黑科易购项目部署文档（简化版）

## 1. 项目概述

黑科易购是一个基于微服务架构的校园电商平台，包含以下核心组件：

- **前端**：Vue.js 应用，位于 `heikeji-frontend` 目录
- **后端服务**：多个 Spring Boot 微服务，位于 `heikeji-mall-service` 目录
- **网关**：API 网关，位于 `heikeji-gateway` 目录
- **认证服务**：身份认证服务，位于 `heikeji-auth` 目录
- **数据库**：MySQL 8.3.x
- **缓存**：Redis 7.2.x
- **服务注册与配置中心**：Nacos 3.1.1
- **消息队列**：RabbitMQ 3.10.x
- **分布式链路追踪**：Zipkin 2.24.x

## 2. 部署方式选择

本项目支持两种部署方式：

### 2.1 传统部署（推荐给初学者）
- 手动安装所有依赖服务
- 手动构建和启动各个服务
- 适合学习和开发环境

### 2.2 Docker Compose 部署（推荐给生产环境）
- 使用 Docker Compose 一键部署所有依赖服务
- 自动配置服务间的网络连接
- 适合测试和生产环境

## 3. 传统部署流程

### 3.1 环境准备

| 软件 | 版本 | 安装命令 |
|------|------|----------|
| OpenJDK | 17 | `sudo apt install openjdk-17-jdk` |
| Maven | 3.9.8 | 见详细文档 |
| Node.js | 18.x | 见详细文档 |
| MySQL | 8.3.x | 见详细文档 |
| Redis | 7.2.x | 见详细文档 |
| Nacos | 3.1.1 | 见详细文档 |
| RabbitMQ | 3.10.x | 见详细文档 |
| Zipkin | 2.24.x | 见详细文档 |
| Nginx | 最新 | `sudo apt install nginx` |

### 3.2 数据库初始化

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE heikeji_mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 导入数据
mysql -u root -p heikeji_mall < full_db.sql
```

### 3.3 后端服务部署

```bash
# 进入项目根目录
cd heikeji-mall

# 构建所有后端服务
mvn clean install '-Dmaven.test.skip=true'

# 启动服务（按照以下顺序）
# 1. 启动 Nacos
# 2. 启动 Redis
# 3. 启动 MySQL
# 4. 启动 RabbitMQ
# 5. 启动 Zipkin

# 6. 启动后端服务
cd heikeji-mall-service

# 创建启动脚本
cat > start_services.sh << 'EOF'
#!/bin/bash

# 启动用户服务
nohup java -jar service-user/target/service-user-1.0.0-exec.jar > service-user.log 2>&1 &
echo "用户服务启动成功，PID: $!"
sleep 2

# 启动商品服务
nohup java -jar service-product/target/service-product-1.0.0-exec.jar > service-product.log 2>&1 &
echo "商品服务启动成功，PID: $!"
sleep 2

# 启动支付服务
nohup java -jar service-payment/target/service-payment-1.0.0-exec.jar > service-payment.log 2>&1 &
echo "支付服务启动成功，PID: $!"
sleep 2

# 启动外卖服务
nohup java -jar service-takeout/target/service-takeout-1.0.0-exec.jar > service-takeout.log 2>&1 &
echo "外卖服务启动成功，PID: $!"
sleep 2

# 启动订单服务
nohup java -jar service-order/target/service-order-1.0.0-exec.jar > service-order.log 2>&1 &
echo "订单服务启动成功，PID: $!"
sleep 2

# 启动跑腿服务
nohup java -jar service-delivery/target/service-delivery-1.0.0-exec.jar > service-delivery.log 2>&1 &
echo "跑腿服务启动成功，PID: $!"
sleep 2

# 启动校园信息服务
nohup java -jar service-campus/target/service-campus-1.0.0-exec.jar > service-campus.log 2>&1 &
echo "校园信息服务启动成功，PID: $!"
sleep 2

# 启动二手市场服务
nohup java -jar service-secondhand/target/service-secondhand-1.0.0-exec.jar > service-secondhand.log 2>&1 &
echo "二手市场服务启动成功，PID: $!"
sleep 2

# 启动失物招领服务
nohup java -jar service-lostfound/target/service-lostfound-1.0.0-exec.jar > service-lostfound.log 2>&1 &
echo "失物招领服务启动成功，PID: $!"
EOF

# 赋予执行权限
chmod +x start_services.sh

# 启动服务
./start_services.sh
```

### 3.4 前端部署

```bash
# 进入前端目录
cd heikeji-frontend

# 安装依赖
npm install

# 构建前端
npm run build

# 配置 Nginx
cat > heikeji-mall-nginx.conf << 'EOF'
server {
    listen 80;
    server_name localhost;

    location / {
        root /path/to/heikeji-frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 复制配置文件到 Nginx 配置目录
sudo cp heikeji-mall-nginx.conf /etc/nginx/sites-available/

# 创建软链接
sudo ln -s /etc/nginx/sites-available/heikeji-mall-nginx.conf /etc/nginx/sites-enabled/

# 检查配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

## 4. Docker Compose 部署

### 4.1 环境准备

- 安装 Docker：`sudo apt install docker.io`
- 安装 Docker Compose：`sudo apt install docker-compose`

### 4.2 部署步骤

1. **创建 Docker Compose 配置文件**

   ```yaml
   version: '3.8'
   
   services:
     # MySQL 数据库
     mysql:
       image: mysql:8.3
       container_name: heikeji-mysql
       environment:
         MYSQL_ROOT_PASSWORD: root
         MYSQL_DATABASE: heikeji_mall
         MYSQL_CHARSET: utf8mb4
         MYSQL_COLLATION: utf8mb4_unicode_ci
       ports:
         - "3306:3306"
       volumes:
         - mysql_data:/var/lib/mysql
         - ./full_db.sql:/docker-entrypoint-initdb.d/full_db.sql
       restart: always
     
     # Redis 缓存
     redis:
       image: redis:7.2
       container_name: heikeji-redis
       ports:
         - "6379:6379"
       volumes:
         - redis_data:/data
       restart: always
     
     # Nacos 服务注册与配置中心
     nacos:
       image: nacos/nacos-server:v3.1.1
       container_name: heikeji-nacos
       environment:
         - MODE=standalone
         - SPRING_DATASOURCE_PLATFORM=mysql
         - MYSQL_SERVICE_HOST=mysql
         - MYSQL_SERVICE_PORT=3306
         - MYSQL_SERVICE_USER=root
         - MYSQL_SERVICE_PASSWORD=root
         - MYSQL_SERVICE_DB_NAME=nacos
       ports:
         - "8848:8848"
       volumes:
         - nacos_data:/home/nacos/data
       restart: always
     
     # RabbitMQ 消息队列
     rabbitmq:
       image: rabbitmq:3.10-management
       container_name: heikeji-rabbitmq
       environment:
         - RABBITMQ_DEFAULT_USER=admin
         - RABBITMQ_DEFAULT_PASS=admin
       ports:
         - "5672:5672"
         - "15672:15672"
       volumes:
         - rabbitmq_data:/var/lib/rabbitmq
       restart: always
     
     # Zipkin 分布式链路追踪
     zipkin:
       image: openzipkin/zipkin:2.24
       container_name: heikeji-zipkin
       ports:
         - "9411:9411"
       restart: always
   
   volumes:
     mysql_data:
     redis_data:
     nacos_data:
     rabbitmq_data:
   ```

2. **启动依赖服务**

   ```bash
   docker-compose up -d
   ```

3. **构建和启动后端服务**

   ```bash
   # 构建后端服务
   mvn clean install '-Dmaven.test.skip=true'
   
   # 启动后端服务（使用 start_services.sh 脚本）
   cd heikeji-mall-service
   ./start_services.sh
   ```

4. **部署前端**

   ```bash
   # 构建前端
   cd heikeji-frontend
   npm install
   npm run build
   
   # 配置 Nginx（参考传统部署方式）
   ```

## 5. 服务访问地址

| 服务 | 访问地址 |
|------|----------|
| 前端 | http://localhost |
| Nacos 控制台 | http://localhost:8848/nacos |
| RabbitMQ 控制台 | http://localhost:15672 |
| Zipkin 控制台 | http://localhost:9411/zipkin |
| Swagger 文档 | http://localhost:8080/swagger-ui.html |

## 6. 常用命令

### 6.1 服务管理

```bash
# 查看所有后端服务进程
ps -ef | grep java

# 停止所有后端服务
ps -ef | grep java | grep -v grep | awk '{print $2}' | xargs kill -9

# 查看服务日志
tail -f heikeji-mall-service/service-user.log

# 重启 Nginx
sudo systemctl restart nginx

# 重启 MySQL
sudo systemctl restart mysql

# 重启 Redis
sudo systemctl restart redis-server
```

### 6.2 Docker Compose 管理

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f [service-name]
```

## 7. 常见问题排查

### 7.1 服务启动失败

1. **检查日志**：
   ```bash
   tail -f heikeji-mall-service/service-user.log
   ```

2. **检查端口占用**：
   ```bash
   netstat -tuln | grep 8080
   ```

3. **检查数据库连接**：
   ```bash
   mysql -u root -p -h localhost -P 3306
   ```

4. **检查 Nacos 连接**：
   ```bash
   curl -I http://localhost:8848/nacos
   ```

### 7.2 前端无法访问后端

1. **检查 Nginx 配置**：
   ```bash
   sudo nginx -t
   ```

2. **检查后端服务状态**：
   ```bash
   ps -ef | grep java
   ```

3. **检查防火墙设置**：
   ```bash
   sudo ufw status
   ```

## 8. 版本更新

### 8.1 后端更新

```bash
# 拉取最新代码
git pull

# 停止当前服务
ps -ef | grep java | grep -v grep | awk '{print $2}' | xargs kill -9

# 重新构建
docker-compose up -d --build

# 启动服务
cd heikeji-mall-service
./start_services.sh
```

### 8.2 前端更新

```bash
# 拉取最新代码
git pull

# 重新构建
cd heikeji-frontend
npm install
npm run build

# 重启 Nginx
sudo systemctl restart nginx
```

## 9. 监控与维护

### 9.1 系统监控

- 使用 `htop` 查看系统资源使用情况
- 使用 `iotop` 查看磁盘 I/O 情况
- 使用 `vmstat` 查看系统状态

### 9.2 日志管理

- 后端服务日志位于 `heikeji-mall-service` 目录下
- Nginx 日志位于 `/var/log/nginx/` 目录下
- MySQL 日志位于 `/var/log/mysql/` 目录下

### 9.3 数据库备份

```bash
# 创建备份目录
mkdir -p /opt/backup

# 备份数据库
mysqldump -u root -p heikeji_mall > /opt/backup/heikeji_mall_$(date +%Y%m%d).sql
```

## 10. 联系方式

如有问题，请联系项目维护人员：

- 技术支持：support@heikeji.com
- GitHub 仓库：https://github.com/Kylin-001/HKYG
- 项目文档：https://github.com/Kylin-001/HKYG/wiki

---

**部署完成后，您的黑科易购项目应该已经可以正常运行！**