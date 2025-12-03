# 正确的数据库初始化脚本
Write-Host "正在初始化数据库..."

# MySQL连接参数（根据application-dev.yml配置）
$mysqlUser = "root"
$mysqlPassword = "root"
$mysqlHost = "localhost"
$mysqlPort = "3306"
$databaseName = "heikeji_mall"

# 创建数据库命令
$createDbCmd = "mysql -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword -e \"CREATE DATABASE IF NOT EXISTS $databaseName DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\""

# 执行创建数据库
Write-Host "创建数据库 $databaseName..."
Invoke-Expression $createDbCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host "数据库创建成功!"
    
    # 导入简化的表结构命令
    $importSchemaCmd = "mysql -h $mysqlHost -P $mysqlPort -u $mysqlUser -p$mysqlPassword $databaseName -e \"source sql\simple_schema.sql\""
    
    Write-Host "导入表结构..."
    Invoke-Expression $importSchemaCmd
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "表结构导入成功!"
        Write-Host "数据库初始化完成!"
    } else {
        Write-Host "表结构导入失败，请检查SQL文件路径是否正确。"
        exit 1
    }
} else {
    Write-Host "数据库创建失败，请检查MySQL连接参数。"
    exit 1
}