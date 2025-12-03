# 黑科易购项目部署解决方案

## 当前问题分析

用户在尝试启动MySQL服务时遇到了认证问题：

```
==== AUTHENTICATING FOR org.freedesktop.systemd1.manage-units === 
启动“mysqld.service”需要认证。 
Multiple identities can be used for authentication: 
 1.  zky,,, (zky) 
 2.  heikeji 
Choose identity to authenticate as (1-2): 
```

**错误原因**：直接输入用户名 `heikeji` 导致认证失败，系统期望输入的是身份对应的数字编号（1或2）。

## 解决方案

### 方案1：正确使用系统认证启动MySQL服务

1. 执行启动命令：
   ```bash
   systemctl start mysqld
   ```

2. 当出现身份选择提示时，**仅输入对应身份的数字**：
   - 选择 `zky` 身份：输入 `1` 并按回车
   - 选择 `heikeji` 身份：输入 `2` 并按回车

3. 输入对应用户的密码进行认证

4. 验证服务是否成功启动：
   ```bash
   systemctl status mysqld.service
   ```

### 方案2：使用Docker Compose部署（推荐）

使用Docker Compose可以避免手动管理MySQL服务，实现一键部署所有依赖服务。

#### 步骤1：确保Docker和Docker Compose已安装

```bash
# 安装Docker
sudo apt install docker.io

# 安装Docker Compose
sudo apt install docker-compose

# 验证安装
docker --version
docker-compose --version
```

#### 步骤2：启动Docker Compose服务

```bash
# 在项目根目录执行
docker-compose up -d
```

这将启动所有依赖服务：
- MySQL 8.3
- Redis 7.2
- Nacos 3.1.1
- RabbitMQ 3.10
- Zipkin 2.24

#### 步骤3：验证服务状态

```bash
# 查看所有服务状态
docker-compose ps

# 查看MySQL服务日志
docker-compose logs -f mysql
```

## 完整部署流程

### 1. 环境准备

| 软件 | 版本 | 安装命令 |
|------|------|----------|
| OpenJDK | 17 | `sudo apt install openjdk-17-jdk` |
| Maven | 3.9.8 | 已配置 |
| Node.js | 18.x | 已配置 |
| Docker | 最新 | `sudo apt install docker.io` |
| Docker Compose | 最新 | `sudo apt install docker-compose` |

### 2. 部署顺序

#### 方案A：Docker Compose部署（推荐）

1. **启动依赖服务**
   ```bash
   docker-compose up -d
   ```

2. **构建后端服务**
   ```bash
   mvn clean install '-Dmaven.test.skip=true'
   ```

3. **启动后端服务**
   ```bash
   cd heikeji-mall-service
   ./start_services.sh
   ```

4. **构建前端**
   ```bash
   cd heikeji-frontend
   npm install
   npm run build
   ```

5. **配置Nginx**
   ```bash
   # 项目已提供nginx.conf配置文件
   sudo cp nginx.conf /etc/nginx/conf.d/heikeji-mall.conf
   sudo nginx -t
   sudo systemctl restart nginx
   ```

#### 方案B：传统部署

1. **启动基础服务**
   ```bash
   # 启动MySQL
   systemctl start mysqld
   
   # 启动Redis
   systemctl start redis-server
   
   # 启动Nacos
   # 参考详细文档
   
   # 启动RabbitMQ
   systemctl start rabbitmq-server
   
   # 启动Zipkin
   # 参考详细文档
   ```

2. **初始化数据库**
   ```bash
   mysql -u root -p -e "CREATE DATABASE heikeji_mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   mysql -u root -p heikeji_mall < full_db.sql
   ```

3. **构建和启动后端服务**
   ```bash
   mvn clean install '-Dmaven.test.skip=true'
   cd heikeji-mall-service
   ./start_services.sh
   ```

4. **构建前端**
   ```bash
   cd heikeji-frontend
   npm install
   npm run build
   ```

5. **配置Nginx**
   ```bash
   sudo cp nginx.conf /etc/nginx/conf.d/heikeji-mall.conf
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 服务访问地址

| 服务 | 访问地址 |
|------|----------|
| 前端 | http://localhost |
| Nacos 控制台 | http://localhost:8848/nacos |
| RabbitMQ 控制台 | http://localhost:15672 |
| Zipkin 控制台 | http://localhost:9411/zipkin |
| Swagger 文档 | http://localhost:8080/swagger-ui.html |

## 常用命令

### Docker Compose管理

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

### 后端服务管理

```bash
# 查看所有后端服务进程
ps -ef | grep java

# 停止所有后端服务
ps -ef | grep java | grep -v grep | awk '{print $2}' | xargs kill -9

# 查看服务日志
tail -f heikeji-mall-service/service-user.log
```

### 系统服务管理

```bash
# 启动MySQL
systemctl start mysqld

# 重启MySQL
systemctl restart mysqld

# 查看MySQL状态
systemctl status mysqld

# 重启Nginx
systemctl restart nginx
```

## 常见问题排查

1. **MySQL服务无法启动**
   - 检查系统日志：`journalctl -xeu mysqld.service`
   - 确保MySQL配置文件正确：`/etc/mysql/my.cnf`
   - 检查端口占用：`netstat -tuln | grep 3306`

2. **数据库连接失败**
   - 检查MySQL服务是否运行：`systemctl status mysqld`
   - 检查数据库凭证是否正确
   - 检查防火墙设置：`sudo ufw status`

3. **后端服务启动失败**
   - 查看服务日志：`tail -f heikeji-mall-service/[service-name].log`
   - 检查Nacos连接：`curl -I http://localhost:8848/nacos`
   - 检查数据库连接配置

4. **前端无法访问**
   - 检查Nginx配置：`sudo nginx -t`
   - 检查Nginx日志：`tail -f /var/log/nginx/error.log`
   - 检查前端构建是否成功：`ls -la heikeji-frontend/dist`

## 推荐部署方式

**对于初学者或遇到系统服务管理困难的用户，强烈推荐使用Docker Compose部署方式**，原因如下：

1. **简化配置**：无需手动安装和配置MySQL、Redis、Nacos等服务
2. **一键部署**：使用一条命令即可启动所有依赖服务
3. **隔离环境**：容器化部署避免了系统环境冲突
4. **易于管理**：使用Docker Compose命令轻松管理服务的启动、停止和状态检查
5. **一致性**：确保开发、测试和生产环境的一致性

## 后续步骤

1. 选择适合您的部署方式（推荐Docker Compose）
2. 按照上述步骤执行部署
3. 验证所有服务是否正常运行
4. 访问前端地址 http://localhost 测试项目

## 联系支持

如果在部署过程中遇到其他问题，请参考以下资源：

- 项目详细部署文档：`DEPLOYMENT_DETAILED.md`
- MySQL启动故障排除：`MYSQL_START_TROUBLESHOOT.md`
- 项目GitHub仓库：https://github.com/Kylin-001/HKYG
- 技术支持：support@heikeji.com

祝您部署顺利！