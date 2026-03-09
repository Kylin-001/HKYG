#!/bin/bash

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "========================================="
echo "  黑科易购项目启动脚本"
echo "========================================="
echo ""

check_java() {
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | awk -F '.' '{print $1}')
        echo "✓ Java 版本: $JAVA_VERSION"
        if [ "$JAVA_VERSION" -lt 17 ]; then
            echo "✗ Java 版本过低，需要 Java 17 或更高版本"
            exit 1
        fi
    else
        echo "✗ 未安装 Java，请先安装 Java 17 或更高版本"
        exit 1
    fi
}

check_maven() {
    if command -v mvn &> /dev/null; then
        MVN_VERSION=$(mvn -version | awk -F ' ' '{print $3}' | sed 's/-SNAPSHOT//')
        echo "✓ Maven 版本: $MVN_VERSION"
    else
        echo "✗ 未安装 Maven，请先安装 Maven"
        exit 1
    fi
}

check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        echo "✓ Node.js 版本: $NODE_VERSION"
    else
        echo "✗ 未安装 Node.js，请先安装 Node.js"
        exit 1
    fi
}

check_mysql() {
    if command -v mysql &> /dev/null; then
        MYSQL_VERSION=$(mysql --version | awk -F ' ' '{print $5}' | sed 's/,//')
        echo "✓ MySQL 版本: $MYSQL_VERSION"
    else
        echo "⚠ 未检测到 MySQL 命令，请确保 MySQL 已安装并运行"
    fi
}

check_redis() {
    if command -v redis-cli &> /dev/null; then
        if redis-cli ping &> /dev/null; then
            REDIS_VERSION=$(redis-cli --version | awk '{print $2}')
            echo "✓ Redis 版本: $REDIS_VERSION (运行中)"
        else
            echo "⚠ Redis 未运行，请先启动 Redis"
        fi
    else
        echo "⚠ 未检测到 Redis 命令，请确保 Redis 已安装并运行"
    fi
}

start_backend() {
    echo ""
    echo "========================================="
    echo "  启动后端服务"
    echo "========================================="
    echo ""
    
    cd "$PROJECT_DIR"
    
    echo "正在编译项目..."
    mvn clean package -DskipTests
    
    if [ $? -ne 0 ]; then
        echo "✗ 项目编译失败"
        exit 1
    fi
    
    echo "✓ 项目编译成功"
    echo ""
    
    echo "启动 Nacos..."
    cd "$PROJECT_DIR/heikeji-system" || exit 1
    nohup java -jar target/heikeji-system-1.0.0.jar > nacos.log 2>&1 &
    NACOS_PID=$!
    echo "✓ Nacos 已启动 (PID: $NACOS_PID)"
    echo "   日志文件: nacos.log"
    sleep 10
    
    echo "启动 Gateway..."
    cd "$PROJECT_DIR/heikeji-gateway" || exit 1
    nohup java -jar target/heikeji-gateway-1.0.0.jar > gateway.log 2>&1 &
    GATEWAY_PID=$!
    echo "✓ Gateway 已启动 (PID: $GATEWAY_PID)"
    echo "   日志文件: gateway.log"
    sleep 5
    
    echo "启动 Admin 服务..."
    cd "$PROJECT_DIR/heikeji-admin" || exit 1
    nohup java -jar target/heikeji-admin-1.0.0.jar > admin.log 2>&1 &
    ADMIN_PID=$!
    echo "✓ Admin 服务已启动 (PID: $ADMIN_PID)"
    echo "   日志文件: admin.log"
    sleep 3
    
    echo "启动服务模块..."
    SERVICES=("heikeji-mall-service/service-user" "heikeji-mall-service/service-product" "heikeji-mall-service/service-order" "heikeji-mall-service/service-payment" "heikeji-mall-service/service-member")
    
    for SERVICE in "${SERVICES[@]}"; do
        if [ -d "$PROJECT_DIR/$SERVICE" ]; then
            SERVICE_NAME=$(basename "$SERVICE")
            cd "$PROJECT_DIR/$SERVICE" || exit 1
            
            if [ -f "target/${SERVICE_NAME}-1.0.0.jar" ]; then
                nohup java -jar "target/${SERVICE_NAME}-1.0.0.jar" > "${SERVICE_NAME}.log" 2>&1 &
                SERVICE_PID=$!
                echo "✓ $SERVICE_NAME 已启动 (PID: $SERVICE_PID)"
                echo "   日志文件: ${SERVICE_NAME}.log"
                sleep 2
            else
                echo "⚠ $SERVICE_NAME 未找到 JAR 文件，跳过"
            fi
        fi
    done
    
    echo ""
    echo "========================================="
    echo "  后端服务启动完成"
    echo "========================================="
    echo ""
    echo "服务列表："
    echo "  - Nacos (PID: $NACOS_PID)"
    echo "  - Gateway (PID: $GATEWAY_PID)"
    echo "  - Admin (PID: $ADMIN_PID)"
    echo "  - User Service"
    echo "  - Product Service"
    echo "  - Order Service"
    echo "  - Payment Service"
    echo "  - Member Service"
    echo ""
    echo "查看日志："
    echo "  tail -f heikeji-system/nacos.log"
    echo "  tail -f heikeji-gateway/gateway.log"
    echo "  tail -f heikeji-admin/admin.log"
    echo "  tail -f heikeji-mall-service/service-*/service-*.log"
    echo ""
    echo "停止服务："
    echo "  ./stop-all.sh"
}

start_frontend() {
    echo ""
    echo "========================================="
    echo "  启动前端服务"
    echo "========================================="
    echo ""
    
    cd "$PROJECT_DIR/heikeji-frontend" || exit 1
    
    echo "检查 Node.js 依赖..."
    if [ ! -d "node_modules" ]; then
        echo "安装依赖..."
        npm install
        if [ $? -ne 0 ]; then
            echo "✗ 依赖安装失败"
            exit 1
        fi
    fi
    
    echo "✓ 依赖检查完成"
    echo ""
    
    echo "启动开发服务器..."
    nohup npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "✓ 前端服务已启动 (PID: $FRONTEND_PID)"
    echo "   日志文件: frontend.log"
    echo ""
    echo "访问地址："
    echo "  http://localhost:5173"
    echo ""
    echo "查看日志："
    echo "  tail -f heikeji-frontend/frontend.log"
}

start_all() {
    echo "检查系统环境..."
    check_java
    check_maven
    check_mysql
    check_redis
    
    echo ""
    echo "是否启动前端服务？(y/n)"
    read -r START_FRONTEND
    
    if [ "$START_FRONTEND" = "y" ] || [ "$START_FRONTEND" = "Y" ]; then
        check_node
        start_backend
        start_frontend
    else
        start_backend
    fi
}

show_menu() {
    echo "========================================="
    echo "  黑科易购项目启动菜单"
    echo "========================================="
    echo ""
    echo "请选择操作："
    echo "  1) 启动全部服务（后端 + 前端）"
    echo "  2) 仅启动后端服务"
    echo "  3) 仅启动前端服务"
    echo "  4) 检查系统环境"
    echo "  0) 退出"
    echo ""
    read -p "请输入选项 [0-4]: " choice
    
    case $choice in
        1)
            start_all
            ;;
        2)
            start_backend
            ;;
        3)
            check_node
            start_frontend
            ;;
        4)
            check_java
            check_maven
            check_node
            check_mysql
            check_redis
            ;;
        0)
            echo "退出"
            exit 0
            ;;
        *)
            echo "无效选项"
            exit 1
            ;;
    esac
}

if [ $# -eq 0 ]; then
    show_menu
else
    case $1 in
        all)
            start_all
            ;;
        backend)
            start_backend
            ;;
        frontend)
            check_node
            start_frontend
            ;;
        check)
            check_java
            check_maven
            check_node
            check_mysql
            check_redis
            ;;
        *)
            echo "用法: $0 [all|backend|frontend|check]"
            echo ""
            echo "选项："
            echo "  all      - 启动全部服务"
            echo "  backend  - 仅启动后端服务"
            echo "  frontend - 仅启动前端服务"
            echo "  check    - 检查系统环境"
            exit 1
            ;;
    esac
fi
