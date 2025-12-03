# 设置永久环境变量指向JDK 17（需要管理员权限）
Write-Host "=== Java 17 永久环境变量设置脚本 ===" -ForegroundColor Cyan

# 检查是否以管理员权限运行
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "❌ 错误：此脚本需要以管理员权限运行！" -ForegroundColor Red
    Write-Host "请右键点击PowerShell，选择'以管理员身份运行'，然后再运行此脚本。" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ 已确认以管理员权限运行" -ForegroundColor Green

# 查找JDK 17的可能安装路径
$possibleJdkPaths = @(
    "C:\Program Files\Java\jdk-17",
    "C:\Program Files\Java\jdk-17.0.10",
    "C:\Program Files\Java\jdk-17.0.9",
    "C:\Program Files (x86)\Java\jdk-17",
    "D:\Program Files\Java\jdk-17"
)

try {
    $jdk17Path = $null
    $jdkBinPath = $null
    
    # 尝试找到有效的JDK路径
    foreach ($path in $possibleJdkPaths) {
        if (Test-Path "$path\bin\java.exe") {
            $jdk17Path = $path
            $jdkBinPath = "$jdk17Path\bin"
            Write-Host "✅ 找到JDK 17路径: $jdk17Path" -ForegroundColor Green
            break
        }
    }
    
    # 如果找不到，提示用户输入
    if (-not $jdk17Path) {
        Write-Host "❌ 未找到JDK 17的默认安装路径。" -ForegroundColor Red
        $userPath = Read-Host "请手动输入JDK 17的安装路径（例如：C:\Program Files\Java\jdk-17）"
        
        if (Test-Path "$userPath\bin\java.exe") {
            $jdk17Path = $userPath
            $jdkBinPath = "$jdk17Path\bin"
            Write-Host "✅ 确认JDK 17路径: $jdk17Path" -ForegroundColor Green
        } else {
            Write-Host "❌ 无效的JDK路径，请确保Java已正确安装。" -ForegroundColor Red
            exit 1
        }
    }

    # 定义注册表路径
    $regPath = "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment"
    
    Write-Host "\n开始设置系统环境变量..." -ForegroundColor Yellow
    
    # 备份当前环境变量
    Write-Host "备份当前环境变量..." -ForegroundColor Cyan
    $backupTime = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = "$env:TEMP\java_env_backup_$backupTime.txt"
    
    try {
        $currentJavaHome = Get-ItemProperty -Path $regPath -Name "JAVA_HOME" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty JAVA_HOME -ErrorAction SilentlyContinue
        $currentPath = Get-ItemProperty -Path $regPath -Name "Path" -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Path -ErrorAction SilentlyContinue
        
        "# Java环境变量备份 - $backupTime" > $backupPath
        "JAVA_HOME=$currentJavaHome" >> $backupPath
        "PATH=$currentPath" >> $backupPath
        
        Write-Host "✅ 环境变量备份已保存到: $backupPath" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  备份环境变量时出错，但继续执行: $_" -ForegroundColor Yellow
    }
    
    # 设置JAVA_HOME环境变量（系统级别）
    Set-ItemProperty -Path $regPath -Name "JAVA_HOME" -Value $jdk17Path -Type String -ErrorAction Stop
    Write-Host "✅ 已设置系统环境变量 JAVA_HOME = $jdk17Path" -ForegroundColor Green
    
    # 获取当前PATH环境变量
    $currentPath = Get-ItemProperty -Path $regPath -Name "Path" -ErrorAction Stop | Select-Object -ExpandProperty Path
    
    # 检查并添加JDK的bin目录到PATH
    if (-not ($currentPath -like "*$jdkBinPath*")) {
        # 确保PATH以分号结尾
        if (-not $currentPath.EndsWith(';')) {
            $currentPath += ';'
        }
        
        # 添加JDK bin目录到PATH开头，确保优先使用
        $newPath = "$jdkBinPath;$currentPath"
        Set-ItemProperty -Path $regPath -Name "Path" -Value $newPath -Type ExpandString
        Write-Host "✅ 已将 $jdkBinPath 添加到系统PATH环境变量开头" -ForegroundColor Green
    } else {
        Write-Host "✅ $jdkBinPath 已在系统PATH环境变量中" -ForegroundColor Green
    }
    
    # 输出设置信息
    Write-Host "\n=====================================" -ForegroundColor Cyan
    Write-Host "🎉 永久环境变量设置完成!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "JAVA_HOME = $jdk17Path" -ForegroundColor Yellow
    Write-Host "JDK Bin目录 = $jdkBinPath" -ForegroundColor Yellow
    Write-Host "=====================================" -ForegroundColor Cyan
    Write-Host "重要提示: 这些更改需要重新启动终端或应用程序才能完全生效。" -ForegroundColor Red
    Write-Host "对于已经打开的程序，可能需要重启才能识别新的环境变量。" -ForegroundColor Yellow
    Write-Host "=====================================\n" -ForegroundColor Cyan
    
    # 为当前会话临时设置环境变量
    Write-Host "正在为当前PowerShell会话临时应用环境变量..." -ForegroundColor Yellow
    [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $jdk17Path, [System.EnvironmentVariableTarget]::Process)
    $currentProcessPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Process)
    if (-not ($currentProcessPath -like "*$jdkBinPath*")) {
        [System.Environment]::SetEnvironmentVariable("Path", "$jdkBinPath;$currentProcessPath", [System.EnvironmentVariableTarget]::Process)
    }
    Write-Host "✅ 已为当前PowerShell会话应用环境变量" -ForegroundColor Green
    
    # 验证设置
    Write-Host "\n验证当前会话中的Java版本:" -ForegroundColor Yellow
    try {
        $javaVersion = & java -version 2>&1
        Write-Host "$javaVersion" -ForegroundColor Green
        
        # 检查是否为Java 17
        if ($javaVersion -like "*17*" -and ($javaVersion -like "*openjdk version*" -or $javaVersion -like "*java version*")) {
            Write-Host "✅ 确认当前使用的是Java 17版本" -ForegroundColor Green
        } else {
            Write-Host "⚠️  当前使用的Java版本可能不是Java 17，请检查输出确认。" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ 验证Java版本失败: $_" -ForegroundColor Red
    }
    
    Write-Host "\n提示: 如需恢复环境变量，请参考备份文件: $backupPath" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ 设置环境变量失败: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "请确保以管理员权限运行此脚本" -ForegroundColor Yellow
    exit 1
}