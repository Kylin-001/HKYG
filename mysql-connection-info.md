# MySQL 连接信息记录

## 📋 服务器信息

### Ubuntu 服务器 (数据库服务器)
| 项目 | 值 |
|------|-----|
| **IP 地址** | 192.168.186.128 |
| **SSH 用户** | zky |
| **SSH 密码** | hkyg |
| **操作系统** | Ubuntu |

### MySQL 数据库配置
| 项目 | 值 |
|------|-----|
| **主机** | 192.168.186.128 |
| **端口** | 3306 |
| **用户名** | root |
| **密码** | Mysql@8Root!2025 |
| **数据库名** | heikeji_mall |

## 🔌 连接方式

### 1. 本地连接 (Ubuntu 服务器上)
```bash
mysql -u root -p'Mysql@8Root!2025'
```

### 2. 远程连接 (Windows 上)
```bash
mysql -h 192.168.186.128 -u root -p'Mysql@8Root!2025'
```

### 3. 执行 SQL 文件
```bash
# 本地
mysql -u root -p'Mysql@8Root!2025' < script.sql

# 远程
mysql -h 192.168.186.128 -u root -p'Mysql@8Root!2025' < script.sql
```

## ⚠️ 遇到的问题及解决方案

### 问题 1: MySQL 远程访问被拒绝
**错误信息**:
```
ERROR 1045 (28000): Access denied for user 'root'@'192.168.186.1' (using password: YES)
```

**原因**: root 用户默认只允许本地访问 (localhost)

**解决方案**:
```sql
-- 在 Ubuntu 服务器上执行
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'Mysql@8Root!2025';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

### 问题 2: MySQL 绑定地址限制
**原因**: MySQL 默认只监听 127.0.0.1

**解决方案**:
```bash
# 修改 MySQL 配置文件
sudo sed -i 's/bind-address\s*=\s*127.0.0.1/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf

# 重启 MySQL
sudo systemctl restart mysql

# 开放防火墙
sudo ufw allow 3306/tcp
```

### 问题 3: PowerShell 解析问题
**错误信息**:
```
参数列表中缺少参量
表达式或语句中包含意外的标记
```

**原因**: PowerShell 对特殊字符和引号解析与 CMD 不同

**解决方案**: 使用批处理文件 (.bat) 代替 PowerShell
```batch
@echo off
mysql -h 192.168.186.128 -u root -pMysql@8Root!2025 < script.sql
```

### 问题 4: SSH 连接超时
**错误信息**:
```
ssh: connect to host 192.168.186.129 port 22: Connection timed out
```

**原因**: 
- 服务器未开机
- 网络不通
- 防火墙阻止

**解决方案**: 
- 确认服务器 IP 地址正确 (192.168.186.128)
- 检查服务器状态
- 确认 SSH 服务运行中

### 问题 5: SQL 文件编码问题
**错误信息**:
```
ERROR 1064 (42000): You have an error in your SQL syntax
```

**原因**: 中文字符在传输过程中出现编码问题

**解决方案**: 
- 使用纯英文 SQL 语句
- 或在服务器本地创建 SQL 文件

## ✅ 已配置的内容

1. ✅ MySQL 远程访问已授权
2. ✅ 防火墙端口 3306 已开放
3. ✅ root 用户可以从任意 IP 访问
4. ✅ 数据已成功导入 (8 个分类, 6 个外卖商家)

## 📝 常用命令

### 检查 MySQL 状态
```bash
sudo systemctl status mysql
sudo netstat -tlnp | grep mysql
```

### 查看用户权限
```sql
SELECT user, host FROM mysql.user WHERE user='root';
SHOW GRANTS FOR 'root'@'%';
```

### 验证数据
```sql
USE heikeji_mall;
SELECT COUNT(*) FROM category;
SELECT COUNT(*) FROM takeout_merchant;
SELECT COUNT(*) FROM product;
```

## 🔗 相关文件

- SQL 导入脚本: `insert-more-data.sql`
- 简化版 SQL: `insert-data-simple.sql`
- 批处理导入工具: `run-mysql-import.bat`

---
*记录时间: 2026-04-26*
