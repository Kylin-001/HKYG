#!/bin/bash

# 黑科易购项目部署脚本
# 支持传统部署和Docker Compose部署两种方式

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT=$(cd $(dirname $0); pwd)

# 日志文件
LOG_FILE="${PROJECT_ROOT}/deploy.log"

# 部署模式：traditional（传统部署）或 docker（Docker Compose部署）
DEPLOY_MODE="traditional"

# 环境：dev（开发）、test（测试）或 prod（生产）
ENVIRONMENT="prod"

# 数据库配置
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASS="root"
DB_NAME="heikeji_mall"

# Nacos配置
NACOS_HOST="localhost"
NACOS_PORT="8848"

# 打印日志
log() {
    local level=$1
    local message=$2
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    
    case $level in
        "INFO")
            echo -e "${GREEN}[INFO]${NC} ${timestamp} ${message}" | tee -a ${LOG_FILE}
            ;;
        "WARN")
            echo -e "${YELLOW}[WARN]${NC} ${timestamp} ${message}" | tee -a ${LOG_FILE}
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} ${timestamp} ${message}" | tee -a ${LOG_FILE}
            ;;
        *)
            echo -e "${BLUE}[DEBUG]${NC} ${timestamp} ${message}" | tee -a ${LOG_FILE}
            ;;
    esac
}

# 检查命令是否存在
check_command() {
    local cmd=$1
    if ! command -v $cmd &> /dev/null; then
        log "ERROR" "命令 ${cmd} 不存在，请先安装"
        return 1
    fi
    return 0
}

# 检查Java版本
check_java_version() {
    if ! check_command java; then
        return 1
    fi
    
    local java_version=$(java -version 2>&1 | grep -i version | cut -d'"' -f2 | cut -d'.' -f1,2)
    local major_version=$(echo $java_version | cut -d'.' -f1)
    
    if [ "$major_version" -lt 17 ]; then
        log "ERROR" "Java版本需要17或更高，当前版本为 ${java_version}"
        return 1
    fi
    
    log "INFO" "Java版本检查通过：${java_version}"
    return 0
}

# 检查Maven版本
check_maven_version() {
    if ! check_command mvn; then
        return 1
    fi
    
    local mvn_version=$(mvn -version 2>&1 | grep -i "apache maven" | cut -d' ' -f3)
    local major_version=$(echo $mvn_version | cut -d'.' -f1)
    local minor_version=$(echo $mvn_version | cut -d'.' -f2)
    
    if [ "$major_version" -lt 3 ] || ([ "$major_version" -eq 3 ] && [ "$minor_version" -lt 8 ]); then
        log "ERROR" "Maven版本需要3.8.0或更高，当前版本为 ${mvn_version}"
        return 1
    fi
    
    log "INFO" "Maven版本检查通过：${mvn_version}"
    return 0
}

# 检查Node.js版本
check_node_version() {
    if ! check_command node; then
        return 1
    fi
    
    local node_version=$(node -v | cut -d'v' -f2)
    local major_version=$(echo $node_version | cut -d'.' -f1)
    
    if [ "$major_version" -lt 18 ]; then
        log "ERROR" "Node.js版本需要18或更高，当前版本为 ${node_version}"
        return 1
    fi
    
    log "INFO" "Node.js版本检查通过：${node_version}"
    return 0
}

# 检查Docker和Docker Compose
check_docker() {
    if ! check_command docker; then
        log "ERROR" "Docker未安装，请先安装Docker"
        return 1
    fi
    
    if ! check_command docker-compose; then
        log "ERROR" "Docker Compose未安装，请先安装Docker Compose"
        return 1
    fi
    
    local docker_version=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    log "INFO" "Docker版本检查通过：${docker_version}"
    
    local docker_compose_version=$(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)
    log "INFO" "Docker Compose版本检查通过：${docker_compose_version}"
    
    return 0
}

# 初始化数据库
init_database() {
    log "INFO" "开始初始化数据库..."
    
    # 检查MySQL命令是否存在
    if ! check_command mysql; then
        log "ERROR" "MySQL命令不存在，请先安装MySQL客户端"
        return 1
    fi
    
    # 创建数据库
    log "INFO" "创建数据库 ${DB_NAME}..."
    mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASS} -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1
    if [ $? -ne 0 ]; then
        log "ERROR" "创建数据库失败"
        return 1
    fi
    
    # 导入数据
    log "INFO" "导入数据库数据..."
    mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASS} ${DB_NAME} < "${PROJECT_ROOT}/full_db.sql" 2>&1
    if [ $? -ne 0 ]; then
        log "ERROR" "导入数据库数据失败"
        return 1
    fi
    
    log "INFO" "数据库初始化完成"
    return 0
}

# 构建后端服务
build_backend() {
    log "INFO" "开始构建后端服务..."
    
    # 检查Java和Maven
    if ! check_java_version || ! check_maven_version; then
        return 1
    fi
    
    # 进入项目根目录
    cd ${PROJECT_ROOT}
    
    # 构建所有服务
    log "INFO" "使用Maven构建后端服务..."
    mvn clean install '-Dmaven.test.skip=true' 2>&1 | tee -a ${LOG_FILE}
    if [ $? -ne 0 ]; then
        log "ERROR" "后端服务构建失败"
        return 1
    fi
    
    log "INFO" "后端服务构建完成"
    return 0
}

# 构建前端服务
build_frontend() {
    log "INFO" "开始构建前端服务..."
    
    # 检查Node.js
    if ! check_node_version; then
        return 1
    fi
    
    # 进入前端目录
    cd "${PROJECT_ROOT}/heikeji-frontend"
    
    # 安装依赖
    log "INFO" "安装前端依赖..."
    npm install 2>&1 | tee -a ${LOG_FILE}
    if [ $? -ne 0 ]; then
        log "ERROR" "前端依赖安装失败"
        return 1
    fi
    
    # 构建前端
    log "INFO" "构建前端项目..."
    npm run build 2>&1 | tee -a ${LOG_FILE}
    if [ $? -ne 0 ]; then
        log "ERROR" "前端项目构建失败"
        return 1
    fi
    
    log "INFO" "前端服务构建完成"
    return 0
}

# 启动后端服务
start_backend_services() {
    log "INFO" "开始启动后端服务..."
    
    # 进入后端服务目录
    cd "${PROJECT_ROOT}/heikeji-mall-service"
    
    # 检查start_services_final.sh是否存在
    if [ -f "start_services_final.sh" ]; then
        # 执行现有的start_services_final.sh脚本
        chmod +x start_services_final.sh
        ./start_services_final.sh 2>&1 | tee -a ${LOG_FILE}
        if [ $? -ne 0 ]; then
            log "ERROR" "后端服务启动失败"
            return 1
        fi
    else
        log "ERROR" "start_services_final.sh脚本不存在"
        return 1
    fi
    
    log "INFO" "后端服务启动完成"
    return 0
}

# 配置Nginx
configure_nginx() {
    log "INFO" "开始配置Nginx..."
    
    # 检查Nginx命令是否存在
    if ! check_command nginx; then
        log "ERROR" "Nginx命令不存在，请先安装Nginx"
        return 1
    fi
    
    # 复制Nginx配置文件
    log "INFO" "复制Nginx配置文件..."
    sudo cp "${PROJECT_ROOT}/nginx.conf" /etc/nginx/conf.d/heikeji-mall.conf 2>&1 | tee -a ${LOG_FILE}
    if [ $? -ne 0 ]; then
        log "ERROR" "复制Nginx配置文件失败"
        return 1
    fi
    
    # 替换配置文件中的路径
    log "INFO" "替换Nginx配置文件中的路径..."
    sudo sed -i "s|/usr/share/nginx/html|${PROJECT_ROOT}/heikeji-frontend/dist|g" /etc/nginx/conf.d/heikeji-mall.conf 2>&1 | tee -a ${LOG_FILE}
    if [ $? -ne 0 ]; then
        log "ERROR" "替换Nginx配置文件路径失败"
        return 1
    fi
    
    # 检查Nginx配置
    log "INFO" "检查Nginx配置..."
    sudo nginx -t 2>&1 | tee -a ${LOG_FILE}
    if [ $? -ne 0 ]; then
        log "ERROR" "Nginx配置检查失败"
        return 1
    fi
    
    # 重启Nginx
    log "INFO" "重启Nginx服务..."
    sudo systemctl restart nginx 2>&1 | tee -a ${LOG_FILE}
    if [ $? -ne 0 ]; then
        log "ERROR" "重启Nginx服务失败"
        return 1
    fi
    
    log "INFO" "Nginx配置完成"
    return 0
}

# 启动Docker Compose服务
start_docker_services() {
    log "INFO" "开始启动Docker Compose服务..."
    
    # 检查Docker和Docker Compose
    if ! check_docker; then
        return 1
    fi
    
    # 进入项目根目录
    cd ${PROJECT_ROOT}
    
    # 启动服务
    log "INFO" "使用Docker Compose启动服务..."
    docker-compose up -d 2>&1 | tee -a ${LOG_FILE}
    if [ $? -ne 0 ]; then
        log "ERROR" "Docker Compose服务启动失败"
        return 1
    fi
    
    log "INFO" "Docker Compose服务启动完成"
    return 0
}

# 停止Docker Compose服务
stop_docker_services() {
    log "INFO" "开始停止Docker Compose服务..."
    
    # 进入项目根目录
    cd ${PROJECT_ROOT}
    
    # 停止服务
    log "INFO" "使用Docker Compose停止服务..."
    docker-compose down 2>&1 | tee -a ${LOG_FILE}
    if [ $? -ne 0 ]; then
        log "ERROR" "Docker Compose服务停止失败"
        return 1
    fi
    
    log "INFO" "Docker Compose服务停止完成"
    return 0
}

# 传统部署
traditional_deploy() {
    log "INFO" "开始传统部署..."
    
    # 1. 初始化数据库
    if ! init_database; then
        return 1
    fi
    
    # 2. 构建后端服务
    if ! build_backend; then
        return 1
    fi
    
    # 3. 构建前端服务
    if ! build_frontend; then
        return 1
    fi
    
    # 4. 启动后端服务
    if ! start_backend_services; then
        return 1
    fi
    
    # 5. 配置Nginx
    if ! configure_nginx; then
        return 1
    fi
    
    log "INFO" "传统部署完成"
    return 0
}

# Docker Compose部署
docker_deploy() {
    log "INFO" "开始Docker Compose部署..."
    
    # 1. 停止现有服务
    if ! stop_docker_services; then
        log "WARN" "停止现有Docker Compose服务失败，继续部署"
    fi
    
    # 2. 构建后端服务
    if ! build_backend; then
        return 1
    fi
    
    # 3. 构建前端服务
    if ! build_frontend; then
        return 1
    fi
    
    # 4. 启动Docker Compose服务
    if ! start_docker_services; then
        return 1
    fi
    
    log "INFO" "Docker Compose部署完成"
    return 0
}

# 显示帮助
show_help() {
    echo -e "${BLUE}黑科易购项目部署脚本${NC}"
    echo -e ""
    echo -e "${YELLOW}用法：${NC}"
    echo -e "  $0 [选项]"
    echo -e ""
    echo -e "${YELLOW}选项：${NC}"
    echo -e "  -h, --help              显示帮助信息"
    echo -e "  -m, --mode MODE         部署模式：traditional（传统部署）或 docker（Docker Compose部署），默认traditional"
    echo -e "  -e, --environment ENV   环境：dev（开发）、test（测试）或 prod（生产），默认prod"
    echo -e "  -h, --db-host HOST      数据库主机，默认localhost"
    echo -e "  -p, --db-port PORT      数据库端口，默认3306"
    echo -e "  -u, --db-user USER      数据库用户名，默认root"
    echo -e "  -P, --db-pass PASS      数据库密码，默认root"
    echo -e "  -n, --db-name NAME      数据库名称，默认heikeji_mall"
    echo -e ""
    echo -e "${YELLOW}示例：${NC}"
    echo -e "  $0 --mode docker --environment prod"
    echo -e "  $0 --mode traditional --db-host 127.0.0.1 --db-port 3306 --db-user root --db-pass root"
    echo -e ""
}

# 解析命令行参数
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -m|--mode)
                DEPLOY_MODE=$2
                shift 2
                ;;
            -e|--environment)
                ENVIRONMENT=$2
                shift 2
                ;;
            --db-host)
                DB_HOST=$2
                shift 2
                ;;
            --db-port)
                DB_PORT=$2
                shift 2
                ;;
            --db-user)
                DB_USER=$2
                shift 2
                ;;
            --db-pass)
                DB_PASS=$2
                shift 2
                ;;
            --db-name)
                DB_NAME=$2
                shift 2
                ;;
            *)
                log "ERROR" "未知参数：$1"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 验证部署模式
    if [[ "${DEPLOY_MODE}" != "traditional" && "${DEPLOY_MODE}" != "docker" ]]; then
        log "ERROR" "部署模式必须是 traditional 或 docker"
        show_help
        exit 1
    fi
    
    # 验证环境
    if [[ "${ENVIRONMENT}" != "dev" && "${ENVIRONMENT}" != "test" && "${ENVIRONMENT}" != "prod" ]]; then
        log "ERROR" "环境必须是 dev、test 或 prod"
        show_help
        exit 1
    fi
}

# 主函数
main() {
    # 解析命令行参数
    parse_args $@
    
    # 清空日志文件
    > ${LOG_FILE}
    
    log "INFO" "开始部署黑科易购项目..."
    log "INFO" "项目根目录：${PROJECT_ROOT}"
    log "INFO" "部署模式：${DEPLOY_MODE}"
    log "INFO" "环境：${ENVIRONMENT}"
    
    # 根据部署模式执行不同的部署逻辑
    if [[ "${DEPLOY_MODE}" == "traditional" ]]; then
        traditional_deploy
    else
        docker_deploy
    fi
    
    if [ $? -eq 0 ]; then
        log "INFO" "部署成功"
        log "INFO" "前端访问地址：http://localhost"
        log "INFO" "Nacos控制台：http://localhost:8848/nacos"
        log "INFO" "RabbitMQ控制台：http://localhost:15672"
        log "INFO" "Zipkin控制台：http://localhost:9411/zipkin"
        exit 0
    else
        log "ERROR" "部署失败，请查看日志文件 ${LOG_FILE}"
        exit 1
    fi
}

# 执行主函数
main $@
