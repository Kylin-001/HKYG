# Script to download and install Java 17
Write-Host "Starting Java 17 JDK download..."

# Set download URL and output path
$downloadUrl = "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.11%2B9/OpenJDK17U-jdk_x64_windows_hotspot_17.0.11_9.msi"
$outputFile = ".\openjdk-17-installer-new.msi"
$installDir = "C:\Java\jdk-17.0.11"

# Ensure installation directory exists
if (-not (Test-Path $installDir)) {
    Write-Host "Creating installation directory: $installDir"
    New-Item -ItemType Directory -Force -Path $installDir | Out-Null
}

# Download the installer
try {
    Write-Host "Downloading from $downloadUrl..."
    Invoke-WebRequest -Uri $downloadUrl -OutFile $outputFile -UseBasicParsing -TimeoutSec 600
    Write-Host "Download completed: $outputFile"
} catch {
    Write-Host "Download failed: $_"
    exit 1
}

# Check if download was successful
if (Test-Path $outputFile) {
    # Start installation
    Write-Host "Installing Java 17..."
    $process = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i", "$outputFile", "/qn", "INSTALLDIR=$installDir" -Wait -PassThru
    
    # Check installation success
    if ($process.ExitCode -eq 0) {
        Write-Host "Java 17 installation completed!"
        
        # Verify installation
        if (Test-Path "$installDir\bin\java.exe") {
            Write-Host "Java 17 installed successfully!"
            & "$installDir\bin\java.exe" -version
        } else {
            Write-Host "Java 17 installation failed, java.exe not found"
        }
    } else {
        Write-Host "Java 17 installation failed, exit code: $($process.ExitCode)"
    }
} else {
    Write-Host "Download failed, file not found"
}