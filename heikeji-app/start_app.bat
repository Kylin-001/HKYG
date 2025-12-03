@echo off
cd /d "C:\Users\张开源\Desktop\黑科易购项目\heikeji-mall\heikeji-app"
echo Starting APP API Service...

REM 检查目标目录是否存在
if not exist target\ (    
    echo Error: Target directory not found. Please build the project first.
    pause
    exit /b 1
)

REM 检查jar文件是否存在
if not exist target\heikeji-app-1.0.0.jar (    
    echo Error: JAR file not found. Please build the project first.
    pause
    exit /b 1
)

REM 启动应用
java -Xmx512m -Xms256m -jar target/heikeji-app-1.0.0.jar --spring.profiles.active=dev --logging.level.root=INFO

pause