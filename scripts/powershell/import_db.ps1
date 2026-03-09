# MySQL数据库导入脚本
Write-Host "===== 黑科易购数据库导入脚本 ====="

# 获取MySQL root密码
$password = Read-Host -Prompt "请输入MySQL root用户密码" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

# 定义SQL文件路径
$basePath = "e:/Program File/黑科易购项目/heikeji-mall/sql/schema"
$tablesPath = "$basePath/tables"

# 创建数据库
Write-Host "\n1. 创建数据库..."
mysql -u root -p"$passwordPlain" -e "CREATE DATABASE IF NOT EXISTS `heikeji_mall` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p"$passwordPlain" -e "USE `heikeji_mall`;"

# 执行表结构文件
Write-Host "\n2. 导入表结构..."

# 定义表文件执行顺序
$tableFiles = @(
    "01_schema_version.sql",
    "02_user.sql",
    "03_user_auth.sql",
    "04_user_address.sql",
    "05_store.sql",
    "06_category.sql",
    "07_product.sql",
    "08_product_image.sql",
    "09_cart.sql",
    "10_order.sql",
    "11_order_item.sql",
    "12_delivery_locker.sql",
    "13_payment.sql",
    "14_payment_log.sql",
    "15_system_config.sql",
    "16_system_log.sql",
    "17_dict.sql",
    "18_role.sql",
    "19_menu.sql",
    "20_role_menu.sql",
    "21_user_role.sql"
)

# 逐个执行表结构文件
foreach ($file in $tableFiles) {
    $filePath = "$tablesPath\$file"
    Write-Host "   导入 $file..."
    mysql -u root -p"$passwordPlain" -D heikeji_mall -e "source $filePath"
}

# 插入初始版本记录
Write-Host "\n3. 插入初始版本记录..."
mysql -u root -p"$passwordPlain" -D heikeji_mall -e "INSERT INTO `schema_version` (`version`, `description`) VALUES ('v1.0.0', 'Initial schema creation');"

Write-Host "\n===== 数据库结构导入完成 ====="

# 导入基础数据
$importBasicData = Read-Host -Prompt "\n是否导入基础数据？(Y/N)" -Default "Y"
if ($importBasicData -eq "Y" -or $importBasicData -eq "y") {
    Write-Host "\n4. 导入基础数据..."
    $basicDataPath = "e:/Program File/黑科易购项目/heikeji-mall/sql/data/basic"
    
    $basicDataFiles = @(
        "category_data.sql",
        "delivery_locker_data.sql",
        "store_data.sql",
        "product_data.sql",
        "dict_data.sql",
        "system_config_data.sql",
        "role_permission_data.sql"
    )
    
    foreach ($file in $basicDataFiles) {
        $filePath = "$basicDataPath\$file"
        Write-Host "   导入 $file..."
        mysql -u root -p"$passwordPlain" -D heikeji_mall -e "source $filePath"
    }
    
    Write-Host "\n===== 基础数据导入完成 ====="
}

# 导入测试数据
$importTestData = Read-Host -Prompt "\n是否导入测试数据？(Y/N)" -Default "Y"
if ($importTestData -eq "Y" -or $importTestData -eq "y") {
    Write-Host "\n5. 导入测试数据..."
    $testDataPath = "e:/Program File/黑科易购项目/heikeji-mall/sql/data/test"
    
    $testDataFiles = @(
        "user_test_data.sql",
        "cart_test_data.sql",
        "order_test_data.sql"
    )
    
    foreach ($file in $testDataFiles) {
        $filePath = "$testDataPath\$file"
        Write-Host "   导入 $file..."
        mysql -u root -p"$passwordPlain" -D heikeji_mall -e "source $filePath"
    }
    
    Write-Host "\n===== 测试数据导入完成 ====="
}

Write-Host "\n===== 数据库导入全部完成 ====="
