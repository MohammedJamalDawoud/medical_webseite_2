# Automated Setup Script for Telemedicine Portal
# This script sets up both backend and frontend automatically

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Telemedicine Portal Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running from project root
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Error: Please run this script from the project root directory!" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Step 1: Setting up Backend..." -ForegroundColor Yellow
Write-Host ""

# Navigate to backend
Set-Location backend

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from .env.example..." -ForegroundColor Green
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created!" -ForegroundColor Green
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "🐍 Creating Python virtual environment..." -ForegroundColor Green
    python -m venv venv
    Write-Host "✅ Virtual environment created!" -ForegroundColor Green
} else {
    Write-Host "✅ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "🔄 Activating virtual environment..." -ForegroundColor Green
.\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Green
pip install -r requirements.txt --quiet

# Create and seed database
Write-Host "🌱 Creating and seeding database..." -ForegroundColor Green
python seed_data.py

Write-Host ""
Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""

# Return to project root
Set-Location ..

Write-Host "📋 Step 2: Setting up Frontend..." -ForegroundColor Yellow
Write-Host ""

# Navigate to frontend
Set-Location frontend

# Install dependencies
Write-Host "📦 Installing Node dependencies (this may take a few minutes)..." -ForegroundColor Green
npm install --silent

Write-Host ""
Write-Host "✅ Frontend setup complete!" -ForegroundColor Green
Write-Host ""

# Return to project root
Set-Location ..

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete! 🎉" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Demo Account Credentials:" -ForegroundColor Yellow
Write-Host "   Patient: demo.patient@example.com / password123" -ForegroundColor White
Write-Host "   Doctor:  demo.doctor@example.com / password123" -ForegroundColor White
Write-Host ""
Write-Host "🚀 To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. Start Backend (in this terminal):" -ForegroundColor White
Write-Host "      cd backend" -ForegroundColor Gray
Write-Host "      .\venv\Scripts\Activate.ps1" -ForegroundColor Gray
Write-Host "      python -m uvicorn main:app --reload" -ForegroundColor Gray
Write-Host ""
Write-Host "   2. Start Frontend (in a NEW terminal):" -ForegroundColor White
Write-Host "      cd frontend" -ForegroundColor Gray
Write-Host "      npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   3. Open: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
