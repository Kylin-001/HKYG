# 黑科易购项目 Dockerfile
# 基于 OpenJDK 17 构建
FROM openjdk:17-jre-slim

# 设置工作目录
WORKDIR /app

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone

# 复制环境变量配置文件
COPY .env.example /app/.env.example

# 创建日志目录
RUN mkdir -p /app/logs

# 设置权限
RUN chmod 755 /app

# 暴露应用端口
EXPOSE 8080

# 设置启动参数
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -Djava.security.egd=file:/dev/./urandom"

# 容器启动时执行的命令
CMD ["sh", "-c", "java ${JAVA_OPTS} -jar /app/app.jar"]