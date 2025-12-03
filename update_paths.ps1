# 批量更新模板文件中的路径 - 使用当前目录相对路径
Write-Host "开始更新模板文件路径..."

# 使用当前工作目录的相对路径
$baseDir = "heikeji-app\src\main\resources\templates"

# 手动指定HTML文件列表，避免中文路径问题
$htmlFiles = @(
    "address-list.html",
    "cart.html",
    "category-list.html",
    "checkout.html",
    "delivery-request-create.html",
    "delivery-request-detail.html",
    "delivery-request-list.html",
    "index.html",
    "login.html",
    "order-detail.html",
    "order-list.html",
    "payment.html",
    "product-detail.html",
    "product-list.html",
    "profile.html",
    "register.html",
    "takeout-order-create.html",
    "takeout-order-detail.html",
    "takeout-order-list.html"
)

# 处理每个文件
foreach ($fileName in $htmlFiles) {
    $filePath = Join-Path -Path $baseDir -ChildPath $fileName
    
    if (Test-Path $filePath) {
        Write-Host "正在处理: $filePath"
        
        # 读取文件内容
        $content = Get-Content -Path $filePath -Raw
        
        # 先处理首页路径特殊情况
        $content = $content -replace '"/app/index"', '"/"'
        $content = $content -replace "'/app/index'", "'/'"
        
        # 处理其他API路径
        $content = $content -replace '"/app/', '"/api/'
        $content = $content -replace "'/app/", "'/api/"
        
        # 写入更新后的内容
        Set-Content -Path $filePath -Value $content -Encoding UTF8
        Write-Host "✓ 已更新: $filePath"
    } else {
        Write-Host "✗ 文件不存在: $filePath"
    }
}

Write-Host "所有文件处理完成！"