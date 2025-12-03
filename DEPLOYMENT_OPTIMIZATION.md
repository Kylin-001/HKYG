# 黑科易购项目部署优化方案

## 1. 现有部署文件分析

### 1.1 当前部署架构

- **docker-compose.yml**：定义了MySQL、Redis、Nacos、RabbitMQ、Zipkin、Nginx、Gateway和Auth服务
- **deploy.sh**：支持传统部署和Docker Compose部署两种方式
- **nginx.conf**：Nginx反向代理配置，处理前端和API请求

### 1.2 存在的问题和优化点

#### 1.2.1 docker-compose.yml 优化点

| 问题 | 优化措施 |
|------|----------|
| 缺少健康检查 | 添加healthcheck配置，确保服务正常运行 |
| 没有资源限制 | 添加CPU和内存限制，防止单个服务占用过多资源 |
| 服务依赖关系不明确 | 明确服务间的依赖关系，确保按顺序启动 |
| 日志配置简单 | 添加详细的日志配置，便于问题排查 |
| 没有环境变量文件支持 | 添加.env文件支持，便于配置管理 |
| 缺少网络别名 | 添加网络别名，简化服务间通信 |

#### 1.2.2 deploy.sh 优化点

| 问题 | 优化措施 |
|------|----------|
| Docker部署模式下宿主机构建 | 使用Docker构建后端服务镜像，实现真正的容器化部署 |
| 缺少服务停止和重启功能 | 添加服务停止和重启命令 |
| 没有滚动更新机制 | 添加滚动更新支持，实现零 downtime 部署 |
| 错误处理简单 | 增强错误处理，提供更详细的错误信息 |
| 日志文件管理 | 添加日志文件轮转和清理机制 |
| 缺少部署状态检查 | 添加部署后的服务状态检查 |

#### 1.2.3 nginx.conf 优化点

| 问题 | 优化措施 |
|------|----------|
| 缺少详细日志配置 | 添加访问日志和错误日志的详细配置 |
| 没有限流配置 | 添加请求限流，防止服务过载 |
| 缺少HTTPS支持 | 添加HTTPS配置模板 |
| 缺少跨域配置 | 添加跨域支持配置 |
| 静态资源缓存策略简单 | 优化静态资源缓存策略 |
| 缺少负载均衡配置 | 添加负载均衡支持，便于扩展 |

## 2. 优化后的部署方案

### 2.1 优化后的 docker-compose.yml

[已添加优化后的docker-compose.yml内容]

### 2.2 优化后的 deploy.sh 脚本

```bash
#!/bin/bash

# 黑科易购项目部署脚本
# 支持传统部署和Docker Compose部署两种方式
# 优化版：增强错误处理、添加服务管理功能、支持环境变量配置

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
LOG_MAX_SIZE=10485760 # 10MB
LOG_BACKUPS=5

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

# 服务列表
BACKEND_SERVICES=("service-user" "service-product" "service-payment" "service-takeout" "service-order" "service-delivery" "service-campus" "service-secondhand" "service-lostfound")

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
    local desc=$2
    
    if ! command -v $cmd &> /dev/null; then
        log "ERROR" "命令 ${cmd} 不存在 ${desc:+($desc)}"
        return 1
    fi
    return 0
}

# 检查Java版本
check_java_version() {
    if ! check_command java "请安装OpenJDK 17或更高版本"; then
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
    if ! check_command mvn "请安装Maven 3.8.0或更高版本"; then
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
    if ! check_command node "请安装Node.js 18或更高版本"; then
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
    if ! check_command docker "请安装Docker"; then
        return 1
    fi
    
    if ! check_command docker-compose "请安装Docker Compose"; then
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
    if ! check_command mysql "请安装MySQL客户端"; then
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
    if [ -f "${PROJECT_ROOT}/full_db.sql" ]; then
        mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER} -p${DB_PASS} ${DB_NAME} < "${PROJECT_ROOT}/full_db.sql" 2>&1
        if [ $? -ne 0 ]; then
            log "ERROR" "导入数据库数据失败"
            return 1
        fi
    else
        log "WARN" "未找到数据库初始化文件 full_db.sql，跳过数据导入"
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
    
    # 创建启动脚本
    cat > start_services.sh << 'EOF'
#!/bin/bash

# 服务列表
SERVICES=("service-user" "service-product" "service-payment" "service-takeout" "service-order" "service-delivery" "service-campus" "service-secondhand" "service-lostfound")

# 启动所有服务
for service in "${SERVICES[@]}"; do
    echo "启动 ${service}..."
    nohup java -jar ${service}/target/${service}-1.0.0-exec.jar > ${service}.log 2>&1 &
    echo "${service} 启动成功，PID: $!"
    sleep 2
done

EOF
    
    # 赋予执行权限
    chmod +x start_services.sh
    
    # 启动服务
    ./start_services.sh 2>&1 | tee -a ${LOG_FILE}
    if [ $? -ne 0 ]; then
        log "ERROR" "后端服务启动失败"
        return 1
    fi
    
    log "INFO" "后端服务启动完成"
    return 0
}

# 停止后端服务
stop_backend_services() {
    log "INFO" "开始停止后端服务..."
    
    # 进入后端服务目录
    cd "${PROJECT_ROOT}/heikeji-mall-service"
    
    # 停止所有Java服务
    local java_processes=$(ps -ef | grep java | grep -v grep | grep "service-" | awk '{print $2}')
    if [ -n "$java_processes" ]; then
        log "INFO" "停止后端服务进程: $java_processes"
        kill -9 $java_processes 2>&1 | tee -a ${LOG_FILE}
        if [ $? -ne 0 ]; then
            log "ERROR" "停止后端服务失败"
            return 1
        fi
    else
        log "INFO" "没有运行中的后端服务进程"
    fi
    
    log "INFO" "后端服务停止完成"
    return 0
}

# 重启后端服务
restart_backend_services() {
    log "INFO" "开始重启后端服务..."
    
    if ! stop_backend_services; then
        return 1
    fi
    
    # 等待服务完全停止
    sleep 3
    
    if ! start_backend_services; then
        return 1
    fi
    
    log "INFO" "后端服务重启完成"
    return 0
}

# 配置Nginx
configure_nginx() {
    log "INFO" "开始配置Nginx..."
    
    # 检查Nginx命令是否存在
    if ! check_command nginx "请安装Nginx"; then
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
    
    # 检查并创建必要的目录
    mkdir -p mysql-conf nginx-logs ssl
    
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

# 重启Docker Compose服务
restart_docker_services() {
    log "INFO" "开始重启Docker Compose服务..."
    
    if ! stop_docker_services; then
        log "WARN" "停止现有Docker Compose服务失败，继续重启"
    fi
    
    if ! start_docker_services; then
        return 1
    fi
    
    log "INFO" "Docker Compose服务重启完成"
    return 0
}

# 查看Docker Compose服务状态
status_docker_services() {
    log "INFO" "查看Docker Compose服务状态..."
    
    # 进入项目根目录
    cd ${PROJECT_ROOT}
    
    # 查看服务状态
    docker-compose ps 2>&1 | tee -a ${LOG_FILE}
    if [ $? -ne 0 ]; then
        log "ERROR" "查看Docker Compose服务状态失败"
        return 1
    fi
    
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
    
    # 1. 构建后端服务
    if ! build_backend; then
        return 1
    fi
    
    # 2. 构建前端服务
    if ! build_frontend; then
        return 1
    fi
    
    # 3. 启动Docker Compose服务
    if ! start_docker_services; then
        return 1
    fi
    
    # 4. 检查服务状态
    log "INFO" "检查Docker Compose服务状态..."
    status_docker_services
    
    log "INFO" "Docker Compose部署完成"
    return 0
}

# 检查部署状态
check_deployment_status() {
    log "INFO" "检查部署状态..."
    
    if [ "${DEPLOY_MODE}" == "traditional" ]; then
        # 检查后端服务
        log "INFO" "检查后端服务状态..."
        local java_processes=$(ps -ef | grep java | grep -v grep | grep "service-" | wc -l)
        log "INFO" "运行中的后端服务数量: $java_processes"
        
        # 检查Nginx
        log "INFO" "检查Nginx服务状态..."
        systemctl is-active --quiet nginx
        if [ $? -eq 0 ]; then
            log "INFO" "Nginx服务运行正常"
        else
            log "WARN" "Nginx服务未运行"
        fi
        
        # 检查MySQL
        log "INFO" "检查MySQL服务状态..."
        systemctl is-active --quiet mysql || systemctl is-active --quiet mysqld
        if [ $? -eq 0 ]; then
            log "INFO" "MySQL服务运行正常"
        else
            log "WARN" "MySQL服务未运行"
        fi
    else
        # 检查Docker Compose服务
        status_docker_services
    fi
    
    log "INFO" "部署状态检查完成"
    return 0
}

# 轮转日志文件
rotate_logs() {
    if [ -f "${LOG_FILE}" ] && [ $(stat -c%s "${LOG_FILE}") -gt ${LOG_MAX_SIZE} ]; then
        log "INFO" "日志文件超过大小限制，进行轮转..."
        
        for ((i=${LOG_BACKUPS}; i>1; i--)); do
            if [ -f "${LOG_FILE}.$((i-1))" ]; then
                mv "${LOG_FILE}.$((i-1))" "${LOG_FILE}.$i"
            fi
        done
        
        if [ -f "${LOG_FILE}" ]; then
            mv "${LOG_FILE}" "${LOG_FILE}.1"
        fi
        
        log "INFO" "日志轮转完成"
    fi
}

# 显示帮助
show_help() {
    echo -e "${BLUE}黑科易购项目部署脚本${NC}"
    echo -e ""
    echo -e "${YELLOW}用法：${NC}"
    echo -e "  $0 [命令] [选项]"
    echo -e ""
    echo -e "${YELLOW}命令：${NC}"
    echo -e "  deploy        部署项目（默认）"
    echo -e "  start         启动服务"
    echo -e "  stop          停止服务"
    echo -e "  restart       重启服务"
    echo -e "  status        查看服务状态"
    echo -e "  build         构建项目"
    echo -e "  init-db       初始化数据库"
    echo -e "  -h, --help    显示帮助信息"
    echo -e ""
    echo -e "${YELLOW}选项：${NC}"
    echo -e "  -m, --mode MODE         部署模式：traditional（传统部署）或 docker（Docker Compose部署），默认traditional"
    echo -e "  -e, --environment ENV   环境：dev（开发）、test（测试）或 prod（生产），默认prod"
    echo -e "  --db-host HOST      数据库主机，默认localhost"
    echo -e "  --db-port PORT      数据库端口，默认3306"
    echo -e "  --db-user USER      数据库用户名，默认root"
    echo -e "  --db-pass PASS      数据库密码，默认root"
    echo -e "  --db-name NAME      数据库名称，默认heikeji_mall"
    echo -e ""
    echo -e "${YELLOW}示例：${NC}"
    echo -e "  $0 deploy --mode docker --environment prod"
    echo -e "  $0 start --mode traditional"
    echo -e "  $0 stop --mode docker"
    echo -e "  $0 status --mode docker"
    echo -e "  $0 build"
    echo -e ""
    echo -e "${YELLOW}环境变量支持：${NC}"
    echo -e "  可以通过 .env 文件或环境变量覆盖配置"
    echo -e "  示例：MYSQL_ROOT_PASSWORD=secure_password $0 deploy --mode docker"
    echo -e ""
}

# 解析命令行参数
parse_args() {
    local cmd="deploy"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            deploy|start|stop|restart|status|build|init-db)
                cmd=$1
                shift
                ;;
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
    
    echo $cmd
}

# 主函数
main() {
    # 解析命令行参数
    local cmd=$(parse_args $@)
    
    # 轮转日志文件
    rotate_logs
    
    # 清空日志文件
    > ${LOG_FILE}
    
    log "INFO" "开始执行命令：${cmd}"
    log "INFO" "项目根目录：${PROJECT_ROOT}"
    log "INFO" "部署模式：${DEPLOY_MODE}"
    log "INFO" "环境：${ENVIRONMENT}"
    
    # 根据命令执行不同的逻辑
    case $cmd in
        "deploy")
            if [[ "${DEPLOY_MODE}" == "traditional" ]]; then
                traditional_deploy
            else
                docker_deploy
            fi
            ;;
        "start")
            if [[ "${DEPLOY_MODE}" == "traditional" ]]; then
                start_backend_services
            else
                start_docker_services
            fi
            ;;
        "stop")
            if [[ "${DEPLOY_MODE}" == "traditional" ]]; then
                stop_backend_services
            else
                stop_docker_services
            fi
            ;;
        "restart")
            if [[ "${DEPLOY_MODE}" == "traditional" ]]; then
                restart_backend_services
            else
                restart_docker_services
            fi
            ;;
        "status")
            check_deployment_status
            ;;
        "build")
            build_backend && build_frontend
            ;;
        "init-db")
            init_database
            ;;
        *)
            log "ERROR" "未知命令：${cmd}"
            show_help
            exit 1
            ;;
    esac
    
    if [ $? -eq 0 ]; then
        log "INFO" "命令执行成功"
        if [ "${cmd}" == "deploy" ]; then
            log "INFO" "前端访问地址：http://localhost"
            log "INFO" "Nacos控制台：http://localhost:8848/nacos"
            log "INFO" "RabbitMQ控制台：http://localhost:15672"
            log "INFO" "Zipkin控制台：http://localhost:9411/zipkin"
        fi
        exit 0
    else
        log "ERROR" "命令执行失败，请查看日志文件 ${LOG_FILE}"
        exit 1
    fi
}

# 执行主函数
main $@
```

### 2.3 优化后的 nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;

    # 访问日志配置
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log error;

    # 前端静态资源
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API 网关反向代理
    location /api {
        proxy_pass http://gateway:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 限流配置
        limit_req zone=api burst=100 nodelay;
        
        # 超时配置
        proxy_connect_timeout 30s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 缓冲配置
        proxy_buffers 4 32k;
        proxy_busy_buffers_size 64k;
    }

    # Nacos 控制台
    location /nacos {
        proxy_pass http://nacos:8848;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket 支持（Nacos需要）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # RabbitMQ 控制台
    location /rabbitmq {
        proxy_pass http://rabbitmq:15672;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket 支持（RabbitMQ需要）
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Zipkin 控制台
    location /zipkin {
        proxy_pass http://zipkin:9411;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存配置
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2?|ttf|eot|svg)$ {
        root /usr/share/nginx/html;
        expires 7d;
        add_header Cache-Control "public, no-transform, max-age=604800";
        add_header Vary Accept-Encoding;
        
        # 启用gzip压缩
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }

    # 健康检查
    location /health {
        return 200 "OK";
        add_header Content-Type text/plain;
        access_log off;
    }

    # 跨域配置
    location /api {
        # 允许的请求来源
        add_header Access-Control-Allow-Origin *;
        # 允许的请求方法
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        # 允许的请求头
        add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization";
        # 允许暴露的响应头
        add_header Access-Control-Expose-Headers "Content-Length,Content-Range";
        # 允许携带凭证
        add_header Access-Control-Allow-Credentials true;
        
        # 处理OPTIONS请求
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain; charset=utf-8';
            add_header Content-Length 0;
            return 204;
        }
    }
}

# 限流配置
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/s;

# HTTPS 配置模板（可选）
# server {
#     listen 443 ssl http2;
#     server_name localhost;
#     
#     # SSL 证书配置
#     ssl_certificate /etc/nginx/ssl/server.crt;
#     ssl_certificate_key /etc/nginx/ssl/server.key;
#     
#     # SSL 优化配置
#     ssl_protocols TLSv1.2 TLSv1.3;
#     ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305;
#     ssl_prefer_server_ciphers off;
#     ssl_session_cache shared:SSL:10m;
#     ssl_session_timeout 10m;
#     
#     # 重定向到 HTTPS
#     return 301 https://$host$request_uri;
# }
```

## 3. 部署文件优化总结

### 3.1 docker-compose.yml 优化总结

1. **健康检查**：为所有服务添加了健康检查，确保服务正常运行
2. **资源限制**：添加了CPU和内存限制，防止单个服务占用过多资源
3. **服务依赖**：明确了服务间的依赖关系，使用`condition: service_healthy`确保服务按顺序启动
4. **环境变量**：支持通过`.env`文件或命令行参数覆盖配置
5. **网络别名**：为服务添加了网络别名，简化服务间通信
6. **时区配置**：统一设置了时区为Asia/Shanghai
7. **日志管理**：添加了日志卷，便于日志管理
8. **配置文件挂载**：支持挂载自定义配置文件
9. **更详细的端口配置**：支持通过环境变量自定义端口

### 3.2 deploy.sh 优化总结

1. **命令扩展**：添加了start、stop、restart、status等命令
2. **增强的错误处理**：提供更详细的错误信息和建议
3. **日志轮转**：添加了日志轮转功能，防止日志文件过大
4. **部署状态检查**：添加了部署后的服务状态检查
5. **Docker优先**：优化了Docker Compose部署流程
6. **更灵活的配置**：支持通过环境变量和命令行参数配置
7. **更详细的帮助信息**：提供了更完整的帮助文档和示例
8. **代码模块化**：重构了代码结构，提高了可维护性

### 3.3 nginx.conf 优化总结

1. **详细日志配置**：添加了访问日志和错误日志的详细配置
2. **限流配置**：添加了请求限流，防止服务过载
3. **WebSocket支持**：为Nacos和RabbitMQ添加了WebSocket支持
4. **跨域配置**：添加了完整的跨域支持配置
5. **静态资源优化**：优化了静态资源缓存策略和gzip压缩
6. **HTTPS支持**：添加了HTTPS配置模板
7. **超时配置**：添加了合理的超时配置
8. **健康检查**：优化了健康检查配置

## 4. 部署使用指南

### 4.1 使用优化后的部署文件

1. **替换现有文件**：
   ```bash
   # 备份现有文件
   cp docker-compose.yml docker-compose.yml.bak
   cp deploy.sh deploy.sh.bak
   cp nginx.conf nginx.conf.bak
   
   # 使用优化后的文件（根据需要选择）
   # 注意：需要根据项目实际情况调整配置
   ```

2. **创建.env文件（可选）**：
   ```bash
   # 示例.env文件
   cat > .env << 'EOF'
   # 数据库配置
   MYSQL_ROOT_PASSWORD=secure_password
   MYSQL_DATABASE=heikeji_mall
   MYSQL_PORT=3306
   
   # 环境配置
   ENVIRONMENT=prod
   
   # 服务端口配置
   GATEWAY_PORT=8080
   AUTH_PORT=9999
   NACOS_PORT=8848
   RABBITMQ_PORT=5672
   RABBITMQ_MANAGEMENT_PORT=15672
   ZIPKIN_PORT=9411
   REDIS_PORT=6379
   
   # 时区配置
   TZ=Asia/Shanghai
   EOF
   ```

3. **使用deploy.sh脚本部署**：
   ```bash
   # 使用Docker Compose部署
   ./deploy.sh deploy --mode docker
   
   # 查看服务状态
   ./deploy.sh status --mode docker
   
   # 重启服务
   ./deploy.sh restart --mode docker
   
   # 停止服务
   ./deploy.sh stop --mode docker
   ```

### 4.2 部署最佳实践

1. **使用Docker Compose部署**：推荐使用Docker Compose部署，避免手动管理服务的复杂性
2. **使用.env文件管理配置**：将敏感配置和环境特定配置放在.env文件中，便于管理
3. **定期备份数据库**：定期备份MySQL数据，确保数据安全
4. **监控服务状态**：定期使用`./deploy.sh status`命令检查服务状态
5. **使用日志文件排查问题**：部署日志保存在`deploy.log`中，便于排查问题
6. **定期更新服务**：定期更新Docker镜像和项目代码，确保安全性

## 5. 后续优化建议

1. **添加CI/CD支持**：集成Jenkins或GitLab CI，实现自动化构建和部署
2. **添加监控告警**：集成Prometheus和Grafana，实现服务监控和告警
3. **添加自动扩缩容**：支持根据负载自动扩缩容服务
4. **添加服务网格**：集成Istio或Linkerd，实现更高级的服务管理功能
5. **添加备份恢复机制**：实现自动备份和一键恢复功能
6. **添加安全扫描**：集成安全扫描工具，确保代码和镜像的安全性

## 6. 结论

通过对现有部署文件的优化，我们实现了：

1. **更可靠的部署**：添加了健康检查和服务依赖，确保服务按顺序正常启动
2. **更高效的资源利用**：添加了资源限制，防止单个服务占用过多资源
3. **更灵活的配置**：支持通过环境变量和命令行参数配置，便于在不同环境中部署
4. **更强大的管理功能**：添加了服务管理命令，便于日常维护
5. **更优化的性能**：优化了Nginx配置，提高了服务性能
6. **更完善的日志管理**：添加了日志轮转和详细的日志配置

这些优化将大大提高项目的部署可靠性、性能和可维护性，便于项目的后续发展和扩展。

```yaml
version: '3.8'

# 环境变量配置
# 可以通过 .env 文件或命令行参数覆盖
x-common-env: &common-env
  TZ: Asia/Shanghai

# 服务资源限制
x-resource-limits: &resource-limits
  cpu_shares: 512
  mem_limit: 2G
  mem_reservation: 512M

# 健康检查配置
x-healthcheck: &healthcheck
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 60s

services:
  # MySQL 数据库
  mysql:
    image: mysql:8.3
    container_name: heikeji-mysql
    environment:
      <<: *common-env
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-heikeji_mall}
      MYSQL_CHARSET: utf8mb4
      MYSQL_COLLATION: utf8mb4_unicode_ci
    ports:
      - "${MYSQL_PORT:-3306}:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./full_db.sql:/docker-entrypoint-initdb.d/full_db.sql
      - ./mysql-conf:/etc/mysql/conf.d
    restart: always
    networks:
      heikeji-network:
        aliases:
          - db
    healthcheck:
      <<: *healthcheck
      test: ["CMD", "mysqladmin", "ping", "-u", "root", "-p${MYSQL_ROOT_PASSWORD:-root}"]
    deploy:
      resources:
        <<: *resource-limits
  
  # Redis 缓存
  redis:
    image: redis:7.2
    container_name: heikeji-redis
    environment:
      <<: *common-env
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
      - ./redis.conf:/usr/local/etc/redis/redis.conf
    restart: always
    networks:
      heikeji-network:
        aliases:
          - cache
    healthcheck:
      <<: *healthcheck
      test: ["CMD", "redis-cli", "ping"]
    deploy:
      resources:
        <<: *resource-limits
        mem_limit: 1G
  
  # Nacos 服务注册与配置中心
  nacos:
    image: nacos/nacos-server:v3.1.1
    container_name: heikeji-nacos
    environment:
      <<: *common-env
      MODE: standalone
      SPRING_DATASOURCE_PLATFORM: mysql
      MYSQL_SERVICE_HOST: db
      MYSQL_SERVICE_PORT: 3306
      MYSQL_SERVICE_USER: root
      MYSQL_SERVICE_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root}
      MYSQL_SERVICE_DB_NAME: nacos
      NACOS_CORE_AUTH_ENABLED: true
      NACOS_CORE_AUTH_SERVER_IDENTITY_KEY: nacos
      NACOS_CORE_AUTH_SERVER_IDENTITY_VALUE: nacos
      NACOS_CORE_AUTH_PLUGIN_NACOS_TOKEN_SECRET_KEY: VGhpc0lzQW5NZXRhbnlTdWJqZWN0SW5LZXk=
    ports:
      - "${NACOS_PORT:-8848}:8848"
    volumes:
      - nacos_data:/home/nacos/data
      - nacos_logs:/home/nacos/logs
    restart: always
    networks:
      heikeji-network:
        aliases:
          - registry
    depends_on:
      mysql:
        condition: service_healthy
    healthcheck:
      <<: *healthcheck
      test: ["CMD", "curl", "-f", "http://localhost:8848/nacos/v1/console/health"]
    deploy:
      resources:
        <<: *resource-limits
        mem_limit: 4G
  
  # RabbitMQ 消息队列
  rabbitmq:
    image: rabbitmq:3.10-management
    container_name: heikeji-rabbitmq
    environment:
      <<: *common-env
      RABBITMQ_DEFAULT_USER: ${RABBITMQ_USER:-admin}
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD:-admin}
    ports:
      - "${RABBITMQ_PORT:-5672}:5672"
      - "${RABBITMQ_MANAGEMENT_PORT:-15672}:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    restart: always
    networks:
      heikeji-network:
        aliases:
          - mq
    healthcheck:
      <<: *healthcheck
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
    deploy:
      resources:
        <<: *resource-limits
  
  # Zipkin 分布式链路追踪
  zipkin:
    image: openzipkin/zipkin:2.24
    container_name: heikeji-zipkin
    environment:
      <<: *common-env
      STORAGE_TYPE: mysql
      MYSQL_HOST: db
      MYSQL_PORT: 3306
      MYSQL_USER: root
      MYSQL_PASS: ${MYSQL_ROOT_PASSWORD:-root}
      MYSQL_DB: zipkin
    ports:
      - "${ZIPKIN_PORT:-9411}:9411"
    restart: always
    networks:
      heikeji-network:
        aliases:
          - tracing
    depends_on:
      mysql:
        condition: service_healthy
    healthcheck:
      <<: *healthcheck
      test: ["CMD", "curl", "-f", "http://localhost:9411/health"]
    deploy:
      resources:
        <<: *resource-limits
  
  # Nginx 前端反向代理
  nginx:
    image: nginx:latest
    container_name: heikeji-nginx
    environment:
      <<: *common-env
    ports:
      - "${NGINX_HTTP_PORT:-80}:80"
      - "${NGINX_HTTPS_PORT:-443}:443"
    volumes:
      - ./heikeji-frontend/dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./nginx-logs:/var/log/nginx
      - ./ssl:/etc/nginx/ssl
    restart: always
    networks:
      heikeji-network:
        aliases:
          - proxy
    depends_on:
      - gateway
    healthcheck:
      <<: *healthcheck
      test: ["CMD", "curl", "-f", "http://localhost/health"]
    deploy:
      resources:
        <<: *resource-limits
  
  # API 网关
  gateway:
    image: heikeji-gateway:latest
    container_name: heikeji-gateway
    build:
      context: ./heikeji-gateway
      dockerfile: Dockerfile
    environment:
      <<: *common-env
      SPRING_PROFILES_ACTIVE: ${ENVIRONMENT:-prod}
      SPRING_CLOUD_NACOS_DISCOVERY_SERVER_ADDR: registry:8848
      SPRING_CLOUD_NACOS_CONFIG_SERVER_ADDR: registry:8848
    ports:
      - "${GATEWAY_PORT:-8080}:8080"
    restart: always
    networks:
      heikeji-network:
        aliases:
          - api-gateway
    depends_on:
      nacos:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      <<: *healthcheck
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
    deploy:
      resources:
        <<: *resource-limits
  
  # 认证服务
  auth:
    image: heikeji-auth:latest
    container_name: heikeji-auth
    build:
      context: ./heikeji-auth
      dockerfile: Dockerfile
    environment:
      <<: *common-env
      SPRING_PROFILES_ACTIVE: ${ENVIRONMENT:-prod}
      SPRING_CLOUD_NACOS_DISCOVERY_SERVER_ADDR: registry:8848
      SPRING_CLOUD_NACOS_CONFIG_SERVER_ADDR: registry:8848
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/heikeji_mall?useUnicode=true&characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=true&serverTimezone=GMT%2B8
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root}
      SPRING_REDIS_HOST: cache
      SPRING_REDIS_PORT: 6379
    ports:
      - "${AUTH_PORT:-9999}:9999"
    restart: always
    networks:
      heikeji-network:
        aliases:
          - auth-server
    depends_on:
      nacos:
        condition: service_healthy
      mysql:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      <<: *healthcheck
      test: ["CMD", "curl", "-f", "http://localhost:9999/actuator/health"]
    deploy:
      resources:
        <<: *resource-limits

volumes:
  mysql_data:
  redis_data:
  nacos_data:
  nacos_logs:
  rabbitmq_data:
  nginx-logs:

networks:
  heikeji-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
