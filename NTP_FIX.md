# Ubuntu虚拟机NTP设置问题解决方案

## 问题描述
在Ubuntu虚拟机上执行以下命令时遇到错误：
```bash
zky@zky-virtual-machine:~$ sudo timedatectl set-ntp true 
 Failed to set ntp: NTP not supported
```

## 解决方案

Ubuntu 20.04默认使用`systemd-timesyncd`服务进行时间同步，而不是传统的`ntp`服务。请按照以下步骤操作：

### 1. 检查并启动systemd-timesyncd服务
```bash
# 检查systemd-timesyncd服务状态
sudo systemctl status systemd-timesyncd

# 启动systemd-timesyncd服务
sudo systemctl start systemd-timesyncd

# 设置systemd-timesyncd服务开机自启
sudo systemctl enable systemd-timesyncd
```

### 2. 启用NTP时间同步
```bash
# 启用NTP时间同步
sudo timedatectl set-ntp true

# 查看时间同步状态
sudo timedatectl status

# 查看时间同步详细信息
sudo timedatectl timesync-status
```

### 3. 验证时间同步
```bash
# 检查当前时间
date

# 检查硬件时钟
hwclock --show
```

## 可选：使用传统ntp服务（不推荐）
如果您确实需要使用传统的ntp服务，可以按照以下步骤操作：

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

## 常见问题排查

1. **如果systemd-timesyncd服务文件不存在**：
   ```bash
   # 检查系统版本
   lsb_release -a
   
   # 安装systemd-timesyncd包
   sudo apt update
   sudo apt install -y systemd-timesyncd
   ```

2. **如果systemd-timesyncd服务被屏蔽（masked）**：
   ```bash
   # 解除服务屏蔽
   sudo systemctl unmask systemd-timesyncd
   
   # 启用并启动服务
   sudo systemctl enable systemd-timesyncd
   sudo systemctl start systemd-timesyncd
   ```

3. **如果时间同步仍然失败**：
   ```bash
   # 检查网络连接
   ping -c 3 pool.ntp.org
   
   # 查看系统日志
   sudo journalctl -u systemd-timesyncd
   ```

4. **手动同步时间**：
   ```bash
   # 安装ntpdate工具
   sudo apt install -y ntpdate
   
   # 手动同步时间
   sudo ntpdate pool.ntp.org
   ```

## 总结

Ubuntu 20.04及以上版本推荐使用`systemd-timesyncd`服务进行时间同步，它是一个轻量级的NTP客户端，默认已经安装并配置好。如果您遇到"NTP not supported"错误，通常是因为`systemd-timesyncd`服务没有运行，启动该服务后即可解决问题。