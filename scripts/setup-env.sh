#!/bin/bash

# SpeedCheck Pro Environment Setup Script

echo "🚀 Setting up SpeedCheck Pro environment variables..."

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

# Copy from env.example
if [ -f "env.example" ]; then
    cp env.example .env.local
    echo "✅ Created .env.local from env.example"
else
    echo "❌ env.example not found. Please create it first."
    exit 1
fi

# Update GTM ID if not already set
if ! grep -q "NEXT_PUBLIC_GTM_ID=GTM-W3TWP66V" .env.local; then
    echo "🔧 Setting Google Tag Manager ID to GTM-W3TWP66V"
    sed -i 's/NEXT_PUBLIC_GTM_ID=/NEXT_PUBLIC_GTM_ID=GTM-W3TWP66V/' .env.local
fi

# Update GA4 ID if not already set
if ! grep -q "NEXT_PUBLIC_GA_ID=G-1XB7TBR4PW" .env.local; then
    echo "🔧 Setting Google Analytics ID to G-1XB7TBR4PW"
    sed -i 's/NEXT_PUBLIC_GA_ID=/NEXT_PUBLIC_GA_ID=G-1XB7TBR4PW/' .env.local
fi

echo "✅ Environment setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env.local to add your API keys"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to test your application"
echo ""
echo "🔍 Google Tag Manager is configured with ID: GTM-W3TWP66V"
echo "🔍 Google Analytics is configured with ID: G-1XB7TBR4PW"
echo "   You can change these in .env.local if needed"
