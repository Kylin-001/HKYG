# 简易Maven设置脚本（安装在项目目录）
Write-Host "=== 开始在项目目录设置 Maven ==="

# 设置安装目录（项目目录下，不需要管理员权限）
$PROJECT_DIR = Get-Location
$MAVEN_DIR = "$PROJECT_DIR\maven"
$MAVEN_VERSION = "3.8.8"
$DOWNLOAD_URL = "https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.zip"
$DOWNLOAD_PATH = "$PROJECT_DIR\maven.zip"

# 创建安装目录
Write-Host "创建 Maven 目录: $MAVEN_DIR"
if (Test-Path $MAVEN_DIR) {
    Remove-Item -Path $MAVEN_DIR -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $MAVEN_DIR | Out-Null

# 下载Maven
Write-Host "下载 Maven 到 $DOWNLOAD_PATH"
try {
    Invoke-WebRequest -Uri $DOWNLOAD_URL -OutFile $DOWNLOAD_PATH
    Write-Host "下载完成"
} catch {
    Write-Host "下载失败: $_"
    exit 1
}

# 解压Maven
Write-Host "解压 Maven 到 $MAVEN_DIR"
try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::ExtractToDirectory($DOWNLOAD_PATH, $MAVEN_DIR)
    Write-Host "解压完成"
} catch {
    Write-Host "解压失败: $_"
    exit 1
}

# 设置Maven路径
$MAVEN_HOME = "$MAVEN_DIR\apache-maven-$MAVEN_VERSION"
$MAVEN_BIN = "$MAVEN_HOME\bin\mvn.cmd"

# 清理下载的文件
Write-Host "清理下载文件"
Remove-Item -Path $DOWNLOAD_PATH -Force

# 验证安装
Write-Host "验证 Maven 安装..."
Write-Host "Maven 路径: $MAVEN_BIN"
& $MAVEN_BIN -version

Write-Host "=== Maven 设置完成 ==="
Write-Host "使用以下命令运行 Maven:"
Write-Host "$MAVEN_BIN clean install -DskipTests"

# 保存Maven路径到临时文件，供后续使用
Set-Content -Path "$PROJECT_DIR\maven_path.txt" -Value $MAVEN_BIN
Write-Host "Maven 路径已保存到 maven_path.txt"