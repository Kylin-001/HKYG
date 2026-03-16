#!/bin/bash

# 黑科易购 - 服务启动脚本
# 用于一键启动所有微服务

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 项目根目录
PROJECT_ROOT="/home/zky/HKYG"

# 服务配置
SERVICES=(
    "service-user:8081:用户服务"
    "service-product:8082:商品服务"
    "service-order:8083:订单服务"
    "service-delivery:8001:配送服务"
    "service-member:8088:会员服务"
    "service-campus:8003:校园服务"
    "service-secondhand:8006:二手服务"
    "service-lostfound:8007:失物招领"
    "heikeji-admin:8090:管理后台"
    "heikeji-gateway:8080:API网关"
)

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  黑科易购 - 微服务启动脚本${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# 检查Java环境
if ! command -v java &> /dev/null; then
    echo -e "${RED}错误: 未检测到Java环境${NC}"
    exit 1
fi

echo -e "${YELLOW}检测到Java版本:${NC}"
java -version
echo ""

# 检查Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}错误: 未检测到Maven环境${NC}"
    exit 1
fi

echo -e "${YELLOW}检测到Maven版本:${NC}"
mvn -version
echo ""

# 编译项目
echo -e "${GREEN}正在编译项目...${NC}"
cd "$PROJECT_ROOT/heikeji-mall-service"
mvn clean package -DskipTests -q

if [ $? -ne 0 ]; then
    echo -e "${RED}编译失败！${NC}"
    exit 1
fi

echo -e "${GREEN}编译成功！${NC}"
echo ""

# 启动服务
echo -e "${GREEN}正在启动微服务...${NC}"
echo ""

for service_info in "${SERVICES[@]}"; do
    IFS=':' read -r service_name port description <<< "$service_info"
    echo -e "${YELLOW}启动${description}...${NC}"
    
    # 后台启动服务
    nohup java -jar "$PROJECT_ROOT/heikeji-mall-service/$service_name/target/$service_name-1.0.0.jar" \
        --server.port=$port \
        > "$PROJECT_ROOT/logs/$service_name.log" 2>&1 &
    
    echo -e "${GREEN}[$description] 已启动 (PID: $!)${NC}"
done

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  所有服务已启动完成！${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "服务访问地址："
echo "  - API网关: http://localhost:8080"
echo "  - 管理后台: http://localhost:8090"
echo "  - Nacos: http://localhost:8848"
echo ""
echo "日志目录: $PROJECT_ROOT/logs/"
echo ""
