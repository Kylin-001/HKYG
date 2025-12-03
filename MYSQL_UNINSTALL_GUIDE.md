# MySQL完全卸载指南

## 适用系统
- Ubuntu/Debian 系统
- 其他基于apt包管理器的Linux发行版

## 卸载步骤

### 步骤1：停止MySQL服务

首先，确保MySQL服务已停止运行：

```bash
# 尝试停止mysql服务（常见服务名）
sudo systemctl stop mysql 2>/dev/null

# 尝试停止mysqld服务（备用服务名）
sudo systemctl stop mysqld 2>/dev/null

# 确认服务已停止
sudo systemctl status mysql 2>/dev/null || sudo systemctl status mysqld 2>/dev/null
```

### 步骤2：卸载MySQL相关包

使用apt命令卸载所有MySQL相关的包：

```bash
# 列出所有已安装的MySQL包
sudo dpkg -l | grep -i mysql

# 卸载MySQL服务器、客户端和通用包
sudo apt purge mysql-server mysql-client mysql-common mysql-server-core-* mysql-client-core-* -y

# 卸载所有包含mysql的包（确保完全卸载）
sudo apt purge $(dpkg -l | grep -i mysql | awk '{print $2}') -y
```

### 步骤3：清理MySQL配置文件和数据目录

删除MySQL的配置文件、数据目录和日志目录：

```bash
# 删除MySQL配置目录
sudo rm -rf /etc/mysql /etc/mysql.conf.d

# 删除MySQL数据目录（注意：此操作会永久删除所有数据库数据）
sudo rm -rf /var/lib/mysql /var/lib/mysql-files /var/lib/mysql-keyring /var/lib/mysql-upgrade

# 删除MySQL日志目录
sudo rm -rf /var/log/mysql /var/log/mysql.*

# 删除其他可能的MySQL目录
sudo find / -name '*mysql*' -type d -prune -not -path "*/proc/*" -not -path "*/sys/*" -not -path "*/run/*" -not -path "*/dev/*" -exec rm -rf {} \;
```

### 步骤4：清理残留的依赖包

```bash
# 自动清理不再需要的依赖包
sudo apt autoremove -y

# 清理缓存的包文件
sudo apt autoclean -y
```

### 步骤5：验证卸载是否完成

检查是否还有MySQL相关的包或进程：

```bash
# 检查是否还有MySQL包残留
sudo dpkg -l | grep -i mysql

# 检查是否还有MySQL进程运行
ps aux | grep -i mysql | grep -v grep

# 检查MySQL命令是否还存在
which mysql mysqld 2>/dev/null || echo "MySQL commands not found"

# 检查MySQL服务是否还存在
systemctl list-unit-files | grep -i mysql
```

## 卸载完成后的操作

### 选项1：重新安装MySQL（传统方式）

如果您想重新安装MySQL，可以使用以下命令：

```bash
# 更新软件包列表
sudo apt update

# 安装MySQL 8.0（Ubuntu默认仓库版本）
sudo apt install mysql-server mysql-client -y

# 启动并启用MySQL服务
sudo systemctl start mysql
sudo systemctl enable mysql

# 运行安全配置向导
sudo mysql_secure_installation
```

### 选项2：使用Docker Compose部署（推荐）

强烈建议您使用Docker Compose部署方式，避免手动管理MySQL服务的复杂性：

```bash
# 安装Docker和Docker Compose
sudo apt update
sudo apt install docker.io docker-compose -y

# 启动Docker Compose服务
cd /path/to/heikeji-mall
docker-compose up -d

# 检查服务状态
docker-compose ps
```

## 注意事项

1. **数据备份**：在执行卸载操作前，请确保已备份所有重要的数据库数据
2. **永久删除**：清理数据目录的操作会永久删除所有数据库数据，无法恢复
3. **权限问题**：确保使用sudo或root权限执行所有命令
4. **服务名称**：不同Linux发行版的MySQL服务名称可能不同，常见的有mysql和mysqld
5. **彻底清理**：建议执行所有步骤，确保完全卸载MySQL，避免残留文件影响后续安装

## 常见问题

### 问题1：卸载过程中遇到依赖错误

**解决方法**：使用--fix-missing和--fix-broken选项修复依赖问题：

```bash
sudo apt update --fix-missing
sudo apt install -f --fix-broken -y
sudo apt autoremove -y
sudo apt autoclean -y
```

### 问题2：某些MySQL包无法卸载

**解决方法**：使用dpkg命令强制卸载：

```bash
sudo dpkg --remove --force-all <package-name>
```

### 问题3：卸载后仍有MySQL进程运行

**解决方法**：手动杀死残留进程：

```bash
# 查找MySQL进程
ps aux | grep -i mysql | grep -v grep

# 杀死所有MySQL进程
sudo kill -9 $(ps aux | grep -i mysql | grep -v grep | awk '{print $2}')
```

## 联系支持

如果在卸载过程中遇到其他问题，请参考：
- Ubuntu官方文档：https://ubuntu.com/server/docs/databases-mysql
- MySQL官方文档：https://dev.mysql.com/doc/
- 项目GitHub仓库：https://github.com/Kylin-001/HKYG

祝您卸载顺利！