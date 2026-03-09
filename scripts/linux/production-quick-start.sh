#!/bin/bash

# HKYG生产环境快速启动脚本
# 一键启动所有必要的服务

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

# 检查Java
check_java() {
    log_info "检查Java环境..."
    if ! command -v java &> /dev/null; then
        log_error "Java未安装或不在PATH中"
        exit 1
    fi
    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
    log_success "Java版本: $JAVA_VERSION"
}

# 检查Maven
check_maven() {
    log_info "检查Maven环境..."
    if ! command -v mvn &> /dev/null; then
        log_error "Maven未安装或不在PATH中"
        exit 1
    fi
    MAVEN_VERSION=$(mvn -version 2>&1 | grep "Apache Maven" | awk '{print $3}')
    log_success "Maven版本: $MAVEN_VERSION"
}

# 检查MySQL
check_mysql() {
    log_info "检查MySQL..."
    if command -v mysql &> /dev/null; then
        if mysql -u root -p"Mysql@8Root!2025" -h localhost -P 3306 -e "SELECT 1;" &> /dev/null; then
            log_success "MySQL连接正常"
            return 0
        fi
    fi
    log_warn "MySQL连接检查失败，请确保MySQL已启动并配置正确"
    log_warn "默认配置: localhost:3306, 用户: root, 密码: Mysql@8Root!2025"
}

# 检查Redis
check_redis() {
    log_info "检查Redis..."
    if command -v redis-cli &> /dev/null; then
        if redis-cli -h localhost -p 6379 ping &> /dev/null; then
            log_success "Redis连接正常"
            return 0
        fi
    fi
    log_warn "Redis连接检查失败，请确保Redis已启动"
    log_warn "默认配置: localhost:6379"
}

# 初始化数据库
init_database() {
    log_info "检查数据库初始化..."
    
    if [ ! -f "sql/root_scripts/init/full_db.sql" ]; then
        log_warn "未找到完整的数据库初始化脚本"
        return 0
    fi
    
    log_info "数据库初始化脚本存在，如需初始化请手动执行"
    log_info "命令: mysql -u root -p < sql/root_scripts/init/full_db.sql"
}

# 编译后端
compile_backend() {
    log_info "编译后端服务..."
    
    if [ -f "pom.xml" ]; then
        log_info "正在编译，这可能需要几分钟..."
        if mvn clean package -DskipTests -q; then
            log_success "后端编译成功"
        else
            log_error "后端编译失败"
            exit 1
        fi
    else
        log_warn "未找到pom.xml，跳过编译"
    fi
}

# 启动服务
start_services() {
    log_info "准备启动服务..."
    echo ""
    echo "=========================================="
    echo "服务启动说明"
    echo "=========================================="
    echo ""
    echo "由于使用微服务架构，推荐按以下顺序启动："
    echo ""
    echo "1. 基础设施（必需）"
    echo "   - MySQL (端口: 3306)"
    echo "   - Redis (端口: 6379)"
    echo ""
    echo "2. 核心服务"
    echo "   - Gateway (端口: 9999)"
    echo "   - User (端口: 8081)"
    echo "   - Product (端口: 8082)"
    echo "   - Order (端口: 8083)"
    echo ""
    echo "3. 业务服务（可选）"
    echo "   - Campus (端口: 8003)"
    echo "   - Payment (端口: 8004)"
    echo "   - Takeout (端口: 8005)"
    echo "   - Secondhand (端口: 8006)"
    echo "   - Lostfound (端口: 8007)"
    echo "   - Member (端口: 8088)"
    echo "   - Delivery (端口: 8001)"
    echo ""
    echo "4. 管理后台"
    echo "   - Admin (端口: 8090)"
    echo ""
    echo "=========================================="
    echo ""
    log_info "服务已配置为单机模式（Nacos已禁用）"
    log_info "可以直接使用 java -jar 命令启动各个服务"
    echo ""
}

# 显示快速启动命令
show_start_commands() {
    echo ""
    echo "=========================================="
    echo "快速启动命令示例"
    echo "=========================================="
    echo ""
    echo "# 启动Gateway（API网关）"
    echo "cd heikeji-gateway"
    echo "mvn spring-boot:run"
    echo ""
    echo "# 或直接运行JAR包（如果已编译）"
    echo "java -jar heikeji-gateway/target/heikeji-gateway-*.jar"
    echo ""
    echo "# 启动用户服务"
    echo "cd heikeji-mall-service/service-user"
    echo "mvn spring-boot:run"
    echo ""
    echo "# 启动商品服务"
    echo "cd heikeji-mall-service/service-product"
    echo "mvn spring-boot:run"
    echo ""
    echo "# 启动订单服务"
    echo "cd heikeji-mall-service/service-order"
    echo "mvn spring-boot:run"
    echo ""
    echo "=========================================="
    echo ""
}

# 显示健康检查命令
show_health_check() {
    echo ""
    echo "=========================================="
    echo "健康检查命令"
    echo "=========================================="
    echo ""
    echo "# 运行完整健康检查"
    echo "./scripts/linux/production-health-check.sh"
    echo ""
    echo "# 检查特定端口"
    echo "./scripts/linux/production-health-check.sh port 8080"
    echo ""
    echo "=========================================="
    echo ""
}

# 前端启动
start_frontend() {
    log_info "检查前端项目..."
    
    if [ -d "heikeji-frontend" ]; then
        echo ""
        echo "=========================================="
        echo "前端启动说明"
        echo "=========================================="
        echo ""
        echo "# 安装依赖"
        echo "cd heikeji-frontend"
        echo "npm install"
        echo ""
        echo "# 启动开发服务器"
        echo "npm run dev"
        echo ""
        echo "# 构建生产版本"
        echo "npm run build"
        echo ""
        echo "=========================================="
        echo ""
    fi
}

# 主函数
main() {
    echo ""
    echo "=========================================="
    echo "  HKYG生产环境快速启动向导"
    echo "=========================================="
    echo ""
    
    case "${1:-setup}" in
        setup)
            log_info "开始环境检查..."
            echo ""
            
            check_java
            check_maven
            check_mysql
            check_redis
            init_database
            
            echo ""
            log_success "环境检查完成！"
            echo ""
            
            start_services
            show_start_commands
            show_health_check
            start_frontend
            
            log_info "快速启动向导完成！"
            log_info "请参考上述命令启动各个服务"
            ;;
        compile)
            check_java
            check_maven
            compile_backend
            ;;
        health)
            if [ -x "scripts/linux/production-health-check.sh" ]; then
                chmod +x scripts/linux/production-health-check.sh
                scripts/linux/production-health-check.sh
            else
                log_error "健康检查脚本不存在或不可执行"
            fi
            ;;
        help)
            echo "HKYG生产环境快速启动工具"
            echo ""
            echo "用法: $0 [命令]"
            echo ""
            echo "命令:"
            echo "  setup   - 环境检查和启动向导（默认）"
            echo "  compile - 编译后端服务"
            echo "  health  - 运行健康检查"
            echo "  help    - 显示帮助信息"
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
