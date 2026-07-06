@echo off
REM PT. Cipta Sama Abadi - E-Commerce Platform Startup Script (Windows)
REM This script starts both frontend and backend services

echo 🚀 Starting PT. Cipta Sama Abadi E-Commerce Platform
echo ==================================================

REM Check if env file exists
if not exist "env" (
    echo ❌ Error: 'env' file not found!
    echo Please create 'env' file with required environment variables:
    echo   GEMINI_API_KEY=your_gemini_api_key
    echo   SMTP_EMAIL=your_email@gmail.com
    echo   SMTP_PASSWORD=your_app_password
    pause
    exit /b 1
)

REM Check Python installation
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check Node.js installation
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating Python virtual environment...
call venv\Scripts\activate.bat

REM Install/update Python dependencies
echo 📥 Installing Python dependencies...
pip install -r requirements.txt

REM Check Node.js dependencies
if not exist "node_modules" (
    echo 📦 Installing Node.js dependencies...
    npm install
)

echo.
echo 🎯 Starting Services...
echo.

REM Start backend in background
echo 🔧 Starting Backend Server (FastAPI)...
echo    Port: 8000
echo    API Docs: http://localhost:8000/docs
echo.
start "Backend Server" cmd /k "call venv\Scripts\activate.bat && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a bit for backend to initialize
timeout /t 5 /nobreak >nul

REM Start frontend
echo 🎨 Starting Frontend Server (Next.js)...
echo    Port: 3000 (or 3001 if 3000 occupied)
echo    URL: http://localhost:3000
echo.
npm run dev

echo.
echo ✅ Services Started Successfully!
echo.
echo 🌐 Access URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo 🛑 To stop services: Close the command windows
echo.

pause