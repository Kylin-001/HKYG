#!/bin/bash

# Nacos快速启动脚本（终极简化版）
# 用于快速启动Nacos服务

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Nacos配置
NACOS_VERSION="2.3.2"
NACOS_PORT="8848"
NACOS_IMAGE="nacos/nacos-server:$NACOS_VERSION"

# 打印标题
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}    Nacos快速启动工具${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
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

# 启动Nacos（Docker方式）
start_nacos_docker() {
    echo -e "${BLUE}正在启动 Nacos (Docker)...${NC}"
    
    # 检查Docker是否可用
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}✗${NC} Docker 未安装"
        echo -e "${YELLOW}请先安装Docker：${NC}"
        echo -e "  Ubuntu/Debian: sudo apt-get install docker.io"
        echo -e "  CentOS/RHEL: sudo yum install docker"
        return 1
    fi
    
    # 检查Nacos是否已经运行
    if check_nacos_running; then
        echo -e "${YELLOW}⚠${NC} Nacos 已经在运行中"
        read -p "是否重启Nacos？(y/n): " restart
        if [ "$restart" = "y" ]; then
            docker stop heikeji-nacos
            sleep 2
        else
            echo -e "${GREEN}✓${NC} Nacos 正在运行中"
            return 0
        fi
    fi
    
    # 启动Nacos容器
    if docker run -d \
        --name heikeji-nacos \
        --restart unless-stopped \
        -p "$NACOS_PORT:$NACOS_PORT" \
        -p 9848:9848 \
        -e MODE=standalone \
        -e JVM_XMS=512m \
        -e JVM_XMX=512m \
        -v ~/nacos/logs:/home/nacos/logs \
        -v ~/nacos/data:/home/nacos/data \
        "$NACOS_IMAGE"; then
        echo -e "${GREEN}✓${NC} Nacos 已启动"
        echo -e "   容器名称: heikeji-nacos"
        echo -e "   端口: $NACOS_PORT"
        echo -e "   访问地址: http://localhost:$NACOS_PORT/nacos"
        echo -e "   默认用户名: nacos"
        echo -e "   默认密码: nacos"
        echo -e "${YELLOW}⚠${NC} 首次登录后请修改默认密码！"
        
        # 等待Nacos启动
        sleep 10
        
        # 验证Nacos是否启动成功
        if check_nacos_running; then
            echo -e "${GREEN}✓${NC} Nacos 启动成功"
        else
            echo -e "${RED}✗${NC} Nacos 启动失败"
            echo -e "${YELLOW}查看日志: docker logs -f heikeji-nacos${NC}"
        fi
    else
        echo -e "${RED}✗${NC} Nacos 启动失败"
        return 1
    fi
}

# 停止Nacos
stop_nacos() {
    echo -e "${BLUE}正在停止 Nacos...${NC}"
    
    if docker stop heikeji-nacos; then
        echo -e "${GREEN}✓${NC} Nacos 已停止"
    else
        echo -e "${YELLOW}⚠${NC} Nacos 未在运行"
    fi
}

# 查看Nacos日志
view_nacos_logs() {
    echo -e "${BLUE}Nacos 日志：${NC}"
    echo ""
    
    if docker logs --tail 100 heikeji-nacos 2>/dev/null; then
        docker logs --tail 100 heikeji-nacos
    else
        echo -e "${YELLOW}⚠${NC} 无法查看日志，请检查Docker是否正常运行"
    fi
}

# 检查Nacos状态
check_nacos_status() {
    echo -e "${BLUE}检查 Nacos 状态...${NC}"
    echo ""
    
    # 检查进程
    if docker ps | grep -q heikeji-nacos; then
        echo -e "${GREEN}✓${NC} Nacos 容器运行中"
    else
        echo -e "${RED}✗${NC} Nacos 容器未运行"
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

# 主函数
main() {
    print_header
    
    echo -e "${BLUE}请选择操作：${NC}"
    echo "1. 启动Nacos"
    echo "2. 停止Nacos"
    echo "3. 查看Nacos日志"
    echo "4. 检查Nacos状态"
    echo "0. 退出"
    echo ""
    
    read -p "请输入选项 (0-4): " choice
    
    case $choice in
        1)
            start_nacos_docker
            ;;
        2)
            stop_nacos
            ;;
        3)
            view_nacos_logs
            ;;
        4)
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
