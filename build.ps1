# Heikeji Mall Build Script - Java 17 Environment Configuration
Write-Host "=== Heikeji Mall Build Script ===" -ForegroundColor Cyan

# Find Java 17 path
Write-Host "Configuring Java 17 environment..." -ForegroundColor Yellow
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
        Write-Host "✅ JAVA_HOME set to: $JAVA_HOME" -ForegroundColor Green
        $foundJava = $true
        break
    }
}

if (-not $foundJava) {
    Write-Host "❌ Java 17 not found. Please ensure it is correctly installed." -ForegroundColor Red
    Write-Host "Tip: Please manually set Java environment variables." -ForegroundColor Yellow
    exit 1
}

# Check Java version
Write-Host "\nCurrent Java version:" -ForegroundColor Yellow
$javaVersion = java -version 2>&1
Write-Host "$javaVersion" -ForegroundColor Green

# Check Maven version
Write-Host "\nCurrent Maven version:" -ForegroundColor Yellow
$mvnVersion = mvn -version 2>&1
Write-Host "$mvnVersion" -ForegroundColor Green

# Execute Maven build
Write-Host "\nStarting project build with Java 17..." -ForegroundColor Yellow
Write-Host "Build command: mvn clean install -DskipTests" -ForegroundColor Cyan

mvn clean install -DskipTests

if ($LASTEXITCODE -eq 0) {
    Write-Host "\n✅ Project build successful!" -ForegroundColor Green
} else {
    Write-Host "\n❌ Project build failed. Please check error messages." -ForegroundColor Red
    exit $LASTEXITCODE
}
