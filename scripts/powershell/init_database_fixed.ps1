# 数据库初始化脚本（修复版）
Write-Host "开始初始化黑科易购数据库..." -ForegroundColor Green

# 检查MySQL是否安装和运行
Write-Host "正在检查MySQL服务..." -ForegroundColor Yellow
try {
    $mysqlStatus = Get-Service -Name MySQL* -ErrorAction Stop
    if ($mysqlStatus.Status -ne "Running") {
        Write-Host "错误：MySQL服务未运行，请先启动MySQL服务。" -ForegroundColor Red
        exit 1
    }
    Write-Host "MySQL服务运行正常" -ForegroundColor Green
} catch {
    Write-Host "错误：未找到MySQL服务，请确认MySQL已正确安装。" -ForegroundColor Red
    exit 1
}

# 设置数据库连接参数
$mysqlUser = "root"
$mysqlPassword = "root"
$databaseName = "heikeji_mall"

# 创建数据库
Write-Host "正在创建数据库 $databaseName..." -ForegroundColor Yellow
try {
    mysql -u $mysqlUser -p$mysqlPassword -e "CREATE DATABASE IF NOT EXISTS $databaseName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>$null
    Write-Host "数据库创建成功！" -ForegroundColor Green
} catch {
    Write-Host "错误：创建数据库失败。" -ForegroundColor Red
    exit 1
}

# 导入表结构
Write-Host "正在导入表结构..." -ForegroundColor Yellow
try {
    $schemaPath = "$PSScriptRoot\sql\schema.sql"
    if (Test-Path $schemaPath) {
        mysql -u $mysqlUser -p$mysqlPassword $databaseName < $schemaPath 2>$null
        Write-Host "表结构导入成功！" -ForegroundColor Green
    } else {
        Write-Host "错误：找不到schema.sql文件。" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "错误：导入表结构失败。" -ForegroundColor Red
    exit 1
}

# 创建数据脚本文件
$tempDataPath = "$PSScriptRoot\sql\user_data.sql"
$sqlScript = @"
INSERT INTO `user` (`student_no`, `nickname`, `phone`, `sex`, `status`, `is_verified`, `balance`) VALUES
('2022020001', '张三', '13800138001', 1, 0, 1, 100.00),
('2022020002', '李四', '13800138002', 0, 0, 1, 50.00),
('2022020003', '王五', '13800138003', 1, 0, 1, 0.00);

INSERT INTO `user_auth` (`user_id`, `open_id`, `union_id`, `session_key`) VALUES
(1, 'wx1234567890123456', 'o12345678901234567890', 'sess_1234567890'),
(2, 'wx2345678901234567', 'o23456789012345678901', 'sess_2345678901'),
(3, 'wx3456789012345678', 'o34567890123456789012', 'sess_3456789012');

INSERT INTO `category` (`name`, `parent_id`, `sort_order`) VALUES
('校园零食', 0, 1),
('日常用品', 0, 2),
('学习文具', 0, 3);

INSERT INTO `delivery_locker` (`locker_code`, `name`, `location`, `campus_area`, `total_cells`, `available_cells`, `status`) VALUES
('LOCKER001', 'B区食堂外卖柜', 'B区食堂门口', 'B区', 30, 25, 0),
('LOCKER002', 'A区宿舍外卖柜', 'A区宿舍楼下', 'A区', 20, 18, 0);
"@

# 保存SQL脚本
$sqlScript | Out-File -FilePath $tempDataPath -Encoding utf8

# 导入基础数据
Write-Host "正在导入用户和基础数据..." -ForegroundColor Yellow
try {
    mysql -u $mysqlUser -p$mysqlPassword $databaseName < $tempDataPath 2>$null
    Write-Host "基础数据导入成功！" -ForegroundColor Green
} catch {
    Write-Host "错误：导入数据失败。" -ForegroundColor Red
    exit 1
}

# 清理临时文件
Remove-Item $tempDataPath -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== 数据库初始化完成！ ===" -ForegroundColor Green
Write-Host "数据库名: $databaseName"
Write-Host "用户名: $mysqlUser"
Write-Host "密码: $mysqlPassword"
Write-Host ""
Write-Host "登录账号（学号）：2022020001, 2022020002, 2022020003"
Write-Host "密码示例：123456 或 密码为空" -ForegroundColor Yellow
Write-Host ""
Write-Host "数据库已准备就绪！您现在可以启动应用程序了。" -ForegroundColor Green