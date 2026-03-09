# 黑科易购测试数据导入脚本
# 直接执行SQL命令，避免文件编码问题

# MySQL连接信息
$mysqlUser = "root"
$mysqlPassword = "root"
$mysqlDatabase = "heikeji_mall"

Write-Host "开始导入测试数据..."

# 1. 商品类别数据
$categorySql = @"
INSERT INTO category (name, parent_id, sort_order) VALUES 
('Electronics', 0, 1),
('Phone', 1, 1),
('Computer', 1, 2),
('Daily', 0, 2),
('Toiletries', 4, 1),
('Bedding', 4, 2),
('Food', 0, 3),
('Snacks', 7, 1),
('Drinks', 7, 2),
('Study', 0, 4),
('Books', 10, 1),
('Stationery', 10, 2);
"@

# 2. 商家数据
$merchantSql = @"
INSERT INTO merchant (name, description, contact_phone, address, status) VALUES 
('Electronics Store', 'Selling electronics', '13800138001', 'Campus Science Park No.1', 1),
('Campus Supermarket', 'Campus supermarket', '13800138002', 'Near Canteen 1', 1),
('Study Store', 'Study supplies', '13800138003', 'Near Canteen 2', 1);
"@

# 3. 商品数据
$productSql = @"
INSERT INTO product (category_id, name, subtitle, price, original_price, stock, sales, status, sort_order) VALUES 
-- Electronics
(2, 'iPhone 14', 'New iPhone 14, 128GB', 5999.00, 6999.00, 50, 0, 1, 1),
(2, 'Xiaomi 13', 'Xiaomi 13, 256GB', 3999.00, 4999.00, 100, 0, 1, 2),
(3, 'Lenovo Laptop', 'Lenovo小新Pro 14, 16GB RAM', 4999.00, 5999.00, 30, 0, 1, 1),
(3, 'Huawei Laptop', 'Huawei MateBook 14, 16GB RAM', 5999.00, 6999.00, 20, 0, 1, 2),

-- Daily
(5, 'Toothbrush Set', 'Soft toothbrush, 10pcs', 19.90, 29.90, 200, 0, 1, 1),
(5, 'Towel', 'Cotton towel', 9.90, 19.90, 150, 0, 1, 2),
(6, 'Quilt', 'Spring quilt', 99.00, 199.00, 50, 0, 1, 1),
(6, 'Pillow', 'Memory foam pillow', 49.00, 99.00, 80, 0, 1, 2),

-- Food
(8, 'Chips', 'Lays chips', 9.90, 12.90, 300, 0, 1, 1),
(9, 'Cola', 'Coca Cola, 330ml', 3.00, 3.50, 500, 0, 1, 2),

-- Study
(11, 'Java Book', 'Java Programming', 89.00, 128.00, 50, 0, 1, 1),
(11, 'Python Book', 'Python Data Analysis', 69.00, 99.00, 40, 0, 1, 2),
(12, 'Notebook', 'A4 notebook, 100pages', 5.00, 8.00, 200, 0, 1, 1),
(12, 'Pen', 'Hero pen', 29.00, 49.00, 100, 0, 1, 2);
"@

# 4. 配送员数据
$deliverySql = @"
INSERT INTO delivery_person (name, phone, status) VALUES 
('Delivery 1', '13900139001', 1),
('Delivery 2', '13900139002', 1),
('Delivery 3', '13900139003', 1);
"@

# 5. 地址数据
$addressSql = @"
INSERT INTO address (user_id, receiver_name, receiver_phone, province, city, district, detail_address, is_default) VALUES 
(1, 'Zhang San', '13800138001', 'Heilongjiang', 'Harbin', 'Songbei', 'Dorm N1-101', 1),
(2, 'Li Si', '13800138002', 'Heilongjiang', 'Harbin', 'Songbei', 'Dorm S1-202', 1),
(3, 'Wang Wu', '13800138003', 'Heilongjiang', 'Harbin', 'Songbei', 'Dorm N2-303', 1);
"@

# 6. 购物车数据
$cartSql = @"
INSERT INTO cart (user_id, product_id, quantity) VALUES 
(1, 2, 1),
(2, 6, 3),
(3, 11, 1);
"@

# 执行SQL命令
function Execute-Sql {
    param([string]$sql)
    mysql -u $mysqlUser -p$mysqlPassword -D $mysqlDatabase -e "$sql"
}

# 执行所有SQL
Execute-Sql $categorySql
Write-Host "✓ 商品类别数据导入完成"

Execute-Sql $merchantSql
Write-Host "✓ 商家数据导入完成"

Execute-Sql $productSql
Write-Host "✓ 商品数据导入完成"

Execute-Sql $deliverySql
Write-Host "✓ 配送员数据导入完成"

Execute-Sql $addressSql
Write-Host "✓ 地址数据导入完成"

Execute-Sql $cartSql
Write-Host "✓ 购物车数据导入完成"

Write-Host ""
Write-Host "测试数据导入完成！"
Write-Host ""
Write-Host "数据库：$mysqlDatabase"
Write-Host "用户：$mysqlUser"
