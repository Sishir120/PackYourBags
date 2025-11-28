# PackYourBags Startup Script (PowerShell)

Write-Host "Starting PackYourBags Application..." -ForegroundColor Green
Write-Host ""

# Start Backend Server
Write-Host "[1/2] Starting Flask Backend Server on port 5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python app.py" -WindowStyle Normal

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "[2/2] Starting React Frontend Server on port 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend_temp; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "================================" -ForegroundColor Yellow
Write-Host "PackYourBags is starting up!" -ForegroundColor Yellow
Write-Host "================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "The app is now running in separate windows." -ForegroundColor White
Write-Host "Close those windows to stop the servers." -ForegroundColor White
