@echo off
title Stop GEB Application
echo ===============================================================================
echo                      Stopping GEB Application Services                         
echo ===============================================================================
echo.

echo Terminating Backend (Uvicorn / Python processes on port 8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Terminating Frontend (Node / Vite processes on port 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo All GEB services on port 8000 and 5173 have been stopped successfully.
echo.
pause
