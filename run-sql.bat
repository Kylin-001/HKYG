@echo off
echo 正在执行SQL脚本...
mysql -u root -pMysql@8Root!2025 -e "SELECT 'MySQL连接成功' as status;" 2> sql-error.log
if %errorlevel% neq 0 (
    echo MySQL连接失败，请检查密码
    type sql-error.log
    pause
    exit /b 1
)
mysql -u root -pMysql@8Root!2025 < "E:\Program File\HKYG\heikeji-mall\insert-more-data.sql" 2>> sql-error.log
if %errorlevel% neq 0 (
    echo SQL执行失败
    type sql-error.log
    pause
    exit /b 1
)
echo SQL执行成功！
mysql -u root -pMysql@8Root!2025 -e "USE heikeji_mall; SELECT COUNT(*) as product_count FROM product; SELECT COUNT(*) as merchant_count FROM takeout_merchant;"
pause
