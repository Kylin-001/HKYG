# Simple Maven build script

Write-Host "Building project with Maven..."

# Check if Maven is available
function Check-Maven {
    $mvn = Get-Command "mvn" -ErrorAction SilentlyContinue
    return $mvn -ne $null
}

# Validate Maven installation
if (-not (Check-Maven)) {
    Write-Host "Error: Maven not found!" -ForegroundColor Red
    exit 1
}

# Validate mode
if ($args -contains "-validateOnly") {
    Write-Host "Validation mode: Checking Maven..."
    mvn -version
    exit 0
}

# Check pom.xml
if (Test-Path "pom.xml") {
    Write-Host "Found pom.xml file"
} else {
    Write-Host "Warning: No pom.xml file found!" -ForegroundColor Yellow
}

# Build project
Write-Host "Running build command: mvn clean install -DskipTests"
mvn clean install -DskipTests

# Check result
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
} else {
    Write-Host "Build failed!" -ForegroundColor Red
}

Write-Host "Build script completed"