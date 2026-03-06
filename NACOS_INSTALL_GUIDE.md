# Nacos安装和配置指南

## 📋 概述

Nacos（Dynamic Naming and Configuration Service）是阿里巴巴开源的一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。

## 🚀 快速安装

### 方法1：使用Docker安装（推荐）

```bash
# 1. 拉取Nacos镜像
docker pull nacos/nacos-server:v2.3.2

# 2. 运行Nacos容器
docker run -d \
  --name nacos \
  -e MODE=standalone \
  -e SPRING_DATASOURCE_PLATFORM=mysql \
  -e MYSQL_SERVICE_HOST=localhost \
  -e MYSQL_SERVICE_DB_NAME=nacos_config \
  -e MYSQL_SERVICE_USER=root \
  -e MYSQL_SERVICE_PASSWORD=your_password \
  -e MYSQL_SERVICE_DB_PARAM=characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000 \
  -p 8848:8848 \
  nacos/nacos-server:v2.3.2
```

### 方法2：使用源码安装

#### 1. 下载Nacos

```bash
# 下载Nacos 2.3.2版本
wget https://github.com/alibaba/nacos/releases/download/2.3.2/nacos-server-2.3.2.tar.gz

# 或使用华为云镜像（国内推荐）
wget https://repo.huaweicloud.com/nacos/2.3.2/nacos-server-2.3.2.tar.gz
```

#### 2. 解压Nacos

```bash
# 解压到/usr/local目录
sudo tar -zxvf nacos-server-2.3.2.tar.gz -C /usr/local/

# 创建软链接
sudo ln -s /usr/local/nacos-server-2.3.2 /usr/local/nacos
```

#### 3. 配置MySQL数据库

```bash
# 登录MySQL
mysql -u root -p

# 创建Nacos配置数据库
CREATE DATABASE IF NOT EXISTS nacos_config CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# 导入Nacos表结构
USE nacos_config;
source /usr/local/nacos/conf/mysql-schema.sql;
```

#### 4. 配置Nacos

编辑配置文件：
```bash
sudo vi /usr/local/nacos/conf/application.properties
```

添加以下配置：
```properties
# 数据库配置
spring.datasource.platform=mysql
db.num=1
db.url.0=jdbc:mysql://localhost:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user.0=root
db.password.0=your_password

# 单机模式
nacos.standalone=true

# 端口配置
server.port=8848

# 日志配置
nacos.log.path=/usr/local/nacos/logs
```

#### 5. 启动Nacos

```bash
# 方式1：使用启动脚本
cd /usr/local/nacos/bin
./startup.sh -m standalone

# 方式2：使用nohup后台运行
cd /usr/local/nacos/bin
nohup ./startup.sh -m standalone > /usr/local/nacos/logs/startup.log 2>&1 &
```

#### 6. 验证Nacos启动

```bash
# 检查Nacos进程
ps aux | grep nacos

# 检查Nacos端口
netstat -tuln | grep 8848

# 访问Nacos控制台
curl http://localhost:8848/nacos

# 查看Nacos日志
tail -f /usr/local/nacos/logs/startup.log
```

---

## ⚙️ 配置说明

### Nacos控制台访问

- **默认用户名**: nacos
- **默认密码**: nacos
- **访问地址**: http://localhost:8848/nacos

首次登录后请修改默认密码！

### 服务注册配置

各服务需要在`application.yml`中配置Nacos注册：

```yaml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
        namespace: public
        group: DEFAULT_GROUP
      config:
        server-addr: localhost:8848
        namespace: public
        file-extension: yml
        refresh-enabled: true
        group: DEFAULT_GROUP
```

---

## 🔍 故障排查

### 问题1：Nacos无法启动

**检查项：**
1. Java版本是否为17或更高
2. 端口8848是否被占用
3. MySQL是否正常运行
4. 数据库配置是否正确

**解决方案：**
```bash
# 检查Java版本
java -version

# 检查端口占用
lsof -i :8848

# 检查MySQL连接
mysql -u root -p -e "SELECT 1"

# 查看Nacos日志
tail -100 /usr/local/nacos/logs/startup.log
```

### 问题2：服务无法注册到Nacos

**检查项：**
1. Nacos是否正常运行
2. 服务配置中的Nacos地址是否正确
3. 网络连接是否正常
4. 防火墙是否阻止连接

**解决方案：**
```bash
# 检查Nacos服务状态
curl http://localhost:8848/nacos/v1/ns/instance/list?serviceName=heikeji-mall-user

# 检查服务配置
grep -r "nacos.server-addr" heikeji-mall-service/*/src/main/resources/application.yml

# 检查网络连接
ping localhost

# 检查防火墙
sudo ufw status
```

### 问题3：Nacos控制台无法访问

**检查项：**
1. Nacos服务是否启动
2. 端口8848是否开放
3. 浏览器缓存问题

**解决方案：**
```bash
# 检查Nacos服务
curl http://localhost:8848/nacos

# 检查端口
netstat -tuln | grep 8848

# 清除浏览器缓存
# Chrome: Ctrl+Shift+Delete
# Firefox: Ctrl+F5
```

---

## 🛠️ 停止和重启Nacos

### 停止Nacos

```bash
# 方式1：使用停止脚本
cd /usr/local/nacos/bin
./shutdown.sh

# 方式2：杀掉进程
ps aux | grep nacos | grep -v grep | awk '{print $2}' | xargs kill -9
```

### 重启Nacos

```bash
# 停止Nacos
cd /usr/local/nacos/bin
./shutdown.sh

# 等待几秒
sleep 5

# 重新启动
./startup.sh -m standalone
```

---

## 📊 Nacos集群配置（可选）

如果需要配置Nacos集群，请参考以下配置：

```properties
# 集群配置
nacos.inetutils.ipaddress=your_server_ip
nacos.server.cluster.enabled=true
nacos.server.cluster.port=9848

# 数据库配置（使用MySQL集群）
db.num=2
db.url.0=jdbc:mysql://localhost:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.url.1=jdbc:mysql://localhost:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
```

---

## 📝 日志管理

### 查看日志

```bash
# 启动日志
tail -f /usr/local/nacos/logs/startup.log

# 访问日志
tail -f /usr/local/nacos/logs/access.log

# 错误日志
tail -f /usr/local/nacos/logs/nacos.log
```

### 日志级别配置

编辑`/usr/local/nacos/conf/logback.xml`文件调整日志级别。

---

## 🔒 安全配置

### 修改默认密码

1. 登录Nacos控制台：http://localhost:8848/nacos
2. 用户名：nacos，密码：nacos
3. 进入"权限管理" -> "用户列表"
4. 修改nacos用户的密码
5. 保存并重新登录

### 配置HTTPS

编辑`/usr/local/nacos/conf/application.properties`：

```properties
# 启用HTTPS
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore.jks
server.ssl.key-store-password=your_keystore_password
```

---

## 📚 相关资源

- **Nacos官方文档**: https://nacos.io/zh-cn/docs/what-is-nacos
- **Nacos GitHub**: https://github.com/alibaba/nacos
- **Nacos下载地址**: https://github.com/alibaba/nacos/releases
- **华为云镜像**: https://repo.huaweicloud.com/nacos

---

## 🎯 最佳实践

1. **使用Docker** - 推荐使用Docker安装，更简单快捷
2. **备份数据** - 定期备份Nacos配置数据
3. **监控日志** - 定期查看Nacos日志，及时发现问题
4. **修改密码** - 首次登录后立即修改默认密码
5. **使用集群** - 生产环境建议使用Nacos集群提高可用性

---

**文档版本：** 1.0.0  
**最后更新：** 2026-03-06  
**维护团队：** 黑科易购开发团队
