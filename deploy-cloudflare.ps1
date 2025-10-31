# Cloudflare Pages Deployment Script for PowerShell

Write-Host "🚀 Starting Cloudflare Pages Deployment..." -ForegroundColor Cyan

# Navigate to UI directory
Set-Location ui

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Build the Next.js application
Write-Host "🔨 Building Next.js application..." -ForegroundColor Yellow
npm run build

# Deploy to Cloudflare Pages
Write-Host "☁️  Deploying to Cloudflare Pages..." -ForegroundColor Yellow
wrangler pages deploy .next --project-name=aidevelo-ai

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your site should be available at: https://aidevelo-ai.pages.dev" -ForegroundColor Green

