@echo off

echo 正在初始化黑龙江科技大学数据...

REM MySQL连接参数
set mysqlUser=hkyg
set mysqlPassword=Mysql@8Root!2025
set mysqlHost=192.168.186.128
set mysqlPort=3306
set databaseName=heikeji_mall

REM 导入黑龙江科技大学测试数据
echo 导入黑龙江科技大学测试数据...
mysql -h %mysqlHost% -P %mysqlPort% -u %mysqlUser% -p%mysqlPassword% %databaseName% < "%~dp0sql\heikeji_data.sql"

echo 数据导入完成！
pause
