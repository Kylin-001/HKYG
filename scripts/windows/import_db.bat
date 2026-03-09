@echo off
chcp 65001 >nul
echo ======================================
echo 黑科易购数据库导入脚本
echo ======================================
echo.
echo 1. 确保已安装MySQL并启动服务
echo 2. 请准备好MySQL root用户的密码
echo.
set /p password=请输入MySQL root密码: 
echo.
echo 正在导入数据库...
echo.
cd /d "%~dp0"
mysql -u root -p%password% < full_db.sql

echo.
if %errorlevel% == 0 (
    echo 数据库导入成功！
) else (
    echo 数据库导入失败，请检查错误信息。
)

echo.
echo 按任意键退出...
pause >nul
