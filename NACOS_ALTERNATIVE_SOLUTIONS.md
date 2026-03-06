# Nacos安装替代方案

## 📋 概述

由于Docker网络连接问题，无法直接拉取Nacos镜像。本文档提供了多种Nacos安装的替代方案。

---

## 🚀 方案1：使用阿里云镜像（推荐）

### 步骤1：拉取阿里云Nacos镜像

```bash
# 拉取阿里云镜像（国内推荐）
docker pull registry.cn-hangzhou.aliyuncs.com/nacos/nacos-server:v2.3.2
```

### 步骤2：运行Nacos容器

```bash
# 运行Nacos容器
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
```

---

## 🚀 方案2：手动下载Nacos镜像

### 步骤1：下载Nacos镜像文件

```bash
# 使用浏览器下载Nacos镜像
# 访问：https://github.com/alibaba/nacos/releases/download/2.3.2/nacos-server-2.3.2.tar.gz
# 或使用华为云镜像（国内推荐）
# 访问：https://repo.huaweicloud.com/nacos/2.3.2/nacos-server-2.3.2.tar.gz

# 下载后上传到服务器
# 使用scp或ftp上传到服务器的/home/zky/HKYG目录
```

### 步骤2：加载本地Nacos镜像

```bash
# 加载本地Nacos镜像
docker load -i nacos-server-2.3.2.tar.gz

# 运行Nacos容器
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
```

---

## 🚀 方案3：配置Docker镜像加速器

### 步骤1：配置Docker镜像加速器

```bash
# 创建Docker配置目录
sudo mkdir -p /etc/docker

# 配置Docker镜像加速器
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "https://hub-mirror.c.163.com",
    "https://mirror.ccs.tencentyun.com"
  ]
}
EOF

# 重启Docker服务
sudo systemctl restart docker
```

### 步骤2：重新拉取Nacos镜像

```bash
# 拉取Nacos镜像
docker pull nacos/nacos-server:v2.3.2

# 运行Nacos容器
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
```

---

## 🚀 方案4：检查Docker网络连接

### 步骤1：测试Docker网络

```bash
# 测试Docker Hub连接
docker pull hello-world

# 测试阿里云镜像连接
docker pull registry.cn-hangzhou.aliyuncs.com/library/hello-world:latest
```

### 步骤2：检查Docker配置

```bash
# 查看Docker配置
docker info

# 查看Docker网络
docker network ls

# 查看Docker日志
journalctl -u docker -n 100
```

---

## 🚀 方案5：使用嵌入式Nacos（临时方案）

如果Docker问题无法解决，可以考虑使用Spring Cloud Alibaba的嵌入式Nacos作为临时方案。

### 步骤1：修改服务配置

```yaml
# 在各服务的application.yml中修改Nacos配置
spring:
  cloud:
    nacos:
      discovery:
        enabled: false
      config:
        enabled: false
```

### 步骤2：重启服务

```bash
# 重启所有服务
./stop-all.sh
./start-all.sh services
```

---

## 🔍 故障排查

### 问题1：Docker网络超时

**错误信息：**
```
docker: Error response from daemon: Get "https://registry-1.docker.io/v2/": net/http: request canceled while waiting for connection (Client.Timeout exceeded while awaiting headers)
```

**解决方案：**
1. 使用阿里云镜像（方案1）
2. 配置Docker镜像加速器（方案3）
3. 检查网络连接（方案4）
4. 使用本地镜像（方案2）

### 问题2：Nacos容器启动失败

**错误信息：**
```
Error: Unable to access image 'nacos/nacos-server:2.3.2'
```

**解决方案：**
1. 确认镜像名称正确
2. 检查Docker是否正常运行
3. 使用本地镜像文件

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
docker stop heikeji-nacos
docker run -d \
  --name heikeji-nacos \
  --restart unless-stopped \
  -p 8849:8849 \
  -p 9848:9848 \
  -e MODE=standalone \
  -e JVM_XMS=512m \
  -e JVM_XMX=512m \
  -v ~/nacos/logs:/home/nacos/logs \
  -v ~/nacos/data:/home/nacos/data \
  nacos/nacos-server:v2.3.2
```

---

## 🎯 推荐方案

根据当前环境，推荐按以下顺序尝试：

### 优先级1：使用阿里云镜像（推荐）

```bash
# 1. 配置Docker镜像加速器
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://registry.docker-cn.com"
  ]
}
EOF

sudo systemctl restart docker

# 2. 拉取阿里云Nacos镜像
docker pull registry.cn-hangzhou.aliyuncs.com/nacos/nacos-server:v2.3.2

# 3. 运行Nacos容器
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

# 4. 验证Nacos启动
curl http://localhost:8848/nacos
```

### 优先级2：手动下载镜像文件

如果网络问题持续存在，可以手动下载Nacos镜像文件，然后加载到Docker中。

### 优先级3：使用嵌入式Nacos（临时方案）

如果Docker问题无法解决，可以考虑使用Spring Cloud Alibaba的嵌入式Nacos作为临时方案。

---

## 📝 验证清单

启动Nacos后，请验证以下项目：

- [ ] Nacos控制台可以访问：http://localhost:8848/nacos
- [ ] Nacos端口8848正在监听
- [ ] Nacos容器正在运行
- [ ] Gateway可以启动
- [ ] 业务服务可以注册

---

## 📚 相关文档

- [NACOS_INSTALL_GUIDE.md](file:///home/zky/HKYG/NACOS_INSTALL_GUIDE.md) - Nacos安装和配置指南
- [NACOS_QUICK_START_GUIDE.md](file:///home/zky/HKYG/NACOS_QUICK_START_GUIDE.md) - Nacos快速启动完整指南
- [nacos-start.sh](file:///home/zky/HKYG/nacos-start.sh) - Nacos快速启动工具
- [FINAL_PROJECT_SUMMARY.md](file:///home/zky/HKYG/FINAL_PROJECT_SUMMARY.md) - 项目最终总结报告

---

**文档版本：** 1.0.0  
**最后更新：** 2026-03-06  
**维护团队：** 黑科易购开发团队
