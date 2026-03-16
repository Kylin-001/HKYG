#!/bin/bash

# 黑科易购 - 服务停止脚本
# 用于一键停止所有微服务

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  黑科易购 - 微服务停止脚本${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# 服务列表
SERVICES=(
    "heikeji-gateway:API网关"
    "heikeji-admin:管理后台"
    "service-user:用户服务"
    "service-product:商品服务"
    "service-order:订单服务"
    "service-delivery:配送服务"
    "service-member:会员服务"
    "service-campus:校园服务"
    "service-secondhand:二手服务"
    "service-lostfound:失物招领"
)

# 查找并停止Java进程
for service_info in "${SERVICES[@]}"; do
    IFS=':' read -r service_name description <<< "$service_info"
    
    # 查找包含服务名的Java进程
    PID=$(ps -ef | grep "$service_name" | grep -v grep | awk '{print $2}')
    
    if [ -n "$PID" ]; then
        echo -e "${YELLOW}停止${description} (PID: $PID)...${NC}"
        kill -9 $PID
        echo -e "${GREEN}[$description] 已停止${NC}"
    else
        echo -e "${YELLOW}[$description] 未运行${NC}"
    fi
done

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  所有服务已停止${NC}"
echo -e "${GREEN}================================${NC}"
