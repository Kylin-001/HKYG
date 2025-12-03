# 黑科易购项目Ubuntu 20.04详细部署文档

## 文档关联
- **业务介绍文档**: [PROJECT_BUSINESS_INTRO.md](PROJECT_BUSINESS_INTRO.md) - 包含项目业务介绍、技术实践和团队成员信息
- **基础部署文档**: [DEPLOYMENT.md](DEPLOYMENT.md) - 包含项目部署的简要说明

## 1. 环境说明
- **操作系统**: Ubuntu 20.04 LTS
- **项目**: 黑科易购 (heikeji-mall)
- **架构**: 微服务架构

## 2. 系统初始化配置

### 2.1 登录系统
- 使用root用户或创建的普通用户登录系统

### 2.2 系统更新与基础工具安装
```bash
# 更新系统软件包
sudo apt update && sudo apt upgrade -y

# 安装必要的基础工具
sudo apt install -y wget curl vim net-tools git unzip tar gcc g++ make

# 安装常用工具
sudo apt install -y software-properties-common apt-transport-https ca-certificates
```

### 2.3 防火墙配置
```bash
# 查看防火墙状态
sudo ufw status

# 启用防火墙（推荐）
sudo ufw enable

# 允许SSH连接
sudo ufw allow ssh

# 允许HTTP和HTTPS连接
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 允许MySQL连接（仅开发环境，生产环境建议不开放）
sudo ufw allow 3306/tcp

# 允许Redis连接（仅开发环境，生产环境建议不开放）
sudo ufw allow 6379/tcp

# 允许Nacos连接
sudo ufw allow 8848/tcp

# 允许后端服务连接
sudo ufw allow 8080/tcp

# 查看防火墙规则
sudo ufw status numbered
```

### 2.4 时间同步配置
```bash
# 更新软件包列表
sudo apt update

# 安装systemd-timesyncd包（确保服务文件存在）
sudo apt install -y systemd-timesyncd

# 检查时间同步服务状态
sudo systemctl status systemd-timesyncd

# 如果服务被屏蔽，解除屏蔽
sudo systemctl unmask systemd-timesyncd

# 启用并启动时间同步服务
sudo systemctl enable systemd-timesyncd
sudo systemctl start systemd-timesyncd

# 启用NTP时间同步
sudo timedatectl set-ntp true

# 查看时间同步状态
sudo timedatectl status

# 查看时间同步详细信息
sudo timedatectl timesync-status
```

如果需要使用传统的ntp服务（不推荐）：
```bash
# 停止并禁用systemd-timesyncd服务
sudo systemctl stop systemd-timesyncd
sudo systemctl disable systemd-timesyncd

# 安装ntp服务
sudo apt install -y ntp

# 启动ntp服务
sudo systemctl start ntp
sudo systemctl enable ntp

# 查看ntp服务状态
sudo systemctl status ntp

# 查看ntp同步状态
sudo ntpq -p
```

### 2.5 用户与权限配置
```bash
# 创建项目用户
sudo useradd -m heikeji
sudo passwd heikeji

# 添加sudo权限
sudo usermod -aG sudo heikeji

# 创建项目目录
sudo mkdir -p /opt/projects
sudo chown -R heikeji:heikeji /opt/projects
```

## 3. 软件环境安装

### 3.1 安装 JDK 17
```bash
# 安装OpenJDK 17
sudo apt install -y openjdk-17-jdk openjdk-17-jre

# 验证安装
java -version
javac -version

# 查看Java安装路径
sudo update-alternatives --config java
```

### 3.2 安装 Maven 3.8.0+
Ubuntu 20.04默认安装的Maven版本是3.6.3，不符合项目要求。需要安装Maven 3.8.0+版本：

```bash
# 安装依赖
sudo apt install -y wget tar

# 下载Maven 3.9.8（最新稳定版）
wget https://archive.apache.org/dist/maven/maven-3/3.9.8/binaries/apache-maven-3.9.8-bin.tar.gz

# 解压到/usr/local目录
sudo tar -zxvf apache-maven-3.9.8-bin.tar.gz -C /usr/local/

# 创建软链接
sudo ln -s /usr/local/apache-maven-3.9.8 /usr/local/maven

# 配置环境变量
echo 'export MAVEN_HOME=/usr/local/maven' | sudo tee -a /etc/profile
echo 'export PATH=$MAVEN_HOME/bin:$PATH' | sudo tee -a /etc/profile

# 使环境变量生效
source /etc/profile

# 验证安装
mvn -version

# 配置Maven镜像源（可选，加速依赖下载）
sudo vim /usr/local/maven/conf/settings.xml
```

在settings.xml文件中添加阿里云镜像：
```xml
<mirrors>
    <mirror>
        <id>aliyunmaven</id>
        <mirrorOf>*</mirrorOf>
        <name>阿里云公共仓库</name>
        <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
</mirrors>
```

### 3.3 安装 Node.js 18.x
项目要求Node.js版本 >= 18.0.0，因此安装Node.js 18.x

```bash
# 安装Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v
npm -v

# 安装cnpm（可选，加速npm包下载）
sudo npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm -v
```

### 3.4 安装 MySQL 8.3.x
```bash
# 添加MySQL官方仓库
sudo wget -c https://dev.mysql.com/get/mysql-apt-config_0.8.29-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.29-1_all.deb
# 在弹出的界面中选择MySQL 8.3版本

# 更新软件包列表
sudo apt update

# 安装MySQL 8.3.x
sudo apt install -y mysql-server

# 启动MySQL服务
sudo systemctl start mysql
sudo systemctl enable mysql

# 查看MySQL服务状态
sudo systemctl status mysql

# 运行MySQL安全配置脚本
sudo mysql_secure_installation

# 登录MySQL
sudo mysql -u root
```

执行以下SQL命令：
```sql
-- 创建数据库
CREATE DATABASE heikeji_mall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户并授权
CREATE USER 'root'@'%' IDENTIFIED BY 'YourStrongPassword123!';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- 退出MySQL
exit;
```

修改MySQL配置，允许远程连接：
```bash
# 编辑MySQL配置文件
sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf

# 将bind-address改为0.0.0.0
bind-address = 0.0.0.0

# 重启MySQL服务
sudo systemctl restart mysql
```

### 3.5 安装 Redis 7.2.x
```bash
# 添加Redis官方仓库
sudo add-apt-repository -y ppa:redislabs/redis

# 更新软件包列表
sudo apt update

# 安装Redis 7.2.x
sudo apt install -y redis-server

# 启动Redis服务
sudo systemctl start redis-server
sudo systemctl enable redis-server

# 查看Redis服务状态
sudo systemctl status redis-server

# 验证安装
redis-cli ping

# 查看Redis版本
redis-server --version

# 配置Redis（可选，根据需求调整）
sudo vim /etc/redis/redis.conf
```

常用Redis配置项：
```conf
# 监听地址（默认127.0.0.1，允许远程访问改为0.0.0.0）
bind 0.0.0.0

# 端口（默认6379）
port 6379

# 密码（默认无密码，建议设置）
requirepass your_redis_password

# 持久化配置
appendonly yes
appendfsync everysec
```

重启Redis服务使配置生效：
```bash
sudo systemctl restart redis-server
```

### 3.6 安装 Nacos 3.1.1

#### 方案：使用国内镜像源稳定下载并配置（推荐）

```bash
# 1. 清理之前可能下载的损坏文件
rm -f nacos-server-*.tar.gz nacos-server-*.zip

# 2. 安装必要工具
# 确保已安装unzip（如果使用zip格式）
sudo apt install -y unzip

# 3. 选择一种下载方式（推荐使用华为云镜像）

# 方式A：使用华为云镜像下载Nacos 3.1.1（推荐，稳定可靠）
sudo wget --timeout=30 --tries=3 https://repo.huaweicloud.com/nacos/3.1.1/nacos-server-3.1.1.tar.gz

# 方式B：如果tar.gz下载失败，尝试zip格式
# sudo wget --timeout=30 --tries=3 https://repo.huaweicloud.com/nacos/3.1.1/nacos-server-3.1.1.zip

# 4. 解压安装（根据实际下载的文件格式选择）

# 情况1：如果下载的是tar.gz格式
sudo tar -zxvf nacos-server-3.1.1.tar.gz -C /usr/local/

# 情况2：如果下载的是zip格式
# sudo unzip nacos-server-3.1.1.zip -d /usr/local/

# 5. 创建软链接（方便后续版本管理）
# 注意：根据实际安装路径调整

# 情况1：如果Nacos安装在默认路径
# sudo ln -s /usr/local/nacos-server-3.1.1 /usr/local/nacos

# 情况2：如果Nacos安装在自定义路径（如/usr/local/java/nacos）
# 检查实际安装路径
if [ -d "/usr/local/java/nacos" ]; then
    echo "Nacos已安装在/usr/local/java/nacos"
    NACOS_HOME="/usr/local/java/nacos"
elif [ -d "/usr/local/nacos-server-3.1.1" ]; then
    echo "Nacos已安装在/usr/local/nacos-server-3.1.1"
    sudo ln -s /usr/local/nacos-server-3.1.1 /usr/local/nacos
    NACOS_HOME="/usr/local/nacos"
else
    echo "请确认Nacos安装路径"
    NACOS_HOME="/usr/local/nacos"  # 默认路径
fi

echo "使用Nacos安装路径：$NACOS_HOME"

# 6. 配置Nacos（必须，Nacos 3.1.1要求配置完整的认证信息）

# 6.1 生成认证配置所需的密钥
# 6.1.1 生成JWT密钥（长度32位以上）
# 方法1：使用openssl生成
NACOS_JWT_SECRET=$(openssl rand -base64 48)

# 方法2：使用echo生成（备选）
# NACOS_JWT_SECRET=$(echo "heikeji-mall-nacos-jwt-secret-key-2025-very-secure" | base64)

# 6.1.2 设置服务器身份密钥（可自定义）
NACOS_IDENTITY_KEY="nacos"
NACOS_IDENTITY_VALUE="nacos"

echo "生成的JWT密钥：$NACOS_JWT_SECRET"
echo "服务器身份密钥：$NACOS_IDENTITY_KEY/$NACOS_IDENTITY_VALUE"

# 6.2 配置Nacos认证信息到配置文件
# 修改application.properties文件
sudo tee -a $NACOS_HOME/conf/application.properties << EOF

# 开启鉴权（Nacos 3.x建议开启）
nacos.core.auth.enabled=true

# 服务器身份密钥配置
nacos.core.auth.server.identity.key=$NACOS_IDENTITY_KEY
nacos.core.auth.server.identity.value=$NACOS_IDENTITY_VALUE

# JWT密钥配置（必须，用于生成认证token）
nacos.core.auth.plugin.nacos.token.secret.key=$NACOS_JWT_SECRET
EOF

# 6.3 手动配置认证信息（如果自动配置失败，可手动执行）
# 步骤1：生成JWT密钥
# openssl rand -base64 48
# 步骤2：编辑配置文件
# sudo vim $NACOS_HOME/conf/application.properties
# 步骤3：添加以下配置（替换为生成的密钥）
# nacos.core.auth.enabled=true
# nacos.core.auth.server.identity.key=nacos
# nacos.core.auth.server.identity.value=nacos
# nacos.core.auth.plugin.nacos.token.secret.key=生成的Base64密钥
# 步骤4：保存并退出
# :wq

# 6.4 可选：修改JVM内存配置（如果服务器内存较小，可调整为512M）
# sudo nano $NACOS_HOME/bin/startup.sh

# 7. 启动Nacos服务（单机模式）
# 注意：请确保在正确的目录下执行启动命令，使用bash而不是sh（startup.sh脚本使用了Bash特定语法）
# 方法1：使用脚本中定义的NACOS_HOME变量
cd $NACOS_HOME/bin
sudo bash startup.sh -m standalone

# 方法2：如果NACOS_HOME变量未设置或无效，手动切换到安装目录
# 例如：如果Nacos安装在默认路径
sudo bash /usr/local/nacos/bin/startup.sh -m standalone

# 方法3：如果Nacos安装在自定义路径（如/usr/local/java/nacos）
sudo bash /usr/local/java/nacos/bin/startup.sh -m standalone

# 方法4：如果不确定安装路径，可以先查找startup.sh文件
# find / -name "startup.sh" | grep nacos
# 然后使用找到的完整路径执行
# sudo bash /path/to/nacos/bin/startup.sh -m standalone

# 8. 验证Nacos是否启动成功
# 等待30秒让服务完全启动
sleep 30

# 方法1：检查端口是否监听
netstat -tuln | grep 8848

# 方法2：检查进程是否运行
ps -ef | grep nacos

# 方法3：使用curl验证健康状态
curl -X GET http://localhost:8848/nacos/v1/console/health/readiness || echo "Nacos服务已启动，但健康检查可能需要更多时间"

# 9. 设置Nacos开机自启
# 创建systemd服务文件
sudo tee /etc/systemd/system/nacos.service << EOF
[Unit]
Description=Nacos Service
After=network.target

[Service]
Type=forking
ExecStart=/bin/bash /usr/local/java/nacos/bin/startup.sh -m standalone
ExecStop=/bin/bash /usr/local/java/nacos/bin/shutdown.sh
Restart=on-failure
User=root
Group=root

[Install]
WantedBy=multi-user.target
EOF

# 针对自定义安装路径的systemd服务配置（如/usr/local/java/nacos）
# sudo tee /etc/systemd/system/nacos.service << EOF
# [Unit]
# Description=Nacos Service
# After=network.target
# 
# [Service]
# Type=forking
# ExecStart=/bin/bash /usr/local/java/nacos/bin/startup.sh -m standalone
# ExecStop=/bin/bash /usr/local/java/nacos/bin/shutdown.sh
# Restart=on-failure
# User=root
# Group=root
# 
# [Install]
# WantedBy=multi-user.target
# EOF

# 启用并启动服务
sudo systemctl daemon-reload
sudo systemctl enable nacos
sudo systemctl restart nacos

# 10. 查看Nacos服务状态
sudo systemctl status nacos

# 11. 访问Nacos控制台
# 浏览器访问：http://服务器IP:8848/nacos
# 默认账号密码：nacos/nacos
```

#### 常见问题及解决方案：

1. **下载失败**
   - 检查网络连接：`ping repo.huaweicloud.com`
   - 尝试更换下载源：
     ```bash
     # 阿里云镜像
     wget https://mirrors.aliyun.com/nacos/nacos-server/nacos-server-3.1.1.tar.gz
     
     # 腾讯云镜像
     wget https://mirrors.cloud.tencent.com/nacos/nacos-server/nacos-server-3.1.1.tar.gz
     ```

2. **解压失败（gzip: stdin: not in gzip format）**
   - **检查文件类型**：`file nacos-server-3.1.1.tar.gz`（正常应显示"gzip compressed data"）
   - **验证文件大小**：`ls -lh nacos-server-3.1.1.tar.gz`（正常约100MB，太小说明下载不完整）
   - **查看文件内容开头**：`head -n 10 nacos-server-3.1.1.tar.gz`（如果显示HTML内容，说明下载了错误的文件）
   - **删除损坏文件**：`rm -f nacos-server-3.1.1.tar.gz`
   - **重新下载正确的tar.gz文件**：
     ```bash
     # 方案1：使用华为云镜像下载（推荐）
     sudo wget --timeout=30 --tries=3 https://repo.huaweicloud.com/nacos/3.1.1/nacos-server-3.1.1.tar.gz
     
     # 方案2：使用阿里云镜像下载
     sudo wget --timeout=30 --tries=3 https://mirrors.aliyun.com/nacos/nacos-server/nacos-server-3.1.1.tar.gz
     
     # 方案3：使用腾讯云镜像下载
     sudo wget --timeout=30 --tries=3 https://mirrors.cloud.tencent.com/nacos/nacos-server/nacos-server-3.1.1.tar.gz
     ```
   - **使用正确的解压命令**：
     ```bash
     # 确保使用tar.gz文件，而不是zip文件
     sudo tar -zxvf nacos-server-3.1.1.tar.gz -C /usr/local/
     ```
   - **如果仍失败，尝试直接下载解压**：
     ```bash
     # 使用curl下载并直接解压，避免中间文件损坏
     curl -L https://repo.huaweicloud.com/nacos/3.1.1/nacos-server-3.1.1.tar.gz | sudo tar -zxvf - -C /usr/local/
     ```

3. **启动失败：sh: 0: Can't open startup.sh**
   - **原因**：在错误的目录下执行了启动命令，或者startup.sh文件不存在
   - **解决方案**：
     - 确认当前目录：`pwd`
     - 查找startup.sh文件位置：`find / -name "startup.sh" | grep nacos`
     - 使用完整路径执行启动命令：`sudo sh /usr/local/nacos/bin/startup.sh -m standalone`
     - 或者先切换到正确目录：`cd /usr/local/nacos/bin && sudo sh startup.sh -m standalone`

4. **启动失败**
   - 检查端口是否被占用：`netstat -tuln | grep 8848`
   - 查看日志：`tail -n 100 /usr/local/nacos/logs/start.out`
   - 检查JVM内存设置：修改`/usr/local/nacos/bin/startup.sh`中的`JVM_XMS`和`JVM_XMX`参数

5. **启动失败：The initial key used to generate JWT tokens... is missing**
   - **原因**：Nacos配置文件中缺少JWT密钥配置，或配置存在重复、格式错误
   - **解决方案**：
     - 生成Base64密钥：`openssl rand -base64 48`
     - 编辑配置文件（根据实际安装路径调整）：`sudo vim /usr/local/java/nacos/conf/application.properties` 或 `sudo vim /usr/local/nacos/conf/application.properties`
     - 首先删除文件中所有重复的JWT密钥配置行
     - 然后添加完整的认证配置：
       ```
       # 开启鉴权
       nacos.core.auth.enabled=true
       
       # 服务器身份密钥配置
       nacos.core.auth.server.identity.key=nacos
       nacos.core.auth.server.identity.value=nacos
       
       # JWT密钥配置（替换为生成的Base64密钥）
       nacos.core.auth.plugin.nacos.token.secret.key=生成的Base64密钥
       ```
     - 保存并退出：`:wq`
     - 重新启动Nacos

6. **启动失败：`nacos.core.auth.server.identity.key` is missing**
   - **原因**：Nacos配置文件中缺少服务器身份密钥配置
   - **解决方案**：
     - 编辑配置文件（根据实际安装路径调整）：`sudo vim /usr/local/java/nacos/conf/application.properties` 或 `sudo vim /usr/local/nacos/conf/application.properties`
     - 首先删除文件中所有重复的配置行
     - 然后添加服务器身份密钥配置：
       ```
       # 开启鉴权
       nacos.core.auth.enabled=true
       
       # 服务器身份密钥配置
       nacos.core.auth.server.identity.key=nacos
       nacos.core.auth.server.identity.value=nacos
       ```
     - 保存并退出：`:wq`
     - 重新启动Nacos

7. **配置文件存在重复项**
   - **原因**：多次执行配置脚本导致配置项重复
   - **解决方案**：
     - 编辑配置文件：`sudo vim /usr/local/java/nacos/conf/application.properties`
     - 删除所有重复的配置项，只保留一组正确的配置
     - 或者重新创建配置文件：
       ```bash
       # 备份原配置文件
       sudo cp /usr/local/java/nacos/conf/application.properties /usr/local/java/nacos/conf/application.properties.bak
       
       # 清理配置文件中的重复项（保留最后一次出现的配置）
       sudo awk '!seen[$0]++' /usr/local/java/nacos/conf/application.properties.bak > /usr/local/java/nacos/conf/application.properties
       
       # 添加完整的认证配置
       sudo tee -a /usr/local/java/nacos/conf/application.properties << EOF
       
       # 开启鉴权
       nacos.core.auth.enabled=true
       
       # 服务器身份密钥配置
       nacos.core.auth.server.identity.key=nacos
       nacos.core.auth.server.identity.value=nacos
       
       # JWT密钥配置（替换为生成的Base64密钥）
       nacos.core.auth.plugin.nacos.token.secret.key=$(openssl rand -base64 48)
       EOF
       ```
     - 重新启动Nacos

8. **启动失败：/usr/local/java/nacos/bin/startup.sh: 172: [[: not found**
   - **原因**：使用了`sh`命令执行startup.sh脚本，而脚本中使用了Bash特定语法`[[ ]]`
   - **解决方案**：
     - 使用`bash`命令代替`sh`命令执行脚本：
       ```bash
       # 单机模式启动
       sudo bash /usr/local/java/nacos/bin/startup.sh -m standalone
       
       # 或切换到脚本目录后执行
       cd /usr/local/java/nacos/bin && sudo bash startup.sh -m standalone
       ```
     - 检查脚本是否设置了正确的shebang：`head -n 1 /usr/local/java/nacos/bin/startup.sh`
     - 如果脚本第一行不是`#!/bin/bash`，可以修改：`sudo sed -i '1s/^.*$/#!\/bin\/bash/' /usr/local/java/nacos/bin/startup.sh`

9. **健康检查失败**
   - 等待更长时间：`sleep 60`后再次尝试
   - 检查防火墙设置：`sudo ufw status`
   - 查看详细日志：`tail -n 100 /usr/local/nacos/logs/nacos.log`

#### 手动下载上传方案（最可靠）

如果自动下载持续失败，建议：
1. 在本地浏览器下载Nacos安装包：`https://repo.huaweicloud.com/nacos/3.1.1/nacos-server-3.1.1.tar.gz`
2. 使用scp命令上传到服务器：
   ```bash
   # 在本地电脑执行（Windows可使用WinSCP工具）
   scp nacos-server-3.1.1.tar.gz zky@192.168.186.129:~/ 
   ```
3. 然后在服务器上执行上述步骤4-11

### 3.7 安装 Nginx
```bash
# 安装Nginx
sudo apt install -y nginx

# 启动Nginx服务
sudo systemctl start nginx
sudo systemctl enable nginx

# 查看Nginx服务状态
sudo systemctl status nginx

# 验证Nginx是否启动成功
curl -I http://localhost
```

### 3.8 安装 RabbitMQ 3.10.x
项目使用RabbitMQ进行消息队列，需要安装RabbitMQ 3.10.x版本：

#### 步骤1：清理有问题的仓库配置
首先移除之前添加的有问题的RabbitMQ仓库：
```bash
# 移除有问题的RabbitMQ仓库
sudo add-apt-repository --remove 'deb https://dl.cloudsmith.io/public/rabbitmq/rabbitmq-server/deb/ubuntu focal main'

# 清理过时的包列表
sudo apt clean

# 更新软件包列表（验证仓库是否已移除）
sudo apt update
```

#### 方法1：使用Ubuntu默认仓库安装（最可靠）
```bash
# 更新软件包列表
sudo apt update

# 安装RabbitMQ服务器（Ubuntu 20.04默认提供3.8版本，稳定可靠）
sudo apt install -y rabbitmq-server

# 启动RabbitMQ服务
sudo systemctl start rabbitmq-server

# 设置RabbitMQ开机自启
sudo systemctl enable rabbitmq-server

# 验证RabbitMQ是否启动成功
sudo systemctl status rabbitmq-server

# 启用RabbitMQ管理插件（可选，提供Web管理界面）
sudo rabbitmq-plugins enable rabbitmq_management

# 创建管理员用户
sudo rabbitmqctl add_user admin Rabbit@hkyg
sudo rabbitmqctl set_user_tags admin administrator
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"

# 查看用户列表
sudo rabbitmqctl list_users

# 查看RabbitMQ版本
rabbitmqctl version
```

#### 方法2：使用Docker安装RabbitMQ 3.10.x（版本可控）
```bash
# 安装Docker（如果未安装）
sudo apt install -y docker.io

# 启动Docker服务
sudo systemctl start docker
sudo systemctl enable docker

# 使用Docker安装并运行RabbitMQ 3.10.x
sudo docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=admin \
  -e RABBITMQ_DEFAULT_PASS=Rabbit@hkyg \
  rabbitmq:3.10-management

# 验证RabbitMQ是否启动成功
sudo docker ps | grep rabbitmq

# 查看RabbitMQ日志
sudo docker logs rabbitmq
```

#### 方法3：使用官方推荐的仓库安装（备选）
```bash
# 安装依赖
sudo apt install -y curl gnupg2

# 添加RabbitMQ官方GPG密钥
curl -fsSL https://keys.openpgp.org/vks/v1/by-fingerprint/0A9AF2115F4687BD29803A206B73A36E6026DFCA | sudo gpg --dearmor -o /usr/share/keyrings/rabbitmq-archive-keyring.gpg

# 添加Erlang仓库
echo "deb [signed-by=/usr/share/keyrings/rabbitmq-archive-keyring.gpg] http://ppa.launchpad.net/rabbitmq/rabbitmq-erlang/ubuntu focal main" | sudo tee /etc/apt/sources.list.d/rabbitmq.list

# 添加RabbitMQ仓库
echo "deb [signed-by=/usr/share/keyrings/rabbitmq-archive-keyring.gpg] http://ppa.launchpad.net/rabbitmq/rabbitmq-server/ubuntu focal main" | sudo tee -a /etc/apt/sources.list.d/rabbitmq.list

# 更新软件包列表
sudo apt update

# 安装RabbitMQ
sudo apt install -y rabbitmq-server

# 启动和配置步骤与方法1相同
```

### 3.9 安装 Zipkin 2.24.x
项目使用Zipkin进行分布式链路追踪，需要安装Zipkin：
```bash
# 创建Zipkin安装目录
sudo mkdir -p /usr/local/zipkin

# 下载Zipkin
sudo wget -O /usr/local/zipkin/zipkin.jar https://repo1.maven.org/maven2/io/zipkin/zipkin-server/2.24.3/zipkin-server-2.24.3-exec.jar

# 给jar文件添加执行权限
sudo chmod +x /usr/local/zipkin/zipkin.jar

# 创建Zipkin系统服务文件（使用tee命令避免权限问题）
sudo tee /etc/systemd/system/zipkin.service > /dev/null << EOF
[Unit]
Description=Zipkin Distributed Tracing System
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/java -jar /usr/local/zipkin/zipkin.jar
Restart=on-failure
User=root
Group=root

[Install]
WantedBy=multi-user.target
EOF

# 重新加载systemd配置
sudo systemctl daemon-reload

# 启动Zipkin服务
sudo systemctl start zipkin

# 设置Zipkin开机自启
sudo systemctl enable zipkin

# 验证Zipkin是否启动成功
# 注意：Zipkin默认将根路径重定向到/zipkin/，所以使用完整路径进行验证
curl -I http://localhost:9411/zipkin/

# 或者使用-L参数跟随重定向
curl -I -L http://localhost:9411
```

### 3.10 安装 Docker 20.10.x+（可选，用于容器化部署）
如果需要使用Docker进行容器化部署，可以安装Docker：
```bash
# 更新软件包列表
sudo apt update

# 安装依赖
sudo apt install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common

# 添加阿里云Docker GPG密钥
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -

# 添加阿里云Docker稳定版仓库
sudo add-apt-repository "deb [arch=amd64] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"

# 更新软件包列表
sudo apt update

# 安装Docker CE和Docker CLI
# 方案1：正常安装（如果遇到文件尺寸不符问题，尝试方案2或3）
sudo apt install -y docker-ce docker-ce-cli containerd.io

# 方案2：使用--fix-missing选项修复缺失的包
sudo apt install -y --fix-missing docker-ce docker-ce-cli containerd.io

# 方案3：跳过rootless-extras包，只安装核心组件（推荐）
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 启动Docker服务
sudo systemctl start docker

# 设置Docker开机自启
sudo systemctl enable docker

# 配置Docker国内镜像加速（解决拉取镜像超时问题）
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://registry.docker-cn.com",
    "https://mirror.baidubce.com",
    "https://hub-mirror.c.163.com",
    "https://mirror.sjtu.edu.cn",
    "https://docker.nju.edu.cn"
  ]
}
EOF

# 检查配置文件内容是否正确
sudo cat /etc/docker/daemon.json

# 重启Docker服务使配置生效
sudo systemctl daemon-reload
sudo systemctl restart docker

# 验证镜像加速配置是否生效
sudo docker info | grep -A 5 "Registry Mirrors"

# 验证Docker是否安装成功（核心功能验证）
sudo docker --version
sudo docker info

# 注意事项：
# 1. 如果docker-ce-rootless-extras包安装失败，不影响核心功能使用
# 2. 核心组件（docker-ce、docker-ce-cli、containerd.io）已成功安装即可正常使用
# 3. 国内镜像加速配置已添加，可通过docker info查看是否生效
# 4. 如果拉取镜像仍有问题，可能是网络环境限制，可跳过hello-world验证，直接进行后续部署
# 5. 后续部署中使用的镜像可通过本地构建或其他方式获取

# （可选）将当前用户添加到docker组，避免每次使用sudo
# 注意：需要重新登录或重启才能生效
sudo usermod -aG docker $USER
```

## 4. 项目部署

### 4.1 准备项目代码
```bash
# 切换到项目用户
su - heikeji

# 创建项目目录
mkdir -p /opt/projects
cd /opt/projects

# 克隆项目代码（假设已上传到Git仓库）
git clone https://github.com/Kylin-001/HKYG
cd heikeji-mall

# 或者使用文件传输工具（如WinSCP）将项目文件上传到/opt/projects/heikeji-mall目录
```

### 4.2 数据库初始化
```bash
# 导入数据库数据
mysql -u root -p heikeji_mall < full_db.sql
```

### 4.3 后端服务配置与启动

#### 4.3.1 修改配置文件
```bash
# 进入后端服务目录
cd heikeji-mall-service

# 修改各服务模块的配置文件
# 例如修改用户服务配置
vim service-user/src/main/resources/application.yml
```

配置内容示例：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/heikeji_mall?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
    username: root
    password: YourStrongPassword123!
  redis:
    host: localhost
    port: 6379
    password: your_redis_password
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
      config:
        server-addr: localhost:8848
        file-extension: yml
```

#### 4.3.2 构建后端服务
```bash
# 使用Maven构建所有服务
mvn clean install '-Dmaven.test.skip=true'
```

#### 4.3.3 启动后端服务
```bash
# 创建服务启动脚本
cat > start_services.sh << EOF
#!/bin/bash

# 启动用户服务
nohup java -jar service-user/target/service-user-1.0.0-exec.jar > service-user.log 2>&1 &
echo "用户服务启动成功，PID: $!"

# 等待2秒
 sleep 2

# 启动商品服务
nohup java -jar service-product/target/service-product-1.0.0-exec.jar > service-product.log 2>&1 &
echo "商品服务启动成功，PID: $!"

# 等待2秒
 sleep 2

# 启动支付服务
nohup java -jar service-payment/target/service-payment-1.0.0-exec.jar > service-payment.log 2>&1 &
echo "支付服务启动成功，PID: $!"

# 等待2秒
 sleep 2

# 启动外卖服务
nohup java -jar service-takeout/target/service-takeout-1.0.0-exec.jar > service-takeout.log 2>&1 &
echo "外卖服务启动成功，PID: $!"

# 等待2秒
 sleep 2

# 启动订单服务
nohup java -jar service-order/target/service-order-1.0.0-exec.jar > service-order.log 2>&1 &
echo "订单服务启动成功，PID: $!"

# 等待2秒
 sleep 2

# 启动跑腿服务
nohup java -jar service-delivery/target/service-delivery-1.0.0-exec.jar > service-delivery.log 2>&1 &
echo "跑腿服务启动成功，PID: $!"

# 等待2秒
 sleep 2

# 启动校园信息服务
nohup java -jar service-campus/target/service-campus-1.0.0-exec.jar > service-campus.log 2>&1 &
echo "校园信息服务启动成功，PID: $!"

# 等待2秒
 sleep 2

# 启动二手市场服务
nohup java -jar service-secondhand/target/service-secondhand-1.0.0-exec.jar > service-secondhand.log 2>&1 &
echo "二手市场服务启动成功，PID: $!"

# 等待2秒
 sleep 2

# 启动失物招领服务
nohup java -jar service-lostfound/target/service-lostfound-1.0.0-exec.jar > service-lostfound.log 2>&1 &
echo "失物招领服务启动成功，PID: $!"
EOF

# 赋予脚本执行权限
chmod +x start_services.sh

# 执行启动脚本
./start_services.sh
```

#### 4.3.4 查看服务启动状态
```bash
# 查看Nacos控制台，检查服务是否注册成功
# 访问 http://服务器IP:8848/nacos

# 查看服务日志
 tail -f service-user.log
```

### 4.4 前端部署

#### 4.4.1 安装依赖并构建前端
```bash
# 进入前端目录
cd /opt/projects/heikeji-mall/heikeji-frontend

# 安装依赖
npm install

# 构建前端项目
npm run build

# 构建产物位于dist目录
ls -la dist/
```

#### 4.4.2 配置 Nginx
```bash
# 创建Nginx配置文件
sudo cat > /etc/nginx/sites-available/heikeji-mall << EOF
server {
    listen 80;
    server_name localhost;

    location / {
        root /opt/projects/heikeji-mall/heikeji-frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 反向代理API请求
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存配置
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2?|ttf|eot|svg)$ {
        root /opt/projects/heikeji-mall/heikeji-frontend/dist;
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

# 创建软链接，启用配置
sudo ln -s /etc/nginx/sites-available/heikeji-mall /etc/nginx/sites-enabled/

# 检查Nginx配置
sudo nginx -t

# 重启Nginx服务
sudo systemctl restart nginx

# 查看Nginx服务状态
sudo systemctl status nginx
```

## 5. 部署验证

### 5.1 后端服务验证
```bash
# 查看Nacos控制台，检查服务是否注册成功
# 访问 http://服务器IP:8848/nacos
# 登录用户名和密码默认都是nacos

# 访问各服务的Swagger文档
# 访问 http://服务器IP:8080/swagger-ui.html

# 检查服务日志
cd /opt/projects/heikeji-mall/heikeji-mall-service
 tail -f service-user.log
```

### 5.2 前端服务验证
```bash
# 访问前端页面
# 访问 http://服务器IP

# 检查Nginx日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 6. Ubuntu系统优化

### 6.1 内核参数优化
```bash
# 编辑sysctl.conf文件
sudo vim /etc/sysctl.conf
```

添加以下内核参数：
```conf
# 网络优化
net.core.somaxconn = 65535
net.ipv4.tcp_max_syn_backlog = 65535
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_tw_recycle = 0
net.ipv4.ip_local_port_range = 1024 65535

# 文件描述符优化
fs.file-max = 655350

# 内存管理优化
vm.swappiness = 10
vm.overcommit_memory = 1
```

使内核参数生效：
```bash
sudo sysctl -p
```

### 6.2 文件描述符优化
```bash
# 编辑limits.conf文件
sudo vim /etc/security/limits.conf
```

添加以下内容：
```conf
* soft nofile 65535
* hard nofile 65535
* soft nproc 65535
* hard nproc 65535
```

### 6.3 定时任务配置
```bash
# 编辑crontab
crontab -e
```

添加以下定时任务（示例）：
```bash
# 每天凌晨2点备份数据库
0 2 * * * mysqldump -u root -pYourStrongPassword123! heikeji_mall > /opt/backup/heikeji_mall_$(date +\%Y\%m\%d).sql

# 每周日凌晨3点清理日志文件
0 3 * * 0 find /opt/projects/heikeji-mall/heikeji-mall-service -name "*.log" -mtime +7 -delete
```

## 7. 服务管理

### 7.1 查看服务状态
```bash
# 查看系统服务状态
sudo systemctl status mysql redis-server nacos nginx

# 查看Java服务进程
ps -ef | grep java

# 查看端口占用情况
netstat -tuln
# 或
ss -tuln
```

### 7.2 查看服务日志
```bash
# 查看系统日志
sudo journalctl -xe

# 查看MySQL日志
sudo tail -f /var/log/mysql/error.log

# 查看Redis日志
sudo tail -f /var/log/redis/redis-server.log

# 查看Nacos日志
sudo tail -f /usr/local/nacos/logs/nacos.log

# 查看Nginx日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 查看后端服务日志
cd /opt/projects/heikeji-mall/heikeji-mall-service
tail -f service-user.log
```

### 7.3 停止服务
```bash
# 停止Nacos服务
sudo systemctl stop nacos

# 停止后端服务
ps -ef | grep java | grep -v grep | awk '{print $2}' | xargs kill -9

# 停止Redis服务
sudo systemctl stop redis-server

# 停止MySQL服务
sudo systemctl stop mysql

# 停止Nginx服务
sudo systemctl stop nginx
```

### 7.4 重启服务
```bash
# 重启Nacos服务
sudo systemctl restart nacos

# 重启后端服务
cd /opt/projects/heikeji-mall/heikeji-mall-service
ps -ef | grep java | grep -v grep | awk '{print $2}' | xargs kill -9
./start_services.sh

# 重启Redis服务
sudo systemctl restart redis-server

# 重启MySQL服务
sudo systemctl restart mysql

# 重启Nginx服务
sudo systemctl restart nginx
```

## 8. 版本更新

### 8.1 后端更新
```bash
# 切换到项目目录
cd /opt/projects/heikeji-mall

# 拉取最新代码
git pull

# 进入后端服务目录
cd heikeji-mall-service

# 停止当前运行的后端服务
ps -ef | grep java | grep -v grep | awk '{print $2}' | xargs kill -9

# 重新构建服务
mvn clean install '-Dmaven.test.skip=true'

# 启动更新后的服务
./start_services.sh
```

### 8.2 前端更新
```bash
# 切换到项目目录
cd /opt/projects/heikeji-mall

# 拉取最新代码
git pull

# 进入前端目录
cd heikeji-frontend

# 安装依赖
npm install

# 构建前端项目
npm run build

# 重启Nginx服务
sudo systemctl restart nginx
```

## 9. 常见问题和解决方案

### 9.1 端口冲突
```bash
# 查看端口占用情况
netstat -tuln | grep 端口号
# 或
lsof -i:端口号

# 关闭占用端口的进程
kill -9 进程ID

# 修改服务配置文件中的端口号
vim service-user/src/main/resources/application.yml
```

### 9.2 数据库连接失败
```bash
# 检查数据库服务是否已启动
sudo systemctl status mysql

# 检查数据库连接配置
vim service-user/src/main/resources/application.yml

# 检查数据库用户权限
mysql -u root -p -e "SHOW GRANTS FOR 'root'@'%';"
```

### 9.3 Nacos注册失败
```bash
# 检查Nacos服务是否已启动
sudo systemctl status nacos

# 检查Nacos配置
vim service-user/src/main/resources/application.yml

# 查看Nacos日志
sudo tail -f /usr/local/nacos/logs/nacos.log

# 查看服务日志
tail -f service-user.log
```

### 9.4 前端无法访问后端API
```bash
# 检查Nginx配置
sudo nginx -t
cat /etc/nginx/sites-available/heikeji-mall

# 检查后端服务是否已启动
ps -ef | grep java

# 检查防火墙是否允许端口访问
sudo ufw status
```

### 9.5 服务启动失败
```bash
# 查看服务日志
tail -f service-user.log

# 检查JVM内存配置
# 在启动脚本中添加JVM参数
# nohup java -Xms512m -Xmx1024m -jar service-user/target/service-user-1.0.0-exec.jar > service-user.log 2>&1 &
```

## 10. 监控与维护

### 10.1 系统监控
```bash
# 安装监控工具
sudo apt install -y htop iotop vmstat

# 使用htop查看系统资源使用情况
htop

# 使用iotop查看磁盘I/O情况
sudo iotop

# 使用vmstat查看系统状态
vmstat 1
```

### 10.2 日志管理
```bash
# 安装日志管理工具
sudo apt install -y logrotate

# 配置日志轮转
sudo cat > /etc/logrotate.d/heikeji-mall << EOF
/opt/projects/heikeji-mall/heikeji-mall-service/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 heikeji heikeji
    postrotate
        # 重启服务（如果需要）
    endscript
}
EOF

# 手动执行日志轮转
sudo logrotate -f /etc/logrotate.d/heikeji-mall
```

### 10.3 备份策略
```bash
# 创建备份目录
mkdir -p /opt/backup/{database,code,config}

# 数据库备份脚本
cat > /opt/backup/backup_db.sh << EOF
#!/bin/bash

BACKUP_DIR=/opt/backup/database
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME=heikeji_mall
DB_USER=root
DB_PASS=YourStrongPassword123!

# 创建备份文件
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# 压缩备份文件
gzip $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# 删除7天前的备份文件
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "数据库备份完成：$BACKUP_DIR/${DB_NAME}_${DATE}.sql.gz"
EOF

# 赋予脚本执行权限
chmod +x /opt/backup/backup_db.sh

# 执行备份脚本
/opt/backup/backup_db.sh
```

## 11. 安全加固

### 11.1 SSH安全配置
```bash
# 编辑SSH配置文件
sudo vim /etc/ssh/sshd_config

# 修改以下配置
Port 2222  # 更改SSH端口
PermitRootLogin no  # 禁止root用户直接登录
MaxAuthTries 3  # 最大认证尝试次数
PubkeyAuthentication yes  # 启用公钥认证
PasswordAuthentication no  # 禁用密码认证

# 重启SSH服务
sudo systemctl restart sshd
```

### 11.2 防火墙配置
```bash
# 查看防火墙状态
sudo ufw status

# 允许必要的端口
sudo ufw allow 2222/tcp  # SSH端口
sudo ufw allow 80/tcp  # HTTP端口
sudo ufw allow 443/tcp  # HTTPS端口
sudo ufw allow 8848/tcp  # Nacos端口
sudo ufw allow 8080/tcp  # 后端服务端口
```

### 11.3 安装入侵检测系统（可选）
```bash
# 安装fail2ban
sudo apt install -y fail2ban

# 配置fail2ban
sudo cat > /etc/fail2ban/jail.local << EOF
[sshd]
enabled = true
port = 2222
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
EOF

# 启动fail2ban服务
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# 查看fail2ban状态
sudo fail2ban-client status
sudo fail2ban-client status sshd
```

## 12. 总结

本文档详细介绍了黑科易购项目在Ubuntu 20.04环境下的部署过程，包括系统初始化配置、软件环境安装、项目部署、部署验证、系统优化、服务管理、版本更新、常见问题解决方案、监控与维护以及安全加固等内容。

通过本文档，您可以：
- 快速部署黑科易购项目到Ubuntu 20.04环境
- 了解Ubuntu系统的基本配置和优化方法
- 掌握服务管理和监控的基本技能
- 学习常见问题的解决方案
- 了解Ubuntu系统安全加固的基本方法

如有任何问题，请参考常见问题部分，或联系技术支持。

---

**部署完成后，您的黑科易购项目应该已经可以正常运行！**

访问地址：http://服务器IP