@echo off
echo ============================================
echo   SMART AQUARIUM DASHBOARD - DEV SERVER
echo ============================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [WARNING] Dependencies belum diinstall!
    echo.
    echo Menjalankan npm install...
    echo.
    call npm install
    echo.
)

echo Starting development server...
echo.
echo Aplikasi akan terbuka di:
echo   http://localhost:5173
echo.
echo Tekan Ctrl+C untuk menghentikan server
echo.
echo ============================================
echo.

call npm run dev
