#!/bin/bash

# 先停止所有正在运行的业务服务
ps -ef | grep java | grep -v grep | grep -v nacos | grep -v zipkin | awk '{print $2}' | xargs kill -9 2>/dev/null

# 只启动用户服务，添加调试信息
echo "启动 service-user 服务（带调试信息）..."
nohup java -jar -Dspring.cloud.nacos.config.import-check.enabled=false -Ddebug service-user/target/service-user-1.0.0.jar > service-user-debug.log 2>&1 &
echo "service-user 服务已启动，PID: $!"
echo "调试日志：service-user-debug.log"
echo "等待5秒后查看日志..."
sleep 5
echo "日志内容："
tail -n 100 service-user-debug.log