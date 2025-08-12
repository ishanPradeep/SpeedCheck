#!/bin/bash

# Fix dependency issues for GlobalSpeedTrack
echo "🔧 Fixing dependency issues..."

# Remove existing node_modules and lock files
echo "Cleaning existing dependencies..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# Install dependencies with legacy peer deps
echo "Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps

# Verify installation
echo "Verifying installation..."
npm run build

echo "✅ Dependencies fixed successfully!"
echo "🚀 Ready for deployment!"
