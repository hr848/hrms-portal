$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$AnalyticsRoot = Join-Path $Root "attendance-analytics-runtime"
$PidFile = Join-Path $Root ".integrated-services-pids.json"
$HrmsPidFile = Join-Path $Root ".server.pid"
$HrmsLog = Join-Path $Root ".server.log"
$AnalyticsLogDir = Join-Path $Root "attendance-analytics-runtime\logs"
$TempDir = $env:TEMP
$AnalyticsPython = Join-Path $Root "attendance-analytics-runtime\backend\.venv\Scripts\python.exe"
$AnalyticsPip = Join-Path $Root "attendance-analytics-runtime\backend\.venv\Scripts\pip.exe"
$SystemAnalyticsPython = (Get-Command python -ErrorAction SilentlyContinue).Source

New-Item -ItemType Directory -Force -Path $AnalyticsLogDir | Out-Null

function Test-PortListening {
  param([int]$Port)
  $client = New-Object System.Net.Sockets.TcpClient
  try {
    $result = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
    if (-not $result.AsyncWaitHandle.WaitOne(700, $false)) { return $false }
    $client.EndConnect($result)
    return $true
  } catch {
    return $false
  } finally {
    $client.Close()
  }
}

function Wait-Port {
  param([int]$Port, [string]$Name)
  for ($i = 1; $i -le 45; $i++) {
    if (Test-PortListening -Port $Port) {
      Write-Host "$Name is ready on port $Port." -ForegroundColor Green
      return $true
    }
    Start-Sleep -Seconds 1
  }
  Write-Host "$Name did not become ready on port $Port in time." -ForegroundColor Yellow
  return $false
}
function Test-HttpReady {
  param([string]$Url)
  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 2
    return [int]$response.StatusCode -ge 200 -and [int]$response.StatusCode -lt 500
  } catch {
    return $false
  }
}

$pids = [ordered]@{}
Write-Host "Starting HRMS with attendance analytics..." -ForegroundColor Cyan

if (Test-HttpReady -Url "http://127.0.0.1:4173/index.html") {
  Write-Host "HRMS is already running on http://127.0.0.1:4173" -ForegroundColor Yellow
} elseif (Test-PortListening -Port 4173) {
  Write-Host "Port 4173 is occupied but HRMS is not responding. Please close the stale process or restart the machine, then run start-server.bat again." -ForegroundColor Red
} else {
  $hrmsProcess = Start-Process -FilePath cmd.exe -ArgumentList @('/c', 'python', 'server.py', '--port', '4173', '--host', '127.0.0.1') -WorkingDirectory $Root -PassThru -WindowStyle Hidden
  $pids.hrms = $hrmsProcess.Id
  Set-Content -LiteralPath $HrmsPidFile -Value $hrmsProcess.Id -Encoding ASCII
  Write-Host "HRMS started with PID $($hrmsProcess.Id)." -ForegroundColor Green
}

$Backend = Join-Path $AnalyticsRoot "backend"
if (-not (Test-Path -LiteralPath $Backend)) {
  Write-Host "HRMS-local analytics backend was not found: $Backend" -ForegroundColor Red
} elseif (Test-PortListening -Port 8010) {
  Write-Host "Analytics backend is already running on http://127.0.0.1:8010" -ForegroundColor Yellow
} else {
  $OriginalAnalyticsPython = "C:\Users\Anubhab\Documents\Codex\2026-07-04\ask-me-if-any-doubt-about-2\outputs\attendance-analytics-portal\backend\.venv\Scripts\python.exe"
  $SystemAnalyticsReady = $false
  if ($SystemAnalyticsPython) {
    & $SystemAnalyticsPython -c "import fastapi, pandas, openpyxl, uvicorn, win32com.client" 2>$null
    $SystemAnalyticsReady = ($LASTEXITCODE -eq 0)
  }
  if ($SystemAnalyticsReady) {
    $AnalyticsPython = $SystemAnalyticsPython
  } elseif (Test-Path -LiteralPath $OriginalAnalyticsPython) {
    $AnalyticsPython = $OriginalAnalyticsPython
  }
  $backendProcess = Start-Process -FilePath $AnalyticsPython -ArgumentList @('-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8010') -WorkingDirectory $Backend -PassThru -WindowStyle Hidden
  $pids.analyticsBackend = $backendProcess.Id
  Write-Host "HRMS-local analytics backend started with PID $($backendProcess.Id)." -ForegroundColor Green
}

if ($pids.Count -gt 0) {
  $pids | ConvertTo-Json | Set-Content -LiteralPath $PidFile -Encoding UTF8
}

if (Test-HttpReady -Url "http://127.0.0.1:4173/index.html") { Write-Host "HRMS is ready on http://127.0.0.1:4173/index.html" -ForegroundColor Green } else { Write-Host "HRMS page is not responding on http://127.0.0.1:4173/index.html" -ForegroundColor Red }
Wait-Port -Port 8010 -Name "Attendance analytics API" | Out-Null

Write-Host ""
Write-Host "Integrated HRMS services are available:" -ForegroundColor Green
Write-Host "  HRMS                 http://127.0.0.1:4173/index.html"
Write-Host "  Attendance analytics http://127.0.0.1:4173/attendance-analytics/index.html"
Write-Host "  Analytics API        http://127.0.0.1:8010/health"








