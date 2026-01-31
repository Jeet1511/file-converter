# HTML to PPT Converter - Simple Setup
Write-Host "Creating folders..." -ForegroundColor Cyan

# Create folders
if (-not (Test-Path "HTML FILES")) {
    New-Item -ItemType Directory -Path "HTML FILES" | Out-Null
    Write-Host "Created 'HTML FILES' folder" -ForegroundColor Green
}

if (-not (Test-Path "HTML_TO_PPT")) {
    New-Item -ItemType Directory -Path "HTML_TO_PPT" | Out-Null
    Write-Host "Created 'HTML_TO_PPT' folder" -ForegroundColor Green
}

# Move HTML files
Write-Host "`nMoving HTML files..." -ForegroundColor Cyan
$htmlFiles = Get-ChildItem -Path . -Filter "*.html" -File
foreach ($file in $htmlFiles) {
    Move-Item -Path $file.FullName -Destination "HTML FILES\" -Force
    Write-Host "Moved $($file.Name)" -ForegroundColor Gray
}

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Cyan
npm install --silent

# Run conversion
Write-Host "`nConverting to PowerPoint..." -ForegroundColor Cyan
node convert.js

Write-Host "`nDone! Check 'HTML_TO_PPT' folder for your presentation." -ForegroundColor Green
