#!/bin/bash

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "========================================="
echo "  黑科易购项目停止脚本"
echo "========================================="
echo ""

stop_service() {
    SERVICE_NAME=$1
    SERVICE_PID=$2
    
    if [ -n "$SERVICE_PID" ]; then
        echo "正在停止 $SERVICE_NAME (PID: $SERVICE_PID)..."
        kill -15 "$SERVICE_PID" 2>/dev/null
        
        sleep 3
        
        if ps -p "$SERVICE_PID" > /dev/null 2>&1; then
            echo "强制停止 $SERVICE_NAME..."
            kill -9 "$SERVICE_PID" 2>/dev/null
        fi
        
        echo "✓ $SERVICE_NAME 已停止"
    else
        echo "⚠ $SERVICE_NAME 未运行"
    fi
}

stop_backend_services() {
    echo ""
    echo "========================================="
    echo "  停止后端服务"
    echo "========================================="
    echo ""
    
    cd "$PROJECT_DIR"
    
    SERVICES=("heikeji-system" "heikeji-gateway" "heikeji-admin" 
              "heikeji-mall-service/service-user" "heikeji-mall-service/service-product" 
              "heikeji-mall-service/service-order" "heikeji-mall-service/service-payment" 
              "heikeji-mall-service/service-member")
    
    for SERVICE in "${SERVICES[@]}"; do
        if [ -d "$PROJECT_DIR/$SERVICE" ]; then
            SERVICE_NAME=$(basename "$SERVICE")
            PID_FILE="$PROJECT_DIR/$SERVICE/${SERVICE_NAME}.pid"
            
            if [ -f "$PID_FILE" ]; then
                PID=$(cat "$PID_FILE")
                stop_service "$SERVICE_NAME" "$PID"
                rm -f "$PID_FILE"
            else
                echo "⚠ $SERVICE_NAME 未找到 PID 文件"
            fi
        fi
    done
    
    echo ""
    echo "清理进程..."
    pkill -f "heikeji-.*\.jar" 2>/dev/null
    pkill -f "nacos-server" 2>/dev/null
    
    echo "✓ 后端服务已全部停止"
}

stop_frontend_service() {
    echo ""
    echo "========================================="
    echo "  停止前端服务"
    echo "========================================="
    echo ""
    
    cd "$PROJECT_DIR/heikeji-frontend" || exit 1
    
    PID_FILE="$PROJECT_DIR/heikeji-frontend/frontend.pid"
    
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        stop_service "前端服务" "$PID"
        rm -f "$PID_FILE"
    else
        echo "⚠ 前端服务未找到 PID 文件"
    fi
    
    echo ""
    echo "清理 Node.js 进程..."
    pkill -f "vite" 2>/dev/null
    pkill -f "node.*heikeji-frontend" 2>/dev/null
    
    echo "✓ 前端服务已停止"
}

stop_all() {
    stop_backend_services
    stop_frontend_service
    
    echo ""
    echo "========================================="
    echo "  所有服务已停止"
    echo "========================================="
}

show_menu() {
    echo "========================================="
    echo "  黑科易购项目停止菜单"
    echo "========================================="
    echo ""
    echo "请选择操作："
    echo "  1) 停止全部服务"
    echo "  2) 仅停止后端服务"
    echo "  3) 仅停止前端服务"
    echo "  0) 退出"
    echo ""
    read -p "请输入选项 [0-3]: " choice
    
    case $choice in
        1)
            stop_all
            ;;
        2)
            stop_backend_services
            ;;
        3)
            stop_frontend_service
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
            stop_all
            ;;
        backend)
            stop_backend_services
            ;;
        frontend)
            stop_frontend_service
            ;;
        *)
            echo "用法: $0 [all|backend|frontend]"
            echo ""
            echo "选项："
            echo "  all      - 停止全部服务"
            echo "  backend  - 仅停止后端服务"
            echo "  frontend - 仅停止前端服务"
            exit 1
            ;;
    esac
fi
