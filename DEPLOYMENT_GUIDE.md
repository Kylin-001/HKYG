# 黑科易购项目统一部署指南

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

本项目支持两种部署方式，您可以根据实际需求选择：

| 部署方式 | 特点 | 适用场景 |
|---------|------|----------|
| **Docker Compose部署** | 一键部署所有服务，环境隔离，易于管理 | 推荐给所有用户，尤其是生产环境 |
| **传统部署** | 手动安装依赖，灵活性高 | 开发环境，学习目的 |

## 3. 环境准备

### 3.1 硬件要求

| 环境类型 | CPU | 内存 | 磁盘 |
|---------|-----|------|------|
| 开发环境 | 2核 | 8GB | 50GB |
| 测试环境 | 4核 | 16GB | 100GB |
| 生产环境 | 8核 | 32GB | 200GB |

### 3.2 软件要求

| 软件 | 版本 | 安装命令 |
|------|------|----------|
| OpenJDK | 17 | `sudo apt install openjdk-17-jdk` |
| Maven | 3.8.0+ | 见详细说明 |
| Node.js | 18.x+ | 见详细说明 |
| Docker | 20.10.x+ | `sudo apt install docker.io` |
| Docker Compose | 1.29.x+ | `sudo apt install docker-compose` |

## 4. Docker Compose部署（推荐）

### 4.1 安装Docker和Docker Compose

```bash
# 更新软件包列表
sudo apt update

# 安装Docker
sudo apt install docker.io -y

# 安装Docker Compose
sudo apt install docker-compose -y

# 验证安装
docker --version
docker-compose --version

# 添加当前用户到docker组（避免每次使用sudo）
sudo usermod -aG docker $USER
newgrp docker  # 立即生效
```

### 4.2 启动服务

```bash
# 进入项目根目录
cd /path/to/heikeji-mall

# 启动所有服务
docker-compose up -d

# 检查服务状态
docker-compose ps
```

### 4.3 构建和部署应用服务

```bash
# 构建后端服务
mvn clean install '-Dmaven.test.skip=true'

# 启动后端服务
cd heikeji-mall-service
./start_services.sh

# 构建前端服务
cd ../heikeji-frontend
npm install
npm run build

# 配置Nginx
sudo cp ../nginx.conf /etc/nginx/conf.d/heikeji-mall.conf
sudo nginx -t
sudo systemctl restart nginx
```

## 5. 传统部署

### 5.1 安装依赖服务

#### 5.1.1 安装MySQL

```bash
# 更新软件包列表
sudo apt update

# 安装MySQL
sudo apt install mysql-server mysql-client -y

# 启动并启用MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 运行安全配置向导
sudo mysql_secure_installation
```

#### 5.1.2 安装Redis

```bash
# 安装Redis
sudo apt install redis-server -y

# 启动并启用Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### 5.1.3 安装Nacos

```bash
# 下载Nacos
wget https://github.com/alibaba/nacos/releases/download/v3.1.1/nacos-server-3.1.1.tar.gz

# 解压
tar -xzf nacos-server-3.1.1.tar.gz

# 启动Nacos（单机模式）
cd nacos/bin
sh startup.sh -m standalone
```

#### 5.1.4 安装RabbitMQ

```bash
# 安装RabbitMQ
sudo apt install rabbitmq-server -y

# 启动并启用RabbitMQ
sudo systemctl start rabbitmq-server
sudo systemctl enable rabbitmq-server

# 启用管理界面
sudo rabbitmq-plugins enable rabbitmq_management
```

#### 5.1.5 安装Zipkin

```bash
# 下载并启动Zipkin
java -jar zipkin-server-2.24.1-exec.jar &
```

### 5.2 数据库初始化

```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE heikeji_mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 导入数据
mysql -u root -p heikeji_mall < full_db.sql
```

### 5.3 后端服务部署

```bash
# 构建后端服务
mvn clean install '-Dmaven.test.skip=true'

# 进入服务目录
cd heikeji-mall-service

# 创建启动脚本
cat > start_services.sh << 'EOF'
#!/bin/bash

# 服务列表
SERVICES=()
SERVICES+=("service-user")
SERVICES+=("service-product")
SERVICES+=("service-payment")
SERVICES+=("service-takeout")
SERVICES+=("service-order")
SERVICES+=("service-delivery")
SERVICES+=("service-campus")
SERVICES+=("service-secondhand")
SERVICES+=("service-lostfound")

# 启动所有服务
for service in "${SERVICES[@]}"; do
    echo "启动 ${service}..."
    nohup java -jar ${service}/target/${service}-1.0.0-exec.jar > ${service}.log 2>&1 &
    echo "${service} 启动成功，PID: $!"
    sleep 2
done
EOF

# 赋予执行权限
chmod +x start_services.sh

# 启动服务
./start_services.sh
```

### 5.4 前端部署

```bash
# 进入前端目录
cd heikeji-frontend

# 安装依赖
npm install

# 构建前端
npm run build

# 配置Nginx
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

# 复制配置文件
sudo cp heikeji-mall-nginx.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/heikeji-mall-nginx.conf /etc/nginx/sites-enabled/

# 检查配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

## 6. 服务访问地址

| 服务 | 访问地址 | 用户名/密码 |
|------|----------|-------------|
| 前端 | http://localhost | - |
| Nacos 控制台 | http://localhost:8848/nacos | nacos/nacos |
| RabbitMQ 控制台 | http://localhost:15672 | guest/guest |
| Zipkin 控制台 | http://localhost:9411/zipkin | - |
| Swagger 文档 | http://localhost:8080/swagger-ui.html | - |

## 7. 常用命令

### 7.1 Docker Compose命令

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f [service-name]

# 重启服务
docker-compose restart [service-name]
```

### 7.2 后端服务命令

```bash
# 查看后端服务进程
ps -ef | grep java

# 停止所有后端服务
ps -ef | grep java | grep -v grep | awk '{print $2}' | xargs kill -9

# 查看服务日志
tail -f heikeji-mall-service/[service-name].log
```

### 7.3 系统服务命令

```bash
# 查看MySQL状态
sudo systemctl status mysql

# 重启MySQL
sudo systemctl restart mysql

# 查看Nginx状态
sudo systemctl status nginx

# 重启Nginx
sudo systemctl restart nginx
```

## 8. 常见问题排查

### 8.1 MySQL问题

| 问题 | 解决方案 |
|------|----------|
| 无法启动MySQL | 查看日志：`journalctl -xeu mysql` |
| 身份认证失败 | 参考MYSQL_AUTHENTICATION_SOLUTION.md |
| 密码忘记 | 参考MySQL密码重置文档 |

### 8.2 服务注册失败

| 问题 | 解决方案 |
|------|----------|
| Nacos注册失败 | 检查Nacos服务是否启动，配置文件中的地址是否正确 |
| 服务间通信失败 | 检查网络配置，确保服务在同一网络中 |

### 8.3 前端问题

| 问题 | 解决方案 |
|------|----------|
| 无法访问前端 | 检查Nginx配置和日志 |
| 前端无法调用API | 检查Nginx反向代理配置，后端服务是否启动 |
| 静态资源加载失败 | 检查静态资源路径配置 |

### 8.4 端口冲突

```bash
# 查看端口占用情况
netstat -tuln | grep [port]

# 查找占用端口的进程
lsof -i :[port]

# 终止占用端口的进程
kill -9 [pid]
```

## 9. 监控与维护

### 9.1 系统监控

- 使用 `htop` 查看系统资源使用情况
- 使用 `iotop` 查看磁盘I/O情况
- 使用 `vmstat` 查看系统状态

### 9.2 日志管理

- 后端服务日志：`heikeji-mall-service/[service-name].log`
- Nginx日志：`/var/log/nginx/`
- MySQL日志：`/var/log/mysql/`

### 9.3 数据库备份

```bash
# 创建备份目录
mkdir -p /opt/backup

# 备份数据库
mysqldump -u root -p heikeji_mall > /opt/backup/heikeji_mall_$(date +%Y%m%d).sql

# 压缩备份文件
gzip /opt/backup/heikeji_mall_$(date +%Y%m%d).sql
```

## 10. 版本更新

### 10.1 后端更新

```bash
# 拉取最新代码
git pull

# 停止当前服务
ps -ef | grep java | grep -v grep | awk '{print $2}' | xargs kill -9

# 重新构建
mvn clean install '-Dmaven.test.skip=true'

# 启动服务
cd heikeji-mall-service
./start_services.sh
```

### 10.2 前端更新

```bash
# 拉取最新代码
git pull

# 重新构建
cd heikeji-frontend
npm install
npm run build

# 重启Nginx
sudo systemctl restart nginx
```

## 11. 部署优化建议

### 11.1 生产环境优化

1. **使用优化后的部署文件**：参考DEPLOYMENT_OPTIMIZATION.md
2. **配置HTTPS**：为Nginx添加SSL证书
3. **启用防火墙**：配置ufw或firewalld
4. **设置日志轮转**：配置logrotate管理日志文件
5. **监控告警**：集成Prometheus和Grafana

### 11.2 性能优化

1. **数据库优化**：添加索引，优化查询
2. **Redis缓存**：合理使用缓存，减少数据库压力
3. **服务集群**：对核心服务进行集群部署
4. **负载均衡**：使用Nginx或其他负载均衡器
5. **CDN加速**：静态资源使用CDN加速

## 12. 联系支持

如有部署问题，请参考以下资源：

- 项目文档：DOCUMENTATION_GUIDE.md
- 部署问题解决方案：DEPLOYMENT_SOLUTIONS.md
- MySQL相关问题：MYSQL_*.md文档
- GitHub仓库：https://github.com/Kylin-001/HKYG
- 技术支持：support@heikeji.com

---

**部署完成后，您的黑科易购项目应该已经可以正常运行！**

祝您使用愉快！