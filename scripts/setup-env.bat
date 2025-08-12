@echo off
REM SpeedCheck Pro Environment Setup Script for Windows

echo 🚀 Setting up SpeedCheck Pro environment variables...

REM Check if .env.local already exists
if exist ".env.local" (
    echo ⚠️  .env.local already exists. Backing up to .env.local.backup
    copy .env.local .env.local.backup
)

REM Copy from env.example
if exist "env.example" (
    copy env.example .env.local
    echo ✅ Created .env.local from env.example
) else (
    echo ❌ env.example not found. Please create it first.
    exit /b 1
)

REM Update GTM ID if not already set
findstr /C:"NEXT_PUBLIC_GTM_ID=GTM-W3TWP66V" .env.local >nul
if errorlevel 1 (
    echo 🔧 Setting Google Tag Manager ID to GTM-W3TWP66V
    powershell -Command "(Get-Content .env.local) -replace 'NEXT_PUBLIC_GTM_ID=', 'NEXT_PUBLIC_GTM_ID=GTM-W3TWP66V' | Set-Content .env.local"
)

REM Update GA4 ID if not already set
findstr /C:"NEXT_PUBLIC_GA_ID=G-1XB7TBR4PW" .env.local >nul
if errorlevel 1 (
    echo 🔧 Setting Google Analytics ID to G-1XB7TBR4PW
    powershell -Command "(Get-Content .env.local) -replace 'NEXT_PUBLIC_GA_ID=', 'NEXT_PUBLIC_GA_ID=G-1XB7TBR4PW' | Set-Content .env.local"
)

echo ✅ Environment setup complete!
echo.
echo 📝 Next steps:
echo 1. Edit .env.local to add your API keys
echo 2. Run 'npm run dev' to start the development server
echo 3. Visit http://localhost:3000 to test your application
echo.
echo 🔍 Google Tag Manager is configured with ID: GTM-W3TWP66V
echo 🔍 Google Analytics is configured with ID: G-1XB7TBR4PW
echo    You can change these in .env.local if needed
