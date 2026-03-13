#!/bin/bash

# 嵌入式Nacos启动脚本
# 用于在没有Docker的环境中启动Nacos

set -e

# 配置变量
NACOS_VERSION="2.3.2"
NACOS_PORT="8848"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
NACOS_HOME="${PROJECT_ROOT}/nacos"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_debug() {
    echo -e "${BLUE}[DEBUG]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# 检查Java环境
check_java() {
    log_info "检查Java环境..."
    
    if ! command -v java &> /dev/null; then
        log_error "Java未安装或不在PATH中"
        exit 1
    fi
    
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
    log_info "Java版本: $JAVA_VERSION"
    
    # 检查Java版本是否满足要求
    JAVA_MAJOR=$(echo $JAVA_VERSION | cut -d'.' -f1)
    if [ "$JAVA_MAJOR" -lt "17" ]; then
        log_error "Nacos需要Java 17或更高版本，当前版本: $JAVA_VERSION"
        exit 1
    fi
}

# 检查端口是否被占用
check_port() {
    local port=$1
    if command -v netstat &> /dev/null; then
        if netstat -tuln 2>/dev/null | grep -q ":$port "; then
            log_warn "端口 $port 已被占用"
            return 1
        fi
    elif command -v ss &> /dev/null; then
        if ss -tuln 2>/dev/null | grep -q ":$port "; then
            log_warn "端口 $port 已被占用"
            return 1
        fi
    else
        log_warn "无法检查端口状态（netstat和ss都不可用）"
    fi
    return 0
}

# 等待端口可用
wait_for_port() {
    local port=$1
    local timeout=${2:-30}
    
    log_info "等待端口 $port 可用..."
    
    for i in $(seq 1 $timeout); do
        if command -v netstat &> /dev/null; then
            if netstat -tuln 2>/dev/null | grep -q ":$port "; then
                log_info "端口 $port 已就绪"
                return 0
            fi
        elif command -v ss &> /dev/null; then
            if ss -tuln 2>/dev/null | grep -q ":$port "; then
                log_info "端口 $port 已就绪"
                return 0
            fi
        fi
        sleep 1
    done
    
    log_error "等待端口 $port 超时"
    return 1
}

# 下载Nacos
download_nacos() {
    log_info "下载Nacos $NACOS_VERSION..."
    
    # 创建临时目录
    mkdir -p /tmp/nacos-download
    cd /tmp/nacos-download
    
    # 尝试从GitHub下载
    if command -v wget &> /dev/null; then
        log_info "使用wget下载Nacos..."
        wget -O "nacos-server-${NACOS_VERSION}.tar.gz" \
            "https://github.com/alibaba/nacos/releases/download/${NACOS_VERSION}/nacos-server-${NACOS_VERSION}.tar.gz" || \
        wget -O "nacos-server-${NACOS_VERSION}.tar.gz" \
            "https://repo.huaweicloud.com/nacos/${NACOS_VERSION}/nacos-server-${NACOS_VERSION}.tar.gz"
    elif command -v curl &> /dev/null; then
        log_info "使用curl下载Nacos..."
        curl -L -o "nacos-server-${NACOS_VERSION}.tar.gz" \
            "https://github.com/alibaba/nacos/releases/download/${NACOS_VERSION}/nacos-server-${NACOS_VERSION}.tar.gz" || \
        curl -L -o "nacos-server-${NACOS_VERSION}.tar.gz" \
            "https://repo.huaweicloud.com/nacos/${NACOS_VERSION}/nacos-server-${NACOS_VERSION}.tar.gz"
    else
        log_error "未找到wget或curl命令"
        exit 1
    fi
    
    # 验证下载文件
    if [ ! -f "nacos-server-${NACOS_VERSION}.tar.gz" ]; then
        log_error "Nacos下载失败"
        exit 1
    fi
    
    log_info "Nacos下载完成"
}

# 安装Nacos
install_nacos() {
    log_info "安装Nacos到 $NACOS_HOME..."
    
    # 创建安装目录
    mkdir -p "$NACOS_HOME"
    
    # 解压Nacos
    cd /tmp/nacos-download
    tar -xzf "nacos-server-${NACOS_VERSION}.tar.gz" -C "$NACOS_HOME" --strip-components=1
    
    # 创建日志目录
    mkdir -p "$NACOS_HOME/logs"
    
    # 清理下载文件
    rm -rf /tmp/nacos-download
    
    log_info "Nacos安装完成"
}

# 配置Nacos
configure_nacos() {
    log_info "配置Nacos..."
    
    # 备份原始配置文件
    cp "$NACOS_HOME/conf/application.properties" "$NACOS_HOME/conf/application.properties.bak"
    
    # 创建配置文件
    cat > "$NACOS_HOME/conf/application.properties" << EOF
# Nacos配置文件
server.port=${NACOS_PORT}

# 单机模式
nacos.standalone=true

# 数据库配置（使用内存数据库，适合开发环境）
spring.datasource.platform=embedded
nacos.core.auth.enabled=false
nacos.core.auth.default.token.secret.key=SecretKey012345678901234567890123456789012345678901234567890123456789

# 日志配置
server.tomcat.accesslog.enabled=true
server.tomcat.accesslog.pattern=%h %l %u %t "%r" %s %b %D "%{Referer}i" "%{User-Agent}i" %a
server.tomcat.accesslog.prefix=access_log
server.tomcat.accesslog.suffix=.txt
server.tomcat.accesslog.rename-on-rotate=true
server.tomcat.accesslog.directory=logs

# 性能配置
nacos.config.push.content.retryTime=3000
management.endpoints.web.exposure.include=*

# 日志级别
logging.level.com.alibaba.nacos=INFO
logging.level.root=INFO
EOF
    
    log_info "Nacos配置完成"
}

# 启动Nacos
start_nacos() {
    log_info "启动Nacos..."
    
    cd "$NACOS_HOME"
    
    # 设置JVM参数
    export JVM_XMS="256m"
    export JVM_XMX="512m"
    export JVM_XMN="256m"
    export JVM_MS="128m"
    export JVM_MMS="320m"
    
    # 启动Nacos
    nohup bash "$NACOS_HOME/bin/startup.sh" -m standalone > "$NACOS_HOME/logs/startup.log" 2>&1 &
    NACOS_PID=$!
    
    echo $NACOS_PID > "$NACOS_HOME/nacos.pid"
    
    log_info "Nacos启动中，PID: $NACOS_PID"
}

# 等待Nacos就绪
wait_for_nacos() {
    log_info "等待Nacos服务就绪..."
    
    for i in {1..60}; do
        if curl -s "http://localhost:${NACOS_PORT}/nacos" > /dev/null; then
            log_info "Nacos服务已就绪！"
            log_info "访问Nacos控制台: http://localhost:${NACOS_PORT}/nacos"
            log_info "默认用户名: nacos, 密码: nacos"
            return 0
        fi
        
        if [ $((i % 10)) -eq 0 ]; then
            log_info "等待Nacos启动... ($i/60)"
        fi
        
        sleep 1
    done
    
    log_error "Nacos启动超时"
    
    # 显示启动日志
    log_error "启动日志:"
    tail -n 50 "$NACOS_HOME/logs/startup.log"
    
    return 1
}

# 检查Nacos状态
check_nacos_status() {
    if [ -f "$NACOS_HOME/nacos.pid" ]; then
        PID=$(cat "$NACOS_HOME/nacos.pid")
        if ps -p $PID > /dev/null; then
            log_info "Nacos正在运行，PID: $PID"
            return 0
        else
            log_warn "Nacos PID文件存在但进程不存在"
            rm -f "$NACOS_HOME/nacos.pid"
            return 1
        fi
    else
        log_warn "Nacos PID文件不存在"
        return 1
    fi
}

# 停止Nacos
stop_nacos() {
    log_info "停止Nacos..."
    
    if [ -f "$NACOS_HOME/nacos.pid" ]; then
        PID=$(cat "$NACOS_HOME/nacos.pid")
        if ps -p $PID > /dev/null; then
            kill $PID
            log_info "已发送停止信号给Nacos (PID: $PID)"
            
            # 等待进程结束
            for i in {1..30}; do
                if ! ps -p $PID > /dev/null; then
                    log_info "Nacos已停止"
                    rm -f "$NACOS_HOME/nacos.pid"
                    return 0
                fi
                sleep 1
            done
            
            # 强制杀死进程
            log_warn "强制停止Nacos"
            kill -9 $PID
            rm -f "$NACOS_HOME/nacos.pid"
        else
            log_warn "Nacos进程不存在"
        fi
    else
        log_warn "Nacos PID文件不存在"
    fi
}

# 显示帮助信息
show_help() {
    echo "嵌入式Nacos管理脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  start     启动Nacos"
    echo "  stop      停止Nacos"
    echo "  restart   重启Nacos"
    echo "  status    检查Nacos状态"
    echo "  logs      显示Nacos日志"
    echo "  help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 start      # 启动Nacos"
    echo "  $0 stop       # 停止Nacos"
    echo "  $0 restart    # 重启Nacos"
    echo "  $0 status     # 检查状态"
    echo "  $0 logs       # 查看日志"
}

# 显示Nacos日志
show_logs() {
    if [ -f "$NACOS_HOME/logs/startup.log" ]; then
        tail -f "$NACOS_HOME/logs/startup.log"
    else
        log_error "Nacos日志文件不存在"
    fi
}

# 主函数
main() {
    # 解析命令行参数
    case "${1:-start}" in
        start)
            log_info "启动嵌入式Nacos..."
            
            # 检查Java环境
            check_java
            
            # 检查端口
            if ! check_port $NACOS_PORT; then
                log_error "端口 $NACOS_PORT 被占用，请检查是否有其他Nacos实例在运行"
                exit 1
            fi
            
            # 检查Nacos是否已安装
            if [ ! -d "$NACOS_HOME" ] || [ ! -f "$NACOS_HOME/bin/startup.sh" ]; then
                log_info "Nacos未安装，开始下载和安装..."
                download_nacos
                install_nacos
                configure_nacos
            fi
            
            # 检查Nacos是否已运行
            if check_nacos_status; then
                log_warn "Nacos已在运行"
                exit 0
            fi
            
            # 启动Nacos
            start_nacos
            
            # 等待Nacos就绪
            if wait_for_nacos; then
                log_info "嵌入式Nacos启动成功！"
            else
                log_error "嵌入式Nacos启动失败"
                exit 1
            fi
            ;;
        stop)
            stop_nacos
            ;;
        restart)
            stop_nacos
            sleep 2
            main start
            ;;
        status)
            if check_nacos_status; then
                log_info "Nacos正在运行"
                exit 0
            else
                log_info "Nacos未运行"
                exit 1
            fi
            ;;
        logs)
            show_logs
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"