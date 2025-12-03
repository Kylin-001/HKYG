@echo off

echo 正在初始化数据库...

REM MySQL连接参数（根据application-dev.yml配置）
set mysqlUser=root
set mysqlPassword=root
set mysqlHost=localhost
set mysqlPort=3306
set databaseName=heikeji_mall

REM 创建数据库
echo 创建数据库 %databaseName%...
mysql -h %mysqlHost% -P %mysqlPort% -u %mysqlUser% -p%mysqlPassword% -e "CREATE DATABASE IF NOT EXISTS %databaseName% DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %ERRORLEVEL% equ 0 (
    echo 数据库创建成功!
    
    REM 导入简化的表结构
    echo 导入表结构...
    mysql -h %mysqlHost% -P %mysqlPort% -u %mysqlUser% -p%mysqlPassword% %databaseName% -e "source sql\simple_schema.sql"
    
    if %ERRORLEVEL% equ 0 (
        echo 表结构导入成功!
        echo 数据库初始化完成!
    ) else (
        echo 表结构导入失败，请检查SQL文件路径是否正确。
        exit /b 1
    )
) else (
    echo 数据库创建失败，请检查MySQL连接参数。
    exit /b 1
)