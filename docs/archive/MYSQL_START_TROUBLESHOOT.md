# MySQL 服务启动认证问题解决指南

## 问题分析

当执行 `systemctl start mysqld` 时，系统提示需要认证并选择身份：

```
==== AUTHENTICATING FOR org.freedesktop.systemd1.manage-units === 
启动“mysqld.service”需要认证。 
Multiple identities can be used for authentication: 
 1.  zky,,, (zky) 
 2.  heikeji 
Choose identity to authenticate as (1-2): 
```

**错误原因**：直接输入用户名 `heikeji` 导致认证失败，系统期望输入的是身份对应的数字编号（1或2）。

## 正确操作步骤

1. 执行启动命令：
   ```bash
   systemctl start mysqld
   ```

2. 当出现身份选择提示时，**仅输入对应身份的数字**：
   - 选择 `zky` 身份：输入 `1` 并按回车
   - 选择 `heikeji` 身份：输入 `2` 并按回车

3. 输入对应用户的密码进行认证

4. 验证服务是否成功启动：
   ```bash
   systemctl status mysqld.service
   ```

## 其他常用 MySQL 服务管理命令

```bash
# 启动 MySQL 服务
sudo systemctl start mysqld

# 停止 MySQL 服务
sudo systemctl stop mysqld

# 重启 MySQL 服务
sudo systemctl restart mysqld

# 设置 MySQL 开机自启
sudo systemctl enable mysqld

# 禁用 MySQL 开机自启
sudo systemctl disable mysqld

# 查看 MySQL 服务状态
sudo systemctl status mysqld
```

## 注意事项

- 确保使用具有 sudo 权限的用户执行系统服务管理命令
- 如果忘记了用户密码，需要使用 root 用户或具有特权的用户进行密码重置
- 对于 Docker 部署方式，建议直接使用项目提供的 `docker-compose.yml` 配置，避免手动管理 MySQL 服务

## Docker 部署替代方案

如果手动管理 MySQL 服务遇到困难，建议使用项目中的 Docker Compose 部署方案：

```bash
# 在项目根目录执行
docker-compose up -d mysql
```

这将自动拉取 MySQL 镜像并启动容器，无需手动配置系统服务。