@echo off
chcp 65001
setlocal enabledelayedexpansion

echo =========================================
echo   黑科易购项目启动脚本 (Windows)
echo =========================================
echo.

set PROJECT_DIR=%~dp0

:check_java
where java >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=3" %%i in ('java -version 2^>^&1 ^| findstr /i "version"') do set JAVA_VERSION=%%i
    echo [OK] Java 版本: %JAVA_VERSION%
) else (
    echo [ERROR] 未安装 Java，请先安装 Java 17 或更高版本
    pause
    exit /b 1
)

:check_maven
where mvn >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=3" %%i in ('mvn -version') do set MVN_VERSION=%%i
    echo [OK] Maven 版本: %MVN_VERSION%
) else (
    echo [ERROR] 未安装 Maven，请先安装 Maven
    pause
    exit /b 1
)

:check_node
where node >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo [OK] Node.js 版本: %NODE_VERSION%
) else (
    echo [ERROR] 未安装 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

:start_backend
echo.
echo ========================================
echo   启动后端服务
echo ========================================
echo.

cd /d "%PROJECT_DIR%"

echo 正在编译项目...
call mvn clean package -DskipTests
if %errorlevel% neq 0 (
    echo [ERROR] 项目编译失败
    pause
    exit /b 1
)

echo [OK] 项目编译成功
echo.

echo 启动 Nacos...
cd /d "%PROJECT_DIR%\heikeji-system" || exit /b 1
start "Nacos" cmd /k "java -jar target\heikeji-system-1.0.0.jar > nacos.log 2>&1"
echo [OK] Nacos 已启动
echo    日志文件: nacos.log
timeout /t 10 /nobreak >nul

echo 启动 Gateway...
cd /d "%PROJECT_DIR%\heikeji-gateway" || exit /b 1
start "Gateway" cmd /k "java -jar target\heikeji-gateway-1.0.0.jar > gateway.log 2>&1"
echo [OK] Gateway 已启动
echo    日志文件: gateway.log
timeout /t 5 /nobreak >nul

echo 启动 Admin 服务...
cd /d "%PROJECT_DIR%\heikeji-admin" || exit /b 1
start "Admin" cmd /k "java -jar target\heikeji-admin-1.0.0.jar > admin.log 2>&1"
echo [OK] Admin 服务已启动
echo    日志文件: admin.log
timeout /t 3 /nobreak >nul

echo 启动服务模块...
cd /d "%PROJECT_DIR%\heikeji-mall-service"

if exist "service-user\target\service-user-1.0.0.jar" (
    start "User Service" cmd /k "cd service-user && java -jar target\service-user-1.0.0.jar > user-service.log 2>&1"
    echo [OK] User Service 已启动
    echo    日志文件: user-service.log
    timeout /t 2 /nobreak >nul
)

if exist "service-product\target\service-product-1.0.0.jar" (
    start "Product Service" cmd /k "cd service-product && java -jar target\service-product-1.0.0.jar > product-service.log 2>&1"
    echo [OK] Product Service 已启动
    echo    日志文件: product-service.log
    timeout /t 2 /nobreak >nul
)

if exist "service-order\target\service-order-1.0.0.jar" (
    start "Order Service" cmd /k "cd service-order && java -jar target\service-order-1.0.0.jar > order-service.log 2>&1"
    echo [OK] Order Service 已启动
    echo    日志文件: order-service.log
    timeout /t 2 /nobreak >nul
)

if exist "service-payment\target\service-payment-1.0.0.jar" (
    start "Payment Service" cmd /k "cd service-payment && java -jar target\service-payment-1.0.0.jar > payment-service.log 2>&1"
    echo [OK] Payment Service 已启动
    echo    日志文件: payment-service.log
    timeout /t 2 /nobreak >nul
)

if exist "service-member\target\service-member-1.0.0.jar" (
    start "Member Service" cmd /k "cd service-member && java -jar target\service-member-1.0.0.jar > member-service.log 2>&1"
    echo [OK] Member Service 已启动
    echo    日志文件: member-service.log
    timeout /t 2 /nobreak >nul
)

echo.
echo ========================================
echo   后端服务启动完成
echo ========================================
echo.
echo 服务列表：
echo   - Nacos
echo   - Gateway
echo   - Admin
echo   - User Service
echo   - Product Service
echo   - Order Service
echo   - Payment Service
echo   - Member Service
echo.
echo 查看日志：
echo   - Nacos: heikeji-system\nacos.log
echo   - Gateway: heikeji-gateway\gateway.log
echo   - Admin: heikeji-admin\admin.log
echo   - Services: heikeji-mall-service\service-*.log
echo.
echo 停止服务：运行 stop-all.bat
echo.

set /p START_FRONTEND="是否启动前端服务？(y/n): "
if /i "%START_FRONTEND%"=="y" (
    call :start_frontend
) else (
    echo.
    echo 前端服务未启动
    echo.
    echo 如需启动前端，请运行：npm run dev
)

goto :end

:start_frontend
echo.
echo ========================================
echo   启动前端服务
echo ========================================
echo.

cd /d "%PROJECT_DIR%\heikeji-frontend" || exit /b 1

echo 检查 Node.js 依赖...
if not exist "node_modules" (
    echo 安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] 依赖安装失败
        pause
        exit /b 1
    )
)

echo [OK] 依赖检查完成
echo.

echo 启动开发服务器...
start "Frontend" cmd /k "npm run dev > frontend.log 2>&1"
echo [OK] 前端服务已启动
echo    日志文件: frontend.log
echo.
echo 访问地址：
echo   http://localhost:5173
echo.
echo 查看日志：
echo   type heikeji-frontend\frontend.log
echo.

:end
echo.
echo ========================================
echo   启动完成
echo ========================================
echo.
echo 按任意键退出...
pause >nul
