@echo off
setlocal
title GEB Application Launcher

cd /d "%~dp0"

echo ===============================================================================
echo                GEB - Government Employee Board Portal Launcher                
echo ===============================================================================
echo.

where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Python is not found in your system PATH.
    echo Please install Python 3.10+ and ensure Add Python to PATH is checked.
    echo.
    pause
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js / npm is not found in your system PATH.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [1/4] Checking Backend Virtual Environment...
if not exist "backend\venv\Scripts\python.exe" (
    echo [SETUP] Virtual environment not found. Creating backend venv...
    python -m venv backend\venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo [SETUP] Installing backend dependencies...
    call "backend\venv\Scripts\pip.exe" install -r backend\requirements.txt
)

echo [2/4] Initializing Database and Admin Seed...
cd /d "%~dp0backend"
call ".\venv\Scripts\python.exe" create_tables.py >nul 2>&1
call ".\venv\Scripts\python.exe" seed_admin.py >nul 2>&1
cd /d "%~dp0"

echo [3/4] Checking Frontend Dependencies...
if not exist "frontend\node_modules" (
    echo [SETUP] Installing frontend node packages. Please wait...
    cd /d "%~dp0frontend"
    call npm install
    cd /d "%~dp0"
)

echo [4/4] Starting GEB Backend and Frontend Services...

start "GEB Backend (FastAPI on Port 8000)" cmd /k "cd /d %~dp0backend && .\venv\Scripts\activate && title [GEB] Backend - FastAPI (Port 8000) && uvicorn app.main:app --reload --port 8000"

start "GEB Frontend (Vite on Port 5173)" cmd /k "cd /d %~dp0frontend && title [GEB] Frontend - Vite (Port 5173) && npm run dev"

echo.
echo ===============================================================================
echo                      GEB SYSTEM IS RUNNING SUCCESSFULLY!                      
echo ===============================================================================
echo.
echo   * Frontend Web UI:    http://localhost:5173
echo   * Backend REST API:   http://localhost:8000
echo   * API Documentation:  http://localhost:8000/docs
echo.
echo   * Default Admin Email:    admin@geb.gov
echo   * Default Admin Password: Admin@123
echo.
echo ===============================================================================
echo.
echo Opening http://localhost:5173 in your default browser...
ping 127.0.0.1 -n 3 >nul
start http://localhost:5173

echo.
echo Keep this window or minimize it. Run stop.bat anytime to shut down servers.
echo.
pause
