# Safariya Build Script
# Builds frontend then starts backend

Write-Host "🌍 Building Safariya - Africa Explorer..." -ForegroundColor Yellow

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Cyan
npm install

# Install and build frontend
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
Set-Location client
npm install

Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
npm run build

Set-Location ..

Write-Host "✅ Build complete! Starting server..." -ForegroundColor Green
npm start
