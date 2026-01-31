# HTML to PPT Converter Setup Script
Write-Host "🚀 Setting up HTML to PPT Converter..." -ForegroundColor Cyan
Write-Host ""

# Create folder structure
Write-Host "📁 Creating folder structure..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "HTML FILES" -Force | Out-Null
New-Item -ItemType Directory -Path "HTML>>>PPT" -Force | Out-Null

# Move HTML files to HTML FILES folder
Write-Host "📄 Moving HTML files..." -ForegroundColor Yellow
Get-ChildItem -Filter "*.html" | Move-Item -Destination "HTML FILES" -Force

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Running conversion..." -ForegroundColor Cyan
Write-Host ""

# Run the conversion
node convert.js

Write-Host ""
Write-Host "🎉 All done! Check the 'HTML>>>PPT' folder for your PowerPoint file." -ForegroundColor Green
