#!/bin/bash

echo "🏗️  Building Docker images..."

# Build frontend image
echo "Building frontend image..."
docker build -t faq-system-frontend:latest ./frontend

# Build backend image
echo "Building backend image..."
docker build -t faq-system-backend:latest ./backend

echo "✅ Build complete!" 