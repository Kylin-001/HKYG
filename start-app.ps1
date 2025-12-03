# 启动脚本 - 使用Maven或JAR包启动Spring Boot应用
Write-Host "开始启动黑科易购应用..." -ForegroundColor Green

# 检查MySQL和Redis服务
Write-Host "检查必要的服务..." -ForegroundColor Yellow

# 检查MySQL服务
try {
    $mysqlStatus = Get-Service -Name MySQL* -ErrorAction Stop
    if ($mysqlStatus.Status -ne "Running") {
        Write-Host "⚠️ MySQL服务未运行，请先启动MySQL服务。" -ForegroundColor Yellow
    } else {
        Write-Host "✅ MySQL服务运行正常" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ 未找到MySQL服务，应用可能无法正常连接数据库。" -ForegroundColor Yellow
}

# 检查Redis服务（如果需要）
try {
    $redisStatus = Get-Service -Name Redis* -ErrorAction Stop
    if ($redisStatus.Status -ne "Running") {
        Write-Host "⚠️ Redis服务未运行，如果应用需要Redis，可能会出现错误。" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Redis服务运行正常" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ 未找到Redis服务，如果应用需要Redis，可能会出现错误。" -ForegroundColor Yellow
}

# 尝试查找可执行的JAR文件
Write-Host "`n查找构建好的JAR文件..." -ForegroundColor Yellow
$jarFiles = Get-ChildItem -Recurse -Path "." -Filter "*.jar" | Where-Object {
    $_.FullName -like "*\target\*" -and 
    -not $_.FullName -like "*\test*" -and
    $_.Name -like "*-app*.jar" -or $_.Name -like "heikeji-*.jar"
} | Sort-Object -Property LastWriteTime -Descending

if ($jarFiles.Count -gt 0) {
    $jarFile = $jarFiles[0]
    Write-Host "找到最新的JAR文件：$($jarFile.FullName)" -ForegroundColor Green
    Write-Host "`n正在启动应用..." -ForegroundColor Green
    
    try {
        # 启动应用
        java -jar "$($jarFile.FullName)"
    } catch {
        Write-Host "❌ 启动失败: $_" -ForegroundColor Red
    }
} else {
    Write-Host "❌ 未找到可执行的JAR文件。请先运行构建脚本。" -ForegroundColor Red
    Write-Host "`n建议运行以下命令："
    Write-Host "1. 使用build_with_maven.ps1脚本构建项目" -ForegroundColor Cyan
    Write-Host "2. 或在项目根目录运行: mvn clean install -DskipTests" -ForegroundColor Cyan
}