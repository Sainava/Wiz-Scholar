#!/bin/bash

# Wiz Scholar - Stop All Servers Script

echo "🛑 Stopping Wiz Scholar servers..."

# Kill processes on our ports
echo "🔄 Killing processes on ports 3000, 5001, and 8001..."
lsof -ti:3000,5001,8001 | xargs kill -9 2>/dev/null || true

# Clean up any remaining node/python processes related to our project
pkill -f "npm.*dev" 2>/dev/null || true
pkill -f "npm.*start" 2>/dev/null || true
pkill -f "python.*main.py" 2>/dev/null || true
pkill -f "uvicorn" 2>/dev/null || true

echo "✅ All Wiz Scholar servers stopped"
echo "🧹 Cleanup complete"
