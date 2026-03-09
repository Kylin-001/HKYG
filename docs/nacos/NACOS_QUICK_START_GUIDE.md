# Nacos安装和启动完整指南

## 📋 概述

本文档提供了Nacos的多种安装和启动方式，解决当前Nacos服务未运行的问题。

## 🚀 方案1：使用Docker安装（推荐）

### 步骤1：拉取Nacos镜像

```bash
# 使用官方镜像
docker pull nacos/nacos-server:v2.3.2

# 或使用阿里云镜像（国内推荐）
docker pull registry.cn-hangzhou.aliyuncs.com/nacos/nacos-server:v2.3.2
```

### 步骤2：运行Nacos容器

```bash
# 方式1：使用官方镜像
docker run -d \
  --name heikeji-nacos \
  --restart unless-stopped \
  -p 8848:8848 \
  -p 9848:9848 \
  -e MODE=standalone \
  -e JVM_XMS=512m \
  -e JVM_XMX=512m \
  -v ~/nacos/logs:/home/nacos/logs \
  -v ~/nacos/data:/home/nacos/data \
  nacos/nacos-server:v2.3.2

# 方式2：使用阿里云镜像（国内推荐）
docker run -d \
  --name heikeji-nacos \
  --restart unless-stopped \
  -p 8848:8848 \
  -p 9848:9848 \
  -e MODE=standalone \
  -e JVM_XMS=512m \
  -e JVM_XMX=512m \
  -v ~/nacos/logs:/home/nacos/logs \
  -v ~/nacos/data:/home/nacos/data \
  registry.cn-hangzhou.aliyuncs.com/nacos/nacos-server:v2.3.2
```

### 步骤3：验证Nacos启动

```bash
# 检查Nacos容器状态
docker ps | grep nacos

# 检查Nacos端口
netstat -tuln | grep 8848

# 访问Nacos控制台
curl http://localhost:8848/nacos

# 查看Nacos日志
docker logs -f heikeji-nacos
```

### 步骤4：访问Nacos控制台

- **访问地址：** http://localhost:8848/nacos
- **默认用户名：** nacos
- **默认密码：** nacos

⚠️ **重要：** 首次登录后请修改默认密码！

---

## 🚀 方案2：使用源码安装

### 步骤1：下载Nacos

```bash
# 下载Nacos 2.3.2版本
wget https://github.com/alibaba/nacos/releases/download/2.3.2/nacos-server-2.3.2.tar.gz

# 或使用华为云镜像（国内推荐）
wget https://repo.huaweicloud.com/nacos/2.3.2/nacos-server-2.3.2.tar.gz
```

### 步骤2：解压Nacos

```bash
# 解压到/usr/local目录
sudo tar -zxvf nacos-server-2.3.2.tar.gz -C /usr/local/

# 创建软链接
sudo ln -sf /usr/local/nacos-server-2.3.2 /usr/local/nacos
```

### 步骤3：配置Nacos

```bash
# 编辑配置文件
sudo vi /usr/local/nacos/conf/application.properties

# 添加以下配置
```

配置内容：
```properties
# 单机模式
nacos.standalone=true

# 端口配置
server.port=8848

# 日志配置
nacos.log.path=/usr/local/nacos/logs

# 认证配置
nacos.core.auth.enabled=false
```

### 步骤4：启动Nacos

```bash
# 启动Nacos
cd /usr/local/nacos/bin
./startup.sh -m standalone

# 或使用nohup后台运行
nohup ./startup.sh -m standalone > /usr/local/nacos/logs/startup.log 2>&1 &
```

### 步骤5：验证Nacos启动

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

## 🚀 方案3：使用快速启动脚本

### 使用nacos-quick-start.sh脚本

```bash
# 运行快速启动脚本
./nacos-quick-start.sh

# 选择选项1进行完整安装（下载+安装+配置+启动）
```

### 脚本功能

1. **完整安装** - 自动下载、安装、配置、启动Nacos
2. **仅启动Nacos** - 如果已安装，仅启动Nacos
3. **停止Nacos** - 停止正在运行的Nacos
4. **查看日志** - 查看Nacos启动日志
5. **检查状态** - 检查Nacos运行状态

---

## 🔍 验证Nacos安装

### 检查Nacos是否运行

```bash
# 检查端口
netstat -tuln | grep 8848

# 检查进程
ps aux | grep nacos

# 检查HTTP访问
curl http://localhost:8848/nacos
```

### 访问Nacos控制台

1. 打开浏览器
2. 访问：http://localhost:8848/nacos
3. 登录：
   - 用户名：nacos
   - 密码：nacos
4. 修改默认密码（重要！）

### 检查服务注册

```bash
# 查看注册的服务
curl "http://localhost:8848/nacos/v1/ns/instance/list?serviceName=heikeji-mall-user"

# 查看所有服务
curl "http://localhost:8848/nacos/v1/ns/service/list?pageNo=1&pageSize=10"
```

---

## ⚠️ 常见问题

### 问题1：Docker镜像拉取失败

**错误信息：**
```
Unable to find image 'nacos/nacos-server:v2.3.2' locally
docker: Error response from daemon: Get "https://registry-1.docker.io/v2/": context deadline exceeded
```

**解决方案：**
1. 使用阿里云镜像（国内推荐）
2. 配置Docker镜像加速器
3. 手动下载镜像文件

```bash
# 配置Docker镜像加速器
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://registry.docker-cn.com"
  ]
}
EOF

# 重启Docker服务
sudo systemctl restart docker
```

### 问题2：Nacos启动失败

**错误信息：**
```
Please set the JAVA_HOME variable in your environment to run Nacos
```

**解决方案：**
```bash
# 设置JAVA_HOME环境变量
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk

# 或在启动时指定Java路径
cd /usr/local/nacos/bin
JAVA_HOME=/usr/lib/jvm/java-17-openjdk ./startup.sh -m standalone
```

### 问题3：端口被占用

**错误信息：**
```
Failed to bind to address 0.0.0.0:8848
```

**解决方案：**
```bash
# 查找占用端口的进程
lsof -i :8848

# 杀死占用端口的进程
kill -9 <PID>

# 或修改Nacos端口
sudo vi /usr/local/nacos/conf/application.properties
# 修改 server.port=8849
```

### 问题4：内存不足

**错误信息：**
```
java.lang.OutOfMemoryError: Java heap space
```

**解决方案：**
```bash
# 增加JVM内存
export JAVA_OPTS="-Xms512m -Xmx1024m"

# 或在启动脚本中配置
cd /usr/local/nacos/bin
JAVA_OPTS="-Xms512m -Xmx1024m" ./startup.sh -m standalone
```

---

## 🚀 启动Nacos后的下一步

### 1. 启动Gateway服务

```bash
# 启动Gateway
cd heikeji-gateway
mvn spring-boot:run

# 或使用启动脚本
./start-all.sh gateway

# 验证Gateway启动
curl http://localhost:8080/actuator/health
```

### 2. 启动业务服务

```bash
# 启动所有业务服务
./start-all.sh services

# 或逐个启动
cd heikeji-mall-service/service-user && mvn spring-boot:run &
cd heikeji-mall-service/service-product && mvn spring-boot:run &
cd heikeji-mall-service/service-order && mvn spring-boot:run &
# ... 其他服务
```

### 3. 验证服务状态

```bash
# 运行健康检查
./health-check.sh

# 查看服务注册
curl http://localhost:8848/nacos/v1/ns/instance/list?serviceName=heikeji-mall-user

# 查看服务日志
tail -f heikeji-mall-service/service-*/logs/*.log
```

---

## 📝 验证清单

启动Nacos后，请验证以下项目：

- [ ] Nacos控制台可以访问：http://localhost:8848/nacos
- [ ] Gateway健康检查：http://localhost:8080/actuator/health
- [ ] 用户服务注册到Nacos
- [ ] 商品服务注册到Nacos
- [ ] 订单服务注册到Nacos
- [ ] 其他服务正常注册

---

## 🎯 推荐方案

根据当前环境，推荐使用以下方案：

### 如果Docker可用

**推荐：** 方案1（Docker安装）
- 优点：安装简单、启动快速、易于管理
- 缺点：需要Docker环境

### 如果Docker不可用

**推荐：** 方案3（快速启动脚本）
- 优点：自动化程度高、包含完整流程
- 缺点：需要网络连接下载

### 如果需要完全控制

**推荐：** 方案2（源码安装）
- 优点：完全控制、可自定义配置
- 缺点：安装复杂、需要手动配置

---

## 📚 相关文档

- [NACOS_INSTALL_GUIDE.md](file:///home/zky/HKYG/NACOS_INSTALL_GUIDE.md) - Nacos安装和配置指南
- [SERVICE_STARTUP.md](file:///home/zky/HKYG/SERVICE_STARTUP.md) - 服务启动指南
- [PROJECT_STATUS.md](file:///home/zky/HKYG/PROJECT_STATUS.md) - 项目状态总结
- [PROJECT_PROGRESS.md](file:///home/zky/HKYG/PROJECT_PROGRESS.md) - 项目开发进展总结
- [PROJECT_COMPLETION_REPORT.md](file:///home/zky/HKYG/PROJECT_COMPLETION_REPORT.md) - 项目完成报告

---

**文档版本：** 1.0.0  
**最后更新：** 2026-03-06  
**维护团队：** 黑科易购开发团队
