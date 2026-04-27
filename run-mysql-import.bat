@echo off
chcp 65001 >nul
echo MySQL Data Import Tool
echo ========================
echo.

set MYSQL_HOST=192.168.186.128
set MYSQL_USER=root
set MYSQL_PASS=Mysql@8Root!2025
set MYSQL_DB=heikeji_mall
set SQL_FILE=E:\Program File\HKYG\heikeji-mall\insert-data-simple.sql

echo Connecting to MySQL server %MYSQL_HOST%...
echo.

mysql -h %MYSQL_HOST% -u %MYSQL_USER% -p%MYSQL_PASS% < "%SQL_FILE%"

if %errorlevel% neq 0 (
    echo.
    echo Import failed with error code %errorlevel%
    pause
    exit /b 1
)

echo.
echo Import completed successfully!
echo.
echo Verifying data...
mysql -h %MYSQL_HOST% -u %MYSQL_USER% -p%MYSQL_PASS% -e "USE %MYSQL_DB%; SELECT 'Categories' as item, COUNT(*) as count FROM category WHERE parent_id=0 UNION ALL SELECT 'Takeout Merchants', COUNT(*) FROM takeout_merchant;"

echo.
pause
