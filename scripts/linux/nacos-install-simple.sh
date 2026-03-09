#!/bin/bash

# Nacos下载和安装脚本（简化版）
# 用于下载、安装和启动Nacos服务

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Nacos配置
NACOS_VERSION="2.3.2"
NACOS_PORT="8848"
NACOS_INSTALL_DIR="/usr/local/nacos"
DOWNLOAD_DIR="/tmp/nacos-download"

# 打印标题
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}    Nacos下载和安装工具（简化版）${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# 下载Nacos
download_nacos() {
    echo -e "${BLUE}正在下载 Nacos $NACOS_VERSION...${NC}"
    
    # 创建下载目录
    mkdir -p "$DOWNLOAD_DIR"
    cd "$DOWNLOAD_DIR"
    
    # 使用华为云镜像下载（国内推荐）
    if wget -q -O "nacos-server-$NACOS_VERSION.tar.gz" \
        https://repo.huaweicloud.com/nacos/$NACOS_VERSION/nacos-server-$NACOS_VERSION.tar.gz; then
        echo -e "${GREEN}✓${NC} Nacos 下载成功"
        echo -e "   文件: $DOWNLOAD_DIR/nacos-server-$NACOS_VERSION.tar.gz"
        echo -e "   大小: $(du -h nacos-server-$NACOS_VERSION.tar.gz | awk '{print $1}')"
    else
        echo -e "${RED}✗${NC} Nacos 下载失败"
        echo -e "${YELLOW}请检查网络连接或手动下载${NC}"
        exit 1
    fi
}

# 安装Nacos
install_nacos() {
    echo -e "${BLUE}正在安装 Nacos...${NC}"
    
    # 检查是否需要sudo权限
    if [ ! -w "$NACOS_INSTALL_DIR" ]; then
        echo -e "${YELLOW}需要sudo权限来安装Nacos${NC}"
        SUDO="sudo"
    else
        SUDO=""
    fi
    
    # 创建安装目录
    $SUDO mkdir -p "$NACOS_INSTALL_DIR"
    
    # 解压Nacos
    cd "$DOWNLOAD_DIR"
    if $SUDO tar -zxvf "nacos-server-$NACOS_VERSION.tar.gz" -C "$NACOS_INSTALL_DIR"; then
        echo -e "${GREEN}✓${NC} Nacos 解压成功"
    else
        echo -e "${RED}✗${NC} Nacos 解压失败"
        exit 1
    fi
    
    # 创建软链接
    $SUDO ln -sf "$NACOS_INSTALL_DIR/nacos" /usr/local/nacos
    
    echo -e "${GREEN}✓${NC} Nacos 安装完成"
    echo -e "   安装目录: $NACOS_INSTALL_DIR"
    echo -e "   软链接: /usr/local/nacos -> $NACOS_INSTALL_DIR/nacos"
}

# 配置Nacos（standalone模式）
configure_nacos() {
    echo -e "${BLUE}正在配置 Nacos...${NC}"
    
    local config_file="$NACOS_INSTALL_DIR/nacos/conf/application.properties"
    
    # 检查是否需要sudo权限
    if [ ! -w "$NACOS_INSTALL_DIR" ]; then
        SUDO="sudo"
    else
        SUDO=""
    fi
    
    # 创建配置文件
    $SUDO tee "$config_file" << 'EOF'
# 单机模式
nacos.standalone=true

# 端口配置
server.port='$NACOS_PORT'

# 日志配置
nacos.log.path='$NACOS_INSTALL_DIR/logs'

# 认证配置（暂时禁用）
nacos.core.auth.enabled=false

# 数据库配置（使用嵌入式数据库，无需MySQL）
# spring.datasource.platform=embedded

# JVM配置
nacos.inetutils.ipaddress=
EOF
    
    echo -e "${GREEN}✓${NC} Nacos 配置完成"
    echo -e "   配置文件: $config_file"
    echo -e "   模式: standalone"
    echo -e "   端口: $NACOS_PORT"
}

# 启动Nacos
start_nacos() {
    echo -e "${BLUE}正在启动 Nacos...${NC}"
    
    # 检查是否需要sudo权限
    if [ ! -w "$NACOS_INSTALL_DIR" ]; then
        SUDO="sudo"
    else
        SUDO=""
    fi
    
    # 检查Nacos是否已经运行
    if netstat -tuln 2>/dev/null | grep -q ":$NACOS_PORT "; then
        echo -e "${YELLOW}⚠${NC} Nacos 已经在运行中"
        read -p "是否重启Nacos？(y/n): " restart
        if [ "$restart" = "y" ]; then
            stop_nacos
            sleep 2
        else
            echo -e "${GREEN}✓${NC} Nacos 正在运行中"
            return 0
        fi
    fi
    
    # 启动Nacos
    cd "$NACOS_INSTALL_DIR/nacos/bin"
    if nohup ./startup.sh -m standalone > "$NACOS_INSTALL_DIR/logs/startup.log" 2>&1 & then
        NACOS_PID=$!
        echo -e "${GREEN}✓${NC} Nacos 已启动 (PID: $NACOS_PID)"
        echo -e "   日志文件: $NACOS_INSTALL_DIR/logs/startup.log"
        echo -e "   访问地址: http://localhost:$NACOS_PORT/nacos"
        
        # 等待Nacos启动
        sleep 10
        
        # 验证Nacos是否启动成功
        if netstat -tuln 2>/dev/null | grep -q ":$NACOS_PORT "; then
            echo -e "${GREEN}✓${NC} Nacos 启动成功"
        else
            echo -e "${RED}✗${NC} Nacos 启动失败"
            echo -e "${YELLOW}查看日志: tail -f $NACOS_INSTALL_DIR/logs/startup.log${NC}"
        fi
    else
        echo -e "${RED}✗${NC} Nacos 启动失败"
        exit 1
    fi
}

# 停止Nacos
stop_nacos() {
    echo -e "${BLUE}正在停止 Nacos...${NC}"
    
    # 查找Nacos进程
    local nacos_pid=$(ps aux | grep nacos | grep -v grep | awk '{print $2}')
    
    if [ -n "$nacos_pid" ]; then
        kill -15 "$nacos_pid"
        echo -e "${GREEN}✓${NC} Nacos 已停止 (PID: $nacos_pid)"
    else
        echo -e "${YELLOW}⚠${NC} Nacos 未在运行"
    fi
}

# 查看Nacos日志
view_nacos_logs() {
    echo -e "${BLUE}Nacos 日志：${NC}"
    echo ""
    
    if [ -f "$NACOS_INSTALL_DIR/logs/startup.log" ]; then
        tail -f "$NACOS_INSTALL_DIR/logs/startup.log"
    else
        echo -e "${YELLOW}⚠${NC} 日志文件不存在: $NACOS_INSTALL_DIR/logs/startup.log"
    fi
}

# 检查Nacos状态
check_nacos_status() {
    echo -e "${BLUE}检查 Nacos 状态...${NC}"
    echo ""
    
    # 检查进程
    local nacos_pid=$(ps aux | grep nacos | grep -v grep | awk '{print $2}')
    if [ -n "$nacos_pid" ]; then
        echo -e "${GREEN}✓${NC} Nacos 进程运行中 (PID: $nacos_pid)"
    else
        echo -e "${RED}✗${NC} Nacos 进程未运行"
    fi
    
    # 检查端口
    if netstat -tuln 2>/dev/null | grep -q ":$NACOS_PORT "; then
        echo -e "${GREEN}✓${NC} Nacos 端口 $NACOS_PORT 正在监听"
    else
        echo -e "${RED}✗${NC} Nacos 端口 $NACOS_PORT 未监听"
    fi
    
    # 检查HTTP访问
    local http_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$NACOS_PORT/nacos" --max-time 3 2>/dev/null)
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓${NC} Nacos HTTP服务正常 (HTTP $http_code)"
    else
        echo -e "${YELLOW}⚠${NC} Nacos HTTP服务异常 (HTTP $http_code)"
    fi
    
    echo ""
}

# 完整安装流程
full_install() {
    print_header
    
    # 下载Nacos
    download_nacos
    
    # 安装Nacos
    install_nacos
    
    # 配置Nacos
    configure_nacos
    
    # 启动Nacos
    start_nacos
    
    # 检查Nacos状态
    check_nacos_status
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}    安装和启动完成${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${BLUE}访问 Nacos 控制台：${NC} http://localhost:$NACOS_PORT/nacos"
    echo -e "${BLUE}默认用户名：${NC} nacos"
    echo -e "${BLUE}默认密码：${NC} nacos"
    echo -e "${YELLOW}⚠${NC} 首次登录后请修改默认密码！"
    echo ""
}

# 主函数
main() {
    print_header
    
    echo -e "${BLUE}请选择操作：${NC}"
    echo "1. 完整安装（下载+安装+配置+启动）"
    echo "2. 仅启动Nacos"
    echo "3. 停止Nacos"
    echo "4. 查看Nacos日志"
    echo "5. 检查Nacos状态"
    echo "0. 退出"
    echo ""
    
    read -p "请输入选项 (0-5): " choice
    
    case $choice in
        1)
            full_install
            ;;
        2)
            start_nacos
            ;;
        3)
            stop_nacos
            ;;
        4)
            view_nacos_logs
            ;;
        5)
            check_nacos_status
            ;;
        0)
            echo -e "${GREEN}再见！${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}无效选项${NC}"
            ;;
    esac
}

# 启动主程序
main
