#!/bin/bash
# Cloudflare Pages Deployment Script

set -e

echo "🚀 Starting Cloudflare Pages Deployment..."

# Navigate to UI directory
cd ui

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the Next.js application
echo "🔨 Building Next.js application..."
npm run build

# Deploy to Cloudflare Pages
echo "☁️  Deploying to Cloudflare Pages..."
wrangler pages deploy .next --project-name=aidevelo-ai

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: https://aidevelo-ai.pages.dev"

