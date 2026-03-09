#!/bin/bash

# 使用嵌入式Nacos启动所有微服务
# 此脚本会先启动嵌入式Nacos，然后启动所有微服务

set -e

# 配置变量
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
NACOS_SCRIPT="$PROJECT_ROOT/scripts/linux/embedded-nacos.sh"
SERVICE_START_TIMEOUT=60
NACOS_PORT=8848

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
        log_error "项目需要Java 17或更高版本，当前版本: $JAVA_VERSION"
        exit 1
    fi
}

# 等待Nacos就绪
wait_for_nacos() {
    log_info "等待Nacos服务就绪..."
    
    for i in $(seq 1 $SERVICE_START_TIMEOUT); do
        if curl -s "http://localhost:${NACOS_PORT}/nacos/v1/console/server/state" > /dev/null; then
            log_info "Nacos服务已就绪！"
            return 0
        fi
        
        if [ $((i % 10)) -eq 0 ]; then
            log_info "等待Nacos启动... ($i/$SERVICE_START_TIMEOUT)"
        fi
        
        sleep 1
    done
    
    log_error "Nacos启动超时"
    return 1
}

# 查找服务JAR文件
find_service_jar() {
    local service_name=$1
    local service_dir="$PROJECT_ROOT/$service_name"
    
    if [ ! -d "$service_dir" ]; then
        log_warn "服务目录不存在: $service_dir"
        return 1
    fi
    
    # 查找JAR文件
    local jar_file=$(find "$service_dir/target" -name "*.jar" -type f | head -n 1)
    if [ -z "$jar_file" ]; then
        log_warn "未找到 $service_name 的JAR文件"
        return 1
    fi
    
    echo "$jar_file"
    return 0
}

# 启动单个服务
start_service() {
    local service_name=$1
    local jar_file=$(find_service_jar $service_name)
    
    if [ -z "$jar_file" ]; then
        return 1
    fi
    
    log_info "启动服务: $service_name"
    log_debug "JAR文件: $jar_file"
    
    # 创建日志目录
    local log_dir="$PROJECT_ROOT/$service_name/logs"
    mkdir -p "$log_dir"
    
    # 设置JVM参数
    local jvm_opts="-Xms256m -Xmx512m"
    
    # 启动服务
    cd "$PROJECT_ROOT"
    nohup java $jvm_opts -jar "$jar_file" > "$log_dir/startup.log" 2>&1 &
    local service_pid=$!
    
    # 保存PID
    echo "$service_pid" > "$PROJECT_ROOT/$service_name/service.pid"
    
    log_info "$service_name 启动中，PID: $service_pid"
    return 0
}

# 等待服务启动
wait_for_service() {
    local service_name=$1
    local service_port=$2
    local timeout=${3:-30}
    
    log_info "等待服务 $service_name 启动..."
    
    for i in $(seq 1 $timeout); do
        if netstat -tuln | grep -q ":$service_port "; then
            log_info "服务 $service_name 已启动 (端口: $service_port)"
            return 0
        fi
        
        if [ $((i % 10)) -eq 0 ]; then
            log_info "等待服务 $service_name 启动... ($i/$timeout)"
        fi
        
        sleep 1
    done
    
    log_error "服务 $service_name 启动超时"
    return 1
}

# 启动所有微服务
start_microservices() {
    log_info "启动微服务..."
    
    # 服务列表（按启动顺序）
    declare -A services=(
        ["heikeji-gateway"]="8080"
        ["heikeji-admin"]="8081"
        ["service-user"]="8082"
        ["service-product"]="8083"
        ["service-order"]="8084"
        ["service-payment"]="8085"
        ["service-takeout"]="8086"
        ["service-secondhand"]="8087"
        ["service-lostfound"]="8088"
        ["service-campus"]="8089"
        ["service-delivery"]="8090"
        ["service-member"]="8091"
    )
    
    # 先启动Gateway
    log_info "首先启动API网关..."
    if start_service "heikeji-gateway"; then
        wait_for_service "heikeji-gateway" "${services[heikeji-gateway]}"
    else
        log_error "无法启动API网关"
        return 1
    fi
    
    # 启动其他服务
    for service in "${!services[@]}"; do
        if [ "$service" = "heikeji-gateway" ]; then
            continue  # 已启动
        fi
        
        if start_service "$service"; then
            # 不等待每个服务启动完成，并行启动
            sleep 2
        fi
    done
    
    log_info "所有微服务启动命令已发送"
    return 0
}

# 检查服务状态
check_services_status() {
    log_info "检查服务状态..."
    
    # 服务列表
    declare -A services=(
        ["heikeji-gateway"]="8080"
        ["heikeji-admin"]="8081"
        ["service-user"]="8082"
        ["service-product"]="8083"
        ["service-order"]="8084"
        ["service-payment"]="8085"
        ["service-takeout"]="8086"
        ["service-secondhand"]="8087"
        ["service-lostfound"]="8088"
        ["service-campus"]="8089"
        ["service-delivery"]="8090"
        ["service-member"]="8091"
    )
    
    local running_count=0
    local total_count=${#services[@]}
    
    for service in "${!services[@]}"; do
        local port=${services[$service]}
        
        if netstat -tuln | grep -q ":$port "; then
            log_info "$service (端口: $port) - 运行中"
            ((running_count++))
        else
            log_warn "$service (端口: $port) - 未运行"
        fi
    done
    
    log_info "服务状态: $running_count/$total_count 运行中"
    
    if [ $running_count -eq $total_count ]; then
        log_info "所有服务运行正常！"
        return 0
    else
        log_warn "部分服务未运行"
        return 1
    fi
}

# 停止所有服务
stop_all_services() {
    log_info "停止所有服务..."
    
    # 停止微服务
    for service_dir in "$PROJECT_ROOT"/*; do
        if [ -d "$service_dir" ] && [ -f "$service_dir/service.pid" ]; then
            local service_name=$(basename "$service_dir")
            local pid=$(cat "$service_dir/service.pid")
            
            if ps -p $pid > /dev/null; then
                log_info "停止服务: $service_name (PID: $pid)"
                kill $pid
                
                # 等待进程结束
                for i in {1..10}; do
                    if ! ps -p $pid > /dev/null; then
                        break
                    fi
                    sleep 1
                done
                
                # 如果进程仍在运行，强制杀死
                if ps -p $pid > /dev/null; then
                    log_warn "强制停止服务: $service_name"
                    kill -9 $pid
                fi
            fi
            
            rm -f "$service_dir/service.pid"
        fi
    done
    
    # 停止Nacos
    if [ -f "$NACOS_SCRIPT" ]; then
        log_info "停止嵌入式Nacos..."
        bash "$NACOS_SCRIPT" stop
    fi
    
    log_info "所有服务已停止"
}

# 显示帮助信息
show_help() {
    echo "使用嵌入式Nacos启动HKYG微服务"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  start     启动所有服务（Nacos + 微服务）"
    echo "  stop      停止所有服务"
    echo "  restart   重启所有服务"
    echo "  status    检查服务状态"
    echo "  nacos     仅管理Nacos (start/stop/restart/status/logs)"
    echo "  help      显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 start           # 启动所有服务"
    echo "  $0 stop            # 停止所有服务"
    echo "  $0 restart         # 重启所有服务"
    echo "  $0 status          # 检查服务状态"
    echo "  $0 nacos start     # 仅启动Nacos"
    echo "  $0 nacos stop      # 仅停止Nacos"
}

# 主函数
main() {
    # 解析命令行参数
    case "${1:-start}" in
        start)
            log_info "启动HKYG微服务平台..."
            
            # 检查Java环境
            check_java
            
            # 启动Nacos
            if [ -f "$NACOS_SCRIPT" ]; then
                log_info "启动嵌入式Nacos..."
                bash "$NACOS_SCRIPT" start
                
                # 等待Nacos就绪
                if ! wait_for_nacos; then
                    log_error "Nacos启动失败"
                    exit 1
                fi
            else
                log_error "Nacos启动脚本不存在: $NACOS_SCRIPT"
                exit 1
            fi
            
            # 启动微服务
            if start_microservices; then
                log_info "等待服务启动完成..."
                sleep 10
                
                # 检查服务状态
                check_services_status
                
                log_info "HKYG微服务平台启动完成！"
                log_info "访问Nacos控制台: http://localhost:${NACOS_PORT}/nacos"
                log_info "API网关地址: http://localhost:8080"
                log_info "管理后台地址: http://localhost:8081"
            else
                log_error "微服务启动失败"
                exit 1
            fi
            ;;
        stop)
            stop_all_services
            ;;
        restart)
            stop_all_services
            sleep 3
            main start
            ;;
        status)
            # 检查Nacos状态
            if [ -f "$NACOS_SCRIPT" ]; then
                bash "$NACOS_SCRIPT" status
            fi
            
            # 检查微服务状态
            check_services_status
            ;;
        nacos)
            if [ -z "$2" ]; then
                log_error "请指定Nacos操作: start|stop|restart|status|logs"
                exit 1
            fi
            
            if [ -f "$NACOS_SCRIPT" ]; then
                bash "$NACOS_SCRIPT" "$2"
            else
                log_error "Nacos启动脚本不存在: $NACOS_SCRIPT"
                exit 1
            fi
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