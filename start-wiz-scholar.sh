#!/bin/bash

# Wiz Scholar - Clean Startup Script
# This script starts all three servers in the correct order

echo "🧙‍♂️ Starting Wiz Scholar - Clean Startup"
echo "========================================="

# Kill any existing processes on our ports
echo "🔄 Cleaning up existing processes..."
lsof -ti:3000,5001,8001 | xargs kill -9 2>/dev/null || true
sleep 2

# Project root directory
PROJECT_ROOT="/Users/sainava/Desktop/Wiz-Scholar"
cd "$PROJECT_ROOT"

echo "📁 Working from: $(pwd)"

# Function to check if a port is ready
wait_for_port() {
    local port=$1
    local service=$2
    echo "⏳ Waiting for $service to start on port $port..."
    while ! nc -z localhost $port; do
        sleep 1
    done
    echo "✅ $service is ready on port $port"
}

# Function to start AI server
start_ai_server() {
    echo ""
    echo "🤖 Starting AI Server (Port 8001)..."
    cd "$PROJECT_ROOT/ai_server"
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "❌ Virtual environment not found. Creating..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment and install dependencies
    source venv/bin/activate
    
    # Install requirements if needed
    pip install -r requirements.txt > /dev/null 2>&1
    
    # Start AI server in background
    nohup python main.py > ai_server.log 2>&1 &
    AI_SERVER_PID=$!
    echo "🔄 AI Server started (PID: $AI_SERVER_PID)"
    
    # Wait for AI server to be ready
    wait_for_port 8001 "AI Server"
}

# Function to start Express server
start_express_server() {
    echo ""
    echo "🚀 Starting Express Server (Port 5001)..."
    cd "$PROJECT_ROOT/server"
    
    # Install dependencies if needed
    npm install > /dev/null 2>&1
    
    # Start Express server in background
    nohup npm start > express_server.log 2>&1 &
    EXPRESS_SERVER_PID=$!
    echo "🔄 Express Server started (PID: $EXPRESS_SERVER_PID)"
    
    # Wait for Express server to be ready
    wait_for_port 5001 "Express Server"
}

# Function to start React client
start_react_client() {
    echo ""
    echo "⚛️ Starting React Client (Port 3000)..."
    cd "$PROJECT_ROOT/client"
    
    # Install dependencies if needed
    npm install > /dev/null 2>&1
    
    # Start React client in background
    nohup npm run dev > react_client.log 2>&1 &
    REACT_CLIENT_PID=$!
    echo "🔄 React Client started (PID: $REACT_CLIENT_PID)"
    
    # Wait for React client to be ready
    wait_for_port 3000 "React Client"
}

# Start all servers
start_ai_server
start_express_server
start_react_client

echo ""
echo "🎉 All servers are running!"
echo "=========================="
echo "🤖 AI Server:      http://localhost:8001"
echo "🚀 Express Server: http://localhost:5001"
echo "⚛️ React Client:   http://localhost:3000"
echo ""
echo "📋 Process IDs:"
echo "   AI Server: $AI_SERVER_PID"
echo "   Express:   $EXPRESS_SERVER_PID"
echo "   React:     $REACT_CLIENT_PID"
echo ""
echo "📊 Log files:"
echo "   AI Server: $PROJECT_ROOT/ai_server/ai_server.log"
echo "   Express:   $PROJECT_ROOT/server/express_server.log"
echo "   React:     $PROJECT_ROOT/client/react_client.log"
echo ""
echo "🛑 To stop all servers: kill $AI_SERVER_PID $EXPRESS_SERVER_PID $REACT_CLIENT_PID"
echo ""
echo "🧙‍♂️ Wiz Scholar is ready for magical PDF summarization!"

# Keep the script running to show status
echo "Press Ctrl+C to stop monitoring (servers will continue running)"
trap 'echo "Monitoring stopped. Servers are still running."; exit 0' INT

# Monitor servers
while true; do
    sleep 30
    echo "📊 $(date): Checking server status..."
    
    if ! kill -0 $AI_SERVER_PID 2>/dev/null; then
        echo "❌ AI Server stopped unexpectedly"
    fi
    
    if ! kill -0 $EXPRESS_SERVER_PID 2>/dev/null; then
        echo "❌ Express Server stopped unexpectedly"
    fi
    
    if ! kill -0 $REACT_CLIENT_PID 2>/dev/null; then
        echo "❌ React Client stopped unexpectedly"
    fi
done
