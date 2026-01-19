@echo off
echo ============================================
echo   SMART AQUARIUM DASHBOARD - INSTALLER
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js tidak ditemukan!
    echo.
    echo Silakan install Node.js terlebih dahulu dari:
    echo https://nodejs.org/
    echo.
    echo Pilih versi LTS ^(Long Term Support^)
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js terdeteksi
node -v
echo.

REM Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm tidak ditemukan!
    pause
    exit /b 1
)

echo [OK] npm terdeteksi
npm -v
echo.

echo ============================================
echo   Menginstall dependencies...
echo ============================================
echo.

REM Install dependencies
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Instalasi gagal!
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo   INSTALASI SELESAI!
echo ============================================
echo.
echo Untuk menjalankan aplikasi:
echo   npm run dev
echo.
echo Aplikasi akan berjalan di:
echo   http://localhost:5173
echo.
echo ============================================
echo.
pause
