# 黑科易购项目详细部署文档

## 文档关联
- **业务介绍文档**: [PROJECT_BUSINESS_INTRO.md](PROJECT_BUSINESS_INTRO.md) - 包含项目业务介绍、技术实践和团队成员信息

## 环境说明
- **虚拟化软件**: VMware Workstation 17
- **操作系统**: CentOS 7 (CentOS-7-x86_64-DVD-2009.iso)
- **项目**: 黑科易购 (heikeji-mall)

## 1. 虚拟机环境准备

### 1.1 创建虚拟机
1. 打开 VMware Workstation 17，点击「创建新的虚拟机」
2. 选择「典型(推荐)(T)」，点击「下一步」
3. 选择「安装程序光盘映像文件(iso)(M)」，浏览并选择 `CentOS-7-x86_64-DVD-2009.iso`，点击「下一步」
4. 填写「全名」、「用户名」和「密码」，点击「下一步」
5. 填写「虚拟机名称」，选择「位置」（建议放在SSD上），点击「下一步」
6. 配置「最大磁盘大小」为100GB，选择「将虚拟磁盘存储为单个文件」，点击「下一步」
7. 点击「自定义硬件」，调整配置：
   - 内存: 16GB 或更高
   - 处理器: 4核或更高
   - 网络适配器: 选择「桥接模式」或「NAT模式」（根据网络环境选择）
   - 其他硬件保持默认
8. 点击「完成」创建虚拟机

### 1.2 安装 CentOS 7
1. 启动虚拟机，进入 CentOS 7 安装界面
2. 选择「Install CentOS 7」，按 Enter 键
3. 选择语言：「中文 - 简体中文（中国）」，点击「继续」
4. 配置「安装位置」：
   - 点击「安装位置」，选择「我要配置分区」，点击「完成」
   - 点击「+」添加分区：
     - 挂载点：`/`，期望容量：80GB，文件系统：`xfs`
     - 挂载点：`swap`，期望容量：8GB，文件系统：`swap`
     - 挂载点：`/boot`，期望容量：1GB，文件系统：`xfs`
   - 点击「完成」，点击「接受更改」
5. 配置「网络和主机名」：
   - 点击「网络和主机名」，打开网络连接，设置主机名（如 `heikeji-mall`）
   - 点击「应用」，点击「完成」
6. 点击「开始安装」
7. 安装过程中，设置「ROOT密码」，点击「完成」
8. 等待安装完成，点击「重启」

### 1.3 系统初始化配置
1. 登录系统（使用root用户或创建的普通用户）
2. 关闭防火墙（生产环境建议配置防火墙规则，而非直接关闭）：
   ```bash
   systemctl stop firewalld
   systemctl disable firewalld
   ```
3. 关闭 SELinux：
   ```bash
   sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
   setenforce 0
   ```
4. 更新系统：
   ```bash
   yum update -y
   ```
5. 安装必要的工具：
   ```bash
   yum install -y wget curl vim net-tools git
   ```

## 2. 软件环境安装

### 2.1 安装 JDK 17
1. 下载 OpenJDK 17：
   ```bash
   wget https://download.oracle.com/java/17/latest/jdk-17_linux-x64_bin.rpm
   ```
2. 安装 JDK：
   ```bash
   rpm -ivh jdk-17_linux-x64_bin.rpm
   ```
3. 验证安装：
   ```bash
   java -version
   ```
   输出应显示 Java 17 版本信息

### 2.2 安装 Maven 3.8.0+
1. 下载 Maven：
   ```bash
   wget https://archive.apache.org/dist/maven/maven-3/3.8.8/binaries/apache-maven-3.8.8-bin.tar.gz
   ```
2. 解压并移动到 `/usr/local`：
   ```bash
   tar -zxvf apache-maven-3.8.8-bin.tar.gz
   mv apache-maven-3.8.8 /usr/local/maven
   ```
3. 配置环境变量：
   ```bash
   vim /etc/profile
   ```
   在文件末尾添加：
   ```bash
   export MAVEN_HOME=/usr/local/maven
   export PATH=$MAVEN_HOME/bin:$PATH
   ```
4. 使环境变量生效：
   ```bash
   source /etc/profile
   ```
5. 验证安装：
   ```bash
   mvn -version
   ```

### 2.3 安装 Node.js 16.x
1. 安装 Node.js 16.x：
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_16.x | bash -
   yum install -y nodejs
   ```
2. 验证安装：
   ```bash
   node -v
   npm -v
   ```

### 2.4 安装 MySQL 8.3.x
1. 下载 MySQL 8.3.x 安装包：
   ```bash
   wget https://dev.mysql.com/get/mysql80-community-release-el7-11.noarch.rpm
   ```
2. 安装 MySQL 源：
   ```bash
   rpm -ivh mysql80-community-release-el7-11.noarch.rpm
   ```
3. 安装 MySQL：
   ```bash
   yum install -y mysql-community-server
   ```
4. 启动 MySQL 服务：
   ```bash
   systemctl start mysqld
   systemctl enable mysqld
   ```
5. 获取初始密码：
   ```bash
   grep 'temporary password' /var/log/mysqld.log
   ```
6. 登录 MySQL 并修改密码：
   ```bash
   mysql -u root -p
   ```
   输入初始密码，然后执行：
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourStrongPassword123!';
   ```
7. 配置 MySQL 允许远程访问：
   ```sql
   CREATE USER 'root'@'%' IDENTIFIED BY 'YourStrongPassword123!';
   GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
   FLUSH PRIVILEGES;
   ```
8. 退出 MySQL：
   ```sql
   exit;
   ```

### 2.5 安装 Redis 7.2.x
1. 安装 Redis 7.2.x：
   ```bash
   yum install -y epel-release
   yum install -y redis
   ```
2. 启动 Redis 服务：
   ```bash
   systemctl start redis
   systemctl enable redis
   ```
3. 验证安装：
   ```bash
   redis-cli ping
   ```
   输出应为 `PONG`

### 2.6 安装 Nacos 2.3.x
1. 下载 Nacos 2.3.x：
   ```bash
   wget https://github.com/alibaba/nacos/releases/download/2.3.2/nacos-server-2.3.2.tar.gz
   ```
2. 解压并移动到 `/usr/local`：
   ```bash
   tar -zxvf nacos-server-2.3.2.tar.gz
   mv nacos /usr/local/
   ```
3. 启动 Nacos 服务：
   ```bash
   cd /usr/local/nacos/bin
   sh startup.sh -m standalone
   ```
4. 验证 Nacos 是否启动成功：
   ```bash
   curl -X GET 'http://localhost:8848/nacos/v1/console/health/readiness'
   ```
   输出应为 `{"status":"UP"}`

## 3. 项目部署

### 3.1 克隆项目代码
1. 创建项目目录：
   ```bash
   mkdir -p /opt/projects
   cd /opt/projects
   ```
2. 克隆项目代码（假设已上传到Git仓库）：
   ```bash
   git clone https://github.com/your-repo/heikeji-mall.git
   cd heikeji-mall
   ```
   或者使用文件传输工具（如WinSCP）将项目文件上传到 `/opt/projects/heikeji-mall` 目录

### 3.2 数据库配置
1. 创建数据库：
   ```bash
   mysql -u root -p
   ```
   输入密码后执行：
   ```sql
   CREATE DATABASE heikeji_mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   exit;
   ```
2. 导入数据：
   ```bash
   mysql -u root -p heikeji_mall < full_db.sql
   ```

### 3.3 后端服务配置与启动

#### 3.3.1 修改配置文件
1. 进入 `heikeji-mall-service` 目录：
   ```bash
   cd heikeji-mall-service
   ```
2. 修改每个服务模块下的 `application.yml` 文件，配置数据库连接、Redis、Nacos 等信息：
   ```bash
   # 例如修改用户服务配置
   vim service-user/src/main/resources/application.yml
   ```
   配置内容：
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/heikeji_mall?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
       username: root
       password: YourStrongPassword123!
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
   对所有服务模块执行相同操作

#### 3.3.2 构建和启动服务
1. 使用 Maven 构建所有服务：
   ```bash
   mvn clean install '-Dmaven.test.skip=true'
   ```
2. 按照以下顺序启动服务：
   ```bash
   # 1. 确保 Nacos 和 Redis 已启动
   # 2. 启动用户服务
   nohup java -jar service-user/target/service-user-1.0.0-exec.jar > service-user.log 2>&1 &
   
   # 3. 启动商品服务
   nohup java -jar service-product/target/service-product-1.0.0-exec.jar > service-product.log 2>&1 &
   
   # 4. 启动支付服务
   nohup java -jar service-payment/target/service-payment-1.0.0-exec.jar > service-payment.log 2>&1 &
   
   # 5. 启动外卖服务
   nohup java -jar service-takeout/target/service-takeout-1.0.0-exec.jar > service-takeout.log 2>&1 &
   
   # 6. 启动订单服务
   nohup java -jar service-order/target/service-order-1.0.0-exec.jar > service-order.log 2>&1 &
   
   # 7. 启动跑腿服务
   nohup java -jar service-delivery/target/service-delivery-1.0.0-exec.jar > service-delivery.log 2>&1 &
   
   # 8. 启动校园信息服务
   nohup java -jar service-campus/target/service-campus-1.0.0-exec.jar > service-campus.log 2>&1 &
   
   # 9. 启动二手市场服务
   nohup java -jar service-secondhand/target/service-secondhand-1.0.0-exec.jar > service-secondhand.log 2>&1 &
   
   # 10. 启动失物招领服务
   nohup java -jar service-lostfound/target/service-lostfound-1.0.0-exec.jar > service-lostfound.log 2>&1 &
   ```
3. 查看服务启动状态：
   ```bash
   # 查看 Nacos 控制台，检查服务是否注册成功
   # 访问 http://虚拟机IP:8848/nacos
   ```

### 3.4 前端部署

#### 3.4.1 安装依赖并构建前端
1. 进入前端目录：
   ```bash
   cd /opt/projects/heikeji-mall/heikeji-frontend
   ```
2. 安装依赖：
   ```bash
   npm install
   ```
3. 构建前端项目：
   ```bash
   npm run build
   ```
   构建产物位于 `dist` 目录

#### 3.4.2 安装和配置 Nginx
1. 安装 Nginx：
   ```bash
   yum install -y nginx
   ```
2. 启动 Nginx 服务：
   ```bash
   systemctl start nginx
   systemctl enable nginx
   ```
3. 配置 Nginx：
   ```bash
   vim /etc/nginx/conf.d/heikeji-mall.conf
   ```
   配置内容：
   ```nginx
   server {
       listen 80;
       server_name localhost;

       location / {
           root /opt/projects/heikeji-mall/heikeji-frontend/dist;
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
4. 检查 Nginx 配置：
   ```bash
   nginx -t
   ```
5. 重启 Nginx 服务：
   ```bash
   systemctl restart nginx
   ```

## 4. 验证部署

### 4.1 验证后端服务
1. 访问 Nacos 控制台：
   ```
   http://虚拟机IP:8848/nacos
   ```
   登录用户名和密码默认都是 `nacos`，检查所有服务是否已注册

2. 访问各服务的 Swagger 文档：
   ```
   http://虚拟机IP:8080/swagger-ui.html
   ```

### 4.2 验证前端服务
1. 访问前端页面：
   ```
   http://虚拟机IP
   ```
2. 尝试登录、浏览商品等操作，验证系统功能是否正常

## 5. 常见问题和解决方案

### 5.1 端口冲突
- 问题：服务启动失败，提示端口已被占用
- 解决方案：修改配置文件中的端口号，或关闭占用端口的进程
  ```bash
  # 查看端口占用情况
  netstat -tuln | grep 端口号
  # 或
  lsof -i:端口号
  
  # 关闭占用端口的进程
  kill -9 进程ID
  ```

### 5.2 数据库连接失败
- 问题：服务无法连接到数据库
- 解决方案：
  1. 检查数据库服务是否已启动：`systemctl status mysqld`
  2. 检查数据库地址、用户名、密码是否正确
  3. 检查防火墙是否允许3306端口访问

### 5.3 Nacos 注册失败
- 问题：服务无法注册到 Nacos
- 解决方案：
  1. 检查 Nacos 服务是否已启动：`ps -ef | grep nacos`
  2. 检查配置文件中的 Nacos 地址是否正确
  3. 检查防火墙是否允许8848端口访问

### 5.4 前端无法访问后端 API
- 问题：前端页面无法调用后端接口
- 解决方案：
  1. 检查 Nginx 反向代理配置是否正确
  2. 检查后端服务是否已启动
  3. 检查防火墙是否允许8080端口访问

## 6. 服务管理

### 6.1 查看服务日志
```bash
# 查看 Nacos 日志
cd /usr/local/nacos/logs
cat nacos.log

# 查看后端服务日志
cd /opt/projects/heikeji-mall/heikeji-mall-service
cat service-user.log
```

### 6.2 停止服务
```bash
# 停止 Nacos 服务
cd /usr/local/nacos/bin
sh shutdown.sh

# 停止后端服务
ps -ef | grep java
kill -9 进程ID

# 停止 Redis 服务
systemctl stop redis

# 停止 MySQL 服务
systemctl stop mysqld

# 停止 Nginx 服务
systemctl stop nginx
```

## 7. 版本更新

### 7.1 后端更新
1. 停止相关服务
2. 拉取最新代码：`git pull`
3. 重新构建服务：`mvn clean install '-Dmaven.test.skip=true'`
4. 启动更新后的服务

### 7.2 前端更新
1. 拉取最新代码：`git pull`
2. 安装依赖：`npm install`
3. 重新构建前端：`npm run build`
4. 重启 Nginx 服务：`systemctl restart nginx`

---

**部署完成后，您的黑科易购项目应该已经可以正常运行！**

如有任何问题，请参考常见问题部分，或联系技术支持。