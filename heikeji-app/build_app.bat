@echo off
cd /d "C:\Users\张开源\Desktop\黑科易购项目\heikeji-mall\heikeji-app"
echo Building APP API Service...

REM 检查Maven是否可用
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Maven not found. Please make sure Maven is installed and added to PATH.
    pause
    exit /b 1
)

REM 执行构建
mvn clean package -DskipTests

if %errorlevel% neq 0 (
    echo Error: Build failed!
    pause
    exit /b 1
)

echo Build completed successfully!
echo You can now run start_app.bat to start the application.
pause