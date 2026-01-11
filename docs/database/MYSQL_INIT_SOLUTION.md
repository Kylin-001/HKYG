# MySQL数据库初始化与部署解决方案

## 当前问题分析

从错误信息可以看出两个主要问题：

1. **身份认证失败**：
   ```
   polkit-agent-helper-1: pam_authenticate failed: Authentication failure
   ```
   - 原因：输入的`heikeji`用户密码不正确

2. **服务启动超时**：
   ```
   Failed to start mysqld.service: 连接超时
   ```
   - 原因：服务名称可能不正确，或者MySQL服务未正确安装

## 解决方案

### 1. 检查服务名称与安装问题

从错误信息看，您遇到了两个问题：
1. **身份认证失败**：`heikeji`用户密码不正确导致身份认证失败
2. **服务启动超时**：服务启动超时，可能是因为服务名称不正确或服务未安装

## 解决步骤

### 1. **检查服务名称**
   ```bash
   # 检查MySQL服务名称
   systemctl list-unit-files | grep mysql
   # 或
   systemctl list-unit-files | grep -i mysql
   ```

### 2. **安装MySQL服务**

```bash
# 更新软件包列表
sudo apt update

# 安装MySQL
sudo apt install mysql-server mysql-client -y

# 检查服务状态
systemctl status mysql

# 启动服务
sudo systemctl start mysql

# 设置开机自启
sudo systemctl enable mysql

# 检查状态
sudo systemctl status mysql
```

### 3. 初始化数据库

项目中现有的SQL文件：

- sql/schema/init_schema.sql
- sql/schema/00_create_database.sql

使用这些文件初始化：

```bash
# 进入sql目录
cd /home/heikeji/heikeji-mall/sql

# 创建数据库
mysql -u root -p < schema/00_create_database.sql

# 导入schema
mysql -u root -p heikeji_mall < schema/init_schema.sql
```

### 4. Docker Compose部署推荐

最推荐的方式是使用Docker Compose一键部署：

```bash
# 安装Docker和Docker Compose
sudo apt update
sudo apt install docker.io docker-compose -y

# 启动MySQL服务
docker-compose up -d mysql

# 检查状态
docker-compose logs -f mysql
```

## 总结

1. **身份认证**：使用正确的用户名和密码
2. **服务名称**：检查服务名称是否为`mysql`而非`mysqld`
3. **安装MySQL**：使用`sudo apt install mysql-server mysql-client`
4. **启动服务**：`sudo systemctl start mysql`
5. **Docker Compose**：一键部署所有服务