@echo off
chcp 65001
setlocal enabledelayedexpansion

echo =========================================
echo   黑科易购项目停止脚本 (Windows)
echo =========================================
echo.

set PROJECT_DIR=%~dp0

:stop_backend
echo.
echo ========================================
echo   停止后端服务
echo ========================================
echo.

taskkill /F /IM java.exe /FI "WINDOWTITLE eq Nacos*" 2>nul
if %errorlevel% equ 0 (
    echo [OK] Nacos 已停止
) else (
    echo [INFO] Nacos 未运行
)

taskkill /F /IM java.exe /FI "WINDOWTITLE eq Gateway*" 2>nul
if %errorlevel% equ 0 (
    echo [OK] Gateway 已停止
) else (
    echo [INFO] Gateway 未运行
)

taskkill /F /IM java.exe /FI "WINDOWTITLE eq Admin*" 2>nul
if %errorlevel% equ 0 (
    echo [OK] Admin 服务已停止
) else (
    echo [INFO] Admin 服务未运行
)

taskkill /F /IM java.exe /FI "WINDOWTITLE eq User Service*" 2>nul
if %errorlevel% equ 0 (
    echo [OK] User Service 已停止
) else (
    echo [INFO] User Service 未运行
)

taskkill /F /IM java.exe /FI "WINDOWTITLE eq Product Service*" 2>nul
if %errorlevel% equ 0 (
    echo [OK] Product Service 已停止
) else (
    echo [INFO] Product Service 未运行
)

taskkill /F /IM java.exe /FI "WINDOWTITLE eq Order Service*" 2>nul
if %errorlevel% equ 0 (
    echo [OK] Order Service 已停止
) else (
    echo [INFO] Order Service 未运行
)

taskkill /F /IM java.exe /FI "WINDOWTITLE eq Payment Service*" 2>nul
if %errorlevel% equ 0 (
    echo [OK] Payment Service 已停止
) else (
    echo [INFO] Payment Service 未运行
)

taskkill /F /IM java.exe /FI "WINDOWTITLE eq Member Service*" 2>nul
if %errorlevel% equ 0 (
    echo [OK] Member Service 已停止
) else (
    echo [INFO] Member Service 未运行
)

echo.
echo ========================================
echo   后端服务已停止
echo ========================================
echo.

:stop_frontend
echo.
echo ========================================
echo   停止前端服务
echo ========================================
echo.

taskkill /F /IM node.exe /FI "WINDOWTITLE eq Vite*" 2>nul
if %errorlevel% equ 0 (
    echo [OK] 前端服务已停止
) else (
    echo [INFO] 前端服务未运行
)

echo.
echo ========================================
echo   所有服务已停止
echo ========================================
echo.
echo 按任意键退出...
pause >nul
