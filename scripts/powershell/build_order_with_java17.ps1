# 订单服务模块构建脚本 - 使用Java 17环境
Write-Host "=== 订单服务模块构建脚本 ===" -ForegroundColor Cyan

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
        $java17Home = $path
        $javaPath = "$java17Home\bin"
        $env:PATH = "$javaPath;$env:PATH"
        $env:JAVA_HOME = $java17Home
        Write-Host "✅ 已设置JAVA_HOME: $java17Home" -ForegroundColor Green
        $foundJava = $true
        break
    }
}

if (-not $foundJava) {
    Write-Host "❌ 未找到Java 17，请确保已正确安装。" -ForegroundColor Red
    exit 1
}

# 验证Java版本
Write-Host "\n当前使用的Java版本：" -ForegroundColor Yellow
try {
    $javaVersion = & java -version 2>&1
    Write-Host "$javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 无法获取Java版本" -ForegroundColor Red
    exit 1
}

# 定义模块路径
$modulePath = "heikeji-mall-service/service-order"

# 检查模块是否存在
if (-not (Test-Path "$PSScriptRoot\$modulePath")) {
    Write-Host "❌ 模块路径不存在：$modulePath" -ForegroundColor Red
    exit 1
}

# 尝试构建订单服务模块
Write-Host "\n开始构建订单服务模块..." -ForegroundColor Yellow
Write-Host "构建命令: mvn clean install -DskipTests -pl $modulePath" -ForegroundColor Cyan
try {
    & mvn clean install -DskipTests -pl $modulePath
    
    # 保存构建结果
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host "\n✅ 订单服务模块构建成功！" -ForegroundColor Green
    } else {
        Write-Host "\n❌ 订单服务模块构建失败，退出代码：$exitCode" -ForegroundColor Red
    }
    
    # 返回退出代码
    exit $exitCode
} catch {
    Write-Host "\n❌ 构建过程中出现异常: $_" -ForegroundColor Red
    exit 1
}