$ErrorActionPreference = "Continue"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$PidFile = Join-Path $Root ".integrated-services-pids.json"
$HrmsPidFile = Join-Path $Root ".server.pid"

Write-Host "Stopping HRMS with attendance analytics..." -ForegroundColor Cyan

if (Test-Path -LiteralPath $PidFile) {
  try {
    $saved = Get-Content -LiteralPath $PidFile -Raw | ConvertFrom-Json
    foreach ($id in @($saved.hrms, $saved.analyticsBackend)) {
      if ($id) { & taskkill.exe /PID $id /F /T | Out-Null }
    }
    Remove-Item -LiteralPath $PidFile -Force -ErrorAction SilentlyContinue
  } catch {}
}

if (Test-Path -LiteralPath $HrmsPidFile) {
  try {
    $hrmsPid = Get-Content -LiteralPath $HrmsPidFile -Raw
    if ($hrmsPid) { & taskkill.exe /PID $hrmsPid /F /T | Out-Null }
    Remove-Item -LiteralPath $HrmsPidFile -Force -ErrorAction SilentlyContinue
  } catch {}
}

foreach ($port in 4173, 8010) {
  $lines = netstat -ano -p tcp | Select-String ":$port\s+.*LISTENING"
  foreach ($line in $lines) {
    $parts = ($line.Line -replace "\s+", " ").Trim().Split(" ")
    $portPid = $parts[$parts.Length - 1]
    if ($portPid -match "^\d+$") { & taskkill.exe /PID $portPid /F /T | Out-Null }
  }
}

Write-Host "HRMS and attendance analytics stopped." -ForegroundColor Green
exit 0

