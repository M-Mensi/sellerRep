# Node.js Backend & Frontend Startup Script (PowerShell)
# Run with: powershell -ExecutionPolicy Bypass -File startup.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Node.js Full Stack Application Startup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[SUCCESS] Node.js version: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Get script directory
$scriptDir = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition

Write-Host "`n[INFO] Checking dependencies...`n" -ForegroundColor Yellow

# Check and install backend dependencies
Write-Host "[INFO] Checking backend dependencies..." -ForegroundColor Yellow
$backendPath = Join-Path $scriptDir "backend"
Set-Location $backendPath

if (-not (Test-Path "node_modules")) {
    Write-Host "[WAIT] Installing backend dependencies..." -ForegroundColor Cyan
    & npm install | Out-Null
    Write-Host "[SUCCESS] Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "[SUCCESS] Backend dependencies already installed" -ForegroundColor Green
}

# Check and install frontend dependencies
Write-Host "[INFO] Checking frontend dependencies..." -ForegroundColor Yellow
$frontendPath = Join-Path $scriptDir "frontend"
Set-Location $frontendPath

if (-not (Test-Path "node_modules")) {
    Write-Host "[WAIT] Installing frontend dependencies..." -ForegroundColor Cyan
    & npm install | Out-Null
    Write-Host "[SUCCESS] Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "[SUCCESS] Frontend dependencies already installed" -ForegroundColor Green
}

Write-Host "`n[INFO] Starting servers...`n" -ForegroundColor Yellow

# Start backend server
Write-Host "[WAIT] Starting backend server (port 3000)..." -ForegroundColor Cyan
$backendPath = Join-Path $scriptDir "backend"
$backendProcess = Start-Process powershell `
    -ArgumentList "-NoExit -Command `"Set-Location '$backendPath'; node src/server.js`"" `
    -WindowStyle Normal `
    -PassThru

Start-Sleep -Seconds 2

# Start frontend server
Write-Host "[WAIT] Starting frontend server (port 3001)..." -ForegroundColor Cyan
$frontendPath = Join-Path $scriptDir "frontend"
$frontendProcess = Start-Process powershell `
    -ArgumentList "-NoExit -Command `"Set-Location '$frontendPath'; npm start`"" `
    -WindowStyle Normal `
    -PassThru

Start-Sleep -Seconds 2

# Display startup information
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "[SUCCESS] Servers started successfully!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Backend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3001" -ForegroundColor Cyan

Write-Host "`n[INFO] Opening browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Try to open browser
try {
    Start-Process "http://localhost:3001"
} catch {
    Write-Host "[WARNING] Could not open browser automatically" -ForegroundColor Yellow
    Write-Host "Please open http://localhost:3001 manually" -ForegroundColor Yellow
}

Write-Host "`n[SUCCESS] Application is ready!`n" -ForegroundColor Green

Write-Host "To verify setup in a new terminal, run:" -ForegroundColor Yellow
Write-Host "`n  Set-Location '$scriptDir'" -ForegroundColor Cyan
Write-Host "  node verify-setup.js" -ForegroundColor Cyan
Write-Host "  node test-api.js`n" -ForegroundColor Cyan

Write-Host "Servers are running. Press Ctrl+C to stop them or close their windows.`n" -ForegroundColor Gray

# Keep this window open
Read-Host "Press Enter to close this window"
