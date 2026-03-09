#!/bin/bash

# HKYG生产环境健康检查脚本
# 用于检查所有服务的健康状态

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$PROJECT_ROOT"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# 服务端口配置
declare -A SERVICES=(
    ["Gateway"]="9999"
    ["Admin"]="8090"
    ["User"]="8081"
    ["Product"]="8082"
    ["Order"]="8083"
    ["Payment"]="8004"
    ["Takeout"]="8005"
    ["Secondhand"]="8006"
    ["Lostfound"]="8007"
    ["Campus"]="8003"
    ["Member"]="8088"
    ["Delivery"]="8001"
    ["Nacos"]="8848"
    ["MySQL"]="3306"
    ["Redis"]="6379"
)

# 检查端口是否开放
check_port() {
    local service_name=$1
    local port=$2
    
    log_info "检查 $service_name (端口: $port)..."
    
    if command -v netstat &> /dev/null; then
        if netstat -tuln 2>/dev/null | grep -q ":$port "; then
            log_success "$service_name 端口 $port 开放"
            return 0
        fi
    elif command -v ss &> /dev/null; then
        if ss -tuln 2>/dev/null | grep -q ":$port "; then
            log_success "$service_name 端口 $port 开放"
            return 0
        fi
    elif command -v lsof &> /dev/null; then
        if lsof -i :$port &> /dev/null; then
            log_success "$service_name 端口 $port 开放"
            return 0
        fi
    fi
    
    log_warn "$service_name 端口 $port 未开放"
    return 1
}

# 检查HTTP服务
check_http_service() {
    local service_name=$1
    local port=$2
    local path=${3:-"/actuator/health"}
    
    log_info "检查 $service_name HTTP健康检查..."
    
    if command -v curl &> /dev/null; then
        local response
        response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "http://localhost:$port$path" 2>/dev/null || echo "000")
        
        if [ "$response" = "200" ]; then
            log_success "$service_name HTTP健康检查通过"
            return 0
        elif [ "$response" != "000" ]; then
            log_warn "$service_name HTTP返回状态码: $response"
            return 1
        fi
    fi
    
    log_warn "$service_name HTTP健康检查无法访问"
    return 1
}

# 检查MySQL
check_mysql() {
    log_info "检查MySQL连接..."
    
    if command -v mysql &> /dev/null; then
        if mysql -u root -p"Mysql@8Root!2025" -h localhost -P 3306 -e "SELECT 1;" &> /dev/null; then
            log_success "MySQL连接正常"
            return 0
        fi
    fi
    
    log_warn "MySQL连接检查失败（可能密码或配置不同）"
    return 1
}

# 检查Redis
check_redis() {
    log_info "检查Redis连接..."
    
    if command -v redis-cli &> /dev/null; then
        if redis-cli -h localhost -p 6379 -a "Redis@hkyg" ping &> /dev/null; then
            log_success "Redis连接正常"
            return 0
        fi
    fi
    
    log_warn "Redis连接检查失败（可能密码或配置不同）"
    return 1
}

# 生成健康报告
generate_report() {
    local report_file="reports/health_check_report_$(date '+%Y%m%d_%H%M%S').txt"
    
    mkdir -p reports
    
    {
        echo "=========================================="
        echo "HKYG生产环境健康检查报告"
        echo "=========================================="
        echo "检查时间: $(date '+%Y-%m-%d %H:%M:%S')"
        echo ""
        echo "服务状态概览:"
        echo "------------------------------------------"
    } > "$report_file"
    
    local success_count=0
    local warn_count=0
    local error_count=0
    
    echo ""
    log_info "开始执行健康检查..."
    echo "=========================================="
    
    for service in "${!SERVICES[@]}"; do
        port=${SERVICES[$service]}
        
        if check_port "$service" "$port"; then
            ((success_count++))
            echo "✅ $service: 端口 $port 开放" >> "$report_file"
            
            if [[ "$service" != "MySQL" && "$service" != "Redis" && "$service" != "Nacos" ]]; then
                if check_http_service "$service" "$port"; then
                    echo "   HTTP健康检查: 通过" >> "$report_file"
                else
                    echo "   HTTP健康检查: 未通过" >> "$report_file"
                    ((warn_count++))
                fi
            fi
        else
            ((warn_count++))
            echo "⚠️  $service: 端口 $port 未开放" >> "$report_file"
        fi
    done
    
    echo "" >> "$report_file"
    echo "数据库状态:" >> "$report_file"
    echo "------------------------------------------" >> "$report_file"
    
    if check_mysql; then
        ((success_count++))
        echo "✅ MySQL: 连接正常" >> "$report_file"
    else
        ((warn_count++))
        echo "⚠️  MySQL: 连接异常" >> "$report_file"
    fi
    
    if check_redis; then
        ((success_count++))
        echo "✅ Redis: 连接正常" >> "$report_file"
    else
        ((warn_count++))
        echo "⚠️  Redis: 连接异常" >> "$report_file"
    fi
    
    echo "" >> "$report_file"
    echo "==========================================" >> "$report_file"
    echo "检查总结:" >> "$report_file"
    echo "  ✅ 正常: $success_count" >> "$report_file"
    echo "  ⚠️  警告: $warn_count" >> "$report_file"
    echo "  ❌ 错误: $error_count" >> "$report_file"
    echo "==========================================" >> "$report_file"
    
    echo ""
    log_success "健康检查完成！"
    log_info "报告已保存到: $report_file"
    echo ""
    cat "$report_file"
}

# 主函数
main() {
    case "${1:-check}" in
        check)
            generate_report
            ;;
        port)
            if [ -z "$2" ]; then
                log_error "请指定端口号"
                echo "用法: $0 port <port>"
                exit 1
            fi
            check_port "指定端口" "$2"
            ;;
        all)
            generate_report
            ;;
        help)
            echo "HKYG生产环境健康检查工具"
            echo ""
            echo "用法: $0 [命令]"
            echo ""
            echo "命令:"
            echo "  check    - 执行完整健康检查（默认）"
            echo "  port <n> - 检查特定端口"
            echo "  all      - 同 check"
            echo "  help     - 显示帮助信息"
            echo ""
            ;;
        *)
            log_error "未知命令: $1"
            echo "使用 '$0 help' 查看帮助"
            exit 1
            ;;
    esac
}

main "$@"
