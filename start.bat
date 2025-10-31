@echo off
echo 🏏 IPL Analytics Dashboard Startup
echo ================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python first.
    echo 📥 Download from: https://python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo 🔧 Installing Python requirements...
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Error installing Python requirements
    pause
    exit /b 1
)

echo 🔧 Installing Node.js dependencies...
npm install
if errorlevel 1 (
    echo ❌ Error installing Node.js dependencies
    pause
    exit /b 1
)

echo 🎉 Setup complete! Starting servers...
echo ================================================

REM Start Flask server in background
echo 🚀 Starting Flask backend server...
start "Flask Server" cmd /k "python app.py"

REM Wait for Flask to start
timeout /t 5 /nobreak >nul

REM Start React server
echo 🚀 Starting React frontend server...
echo 🌐 The dashboard will open in your browser at http://localhost:3000
start "React Server" cmd /k "npm start"

echo.
echo ✅ Both servers are starting...
echo 📊 Backend: http://localhost:5000
echo 🎨 Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
