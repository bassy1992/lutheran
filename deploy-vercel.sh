#!/bin/bash

# Vercel Deployment Script for Trinity Lutheran Church Website
# This script deploys the frontend to Vercel using the CLI

echo "🚀 Trinity Lutheran Church - Vercel Deployment"
echo "=============================================="
echo ""

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed"
    echo "Installing Vercel CLI..."
    sudo npm install -g vercel
fi

echo "✅ Vercel CLI is installed"
echo ""

# Navigate to frontend directory
cd front

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Building project..."
npm run build

echo ""
echo "🌐 Deploying to Vercel..."
echo ""
echo "IMPORTANT: You will need to:"
echo "1. Login to Vercel (browser will open)"
echo "2. Select your scope/team"
echo "3. Link to existing project or create new one"
echo "4. Confirm deployment settings"
echo ""
echo "After deployment, remember to:"
echo "- Set VITE_API_BASE_URL environment variable in Vercel dashboard"
echo "- Update CORS_ALLOWED_ORIGINS in Railway backend"
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Find your project"
echo "3. Go to Settings > Environment Variables"
echo "4. Add: VITE_API_BASE_URL=https://your-railway-backend.railway.app/api"
echo "5. Redeploy the project"
echo ""
