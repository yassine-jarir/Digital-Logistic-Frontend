#!/bin/bash

# Quick Start Script for Logistics Frontend
# This script checks prerequisites and starts the application

echo "=========================================="
echo "Digital Logistics Frontend - Quick Start"
echo "=========================================="
echo ""

# Check Node.js
echo "Checking Node.js version..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION found"
echo ""

# Check backend API
echo "Checking backend API on http://localhost:9090..."
if curl -s http://localhost:9090/actuator/health > /dev/null 2>&1; then
    echo "✅ Backend API is running"
else
    echo "⚠️  Backend API is not responding on http://localhost:9090"
    echo "   Please start the backend before proceeding."
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Start development server
echo "=========================================="
echo "Starting development server..."
echo "=========================================="
echo ""
echo "Application will be available at:"
echo "👉 http://localhost:4200"
echo ""
echo "Test credentials:"
echo "  Admin:     username: admin,     password: admin"
echo "  Warehouse: username: warehouse, password: warehouse"
echo "  Client:    username: client,    password: client"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

npm start
