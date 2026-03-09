#!/bin/bash

# API文档测试脚本
# 用于自动化测试API接口并生成测试报告

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
BASE_URL="http://localhost:8089"
REPORT_FILE="api_test_report_$(date +%Y%m%d_%H%M%S).json"
LOG_FILE="api_test_$(date +%Y%m%d_%H%M%S).log"

# 统计变量
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 初始化报告
init_report() {
    cat > "$REPORT_FILE" << EOF
{
  "testSuite": "黑科易购API接口测试",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "baseUrl": "$BASE_URL",
  "tests": []
}
EOF
}

# 添加测试结果到报告
add_test_result() {
    local test_name=$1
    local method=$2
    local url=$3
    local status=$4
    local response=$5
    local error=$6
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ "$status" = "PASS" ]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        echo -e "${GREEN}✓ PASS${NC} - $test_name"
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo -e "${RED}✗ FAIL${NC} - $test_name"
    fi
    
    # 添加到JSON报告
    local test_json=$(cat << EOF
{
  "name": "$test_name",
  "method": "$method",
  "url": "$url",
  "status": "$status",
  "response": $(echo "$response" | jq -Rs .),
  "error": $(if [ -n "$error" ]; then echo "\"$error\"" | jq -Rs .; else echo "null"; fi)
}
EOF
)
    
    # 使用临时文件来更新JSON
    local temp_file=$(mktemp)
    jq ".tests += [$test_json]" "$REPORT_FILE" > "$temp_file"
    mv "$temp_file" "$REPORT_FILE"
}

# 执行测试
execute_test() {
    local test_name=$1
    local method=$2
    local url=$3
    local data=$4
    local expected_status=$5
    
    echo -e "${BLUE}测试：${NC}$test_name"
    echo -e "${BLUE}请求：${NC}$method $url"
    
    local response
    local http_status
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$url")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X PUT "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X DELETE "$url")
    fi
    
    # 提取HTTP状态码和响应体
    http_status=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | sed '$d')
    
    # 记录到日志文件
    echo "========================================" >> "$LOG_FILE"
    echo "测试：$test_name" >> "$LOG_FILE"
    echo "请求：$method $url" >> "$LOG_FILE"
    echo "HTTP状态码：$http_status" >> "$LOG_FILE"
    echo "响应体：$response_body" >> "$LOG_FILE"
    echo "========================================" >> "$LOG_FILE"
    echo "" >> "$LOG_FILE"
    
    # 检查测试结果
    if [ "$http_status" = "$expected_status" ]; then
        add_test_result "$test_name" "$method" "$url" "PASS" "$response_body" ""
    else
        add_test_result "$test_name" "$method" "$url" "FAIL" "$response_body" "HTTP状态码不匹配：期望$expected_status，实际$http_status"
    fi
    
    echo ""
}

# 测试API文档中心
test_api_docs_center() {
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}测试API文档中心${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    
    # 测试健康检查
    execute_test "API文档中心健康检查" \
        "GET" \
        "$BASE_URL/api/docs/health" \
        "" \
        "200"
    
    # 测试获取API文档中心信息
    execute_test "获取API文档中心信息" \
        "GET" \
        "$BASE_URL/api/docs/info" \
        "" \
        "200"
    
    # 测试获取服务列表
    execute_test "获取服务列表" \
        "GET" \
        "$BASE_URL/api/docs/services" \
        "" \
        "200"
    
    # 测试获取联系信息
    execute_test "获取联系信息" \
        "GET" \
        "$BASE_URL/api/docs/contact" \
        "" \
        "200"
    
    # 测试获取API文档JSON
    execute_test "获取API文档JSON" \
        "GET" \
        "$BASE_URL/v3/api-docs" \
        "" \
        "200"
}

# 测试用户服务
test_user_service() {
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}测试用户服务${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    
    # 测试用户登录
    execute_test "用户登录" \
        "POST" \
        "$BASE_URL/v3/api-docs/service-user/api/user/login" \
        '{"username":"testuser","password":"password123"}' \
        "200"
    
    # 测试获取用户信息（需要认证）
    execute_test "获取用户信息" \
        "GET" \
        "$BASE_URL/v3/api-docs/service-user/api/user/info" \
        "" \
        "401"
}

# 测试商品服务
test_product_service() {
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}测试商品服务${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    
    # 测试分页查询商品
    execute_test "分页查询商品" \
        "GET" \
        "$BASE_URL/v3/api-docs/service-product/api/product/page?pageNo=1&pageSize=10" \
        "" \
        "200"
    
    # 测试获取热门商品
    execute_test "获取热门商品" \
        "GET" \
        "$BASE_URL/v3/api-docs/service-product/api/product/hot" \
        "" \
        "200"
    
    # 测试获取分类列表
    execute_test "获取分类列表" \
        "GET" \
        "$BASE_URL/v3/api-docs/service-product/api/category/list" \
        "" \
        "200"
}

# 测试订单服务
test_order_service() {
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}测试订单服务${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    
    # 测试获取销售概览
    execute_test "获取销售概览" \
        "GET" \
        "$BASE_URL/v3/api-docs/service-order/api/analysis/sales/overview?startDate=2024-01-01&endDate=2024-12-31" \
        "" \
        "401"
}

# 测试支付服务
test_payment_service() {
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}测试支付服务${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    
    # 测试查询支付状态
    execute_test "查询支付状态" \
        "GET" \
        "$BASE_URL/v3/api-docs/service-payment/api/payment/status/TEST123" \
        "" \
        "200"
}

# 测试外卖服务
test_takeout_service() {
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}测试外卖服务${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    
    # 测试获取商家列表
    execute_test "获取商家列表" \
        "GET" \
        "$BASE_URL/v3/api-docs/service-takeout/api/takeout/merchant/list" \
        "" \
        "200"
}

# 生成测试摘要
generate_summary() {
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}测试摘要${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    echo -e "总测试数：$TOTAL_TESTS"
    echo -e "${GREEN}通过：$PASSED_TESTS${NC}"
    echo -e "${RED}失败：$FAILED_TESTS${NC}"
    echo ""
    
    local pass_rate=0
    if [ $TOTAL_TESTS -gt 0 ]; then
        pass_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    fi
    echo -e "通过率：$pass_rate%"
    echo ""
    
    # 更新报告摘要
    local temp_file=$(mktemp)
    jq ".totalTests = $TOTAL_TESTS | .passedTests = $PASSED_TESTS | .failedTests = $FAILED_TESTS | .passRate = $pass_rate" "$REPORT_FILE" > "$temp_file"
    mv "$temp_file" "$REPORT_FILE"
    
    echo -e "${BLUE}测试报告已生成：${NC}$REPORT_FILE"
    echo -e "${BLUE}测试日志已生成：${NC}$LOG_FILE"
    echo ""
}

# 主函数
main() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}    黑科易购API接口自动化测试${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo -e "开始时间：$(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    # 初始化报告
    init_report
    
    # 执行测试
    test_api_docs_center
    test_user_service
    test_product_service
    test_order_service
    test_payment_service
    test_takeout_service
    
    # 生成测试摘要
    generate_summary
    
    echo -e "结束时间：$(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}所有测试通过！${NC}"
        exit 0
    else
        echo -e "${RED}有 $FAILED_TESTS 个测试失败${NC}"
        exit 1
    fi
}

# 检查jq是否安装
if ! command -v jq > /dev/null; then
    echo -e "${RED}错误：未安装jq工具${NC}"
    echo "请先安装jq："
    echo "  Ubuntu/Debian: sudo apt-get install jq"
    echo "  CentOS/RHEL: sudo yum install jq"
    echo "  macOS: brew install jq"
    exit 1
fi

# 启动主程序
main
