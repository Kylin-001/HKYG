# 黑科易购项目构建脚本 - 使用Java 17环境配置Maven
Write-Host "=== 黑科易购项目构建脚本 ===" -ForegroundColor Cyan

# 查找Java 17路径
Write-Host "配置Java 17环境..." -ForegroundColor Yellow
$javaPaths = @(
    "C:\Program Files\Java\jdk-17",
    "C:\Program Files\Java\jdk-17.0.10",
    "C:\Program Files\Java\jdk-17.0.9",
    "C:\Program Files (x86)\Java\jdk-17"
)

$foundJava = $false
foreach ($path in $javaPaths) {
    if (Test-Path "$path\bin\java.exe") {
        $JAVA_HOME = $path
        $env:JAVA_HOME = $JAVA_HOME
        $env:PATH = "$JAVA_HOME\bin;$env:PATH"
        Write-Host "✅ 已设置JAVA_HOME: $JAVA_HOME" -ForegroundColor Green
        $foundJava = $true
        break
    }
}

if (-not $foundJava) {
    Write-Host "❌ 未找到Java 17，请确保已正确安装。" -ForegroundColor Red
    Write-Host "提示：请手动设置Java环境变量。" -ForegroundColor Yellow
    exit 1
}

# 检查Java版本
Write-Host "\n当前Java版本:" -ForegroundColor Yellow
$javaVersion = java -version 2>&1
Write-Host "$javaVersion" -ForegroundColor Green

# 检查Maven版本
Write-Host "\n当前Maven版本:" -ForegroundColor Yellow
$mvnVersion = mvn -version 2>&1
Write-Host "$mvnVersion" -ForegroundColor Green

# 执行Maven构建
Write-Host "\n开始使用Java 17构建项目..." -ForegroundColor Yellow
Write-Host "构建命令: mvn clean install -DskipTests" -ForegroundColor Cyan

mvn clean install -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host "\n✅ 项目构建成功！" -ForegroundColor Green
    Write-Host "\n可以使用启动脚本启动应用。" -ForegroundColor Cyan
} else {
    Write-Host "\n❌ 项目构建失败，请检查错误信息。" -ForegroundColor Red
    exit $LASTEXITCODE
}
