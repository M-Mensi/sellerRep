@echo off
REM Node.js Backend & Frontend Startup Script for Windows
REM This script starts both backend and frontend servers in separate windows

echo.
echo ========================================
echo Node.js Full Stack Application Startup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js version:
node --version
echo.

REM Colors and formatting
set "SUCCESS=[SUCCESS]"
set "ERROR=[ERROR]"
set "INFO=[INFO]"
set "WAIT=[WAIT]"

echo %INFO% Checking dependencies...
echo.

REM Check backend dependencies
cd /d "%~dp0backend" || goto error
if not exist "node_modules" (
    echo %INFO% Installing backend dependencies...
    call npm install >nul 2>&1
    if errorlevel 1 (
        echo %ERROR% Failed to install backend dependencies
        echo Try running: cd backend ^&^& npm install
        pause
        exit /b 1
    )
    echo %SUCCESS% Backend dependencies installed
) else (
    echo %SUCCESS% Backend dependencies already installed
)

REM Check frontend dependencies
cd /d "%~dp0..\frontend" || goto error
if not exist "node_modules" (
    echo %INFO% Installing frontend dependencies...
    call npm install >nul 2>&1
    if errorlevel 1 (
        echo %ERROR% Failed to install frontend dependencies
        echo Try running: cd frontend ^&^& npm install
        pause
        exit /b 1
    )
    echo %SUCCESS% Frontend dependencies installed
) else (
    echo %SUCCESS% Frontend dependencies already installed
)

echo.
echo %INFO% Starting servers...
echo.

REM Start backend in new window
echo %WAIT% Starting backend server (port 3000)...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "title Backend Server (Port 3000)&node src/server.js"
timeout /t 2 /nobreak

REM Start frontend in new window
echo %WAIT% Starting frontend server (port 3001)...
cd /d "%~dp0frontend"
start "Frontend Server" cmd /k "title Frontend Server (Port 3001)&npm start"
timeout /t 2 /nobreak

echo.
echo ========================================
echo %SUCCESS% Servers started successfully!
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:3001
echo.
echo %INFO% Opening browser...
timeout /t 3 /nobreak

REM Try to open browser
start http://localhost:3001

echo.
echo %INFO% Application is ready!
echo.
echo To verify setup, run in another terminal:
echo.
echo   node verify-setup.js
echo   node test-api.js
echo.
pause
goto :eof

:error
echo %ERROR% Navigation error occurred
pause
exit /b 1
