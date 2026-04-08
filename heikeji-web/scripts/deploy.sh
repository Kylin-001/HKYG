#!/bin/bash

# ============================================
# 黑科易购 (heikeji-web) - 一键部署脚本
# 支持: build | deploy | start | stop | restart | logs | status
# ============================================

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目配置
PROJECT_NAME="heikeji-web"
DOCKER_IMAGE="${PROJECT_NAME}:latest"
CONTAINER_NAME="${PROJECT_NAME}"
COMPOSE_FILE="docker-compose.yml"

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    log_info "检查依赖..."

    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose未安装"
        exit 1
    fi

    log_success "依赖检查通过 ✓"
}

# 构建镜像
build_image() {
    log_info "构建Docker镜像..."
    
    docker build \
        --target production \
        --tag ${DOCKER_IMAGE} \
        --build-arg NODE_ENV=production \
        .
    
    log_success "镜像构建完成: ${DOCKER_IMAGE}"
    
    # 显示镜像大小
    docker images ${DOCKER_IMAGE}
}

# 部署应用
deploy() {
    log_info "部署应用..."
    
    # 检查.env文件
    if [ ! -f ".env" ]; then
        log_warning ".env文件不存在，从.example复制..."
        cp .env.example .env
        log_info "请编辑 .env 文件后重新运行部署"
        exit 1
    fi
    
    # 停止旧容器（如果存在）
    if [ "$(docker ps -q -f name=${CONTAINER_NAME})" ]; then
        docker stop ${CONTAINER_NAME} || true
        docker rm ${CONTAINER_NAME} || true
    fi
    
    # 使用docker-compose启动
    docker compose -f ${COMPOSE_FILE} up -d --build
    
    log_success "部署完成！"
    show_status
}

# 启动服务
start() {
    log_info "启动服务..."
    docker compose -f ${COMPOSE_FILE} up -d
    log_success "服务已启动"
}

# 停止服务
stop() {
    log_info "停止服务..."
    docker compose -f ${COMPOSE_FILE} down
    log_success "服务已停止"
}

# 重启服务
restart() {
    stop
    sleep 2
    start
}

# 查看日志
logs() {
    local tail=${1:-100}
    docker compose -f ${COMPOSE_FILE} logs --tail=${tail} -f
}

# 查看状态
show_status() {
    echo ""
    echo "=========================================="
    echo "  黑科易购 (heikeji-web) 运行状态"
    echo "=========================================="
    echo ""
    
    # 容器状态
    docker compose -f ${COMPOSE_FILE} ps
    
    echo ""
    echo "--- 资源使用情况 ---"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
    
    echo ""
    echo "--- 健康检查 ---"
    for container in $(docker ps -q); do
        name=$(docker inspect --format='{{.Name}}' $container | sed 's/\///')
        health=$(docker inspect --format='{{.State.Health.Status}}' $container 2>/dev/null || echo 'N/A')
        echo "  ${name}: ${health}"
    done
    
    echo ""
    echo "--- 最近日志 ---"
    docker logs --tail 5 ${CONTAINER_NAME} 2>&1 || true
}

# 清理资源
cleanup() {
    log_info "清理资源..."
    
    # 停止所有容器
    docker compose -f ${COMPOSE_FILE} down -v --remove-orphans
    
    # 删除悬空镜像
    docker image prune -f
    
    # 清理构建缓存
    docker builder prune -f
    
    log_success "清理完成"
}

# 进入容器shell
shell() {
    docker exec -it ${CONTAINER_NAME} /bin/sh
}

# 备份数据
backup() {
    BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p ${BACKUP_DIR}
    
    log_info "备份数据到 ${BACKUP_DIR}..."
    
    # 备份MongoDB
    docker exec heikeji-mongo mongodump --archive=/data/db/backup.archive
    docker cp heikeji-mongo:/data/db/backup.archive ${BACKUP_DIR}/mongo_backup.archive
    
    # 备份Redis
    docker exec heikeji-redis redis-cli BGSAVE
    sleep 2
    docker cp heikeji-mongo:/data/dump.rdb ${BACKUP_DIR}/redis_dump.rdb
    
    log_success "备份完成: ${BACKUP_DIR}"
}

# 性能测试
benchmark() {
    log_info "运行性能基准测试..."
    
    echo ""
    echo "--- 首屏加载时间 ---"
    curl -o /dev/null -s -w "DNS: %{time_namelookup}s\n连接: %{time_connect}s\nTLS握手: %{time_appconnect}s\n首字节: %{time_starttransfer}s\n总时间: %{time_total}s\n" http://localhost/
    
    echo ""
    echo "--- 页面大小 ---"
    curl -sI http://localhost/ | grep -i content-length
    
    echo ""
    echo "--- Gzip压缩率 ---"
    curl -sI -H "Accept-Encoding: gzip" http://localhost/ | grep -i content-encoding
}

# 显示帮助
show_help() {
    echo ""
    echo "黑科易购 (heikeji-web) 部署工具"
    echo ""
    echo "用法: ./deploy.sh [命令]"
    echo ""
    echo "命令:"
    echo "  build      构建Docker镜像"
    echo "  deploy     部署应用（首次或更新）"
    echo "  start      启动服务"
    echo "  stop       停止服务"
    echo "  restart    重启服务"
    echo "  logs       查看日志 (可选参数: 行数，默认100)"
    echo "  status     查看运行状态"
    echo "  shell      进入容器Shell"
    echo "  cleanup    清理所有资源"
    echo "  backup     备份数据"
    echo "  benchmark  性能基准测试"
    echo "  help       显示帮助信息"
    echo ""
    echo "示例:"
    echo "  ./deploy.sh build          # 构建镜像"
    echo "  ./deploy.sh deploy         # 部署应用"
    echo "  ./deploy.sh logs 50        # 查看50行日志"
    echo "  ./deploy.sh benchmark      # 运行性能测试"
    echo ""
}

# 主入口
case "$1" in
    build)
        check_dependencies
        build_image
        ;;
    deploy)
        check_dependencies
        deploy
        ;;
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs $2
        ;;
    status)
        show_status
        ;;
    shell)
        shell
        ;;
    cleanup)
        cleanup
        ;;
    backup)
        backup
        ;;
    benchmark)
        benchmark
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
