@echo off
setlocal
title HRMS Portal - Start Integrated Services

cd /d "%~dp0"

echo.
echo Starting HRMS Portal with integrated Attendance Analytics...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-integrated-services.ps1"
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if "%EXIT_CODE%"=="0" (
  echo HRMS Portal is available at:
  echo http://127.0.0.1:4173/index.html
  echo.
  echo Attendance Analytics is available inside HRMS from the admin console.
) else (
  echo Start command finished with error code %EXIT_CODE%.
  echo Please share this window output if the portal does not open.
)
echo.
pause
exit /b %EXIT_CODE%
