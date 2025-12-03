# 黑科易购项目部署文档

## 1. 环境准备

### 1.1 硬件要求
- CPU: 至少 4 核
- 内存: 至少 16 GB
- 磁盘: 至少 100 GB 可用空间

### 1.2 软件要求
- **操作系统**: Linux 发行版（推荐 CentOS 7+ 或 Ubuntu 20.04+）
- **JDK**: OpenJDK 17
- **Maven**: 3.8.0 或更高版本
- **Node.js**: 18.x 或更高版本
- **MySQL**: 8.3.x
- **Redis**: 7.2.x
- **Nacos**: 2.3.x
- **RabbitMQ**: 3.10.x（用于消息队列）
- **Zipkin**: 2.24.x（用于分布式链路追踪）
- **Elasticsearch**: 8.x（可选，用于商品搜索）
- **Docker**: 20.10.x 或更高版本（可选，用于容器化部署）

## 2. 数据库配置

### 2.1 创建数据库
```sql
CREATE DATABASE heikeji_mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2.2 导入数据
使用项目根目录下的 `full_db.sql` 文件导入完整的数据库结构和初始数据：

```bash
mysql -u root -p heikeji_mall < full_db.sql
```

## 3. 后端服务部署

### 3.1 配置文件修改

1. 进入 `heikeji-mall-service` 目录，修改每个服务模块下的 `application.yml` 文件，配置数据库连接、Redis、Nacos 等信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/heikeji_mall?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
    username: root
    password: your_password
  redis:
    host: localhost
    port: 6379
    password: 
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
      config:
        server-addr: localhost:8848
        file-extension: yml
```

### 3.2 构建和启动服务

#### 3.2.1 使用 Maven 构建

已成功构建所有服务模块，构建产物位于各模块的 `target` 目录下：

```bash
# 构建命令（已执行）
mvn clean install '-Dmaven.test.skip=true'
```

#### 3.2.2 启动服务

按照以下顺序启动服务：

1. **Nacos Server**（必须先启动）
2. **Redis Server**
3. **用户服务** (`service-user`)
4. **商品服务** (`service-product`)
5. **支付服务** (`service-payment`)
6. **外卖服务** (`service-takeout`)
7. **订单服务** (`service-order`)
8. **跑腿服务** (`service-delivery`)
9. **校园信息服务** (`service-campus`)
10. **二手市场服务** (`service-secondhand`)
11. **失物招领服务** (`service-lostfound`)

启动命令示例（以用户服务为例）：

```bash
java -jar service-user/target/service-user-1.0.0-exec.jar
```

### 3.3 使用 Docker 部署

项目根目录下提供了 `Dockerfile`，可以用于构建 Docker 镜像：

```bash
docker build -t heikeji-mall .
docker run -d -p 8080:8080 --name heikeji-mall heikeji-mall
```

## 4. 前端部署

### 4.1 构建前端项目

已成功构建前端项目，构建产物位于 `heikeji-frontend/dist` 目录下：

```bash
# 构建命令（已执行）
npm run build
```

### 4.2 部署前端

1. 将 `dist` 目录下的所有文件复制到 Web 服务器的根目录（如 Nginx 或 Apache）

2. 配置 Nginx（示例）：

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /path/to/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 反向代理 API 请求
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

3. 启动 Nginx 服务

## 5. 启动顺序和验证

### 5.1 启动顺序

1. 启动基础服务：Nacos → Redis → MySQL
2. 启动后端服务：按照 3.2.2 节的顺序
3. 启动前端服务：Nginx 或其他 Web 服务器

### 5.2 验证服务

1. **验证后端服务**：
   - 访问 Nacos 控制台：http://localhost:8848/nacos
   - 检查所有服务是否已注册
   - 访问各服务的 Swagger 文档：http://localhost:8080/swagger-ui.html

2. **验证前端服务**：
   - 访问前端页面：http://localhost
   - 尝试登录、浏览商品等操作

## 6. 常见问题和解决方案

### 6.1 端口冲突
- 问题：服务启动失败，提示端口已被占用
- 解决方案：修改配置文件中的端口号，或关闭占用端口的进程

### 6.2 数据库连接失败
- 问题：服务无法连接到数据库
- 解决方案：检查数据库地址、用户名、密码是否正确，确保数据库服务已启动

### 6.3 Nacos 注册失败
- 问题：服务无法注册到 Nacos
- 解决方案：检查 Nacos 服务是否已启动，配置文件中的 Nacos 地址是否正确

### 6.4 前端无法访问后端 API
- 问题：前端页面无法调用后端接口
- 解决方案：检查 Nginx 反向代理配置是否正确，后端服务是否已启动

## 7. 监控和维护

### 7.1 日志查看
- 后端服务日志：各服务的 `logs` 目录下
- Nginx 日志：Nginx 安装目录的 `logs` 目录下

### 7.2 性能监控
- 使用 Nacos 控制台监控服务状态
- 使用 Spring Boot Actuator 监控服务指标
- 使用 Prometheus + Grafana 进行更详细的监控（可选）

## 8. 版本更新

### 8.1 后端更新
1. 停止相关服务
2. 重新构建服务：`mvn clean install '-Dmaven.test.skip=true'`
3. 启动更新后的服务

### 8.2 前端更新
1. 停止 Nginx 服务（或其他 Web 服务器）
2. 重新构建前端：`npm run build`
3. 将新的构建产物复制到 Web 服务器根目录
4. 启动 Nginx 服务

---

**部署完成后，您的黑科易购项目应该已经可以正常运行！**

如有任何问题，请参考常见问题部分，或联系技术支持。