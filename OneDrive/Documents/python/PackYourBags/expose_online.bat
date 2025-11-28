@echo off
title PackYourBags - Expose Online

echo ====================================================
echo PackYourBags - Make Localhost Online
echo ====================================================

echo.
echo This script will help you expose your local application to the internet.
echo.

REM Check if ngrok is installed
where ngrok >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: ngrok is not installed or not in PATH
    echo.
    echo Please install ngrok:
    echo 1. Visit https://ngrok.com/download
    echo 2. Download the Windows version
    echo 3. Extract and add ngrok.exe to your system PATH
    echo 4. Sign up for a free account at https://ngrok.com/signup
    echo 5. Authenticate with: ngrok authtoken YOUR_AUTH_TOKEN
    echo.
    pause
    exit /b 1
)

echo ✓ ngrok is installed
echo.

echo Starting local servers and exposing them online...
echo.

echo 1. Starting backend server in new window...
start "Backend Server" cmd /k "cd backend && python app.py"

timeout /t 5 /nobreak >nul

echo 2. Starting frontend server in new window...
start "Frontend Server" cmd /k "cd frontend_temp && npm run dev"

timeout /t 10 /nobreak >nul

echo 3. Exposing backend (port 5000) with ngrok...
start "ngrok Backend" cmd /k "ngrok http 5000"

timeout /t 3 /nobreak >nul

echo 4. Exposing frontend (port 3000) with ngrok...
start "ngrok Frontend" cmd /k "ngrok http 3000"

echo.
echo ====================================================
echo SETUP COMPLETE!
echo ====================================================
echo.
echo Your application is now accessible online!
echo.
echo NEXT STEPS:
echo 1. Check the "ngrok Backend" window for the public backend URL
echo 2. Check the "ngrok Frontend" window for the public frontend URL
echo 3. Update frontend\temp\.env to use the backend ngrok URL:
echo    Change VITE_API_BASE_URL to point to your ngrok backend URL
echo 4. Rebuild frontend: cd frontend_temp && npm run build
echo.
echo To stop all servers, close all the command windows
echo.
pause