#!/bin/bash

# 黑科易购项目部署脚本
# 使用说明: ./deploy.sh [环境] [服务名称]
# 环境可选值: dev, test, prod
# 服务名称可选值: admin, api, app, system, order, product

set -e

echo "==========================================="
echo "黑科易购项目部署脚本"
echo "==========================================="

# 检查参数
if [ $# -lt 2 ]; then
    echo "错误: 参数不足"
    echo "使用方法: ./deploy.sh [环境] [服务名称]"
    echo "环境: dev, test, prod"
    echo "服务: admin, api, app, system, order, product"
    exit 1
fi

ENV=$1
SERVICE=$2

# 验证环境参数
if [[ "$ENV" != "dev" && "$ENV" != "test" && "$ENV" != "prod" ]]; then
    echo "错误: 环境参数无效，必须是 dev, test 或 prod"
    exit 1
fi

# 验证服务参数
if [[ "$SERVICE" != "admin" && "$SERVICE" != "api" && "$SERVICE" != "app" && "$SERVICE" != "system" && "$SERVICE" != "order" && "$SERVICE" != "product" ]]; then
    echo "错误: 服务参数无效，请检查服务名称"
    exit 1
fi

# 定义变量
PROJECT_NAME="heikeji-mall"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="${PROJECT_DIR}/target"
DEPLOY_DIR="/opt/${PROJECT_NAME}/${ENV}/${SERVICE}"
JAR_NAME="heikeji-${SERVICE}-1.0.0.jar"
CONFIG_DIR="${PROJECT_DIR}/heikeji-${SERVICE}/src/main/resources"
CONFIG_FILE="application-${ENV}.yml"
LOG_DIR="/var/log/${PROJECT_NAME}/${ENV}/${SERVICE}"
PID_FILE="${DEPLOY_DIR}/${SERVICE}.pid"

# 检查Java环境
echo "检查Java环境..."
if ! command -v java &> /dev/null; then
    echo "错误: 未找到Java，请安装JDK 8或更高版本"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
echo "当前Java版本: ${JAVA_VERSION}"

# 创建必要的目录
echo "创建必要的目录..."
mkdir -p ${DEPLOY_DIR}
mkdir -p ${LOG_DIR}

# 构建项目
echo "构建项目..."
cd ${PROJECT_DIR}
mvn clean package -Dmaven.test.skip=true -P${ENV}

if [ ! -f "${BUILD_DIR}/${JAR_NAME}" ]; then
    echo "错误: 构建失败，未找到JAR文件 ${BUILD_DIR}/${JAR_NAME}"
    exit 1
fi

# 停止运行中的服务
echo "停止运行中的服务..."
if [ -f "${PID_FILE}" ]; then
    PID=$(cat ${PID_FILE})
    if ps -p ${PID} > /dev/null; then
        echo "正在停止进程 ${PID}..."
        kill ${PID}
        sleep 5
        if ps -p ${PID} > /dev/null; then
            echo "强制终止进程 ${PID}..."
            kill -9 ${PID}
        fi
    fi
    rm -f ${PID_FILE}
fi

# 部署应用
echo "部署应用..."
cp -f "${BUILD_DIR}/${JAR_NAME}" "${DEPLOY_DIR}/"
cp -f "${CONFIG_DIR}/${CONFIG_FILE}" "${DEPLOY_DIR}/application.yml"

# 设置环境变量
export JAVA_OPTS="-Xms512m -Xmx1024m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m"
export JAVA_OPTS="${JAVA_OPTS} -Dspring.profiles.active=${ENV}"
export JAVA_OPTS="${JAVA_OPTS} -Dlogging.file=${LOG_DIR}/${SERVICE}.log"

# 启动服务
echo "启动服务..."
cd ${DEPLOY_DIR}
nohup java ${JAVA_OPTS} -jar ${JAR_NAME} > /dev/null 2>&1 &
echo $! > ${PID_FILE}

# 检查服务是否启动成功
echo "检查服务启动状态..."
sleep 10
if ps -p $(cat ${PID_FILE}) > /dev/null; then
    echo "==========================================="
    echo "服务部署成功!"
    echo "服务名称: ${SERVICE}"
    echo "环境: ${ENV}"
    echo "部署目录: ${DEPLOY_DIR}"
    echo "日志目录: ${LOG_DIR}"
    echo "PID: $(cat ${PID_FILE})"
    echo "==========================================="
else
    echo "错误: 服务启动失败，请检查日志文件: ${LOG_DIR}/${SERVICE}.log"
    exit 1
fi