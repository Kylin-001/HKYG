@echo off

echo 正在初始化黑龙江科技大学数据...

REM MySQL连接参数（根据要求配置）
set mysqlUser=root
set mysqlPassword=root
set mysqlHost=192.168.110.162
set mysqlPort=3306
set databaseName=heikeji_mall

REM 导入黑龙江科技大学测试数据
echo 导入黑龙江科技大学测试数据...
mysql -h %mysqlHost% -P %mysqlPort% -u %mysqlUser% -p%mysqlPassword% %databaseName% < "%~dp0sql\heikeji_data.sql"

if %ERRORLEVEL% equ 0 (
    echo 数据导入成功!
    echo 黑龙江科技大学数据初始化完成!
) else (
    echo 数据导入失败，请检查MySQL连接参数或SQL文件路径是否正确。
    exit /b 1
)
