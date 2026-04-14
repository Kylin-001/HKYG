# Heikeji Campus Mall Full Stack Startup (Enhanced Version)
# Features: Parallel startup, health checks, smart grouping, parameter support
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = "Stop"
$startTime = Get-Date

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "HH:mm:ss"
    $color = switch ($Level) {
        "ERROR" { "Red" }
        "WARN"  { "Yellow" }
        "SUCCESS" { "Green" }
        "INFO"  { "White" }
        default { "White" }
    }
    Write-Host "[$timestamp][$Level] $Message" -ForegroundColor $color
}

function Show-Banner {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║     Heikeji Campus Mall - Full Stack v2.0     ║" -ForegroundColor Cyan
    Write-Host "║         Enhanced Startup Script                ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Help {
    Show-Banner
    Write-Host "Usage: .\start-services.ps1 [Options]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor White
    Write-Host "  -frontend       Start only frontend service" -ForegroundColor Green
    Write-Host "  -backend        Start only backend services" -ForegroundColor Green
    Write-Host "  -core           Start core services only (Gateway, System, User)" -ForegroundColor Green
    Write-Host "  -business       Start business services only" -ForegroundColor Green
    Write-Host "  -parallel       Enable parallel startup (faster)" -ForegroundColor Green
    Write-Host "  -check          Run health check after startup" -ForegroundColor Green
    Write-Host "  -no-wait        Don't wait for user input at end" -ForegroundColor Green
    Write-Host "  -help           Show this help message" -ForegroundColor Green
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\start-services.ps1                  # Start all services" -ForegroundColor White
    Write-Host "  .\start-services.ps1 -backend          # Backend only" -ForegroundColor White
    Write-Host "  .\start-services.ps1 -parallel -check  # Parallel + Health check" -ForegroundColor White
    exit 0
}

function Test-Port {
    param([int]$Port, [int]$TimeoutMs = 1000)
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $result = $tcpClient.BeginConnect("127.0.0.1", $Port, $null, $null)
        $wait = $result.AsyncWaitHandle.WaitOne($TimeoutMs, $false)
        if ($wait) {
            $tcpClient.EndConnect($result)
            $tcpClient.Close()
            return $true
        } else {
            $tcpClient.Close()
            return $false
        }
    } catch {
        return $false
    }
}

function Start-ServiceJob {
    param(
        [string]$Name,
        [string]$Port,
        [string]$DisplayName,
        [string]$Path,
        [bool]$Parallel = $false
    )

    if (-not (Test-Path $Path)) {
        Write-Log "SKIP $DisplayName (dir not found: $Path)" "WARN"
        return $null
    }

    $command = "Set-Location -LiteralPath '$Path'; "
    $command += "Write-Host '========================================' -ForegroundColor Cyan; "
    $command += "Write-Host '  Starting $DisplayName ($Name)' -ForegroundColor Cyan; "
    $command += "Write-Host '  Port: $Port' -ForegroundColor Cyan; "
    $command += "Write-Host '========================================' -ForegroundColor Cyan; "
    $command += "mvn spring-boot:run -DskipTests"

    $encodedCmd = [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes($command))

    try {
        if ($Parallel) {
            $process = Start-Process powershell -ArgumentList "-NoExit", "-EncodedCommand", $encodedCmd -WindowStyle Minimized -PassThru
        } else {
            $process = Start-Process powershell -ArgumentList "-NoExit", "-EncodedCommand", $encodedCmd -WindowStyle Normal -PassThru
        }

        Write-Log "Launched $DisplayName (PID: $($process.Id), Port: $Port)" "SUCCESS"
        return @{
            Name = $Name
            Port = [int]$Port
            DisplayName = $DisplayName
            Process = $process
            Path = $Path
        }
    } catch {
        $errMsg = $_.Exception.Message
        Write-Log ("Failed to start {0}: {1}" -f $DisplayName, $errMsg) "ERROR"
        return $null
    }
}

function Start-Frontend {
    param([bool]$Parallel = $false)

    Write-Log "Starting Frontend Service..." "INFO"

    if (-not (Test-Path $FRONTEND_DIR)) {
        Write-Log "Frontend dir not found: $FRONTEND_DIR" "ERROR"
        return $null
    }

    $nodeModules = Join-Path $FRONTEND_DIR "node_modules"
    if (-not (Test-Path $nodeModules)) {
        Write-Log "Installing frontend dependencies..." "INFO"
        Push-Location $FRONTEND_DIR
        npm install 2>$null
        Pop-Location
    }

    $command = "Set-Location -LiteralPath '$FRONTEND_DIR'; "
    $command += "Write-Host '';" 
    $command += "Write-Host '========================================' -ForegroundColor Cyan; "
    $command += "Write-Host '  Frontend Dev Server (Vite + Mock API)' -ForegroundColor Cyan; "
    $command += "Write-Host '========================================' -ForegroundColor Cyan; "
    $command += "Write-Host ''; "
    $command += "Write-Host '  http://localhost:5174/' -ForegroundColor Green; "
    $command += "Write-Host '  Mock API: 60+ endpoints' -ForegroundColor Green; "
    $command += "Write-Host ''; "
    $command += "npm run dev"

    $encodedCmd = [Convert]::ToBase64String([System.Text.Encoding]::Unicode.GetBytes($command))

    try {
        if ($Parallel) {
            $process = Start-Process powershell -ArgumentList "-NoExit", "-EncodedCommand", $encodedCmd -WindowStyle Minimized -PassThru
        } else {
            $process = Start-Process powershell -ArgumentList "-NoExit", "-EncodedCommand", $encodedCmd -WindowStyle Normal -PassThru
        }

        Write-Log "Frontend started -> http://localhost:5174/ (PID: $($process.Id))" "SUCCESS"
        return @{
            Name = "heikeji-web"
            Port = 5174
            DisplayName = "Frontend Dev Server"
            Process = $process
            Path = $FRONTEND_DIR
        }
    } catch {
        $errMsg = $_.Exception.Message
        Write-Log ("Failed to start frontend: {0}" -f $errMsg) "ERROR"
        return $null
    }
}

function Invoke-HealthCheck {
    param([array]$Services)

    Write-Host ""
    Write-Host "[*] Running Health Check..." -ForegroundColor Yellow
    Write-Host ""

    $readyCount = 0
    $total = $Services.Count

    foreach ($svc in $Services) {
        $port = $svc.Port
        $name = $svc.DisplayName

        Write-Host "  Checking $name (port $port)... " -NoNewline

        if (Test-Port -Port $port -TimeoutMs 2000) {
            Write-Host "[OK] READY" -ForegroundColor Green
            $readyCount++
        } else {
            Write-Host "[..] STARTING..." -ForegroundColor Yellow
        }

        Start-Sleep -Milliseconds 200
    }

    Write-Host ""
    $percentage = [math]::Round(($readyCount / $total) * 100, 1)
    Write-Log "Health Check Complete: $readyCount/$total services ready ($percentage%)" "INFO"

    return $readyCount
}

function Show-Summary {
    param([array]$StartedServices, [timespan]$Duration)

    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║           [*] Startup Summary [*]               ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""

    $totalTime = "{0:F2}" -f $Duration.TotalSeconds
    Write-Log "Total startup time: $totalTime seconds" "INFO"
    Write-Log "Services launched: $($StartedServices.Count)" "INFO"
    Write-Host ""

    Write-Host "--- Services Status ---" -ForegroundColor Green
    Write-Host ""

    $frontendSvc = $StartedServices | Where-Object { $_.Name -eq "heikeji-web" }
    if ($frontendSvc) {
        Write-Host "  [Frontend]:" -ForegroundColor White
        Write-Host "     - heikeji-web:5174  (Vite Dev Server + Mock API)" -ForegroundColor Green
        Write-Host ""
    }

    Write-Host "  [Backend] Microservices:" -ForegroundColor White
    $backendSvcs = $StartedServices | Where-Object { $_.Name -ne "heikeji-web" } | Sort-Object Port
    foreach ($svc in $backendSvcs) {
        $portReady = Test-Port -Port $svc.Port -TimeoutMs 500
        $statusIcon = if ($portReady) { [char]0x2705 } else { [char]0x23F3 }
        $statusColor = if ($portReady) { "Green" } else { "Yellow" }
        Write-Host "     - $($svc.Name):$($svc.Port.ToString().PadLeft(5))  ($($svc.DisplayName))" -ForegroundColor $statusColor
    }

    Write-Host ""
    Write-Host "--- Access URLs ---" -ForegroundColor Magenta
    if ($frontendSvc) {
        Write-Host "  [WEB] Frontend:   http://localhost:5174/" -ForegroundColor Magenta
    }
    Write-Host "  [API] Gateway:    http://localhost:8080/" -ForegroundColor Magenta
    Write-Host "  [CFG] Nacos:      http://192.168.186.128:8848/nacos" -ForegroundColor Magenta
    Write-Host ""
}

Show-Banner

$BASE_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$FRONTEND_DIR = "$BASE_DIR\heikeji-web"
$SERVICE_DIR = "$BASE_DIR\heikeji-mall-service"

$startedServices = @()

$frontendOnly = $args -contains "-frontend"
$backendOnly = $args -contains "-backend"
$coreOnly = $args -contains "-core"
$businessOnly = $args -contains "-business"
$enableParallel = $args -contains "-parallel"
$runHealthCheck = $args -contains "-check"
$noWait = $args -contains "-no-wait"
$showHelp = $args -contains "-help" -or $args -contains "-h"

if ($showHelp) {
    Show-Help
}

Write-Log "Script version: 2.0 (Enhanced)" "INFO"
Write-Log "Mode: $(if ($enableParallel) { 'Parallel' } else { 'Sequential' })" "INFO"
Write-Log "Base directory: $BASE_DIR" "INFO"
Write-Host ""

# Define services with priority groups
$coreServices = @(
    @("heikeji-gateway", "8080", "API Gateway", "$BASE_DIR\heikeji-gateway"),
    @("heikeji-system", "8002", "System Service", "$BASE_DIR\heikeji-system"),
    @("service-user", "8085", "User Service", "$SERVICE_DIR\service-user")
)

$businessServices = @(
    @("service-product", "8082", "Product Service", "$SERVICE_DIR\service-product"),
    @("service-order", "8083", "Order Service", "$SERVICE_DIR\service-order"),
    @("service-payment", "8004", "Payment Service", "$SERVICE_DIR\service-payment"),
    @("service-delivery", "8010", "Delivery Service", "$SERVICE_DIR\service-delivery"),
    @("service-takeout", "8005", "Takeout Service", "$SERVICE_DIR\service-takeout"),
    @("service-campus", "8003", "Campus Service", "$SERVICE_DIR\service-campus"),
    @("service-secondhand", "8006", "Secondhand Service", "$SERVICE_DIR\service-secondhand"),
    @("service-lostfound", "8007", "LostFound Service", "$SERVICE_DIR\service-lostfound"),
    @("service-member", "8088", "Member Service", "$SERVICE_DIR\service-member")
)

$auxiliaryServices = @(
    @("heikeji-admin", "8090", "Admin Service", "$BASE_DIR\heikeji-admin"),
    @("heikeji-mall-job", "8086", "Job Scheduler", "$BASE_DIR\heikeji-mall-job"),
    @("service-api-docs", "8089", "API Docs Service", "$BASE_DIR\service-api-docs")
)

# Start Frontend
if (-not $backendOnly) {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "  [Phase 1/3] Starting Frontend" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host ""

    $frontendResult = Start-Frontend -Parallel $enableParallel
    if ($frontendResult) {
        $startedServices += $frontendResult
    }

    if ($frontendOnly) {
        Show-Summary -StartedServices $startedServices -Duration ((Get-Date) - $startTime)
        if (-not $noWait) { Read-Host ('Press Enter to exit...') }
        exit 0
    }
}

# Start Core Backend Services
if (-not $frontendOnly -and -not $businessOnly) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "  [Phase 2/3] Starting Core Services" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host ""

    foreach ($svc in $coreServices) {
        $result = Start-ServiceJob `
            -Name $svc[0] `
            -Port $svc[1] `
            -DisplayName $svc[2] `
            -Path $svc[3] `
            -Parallel $enableParallel

        if ($result) {
            $startedServices += $result
        }

        if (-not $enableParallel) {
            Start-Sleep -Milliseconds 800
        }
    }

    if ($coreOnly) {
        Start-Sleep -Seconds 3
        if ($runHealthCheck) {
            Invoke-HealthCheck -Services $startedServices
        }
        Show-Summary -StartedServices $startedServices -Duration ((Get-Date) - $startTime)
        if (-not $noWait) { Read-Host ('Press Enter to exit...') }
        exit 0
    }
}

# Start Business Services
if (-not $frontendOnly -and -not $coreOnly) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "  [Phase 3/3] Starting Business and Auxiliary Services" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host ""

    $allBusinessServices = $businessServices + $auxiliaryServices

    foreach ($svc in $allBusinessServices) {
        $result = Start-ServiceJob `
            -Name $svc[0] `
            -Port $svc[1] `
            -DisplayName $svc[2] `
            -Path $svc[3] `
            -Parallel $enableParallel

        if ($result) {
            $startedServices += $result
        }

        if (-not $enableParallel) {
            Start-Sleep -Milliseconds 500
        }
    }
}

# Wait a bit for services to initialize
if ($enableParallel) {
    Write-Host ""
    Write-Log "Waiting for services to initialize..." "INFO"
    Start-Sleep -Seconds 5
}

# Run health check if requested
if ($runHealthCheck) {
    Invoke-HealthCheck -Services $startedServices
}

# Show final summary
$duration = (Get-Date) - $startTime
Show-Summary -StartedServices $startedServices -Duration $duration

Write-Host "[*] Tips:" -ForegroundColor Yellow
Write-Host "  - Each service runs in its own window $(if ($enableParallel) { '(minimized)' })" -ForegroundColor White
Write-Host "  - Wait 2-3 minutes for all services to fully initialize" -ForegroundColor White
Write-Host "  - Check individual service windows for detailed logs" -ForegroundColor White
Write-Host "  - Use -check option to verify service status" -ForegroundColor White
Write-Host ""

if (-not $noWait) {
    Read-Host 'Press Enter to exit...'
}
