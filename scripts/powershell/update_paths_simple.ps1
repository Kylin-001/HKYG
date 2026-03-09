# 简单的路径更新脚本
Write-Host "开始更新模板文件路径..."

# 设置工作目录
Set-Location -Path "heikeji-app\src\main\resources\templates"

# 使用简单的文件处理方式
$files = @(
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

foreach ($file in $files) {
  if (Test-Path $file) {
    Write-Host "处理: $file"
    (Get-Content $file) | 
    ForEach-Object { $_ -replace '/app/index', '/' -replace '/app/', '/api/' } | 
    Set-Content $file -Encoding UTF8
    Write-Host "✓ 已更新: $file"
  } else {
    Write-Host "✗ 不存在: $file"
  }
}

Write-Host "所有文件处理完成！"