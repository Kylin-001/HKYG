#!/bin/bash

# 先停止所有正在运行的业务服务
echo "停止所有正在运行的业务服务..."
ps -ef | grep java | grep -v grep | grep -v nacos | grep -v zipkin | grep -v trae | awk '{print $2}' | xargs kill -9 2>/dev/null
echo "业务服务已停止"

# 服务列表
echo "定义服务列表..."
SERVICES="service-user service-product service-payment service-takeout service-order service-campus service-delivery service-secondhand service-lostfound"

echo "服务列表定义完成：$SERVICES"

# 启动所有服务
echo -e "\n开始启动服务..."
for service in $SERVICES; do
    echo "启动 ${service}..."
    # 使用本地配置启动服务，禁用Nacos配置检查
    # 检查服务是否需要使用带-exec后缀的jar包
    if [[ "$service" == "service-product" || "$service" == "service-payment" || "$service" == "service-takeout" ]]; then
        JAR_FILE="${service}/target/${service}-1.0.0-exec.jar"
    elif [[ "$service" == "service-campus" ]]; then
        JAR_FILE="${service}/target/heikeji-mall-service-campus-1.0.0.jar"
    else
        JAR_FILE="${service}/target/${service}-1.0.0.jar"
    fi
    nohup java -jar -Dspring.cloud.nacos.config.import-check.enabled=false -Dspring.cloud.nacos.username=nacos -Dspring.cloud.nacos.password=nacos $JAR_FILE > ${service}.log 2>&1 &
    echo "${service} 启动成功，PID: $!"
    echo "日志文件：${service}.log"
    echo "使用的jar包：$JAR_FILE"
    sleep 5
done

echo -e "\n所有服务启动完成！"
echo "可以使用以下命令查看服务状态："
echo "ps -ef | grep java | grep -v grep"
echo "或者查看具体服务日志："
echo "tail -f service-user.log"
