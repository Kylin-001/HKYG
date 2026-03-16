#!/bin/bash

# 黑科易购 - 服务健康检查脚本

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  黑科易购 - 服务健康检查${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# 服务配置
declare -A SERVICES
SERVICES=(
    ["8080"]="API网关"
    ["8090"]="管理后台"
    ["8081"]="用户服务"
    ["8082"]="商品服务"
    ["8083"]="订单服务"
    ["8001"]="配送服务"
    ["8088"]="会员服务"
    ["8003"]="校园服务"
    ["8006"]="二手服务"
    ["8007"]="失物招领"
)

# 检查端口是否开放
check_port() {
    local port=$1
    local name=$2
    
    if timeout 1 bash -c "cat < /dev/null > /dev/tcp/127.0.0.1/$port" 2>/dev/null; then
        echo -e "${GREEN}[✓]${NC} $name (端口 $port) - 运行正常"
        return 0
    else
        echo -e "${RED}[✗]${NC} $name (端口 $port) - 未运行"
        return 1
    fi
}

# 检查基础设施
echo -e "${YELLOW}检查基础设施...${NC}"
echo "-------------------------------------------"

check_port 8848 "Nacos注册中心"
check_port 6379 "Redis缓存"
check_port 3306 "MySQL数据库"
check_port 5672 "RabbitMQ消息队列"

echo ""
echo -e "${YELLOW}检查微服务...${NC}"
echo "-------------------------------------------"

total=0
running=0

for port in "${!SERVICES[@]}"; do
    ((total++))
    if check_port $port "${SERVICES[$port]}"; then
        ((running++))
    fi
done

echo ""
echo "==========================================="
echo "服务状态: $running/$total 运行中"
echo "==========================================="

if [ $running -eq $total ]; then
    echo -e "${GREEN}所有服务运行正常！${NC}"
    exit 0
else
    echo -e "${RED}部分服务未运行，请检查！${NC}"
    exit 1
fi
