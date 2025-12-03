# 简化版应用启动脚本

# 设置应用根目录
$APP_ROOT = "c:\Users\张开源\Desktop\黑科易购项目\heikeji-mall\heikeji-app"

# 设置类路径 - 只包含必要的编译类文件
$CLASS_PATH = "$APP_ROOT\target\classes"

# 输出启动信息
Write-Host "=== 黑科易购应用启动脚本 ==="
Write-Host "应用根目录: $APP_ROOT"
Write-Host "类路径: $CLASS_PATH"
Write-Host "启动主类: com.heikeji.app.HeikejiAppApplication"
Write-Host "正在启动应用..."

# 尝试启动应用（注：这将缺少依赖，仅用于检查编译是否正确）
try {
    java -cp $CLASS_PATH com.heikeji.app.HeikejiAppApplication
} catch {
    Write-Host "启动失败: $_"
    Write-Host "注意：由于缺少必要的依赖包，应用可能无法正常启动。"
    Write-Host "建议：请先安装Maven并运行 'mvn clean install' 来下载依赖。"
}