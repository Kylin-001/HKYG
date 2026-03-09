# 下载并安装Java 17的脚本
Write-Host "开始下载Java 17 JDK..."

# 设置下载链接和输出路径
$downloadUrl = "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.11%2B9/OpenJDK17U-jdk_x64_windows_hotspot_17.0.11_9.msi"
$outputFile = ".\openjdk-17-installer.msi"
$installDir = "C:\Java\jdk-17.0.11"

# 确保安装目录存在
if (-not (Test-Path $installDir)) {
    Write-Host "创建安装目录: $installDir"
    New-Item -ItemType Directory -Force -Path $installDir | Out-Null
}

# 下载安装包
Write-Host "正在从 $downloadUrl 下载..."
try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $outputFile -UseBasicParsing -TimeoutSec 300
} catch {
    Write-Host "下载失败: $_"
    exit 1
}

# 检查下载是否成功
if (Test-Path $outputFile) {
    Write-Host "下载完成: $outputFile"
    
    # 开始安装
    Write-Host "开始安装Java 17..."
    $process = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i`,"$outputFile`",/qn,INSTALLDIR=`"$installDir`"" -Wait -PassThru
    
    # 检查安装是否成功
    if ($process.ExitCode -eq 0) {
        Write-Host "Java 17 安装完成!"
        
        # 检查安装结果
        if (Test-Path "$installDir\bin\java.exe") {
            Write-Host "Java 17 安装成功!"
            & "$installDir\bin\java.exe" -version
            
            # 添加Java到PATH环境变量 (当前会话)
            $env:PATH = "$installDir\bin;$env:PATH"
            Write-Host "Java已添加到当前会话的PATH环境变量"
        } else {
            Write-Host "Java 17 安装失败，未找到java.exe文件"
        }
    } else {
        Write-Host "Java 17 安装失败，安装程序返回错误代码: $($process.ExitCode)"
    }
} else {
    Write-Host "下载失败，请检查网络连接后重试"
}