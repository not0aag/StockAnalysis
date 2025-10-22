#!/bin/bash
set -e

echo "Starting build process..."
echo "Current directory: $(pwd)"
echo "Listing files:"
ls -la

# Navigate to frontend directory
if [ -d "frontend" ]; then
    echo "Found frontend directory at ./frontend"
    cd frontend
elif [ -d "../frontend" ]; then
    echo "Found frontend directory at ../frontend"
    cd ../frontend
else
    echo "ERROR: Cannot find frontend directory!"
    exit 1
fi

echo "Installing frontend dependencies..."
npm install

echo "Building React app..."
npm run build

echo "Build complete!"
