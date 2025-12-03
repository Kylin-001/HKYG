# 简单的数据库导入脚本
Write-Host "===== 黑科易购数据库导入脚本 ====="

# 获取MySQL密码
$password = Read-Host -Prompt "请输入MySQL root密码"

# 设置基本路径
$schemaPath = "e:/Program File/黑科易购项目/heikeji-mall/sql/schema"

Write-Host "\n1. 创建数据库..."
mysql -u root -p"$password" -e "CREATE DATABASE IF NOT EXISTS heikeji_mall DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

Write-Host "\n2. 创建表结构..."

# 执行表结构文件
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/01_schema_version.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/02_user.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/03_user_auth.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/04_user_address.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/05_store.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/06_category.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/07_product.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/08_product_image.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/09_cart.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/10_order.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/11_order_item.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/12_delivery_locker.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/13_payment.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/14_payment_log.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/15_system_config.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/16_system_log.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/17_dict.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/18_role.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/19_menu.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/20_role_menu.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $schemaPath/tables/21_user_role.sql"

Write-Host "\n3. 插入基础数据..."
$basicPath = "e:/Program File/黑科易购项目/heikeji-mall/sql/data/basic"
mysql -u root -p"$password" -D heikeji_mall -e "source $basicPath/category_data.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $basicPath/delivery_locker_data.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $basicPath/store_data.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $basicPath/product_data.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $basicPath/dict_data.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $basicPath/system_config_data.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $basicPath/role_permission_data.sql"

Write-Host "\n4. 插入测试数据..."
$testPath = "e:/Program File/黑科易购项目/heikeji-mall/sql/data/test"
mysql -u root -p"$password" -D heikeji_mall -e "source $testPath/user_test_data.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $testPath/order_test_data.sql"
mysql -u root -p"$password" -D heikeji_mall -e "source $testPath/cart_test_data.sql"

Write-Host "\n===== 数据库导入完成 ====="
