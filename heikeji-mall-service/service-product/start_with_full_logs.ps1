# 启动服务并捕获完整日志
[string]$logFile = "startup_full_detailed.log"
Write-Host "Starting service and writing full logs to $logFile..."
java -jar target/service-product-1.0.0.jar 2>&1 | Tee-Object -FilePath $logFile
Write-Host "Service stopped. Check $logFile for details."