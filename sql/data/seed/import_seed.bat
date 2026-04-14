@echo off
chcp 65001 >nul 2>&1
echo ============================================
echo   开始导入种子数据到 heikeji_mall 数据库...
echo ============================================

mysql -h 192.168.186.128 -u hkyg -p"Mysql@8Root!2025" heikeji_mall --default-character-set=utf8mb4 < "e:\Program File\HKYG\heikeji-mall\sql\data\seed\heikeji_mall_seed_data_part1.sql"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Part1 导入失败!
    pause
    exit /b 1
)
echo [OK] Part1 导入完成!

mysql -h 192.168.186.128 -u hkyg -p"Mysql@8Root!2025" heikeji_mall < "e:\Program File\HKYG\heikeji-mall\sql\data\seed\heikeji_mall_seed_data_part2.sql"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Part2 导入失败!
    pause
    exit /b 1
)
echo [OK] Part2 导入完成!

mysql -h 192.168.186.128 -u hkyg -p"Mysql@8Root!2025" heikeji_mall < "e:\Program File\HKYG\heikeji-mall\sql\data\seed\heikeji_mall_seed_data_part3.sql"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Part3 导入失败!
    pause
    exit /b 1
)
echo [OK] Part3 导入完成!

echo.
echo ============================================
echo   全部种子数据导入成功！
echo ============================================
pause
