#!/bin/bash

# 黑科易购 - Docker Compose 启动脚本
# 一键启动所有服务

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的信息
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    cat << EOF
黑科易购 Docker Compose 启动脚本

用法: $0 [选项] [命令]

命令:
    up          启动所有服务
    down        停止并移除所有服务
    restart     重启所有服务
    build       重新构建镜像
    logs        查看日志
    status      查看服务状态
    ps          查看运行中的容器

选项:
    -h, --help  显示帮助信息
    -d          后台运行 (仅up命令有效)

示例:
    $0 up -d           # 后台启动所有服务
    $0 logs gateway    # 查看网关日志
    $0 status          # 查看服务状态
EOF
}

# 检查Docker和Docker Compose
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi

    print_success "Docker 环境检查通过"
}

# 检查jar包是否存在
check_jars() {
    print_info "检查jar包..."
    
    local jars=(
        "heikeji-gateway/target/heikeji-gateway-1.0.0.jar"
        "heikeji-admin/target/heikeji-admin-1.0.0.jar"
        "heikeji-mall-service/service-user/target/service-user-1.0.0.jar"
        "heikeji-mall-service/service-product/target/service-product-1.0.0-exec.jar"
        "heikeji-mall-service/service-order/target/service-order-1.0.0.jar"
        "heikeji-mall-service/service-delivery/target/service-delivery-1.0.0.jar"
        "heikeji-mall-service/service-member/target/service-member-1.0.0.jar"
        "heikeji-mall-service/service-campus/target/heikeji-mall-service-campus-1.0.0.jar"
        "heikeji-mall-service/service-secondhand/target/service-secondhand-1.0.0.jar"
        "heikeji-mall-service/service-lostfound/target/service-lostfound-1.0.0.jar"
    )

    local missing=0
    for jar in "${jars[@]}"; do
        if [ ! -f "$jar" ]; then
            print_error "缺少jar包: $jar"
            missing=1
        fi
    done

    if [ $missing -eq 1 ]; then
        print_warning "请先编译项目: mvn clean package -DskipTests"
        exit 1
    fi

    print_success "所有jar包检查通过"
}

# 启动服务
cmd_up() {
    local detach="$1"
    
    print_info "启动黑科易购服务..."
    
    check_docker
    check_jars
    
    # 创建网络（如果不存在）
    docker network create hkyg-network 2>/dev/null || true
    
    # 启动服务
    if [ "$detach" = "true" ]; then
        docker-compose -f docker-compose-full.yml up -d --build
    else
        docker-compose -f docker-compose-full.yml up --build
    fi
    
    if [ "$detach" = "true" ]; then
        print_success "服务已在后台启动"
        print_info "使用 '$0 logs' 查看日志"
        print_info "使用 '$0 status' 查看服务状态"
    fi
}

# 停止服务
cmd_down() {
    print_info "停止黑科易购服务..."
    docker-compose -f docker-compose-full.yml down
    print_success "服务已停止"
}

# 重启服务
cmd_restart() {
    print_info "重启黑科易购服务..."
    docker-compose -f docker-compose-full.yml restart
    print_success "服务已重启"
}

# 重新构建
cmd_build() {
    print_info "重新构建镜像..."
    check_jars
    docker-compose -f docker-compose-full.yml build --no-cache
    print_success "镜像构建完成"
}

# 查看日志
cmd_logs() {
    local service="$1"
    if [ -n "$service" ]; then
        docker-compose -f docker-compose-full.yml logs -f "$service"
    else
        docker-compose -f docker-compose-full.yml logs -f
    fi
}

# 查看状态
cmd_status() {
    print_info "服务状态:"
    docker-compose -f docker-compose-full.yml ps
    
    print_info "\n健康检查:"
    
    # 检查基础设施
    echo -e "\n${BLUE}基础设施:${NC}"
    check_service "MySQL" "localhost" "3306"
    check_service "Redis" "localhost" "6379"
    check_service "Nacos" "localhost" "8848"
    check_service "RabbitMQ" "localhost" "5672"
    
    # 检查微服务
    echo -e "\n${BLUE}微服务:${NC}"
    check_service "API网关" "localhost" "8080"
    check_service "管理后台" "localhost" "8090"
    check_service "用户服务" "localhost" "8081"
    check_service "商品服务" "localhost" "8082"
    check_service "订单服务" "localhost" "8083"
    check_service "配送服务" "localhost" "8001"
    check_service "会员服务" "localhost" "8088"
    check_service "校园服务" "localhost" "8003"
    check_service "二手服务" "localhost" "8006"
    check_service "失物招领" "localhost" "8007"
}

# 检查单个服务
check_service() {
    local name="$1"
    local host="$2"
    local port="$3"
    
    if nc -z "$host" "$port" 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} $name (端口 $port)"
    else
        echo -e "  ${RED}✗${NC} $name (端口 $port)"
    fi
}

# 查看容器
cmd_ps() {
    docker-compose -f docker-compose-full.yml ps
}

# 主函数
main() {
    local command=""
    local detach="false"
    local service=""

    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -d)
                detach="true"
                shift
                ;;
            up|down|restart|build|logs|status|ps)
                command="$1"
                shift
                ;;
            *)
                service="$1"
                shift
                ;;
        esac
    done

    # 执行命令
    case "$command" in
        up)
            cmd_up "$detach"
            ;;
        down)
            cmd_down
            ;;
        restart)
            cmd_restart
            ;;
        build)
            cmd_build
            ;;
        logs)
            cmd_logs "$service"
            ;;
        status)
            cmd_status
            ;;
        ps)
            cmd_ps
            ;;
        *)
            show_help
            exit 1
            ;;
    esac
}

# 运行主函数
main "$@"
