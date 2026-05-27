#!/bin/bash
# Stock Analysis App - Local Development Startup Script

echo "🚀 Starting Stock Analysis App..."

# Start backend
echo "📦 Starting Python backend on port 8100..."
cd backend
pip3 install -r requirements.txt -q 2>/dev/null
uvicorn main:app --host 0.0.0.0 --port 8100 --reload &
BACKEND_PID=$!
cd ..

# Wait for backend to be ready
sleep 3

# Start frontend
echo "🎨 Starting React frontend on port 5173..."
cd frontend
npm install -q 2>/dev/null
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Stock Analysis App is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8100"
echo ""
echo "Press Ctrl+C to stop both servers."

# Trap to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
