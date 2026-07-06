#!/bin/bash

# PT. Cipta Sama Abadi - E-Commerce Platform Startup Script
# This script starts both frontend and backend services

echo "🚀 Starting PT. Cipta Sama Abadi E-Commerce Platform"
echo "=================================================="

# Check if env file exists
if [ ! -f "env" ]; then
    echo "❌ Error: 'env' file not found!"
    echo "Please create 'env' file with required environment variables:"
    echo "  GEMINI_API_KEY=your_gemini_api_key"
    echo "  SMTP_EMAIL=your_email@gmail.com"
    echo "  SMTP_PASSWORD=your_app_password"
    exit 1
fi

# Check if Python virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating Python virtual environment..."
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install/update Python dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Check if Node.js dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

echo ""
echo "🎯 Starting Services..."
echo ""

# Function to start backend
start_backend() {
    echo "🔧 Starting Backend Server (FastAPI)..."
    echo "   Port: 8000"
    echo "   API Docs: http://localhost:8000/docs"
    echo ""
    python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
}

# Function to start frontend
start_frontend() {
    echo "🎨 Starting Frontend Server (Next.js)..."
    echo "   Port: 3000 (or 3001 if 3000 occupied)"
    echo "   URL: http://localhost:3000"
    echo ""
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
}

# Start services
start_backend
sleep 3  # Wait for backend to initialize
start_frontend

echo ""
echo "✅ Services Started Successfully!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📊 Monitoring:"
echo "   Backend logs will appear above"
echo "   Frontend will show compilation status"
echo ""
echo "🛑 To stop services: Ctrl+C or kill PIDs"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""

# Wait for services
wait