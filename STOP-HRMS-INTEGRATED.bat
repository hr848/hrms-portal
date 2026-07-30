@echo off
setlocal
title HRMS Portal - Stop Integrated Services

cd /d "%~dp0"

echo.
echo Stopping HRMS Portal and integrated Attendance Analytics...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop-integrated-services.ps1"
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if "%EXIT_CODE%"=="0" (
  echo HRMS Portal and integrated Attendance Analytics are stopped.
) else (
  echo Stop command finished with error code %EXIT_CODE%.
  echo Please share this window output if anything remains running.
)
echo.
pause
exit /b %EXIT_CODE%
