#!/bin/bash

# 服务端口配置自动修复脚本
# 用于统一修复项目中各服务的端口配置

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印标题
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}    服务端口配置自动修复工具${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

# 备份文件
backup_file() {
    local file=$1
    if [ -f "$file" ]; then
        local backup="${file}.backup.$(date +%Y%m%d_%H%M%S)"
        cp "$file" "$backup"
        echo -e "${GREEN}✓${NC} 已备份: $file -> $backup"
    fi
}

# 修复用户服务端口
fix_user_service() {
    echo -e "${YELLOW}修复用户服务端口...${NC}"
    local file="heikeji-mall-service/service-user/src/main/resources/application.yml"
    
    if [ -f "$file" ]; then
        backup_file "$file"
        sed -i 's/port: 8082/port: 8081/' "$file"
        echo -e "${GREEN}✓${NC} 用户服务端口已修改: 8082 -> 8081"
    else
        echo -e "${RED}✗${NC} 文件不存在: $file"
    fi
    echo ""
}

# 修复商品服务端口
fix_product_service() {
    echo -e "${YELLOW}修复商品服务端口...${NC}"
    local file="heikeji-mall-service/service-product/src/main/resources/application.yml"
    
    if [ -f "$file" ]; then
        backup_file "$file"
        sed -i 's/port: 8083/port: 8082/' "$file"
        echo -e "${GREEN}✓${NC} 商品服务端口已修改: 8083 -> 8082"
    else
        echo -e "${RED}✗${NC} 文件不存在: $file"
    fi
    echo ""
}

# 修复订单服务端口
fix_order_service() {
    echo -e "${YELLOW}修复订单服务端口...${NC}"
    local file="heikeji-mall-service/service-order/src/main/resources/application.yml"
    
    if [ -f "$file" ]; then
        backup_file "$file"
        sed -i 's/port: 8084/port: 8083/' "$file"
        echo -e "${GREEN}✓${NC} 订单服务端口已修改: 8084 -> 8083"
    else
        echo -e "${RED}✗${NC} 文件不存在: $file"
    fi
    echo ""
}

# 修复配送服务端口
fix_delivery_service() {
    echo -e "${YELLOW}修复配送服务端口...${NC}"
    local file1="heikeji-mall-service/service-delivery/src/main/resources/application.yml"
    local file2="heikeji-mall-service/service-delivery.yml"
    
    if [ -f "$file1" ]; then
        backup_file "$file1"
        sed -i 's/port: 8085/port: 8001/' "$file1"
        echo -e "${GREEN}✓${NC} 配送服务端口(application.yml)已修改: 8085 -> 8001"
    else
        echo -e "${RED}✗${NC} 文件不存在: $file1"
    fi
    
    if [ -f "$file2" ]; then
        backup_file "$file2"
        sed -i 's/port: 8004/port: 8001/' "$file2"
        echo -e "${GREEN}✓${NC} 配送服务端口(service-delivery.yml)已修改: 8004 -> 8001"
    else
        echo -e "${RED}✗${NC} 文件不存在: $file2"
    fi
    echo ""
}

# 修复二手服务端口
fix_secondhand_service() {
    echo -e "${YELLOW}修复二手服务端口...${NC}"
    local file1="heikeji-mall-service/service-secondhand/src/main/resources/application.yml"
    local file2="heikeji-mall-service/service-secondhand.yml"
    
    if [ -f "$file1" ]; then
        backup_file "$file1"
        sed -i 's/port: 8088/port: 8006/' "$file1"
        echo -e "${GREEN}✓${NC} 二手服务端口(application.yml)已修改: 8088 -> 8006"
    else
        echo -e "${RED}✗${NC} 文件不存在: $file1"
    fi
    
    if [ -f "$file2" ]; then
        backup_file "$file2"
        sed -i 's/port: 8088/port: 8006/' "$file2"
        echo -e "${GREEN}✓${NC} 二手服务端口(service-secondhand.yml)已修改: 8088 -> 8006"
    else
        echo -e "${RED}✗${NC} 文件不存在: $file2"
    fi
    echo ""
}

# 修复失物招领服务端口
fix_lostfound_service() {
    echo -e "${YELLOW}修复失物招领服务端口...${NC}"
    local file1="heikeji-mall-service/service-lostfound/src/main/resources/application.yml"
    local file2="heikeji-mall-service/service-lostfound.yml"
    
    if [ -f "$file1" ]; then
        backup_file "$file1"
        sed -i 's/port: 8089/port: 8007/' "$file1"
        echo -e "${GREEN}✓${NC} 失物招领服务端口(application.yml)已修改: 8089 -> 8007"
    else
        echo -e "${RED}✗${NC} 文件不存在: $file1"
    fi
    
    if [ -f "$file2" ]; then
        backup_file "$file2"
        sed -i 's/port: 8089/port: 8007/' "$file2"
        echo -e "${GREEN}✓${NC} 失物招领服务端口(service-lostfound.yml)已修改: 8089 -> 8007"
    else
        echo -e "${RED}✗${NC} 文件不存在: $file2"
    fi
    echo ""
}

# 修复会员服务端口
fix_member_service() {
    echo -e "${YELLOW}修复会员服务端口...${NC}"
    local file="heikeji-mall-service/service-member/src/main/resources/application.yml"
    
    if [ -f "$file" ]; then
        backup_file "$file"
        sed -i 's/port: 8002/port: 8088/' "$file"
        echo -e "${GREEN}✓${NC} 会员服务端口已修改: 8002 -> 8088"
    else
        echo -e "${RED}✗${NC} 文件不存在: $file"
    fi
    echo ""
}

# 验证端口配置
verify_ports() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}验证端口配置${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    
    echo -e "${GREEN}期望的端口配置：${NC}"
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
    
    echo -e "${YELLOW}当前端口配置：${NC}"
    grep -h "port:" heikeji-mall-service/*/src/main/resources/application.yml | sort -u
    echo ""
}

# 生成修复报告
generate_report() {
    local report_file="port_fix_report_$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "=========================================="
        echo "    服务端口配置修复报告"
        echo "=========================================="
        echo "修复时间: $(date '+%Y-%m-%d %H:%M:%S')"
        echo ""
        
        echo "修复的服务："
        echo "1. 用户服务: 8082 -> 8081"
        echo "2. 商品服务: 8083 -> 8082"
        echo "3. 订单服务: 8084 -> 8083"
        echo "4. 配送服务: 8085/8004 -> 8001"
        echo "5. 二手服务: 8088 -> 8006"
        echo "6. 失物招领: 8089 -> 8007"
        echo "7. 会员服务: 8002 -> 8088"
        echo ""
        
        echo "备份文件："
        find . -name "*.backup.*" -type f | sort
        echo ""
        
        echo "=========================================="
        echo "    报告结束"
        echo "=========================================="
    } > "$report_file"
    
    echo -e "${GREEN}修复报告已生成：${NC}$report_file"
    echo ""
}

# 主函数
main() {
    print_header
    
    echo -e "${YELLOW}警告：此脚本将修改多个服务的端口配置${NC}"
    echo -e "${YELLOW}建议在执行前先提交代码到git${NC}"
    echo ""
    
    read -p "是否继续？(y/n): " confirm
    
    if [ "$confirm" != "y" ]; then
        echo -e "${YELLOW}操作已取消${NC}"
        exit 0
    fi
    
    echo ""
    echo -e "${BLUE}开始修复端口配置...${NC}"
    echo ""
    
    # 执行修复
    fix_user_service
    fix_product_service
    fix_order_service
    fix_delivery_service
    fix_secondhand_service
    fix_lostfound_service
    fix_member_service
    
    # 验证配置
    verify_ports
    
    # 生成报告
    generate_report
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}端口配置修复完成！${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "${YELLOW}后续步骤：${NC}"
    echo "1. 检查修复后的配置是否正确"
    echo "2. 重启所有服务"
    echo "3. 验证服务是否正常运行"
    echo "4. 如有问题，可以使用备份文件恢复"
    echo ""
}

# 启动主程序
main
