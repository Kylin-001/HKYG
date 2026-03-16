# Docker镜像加速器配置指南

## 📋 概述

本文档提供了Docker镜像加速器的配置方法，包括需要sudo和不需要sudo两种方式。

---

## 🚀 方式1：使用sudo配置（需要管理员权限）

### 步骤1：配置Docker镜像加速器

```bash
# 使用sudo配置Docker镜像加速器
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

### 步骤2：拉取阿里云Nacos镜像

```bash
# 拉取阿里云Nacos镜像
docker pull registry.cn-hangzhou.aliyuncs.com/nacos/nacos-server:v2.3.2
```

### 步骤3：启动Nacos容器

```bash
# 启动Nacos容器
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

### 步骤4：验证Nacos启动

```bash
# 检查Nacos容器状态
docker ps | grep nacos

# 检查Nacos端口
netstat -tuln | grep 8848

# 访问Nacos控制台
curl http://localhost:8848/nacos
```

---

## 🚀 方式2：不使用sudo配置（推荐）

### 步骤1：配置用户级Docker镜像加速器

```bash
# 创建用户级Docker配置目录
mkdir -p ~/.docker

# 配置用户级Docker镜像加速器
tee ~/.docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://registry.docker-cn.com"
  ]
}
EOF
```

### 步骤2：设置Docker环境变量

```bash
# 设置Docker配置文件路径
export DOCKER_CONFIG=~/.docker/daemon.json

# 或者添加到~/.bashrc
echo 'export DOCKER_CONFIG=~/.docker/daemon.json' >> ~/.bashrc
source ~/.bashrc
```

### 步骤3：拉取阿里云Nacos镜像

```bash
# 拉取阿里云Nacos镜像
docker pull registry.cn-hangzhou.aliyuncs.com/nacos/nacos-server:v2.3.2
```

### 步骤4：启动Nacos容器

```bash
# 启动Nacos容器
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

### 步骤5：验证Nacos启动

```bash
# 检查Nacos容器状态
docker ps | grep nacos

# 检查Nacos端口
netstat -tuln | grep 8848

# 访问Nacos控制台
curl http://localhost:8848/nacos
```

---

## 🚀 方式3：使用Docker Desktop（适用于桌面环境）

如果您使用Docker Desktop，可以直接在GUI中配置镜像加速器：

1. 打开Docker Desktop
2. 点击设置（齿轮图标）
3. 选择Docker Engine
4. 在Registry mirrors中添加：
   - https://registry.docker-cn.com
   - https://hub-mirror.c.163.com
5. 点击Apply & Restart

---

## 🔍 验证Docker配置

### 检查Docker镜像加速器配置

```bash
# 查看Docker镜像加速器配置
cat /etc/docker/daemon.json

# 或查看用户级配置
cat ~/.docker/daemon.json

# 或查看当前Docker配置
docker info | grep -A 5 "Registry"
```

### 测试Docker网络连接

```bash
# 测试Docker Hub连接
docker pull hello-world

# 测试阿里云镜像连接
docker pull registry.cn-hangzhou.aliyuncs.com/library/hello-world:latest
```

---

## ⚠️ 常见问题

### 问题1：sudo命令需要密码

**错误信息：**
```
[sudo] password for zky:
```

**解决方案：**
- 使用方式2（不使用sudo）
- 或者手动输入密码

### 问题2：Docker服务未启动

**错误信息：**
```
Cannot connect to the Docker daemon
```

**解决方案：**
```bash
# 启动Docker服务
sudo systemctl start docker

# 或在桌面环境中启动Docker Desktop
```

### 问题3：镜像拉取失败

**错误信息：**
```
Error response from daemon: Get "https://registry-1.docker.io/v2/"
```

**解决方案：**
- 使用阿里云镜像（国内推荐）
- 配置Docker镜像加速器
- 检查网络连接

---

## 🎯 推荐方案

根据当前环境，推荐使用以下方案：

### 如果有sudo权限

**推荐：** 方式1（使用sudo配置）
- 配置简单，一次配置永久生效
- 适合服务器环境

### 如果没有sudo权限

**推荐：** 方式2（不使用sudo配置）
- 不需要管理员权限
- 配置在用户目录下
- 适合个人开发环境

### 如果使用Docker Desktop

**推荐：** 方式3（GUI配置）
- 图形界面操作简单
- 适合桌面开发环境

---

## 📝 执行步骤总结

### 使用sudo配置（方式1）

1. 配置Docker镜像加速器
2. 重启Docker服务
3. 拉取阿里云Nacos镜像
4. 启动Nacos容器
5. 验证Nacos启动

### 不使用sudo配置（方式2）

1. 创建用户级Docker配置目录
2. 配置用户级Docker镜像加速器
3. 拉取阿里云Nacos镜像
4. 启动Nacos容器
5. 验证Nacos启动

---

## 📚 相关文档

- [NACOS_ALTERNATIVE_SOLUTIONS.md](file:///home/zky/HKYG/NACOS_ALTERNATIVE_SOLUTIONS.md) - Nacos安装替代方案
- [nacos-start.sh](file:///home/zky/HKYG/nacos-start.sh) - Nacos快速启动工具
- [FINAL_PROJECT_SUMMARY.md](file:///home/zky/HKYG/FINAL_PROJECT_SUMMARY.md) - 项目最终总结报告

---

**文档版本：** 1.0.0  
**最后更新：** 2026-03-06  
**维护团队：** 黑科易购开发团队
