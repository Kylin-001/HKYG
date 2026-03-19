# 黑科易购微服务启动脚本

Write-Host "停止所有正在运行的业务服务..."

# 停止所有Java服务，排除nacos、zipkin和trae
$javaProcesses = Get-Process | Where-Object { $_.ProcessName -eq "java" }
foreach ($process in $javaProcesses) {
    $commandLine = $process | Select-Object -ExpandProperty CommandLine
    if (-not ($commandLine -match "nacos" -or $commandLine -match "zipkin" -or $commandLine -match "trae")) {
        Write-Host "停止进程: $($process.Id)"
        try {
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        } catch {
            Write-Host "停止进程 $($process.Id) 时出错: $($_.Exception.Message)"
        }
    }
}

Write-Host "业务服务已停止"

# 服务列表
$services = @("service-user", "service-product", "service-payment", "service-takeout", "service-order", "service-campus", "service-delivery", "service-secondhand", "service-lostfound")

Write-Host "服务列表定义完成: $($services -join ' ')`n"

# 启动所有服务
Write-Host "开始启动服务..."

foreach ($service in $services) {
    Write-Host "启动 $service..."
    
    # 确定JAR文件路径
    if ($service -eq "service-product" -or $service -eq "service-payment" -or $service -eq "service-takeout") {
        $jarFile = "$PSScriptRoot\..\..\heikeji-mall-service\$service\target\$service-1.0.0-exec.jar"
    } elseif ($service -eq "service-campus") {
        $jarFile = "$PSScriptRoot\..\..\heikeji-mall-service\$service\target\heikeji-mall-service-campus-1.0.0.jar"
    } else {
        $jarFile = "$PSScriptRoot\..\..\heikeji-mall-service\$service\target\$service-1.0.0.jar"
    }
    
    # 检查JAR文件是否存在
    if (Test-Path $jarFile) {
        # 启动服务
        $logFile = "$PSScriptRoot\..\..\heikeji-mall-service\$service.log"
        $javaArgs = @(
            "-jar",
            "-Dspring.cloud.nacos.config.import-check.enabled=false",
            "-Dspring.cloud.nacos.username=nacos",
            "-Dspring.cloud.nacos.password=nacos",
            $jarFile
        )
        
        Write-Host "使用的jar包: $jarFile"
        Write-Host "日志文件: $logFile"
        
        # 启动服务并将输出重定向到日志文件
        Start-Process -FilePath "java" -ArgumentList $javaArgs -NoNewWindow -RedirectStandardOutput $logFile -RedirectStandardError $logFile
        
        Write-Host "$service 启动成功"
        Start-Sleep -Seconds 5
    } else {
        Write-Host "错误: JAR文件不存在: $jarFile"
    }
}

Write-Host "`n所有服务启动完成！"
Write-Host "可以使用以下命令查看服务状态:"
Write-Host "Get-Process | Where-Object { $_.ProcessName -eq 'java' }"
Write-Host "或者查看具体服务日志:"
Write-Host 'Get-Content -Path service-user.log -Wait'
