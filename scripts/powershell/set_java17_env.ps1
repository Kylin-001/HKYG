# 设置JAVA_HOME和PATH指向JDK 17（临时环境变量）
Write-Host "=== Java 17 环境变量设置脚本（当前会话） ===" -ForegroundColor Cyan

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

    # 设置当前会话的环境变量（不需要管理员权限）
    Write-Host "\n正在设置当前会话的环境变量..." -ForegroundColor Yellow
    
    # 设置JAVA_HOME
    [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $jdk17Path, [System.EnvironmentVariableTarget]::Process)
    Write-Host "✅ JAVA_HOME 已设置为: $jdk17Path" -ForegroundColor Green
    
    # 设置PATH
    $currentPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Process)
    if (-not ($currentPath -like "*$jdkBinPath*")) {
        [System.Environment]::SetEnvironmentVariable("Path", "$jdkBinPath;$currentPath", [System.EnvironmentVariableTarget]::Process)
        Write-Host "✅ JDK bin路径已添加到PATH: $jdkBinPath" -ForegroundColor Green
    } else {
        Write-Host "✅ JDK bin路径已在PATH中存在: $jdkBinPath" -ForegroundColor Green
    }
    
    Write-Host "\n-------------------------------------" -ForegroundColor Cyan
    Write-Host "✅ 临时环境变量设置完成！" -ForegroundColor Green
    Write-Host "注意：这些设置仅对当前PowerShell会话有效。" -ForegroundColor Yellow
    Write-Host "要设置永久环境变量，请使用 set_permanent_java_env.ps1 脚本（需要管理员权限）。" -ForegroundColor Cyan
    Write-Host "-------------------------------------\n" -ForegroundColor Cyan
    
    # 验证Java版本
    Write-Host "验证当前会话中的Java版本..." -ForegroundColor Yellow
    try {
        $javaVersion = & java -version 2>&1
        Write-Host "$javaVersion" -ForegroundColor Green
        
        # 检查是否为Java 17
        if ($javaVersion -like "*17*" -and $javaVersion -like "*openjdk version*" -or $javaVersion -like "*java version*") {
            Write-Host "✅ 确认当前使用的是Java 17版本" -ForegroundColor Green
        } else {
            Write-Host "⚠️  当前使用的Java版本可能不是Java 17，请检查输出确认。" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ 验证Java版本失败: $_" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ 设置环境变量时出错: $_" -ForegroundColor Red
    exit 1
}