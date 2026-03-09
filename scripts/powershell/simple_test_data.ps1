# Simple test data import script
$mysqlUser = "root"
$mysqlPassword = "root"
$mysqlDatabase = "heikeji_mall"

# Function to execute SQL command
function Run-Sql {
    param([string]$sql)
    mysql -u $mysqlUser -p$mysqlPassword -D $mysqlDatabase -e "$sql"
}

Write-Host "Importing test data..."

# 1. Add categories
Run-Sql "INSERT INTO category (name, parent_id, sort_order) VALUES ('Electronics', 0, 1), ('Phone', 1, 1), ('Computer', 1, 2), ('Daily', 0, 2), ('Food', 0, 3);"
Write-Host "✓ Categories added"

# 2. Add products
Run-Sql "INSERT INTO product (category_id, name, price, stock, status) VALUES (2, 'iPhone', 5999.00, 50, 1), (3, 'Laptop', 4999.00, 30, 1), (4, 'Toothbrush', 19.90, 200, 1), (5, 'Chips', 9.90, 300, 1);"
Write-Host "✓ Products added"

# 3. Add addresses
Run-Sql "INSERT INTO address (user_id, receiver_name, receiver_phone, detail_address) VALUES (1, 'User1', '13800138001', 'Dorm N1-101'), (2, 'User2', '13800138002', 'Dorm S1-202');"
Write-Host "✓ Addresses added"

Write-Host "Test data import completed!"
