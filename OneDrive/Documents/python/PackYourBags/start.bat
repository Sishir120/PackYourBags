@echo off
echo Starting PackYourBags Application...
echo.

REM Start Backend Server
echo [1/2] Starting Flask Backend Server on port 5000...
start "PackYourBags Backend" cmd /k "cd backend && python app.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak > nul

REM Start Frontend Server
echo [2/2] Starting React Frontend Server on port 3000...
start "PackYourBags Frontend" cmd /k "cd frontend_temp && npm run dev"

echo.
echo ================================
echo PackYourBags is starting up!
echo ================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
echo (The app will continue running in separate windows)
pause > nul
