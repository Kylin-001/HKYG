#!/bin/bash

# 服务健康检查脚本
# 用于检查所有微服务的运行状态和健康情况

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印标题
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}    服务健康检查工具${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# 检查端口是否被占用
check_port() {
    local port=$1
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        return 0
    elif ss -tuln 2>/dev/null | grep -q ":$port "; then
        return 0
    else
        return 1
    fi
}

# 检查服务健康状态
check_service_health() {
    local name=$1
    local port=$2
    local url="http://localhost:${port}/actuator/health"
    
    # 尝试访问健康检查端点
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 3 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        echo -e "${GREEN}✓${NC} $name (端口: $port) - 健康状态: 正常"
        return 0
    elif [ "$response" = "404" ]; then
        # 404表示服务运行但健康检查端点不存在
        if check_port "$port"; then
            echo -e "${YELLOW}⚠${NC} $name (端口: $port) - 健康状态: 运行中（无健康检查端点）"
            return 0
        else
            echo -e "${RED}✗${NC} $name (端口: $port) - 健康状态: 未运行"
            return 1
        fi
    else
        if check_port "$port"; then
            echo -e "${YELLOW}⚠${NC} $name (端口: $port) - 健康状态: 运行中（健康检查失败）"
            return 0
        else
            echo -e "${RED}✗${NC} $name (端口: $port) - 健康状态: 未运行"
            return 1
        fi
    fi
}

# 检查所有服务
check_all_services() {
    echo -e "${BLUE}检查所有服务状态...${NC}"
    echo ""
    
    local total=0
    local running=0
    local failed=0
    
    # 检查Gateway
    if check_service_health "Gateway" "8080"; then running=$((running + 1)); else failed=$((failed + 1)); fi
    total=$((total + 1))
    
    # 检查用户服务
    if check_service_health "用户服务" "8081"; then running=$((running + 1)); else failed=$((failed + 1)); fi
    total=$((total + 1))
    
    # 检查商品服务
    if check_service_health "商品服务" "8082"; then running=$((running + 1)); else failed=$((failed + 1)); fi
    total=$((total + 1))
    
    # 检查订单服务
    if check_service_health "订单服务" "8083"; then running=$((running + 1)); else failed=$((failed + 1)); fi
    total=$((total + 1))
    
    # 检查配送服务
    if check_service_health "配送服务" "8001"; then running=$((running + 1)); else failed=$((failed + 1)); fi
    total=$((total + 1))
    
    # 检查校园服务
    if check_service_health "校园服务" "8003"; then running=$((running + 1)); else failed=$((failed + 1)); fi
    total=$((total + 1))
    
    # 检查支付服务
    if check_service_health "支付服务" "8004"; then running=$((running + 1)); else failed=$((failed + 1)); fi
    total=$((total + 1))
    
    # 检查外卖服务
    if check_service_health "外卖服务" "8005"; then running=$((running + 1)); else failed=$((failed + 1)); fi
    total=$((total + 1))
    
    # 检查二手服务
    if check_service_health "二手服务" "8006"; then running=$((running + 1)); else failed=$((failed + 1)); fi
    total=$((total + 1))
    
    # 检查失物招领
    if check_service_health "失物招领" "8007"; then running=$((running + 1)); else failed=$((failed + 1)); fi
    total=$((total + 1))
    
    # 检查会员服务
    if check_service_health "会员服务" "8088"; then running=$((running + 1)); else failed=$((failed + 1)); fi
    total=$((total + 1))
    
    # 检查API文档
    if check_service_health "API文档" "8089"; then running=$((running + 1)); else failed=$((failed + 1)); fi
    total=$((total + 1))
    
    # 检查系统管理
    if check_service_health "系统管理" "8090"; then running=$((running + 1)); else failed=$((failed + 1)); fi
    total=$((total + 1))
    
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}检查结果汇总${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo -e "总服务数: $total"
    echo -e "${GREEN}运行中: $running${NC}"
    echo -e "${RED}未运行: $failed${NC}"
    echo ""
    
    return $failed
}

# 检查依赖服务
check_dependencies() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}检查依赖服务${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    # 检查MySQL
    echo -n "MySQL (3306): "
    if check_port 3306; then
        echo -e "${GREEN}✓ 运行中${NC}"
    else
        echo -e "${RED}✗ 未运行${NC}"
    fi
    
    # 检查Redis
    echo -n "Redis (6379): "
    if check_port 6379; then
        echo -e "${GREEN}✓ 运行中${NC}"
    else
        echo -e "${RED}✗ 未运行${NC}"
    fi
    
    # 检查Nacos
    echo -n "Nacos (8848): "
    if check_port 8848; then
        echo -e "${GREEN}✓ 运行中${NC}"
    else
        echo -e "${RED}✗ 未运行${NC}"
    fi
    
    echo ""
}

# 生成健康检查报告
generate_report() {
    local report_file="health_check_report_$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "=========================================="
        echo "    服务健康检查报告"
        echo "=========================================="
        echo "检查时间: $(date '+%Y-%m-%d %H:%M:%S')"
        echo ""
        echo "服务端口配置："
        echo "Gateway: 8080"
        echo "用户服务: 8081"
        echo "商品服务: 8082"
        echo "订单服务: 8083"
        echo "配送服务: 8001"
        echo "校园服务: 8003"
        echo "支付服务: 8004"
        echo "外卖服务: 8005"
        echo "二手服务: 8006"
        echo "失物招领: 8007"
        echo "会员服务: 8088"
        echo "API文档: 8089"
        echo "系统管理: 8090"
        echo ""
        echo "=========================================="
        echo "    报告结束"
        echo "=========================================="
    } > "$report_file"
    
    echo -e "${GREEN}健康检查报告已生成：${NC}$report_file"
    echo ""
}

# 主函数
main() {
    print_header
    
    # 检查依赖服务
    check_dependencies
    
    # 检查所有服务
    check_all_services
    
    # 生成报告
    generate_report
}

# 启动主程序
main
