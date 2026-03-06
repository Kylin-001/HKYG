#!/bin/bash

# API文档快速访问脚本
# 用于快速访问和测试API文档

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API文档中心地址
API_DOCS_URL="http://localhost:8089"
SWAGGER_UI_URL="${API_DOCS_URL}/swagger-ui.html"
API_DOCS_JSON="${API_DOCS_URL}/v3/api-docs"

# 服务端口映射
declare -A SERVICES=(
    ["用户服务"]="8081"
    ["商品服务"]="8082"
    ["订单服务"]="8083"
    ["配送服务"]="8001"
    ["外卖服务"]="8005"
    ["支付服务"]="8004"
    ["校园服务"]="8003"
    ["二手服务"]="8006"
    ["失物招领"]="8007"
    ["会员服务"]="8088"
    ["系统管理"]="8090"
)

# 打印标题
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}    黑科易购API文档快速访问工具${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# 打印菜单
print_menu() {
    echo -e "${GREEN}请选择操作：${NC}"
    echo "1. 打开API文档中心（Swagger UI）"
    echo "2. 获取API文档JSON"
    echo "3. 获取API文档中心信息"
    echo "4. 获取服务列表"
    echo "5. 获取联系信息"
    echo "6. 健康检查"
    echo "7. 打开指定服务的独立文档"
    echo "8. 测试API接口"
    echo "9. 生成API文档测试报告"
    echo "0. 退出"
    echo ""
}

# 检查服务是否运行
check_service() {
    local url=$1
    local name=$2
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|302"; then
        echo -e "${GREEN}✓${NC} $name 运行正常"
        return 0
    else
        echo -e "${RED}✗${NC} $name 未运行"
        return 1
    fi
}

# 打开浏览器
open_browser() {
    local url=$1
    
    # 检测操作系统
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "$url"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v xdg-open > /dev/null; then
            xdg-open "$url"
        elif command -v gnome-open > /dev/null; then
            gnome-open "$url"
        else
            echo -e "${YELLOW}无法自动打开浏览器，请手动访问：${NC}"
            echo "$url"
        fi
    else
        echo -e "${YELLOW}无法自动打开浏览器，请手动访问：${NC}"
        echo "$url"
    fi
}

# 获取API文档JSON
get_api_docs_json() {
    echo -e "${BLUE}正在获取API文档JSON...${NC}"
    echo ""
    curl -s "$API_DOCS_JSON" | jq '.' 2>/dev/null || curl -s "$API_DOCS_JSON"
}

# 获取API文档中心信息
get_api_docs_info() {
    echo -e "${BLUE}正在获取API文档中心信息...${NC}"
    echo ""
    curl -s "${API_DOCS_URL}/api/docs/info" | jq '.' 2>/dev/null || curl -s "${API_DOCS_URL}/api/docs/info"
}

# 获取服务列表
get_services() {
    echo -e "${BLUE}正在获取服务列表...${NC}"
    echo ""
    curl -s "${API_DOCS_URL}/api/docs/services" | jq '.' 2>/dev/null || curl -s "${API_DOCS_URL}/api/docs/services"
}

# 获取联系信息
get_contact_info() {
    echo -e "${BLUE}正在获取联系信息...${NC}"
    echo ""
    curl -s "${API_DOCS_URL}/api/docs/contact" | jq '.' 2>/dev/null || curl -s "${API_DOCS_URL}/api/docs/contact"
}

# 健康检查
health_check() {
    echo -e "${BLUE}正在执行健康检查...${NC}"
    echo ""
    
    # 检查API文档中心
    check_service "$API_DOCS_URL/api/docs/health" "API文档中心"
    
    echo ""
    echo -e "${BLUE}检查各微服务状态：${NC}"
    for service in "${!SERVICES[@]}"; do
        port="${SERVICES[$service]}"
        check_service "http://localhost:${port}/actuator/health" "$service"
    done
}

# 打开指定服务的独立文档
open_service_docs() {
    echo -e "${GREEN}可用服务：${NC}"
    local i=1
    for service in "${!SERVICES[@]}"; do
        echo "$i. $service (端口: ${SERVICES[$service]})"
        ((i++))
    done
    echo ""
    
    read -p "请选择服务编号: " choice
    
    local i=1
    for service in "${!SERVICES[@]}"; do
        if [ "$i" -eq "$choice" ]; then
            local port="${SERVICES[$service]}"
            local url="http://localhost:${port}/swagger-ui.html"
            echo -e "${BLUE}正在打开 $service 的API文档...${NC}"
            open_browser "$url"
            break
        fi
        ((i++))
    done
}

# 测试API接口
test_api() {
    echo -e "${BLUE}API接口测试${NC}"
    echo ""
    
    # 测试用户登录
    echo -e "${YELLOW}测试用户登录接口...${NC}"
    echo "POST http://localhost:8089/v3/api-docs/service-user/api/user/login"
    echo "请求体："
    echo '{'
    echo '  "username": "testuser",'
    echo '  "password": "password123"'
    echo '}'
    echo ""
    
    read -p "是否执行测试？(y/n): " confirm
    if [ "$confirm" = "y" ]; then
        response=$(curl -s -X POST "${API_DOCS_URL}/v3/api-docs/service-user/api/user/login" \
            -H "Content-Type: application/json" \
            -d '{"username":"testuser","password":"password123"}')
        echo -e "${GREEN}响应：${NC}"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
    fi
    
    echo ""
    
    # 测试商品查询
    echo -e "${YELLOW}测试商品查询接口...${NC}"
    echo "GET http://localhost:8089/v3/api-docs/service-product/api/product/page?pageNo=1&pageSize=10"
    echo ""
    
    read -p "是否执行测试？(y/n): " confirm
    if [ "$confirm" = "y" ]; then
        response=$(curl -s -X GET "${API_DOCS_URL}/v3/api-docs/service-product/api/product/page?pageNo=1&pageSize=10")
        echo -e "${GREEN}响应：${NC}"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
    fi
}

# 生成API文档测试报告
generate_test_report() {
    echo -e "${BLUE}正在生成API文档测试报告...${NC}"
    echo ""
    
    local report_file="api_docs_test_report_$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "=========================================="
        echo "    黑科易购API文档测试报告"
        echo "=========================================="
        echo "生成时间: $(date '+%Y-%m-%d %H:%M:%S')"
        echo ""
        
        echo "1. API文档中心信息"
        echo "----------------------------------------"
        curl -s "${API_DOCS_URL}/api/docs/info"
        echo ""
        echo ""
        
        echo "2. 服务列表"
        echo "----------------------------------------"
        curl -s "${API_DOCS_URL}/api/docs/services"
        echo ""
        echo ""
        
        echo "3. 健康检查"
        echo "----------------------------------------"
        curl -s "${API_DOCS_URL}/api/docs/health"
        echo ""
        echo ""
        
        echo "4. 联系信息"
        echo "----------------------------------------"
        curl -s "${API_DOCS_URL}/api/docs/contact"
        echo ""
        echo ""
        
        echo "=========================================="
        echo "    报告结束"
        echo "=========================================="
    } > "$report_file"
    
    echo -e "${GREEN}测试报告已生成：${NC}$report_file"
    echo ""
}

# 主循环
main() {
    print_header
    
    while true; do
        print_menu
        read -p "请输入选项: " choice
        
        case $choice in
            1)
                echo -e "${BLUE}正在打开API文档中心...${NC}"
                open_browser "$SWAGGER_UI_URL"
                ;;
            2)
                get_api_docs_json
                ;;
            3)
                get_api_docs_info
                ;;
            4)
                get_services
                ;;
            5)
                get_contact_info
                ;;
            6)
                health_check
                ;;
            7)
                open_service_docs
                ;;
            8)
                test_api
                ;;
            9)
                generate_test_report
                ;;
            0)
                echo -e "${GREEN}再见！${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}无效选项，请重新选择${NC}"
                ;;
        esac
        
        echo ""
        read -p "按Enter键继续..."
        clear
        print_header
    done
}

# 检查jq是否安装
if ! command -v jq > /dev/null; then
    echo -e "${YELLOW}警告：未安装jq工具，JSON格式化功能将不可用${NC}"
    echo "安装命令：sudo apt-get install jq (Ubuntu/Debian)"
    echo "           sudo yum install jq (CentOS/RHEL)"
    echo "           brew install jq (macOS)"
    echo ""
fi

# 启动主程序
main
