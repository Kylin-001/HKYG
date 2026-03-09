#!/bin/bash

# Nacos快速安装和启动脚本
# 用于快速安装和启动Nacos服务

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
NACOS_DATA_DIR="/usr/local/nacos/data"
NACOS_LOG_DIR="/usr/local/nacos/logs"

# 打印标题
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}    Nacos快速安装和启动工具${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# 检查Java环境
check_java() {
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | awk -F '.' '{print $1}')
        echo -e "${GREEN}✓${NC} Java 版本: $JAVA_VERSION"
        if [ "$JAVA_VERSION" -lt 17 ]; then
            echo -e "${YELLOW}⚠${NC} Java 版本过低，建议使用 Java 17 或更高版本"
        fi
    else
        echo -e "${RED}✗${NC} 未安装 Java，请先安装 Java 17 或更高版本"
        exit 1
    fi
}

# 检查Nacos是否已安装
check_nacos_installed() {
    if [ -d "$NACOS_INSTALL_DIR" ]; then
        echo -e "${GREEN}✓${NC} Nacos 已安装在 $NACOS_INSTALL_DIR"
        return 0
    else
        echo -e "${YELLOW}✗${NC} Nacos 未安装"
        return 1
    fi
}

# 检查Nacos是否运行
check_nacos_running() {
    if netstat -tuln 2>/dev/null | grep -q ":$NACOS_PORT "; then
        return 0
    elif ss -tuln 2>/dev/null | grep -q ":$NACOS_PORT "; then
        return 0
    else
        return 1
    fi
}

# 下载Nacos
download_nacos() {
    echo -e "${BLUE}正在下载 Nacos $NACOS_VERSION...${NC}"
    
    # 创建安装目录
    sudo mkdir -p "$NACOS_INSTALL_DIR"
    
    # 使用华为云镜像下载（国内推荐）
    if wget -q -O "$NACOS_INSTALL_DIR/nacos-server-$NACOS_VERSION.tar.gz" \
        https://repo.huaweicloud.com/nacos/$NACOS_VERSION/nacos-server-$NACOS_VERSION.tar.gz; then
        echo -e "${GREEN}✓${NC} Nacos 下载成功"
    else
        echo -e "${RED}✗${NC} Nacos 下载失败"
        exit 1
    fi
}

# 安装Nacos
install_nacos() {
    echo -e "${BLUE}正在安装 Nacos...${NC}"
    
    # 解压Nacos
    cd "$NACOS_INSTALL_DIR"
    if sudo tar -zxvf nacos-server-$NACOS_VERSION.tar.gz; then
        echo -e "${GREEN}✓${NC} Nacos 解压成功"
    else
        echo -e "${RED}✗${NC} Nacos 解压失败"
        exit 1
    fi
    
    # 创建软链接
    sudo ln -sf "$NACOS_INSTALL_DIR/nacos" /usr/local/nacos
    
    echo -e "${GREEN}✓${NC} Nacos 安装完成"
}

# 配置Nacos
configure_nacos() {
    echo -e "${BLUE}正在配置 Nacos...${NC}"
    
    # 创建配置文件
    local config_file="$NACOS_INSTALL_DIR/conf/application.properties"
    
    # 检查配置文件是否存在
    if [ ! -f "$config_file" ]; then
        echo -e "${YELLOW}配置文件不存在，创建默认配置${NC}"
        sudo tee "$config_file" << EOF
# 数据库配置
spring.datasource.platform=mysql
db.num=1
db.url.0=jdbc:mysql://localhost:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user.0=root
db.password.0=Mysql@8Root!2025

# 单机模式
nacos.standalone=true

# 端口配置
server.port=$NACOS_PORT

# 日志配置
nacos.log.path=$NACOS_LOG_DIR

# 认证配置
nacos.core.auth.enabled=false
nacos.core.auth.server.identity.key=
nacos.core.auth.server.identity.value=

# 命名空间配置
nacos.naming.namespace.public=
EOF
    fi
    
    echo -e "${GREEN}✓${NC} Nacos 配置完成"
}

# 启动Nacos
start_nacos() {
    echo -e "${BLUE}正在启动 Nacos...${NC}"
    
    # 检查Nacos是否已经运行
    if check_nacos_running; then
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
    if nohup ./startup.sh -m standalone > "$NACOS_LOG_DIR/startup.log" 2>&1 & then
        NACOS_PID=$!
        echo -e "${GREEN}✓${NC} Nacos 已启动 (PID: $NACOS_PID)"
        echo -e "   日志文件: $NACOS_LOG_DIR/startup.log"
        echo -e "   访问地址: http://localhost:$NACOS_PORT/nacos"
        
        # 等待Nacos启动
        sleep 10
        
        # 验证Nacos是否启动成功
        if check_nacos_running; then
            echo -e "${GREEN}✓${NC} Nacos 启动成功"
        else
            echo -e "${RED}✗${NC} Nacos 启动失败"
            echo -e "${YELLOW}查看日志: tail -f $NACOS_LOG_DIR/startup.log${NC}"
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
    
    if [ -f "$NACOS_LOG_DIR/startup.log" ]; then
        tail -f "$NACOS_LOG_DIR/startup.log"
    else
        echo -e "${YELLOW}⚠${NC} 日志文件不存在: $NACOS_LOG_DIR/startup.log"
    fi
}

# 查看Nacos状态
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
    if check_nacos_running; then
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
    
    # 检查Java环境
    check_java
    
    # 检查Nacos是否已安装
    if check_nacos_installed; then
        echo -e "${YELLOW}Nacos 已安装，跳过下载和安装${NC}"
    else
        # 下载Nacos
        download_nacos
        
        # 安装Nacos
        install_nacos
        
        # 配置Nacos
        configure_nacos
    fi
    
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
    echo "1. 完整安装（下载+安装+启动）"
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
