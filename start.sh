#!/bin/bash

# Start script for Dev Recruit Tracker

echo "Starting Dev Recruit Tracker..."
echo ""

# Start backend
echo "Starting Django backend..."
cd backend
source venv/bin/activate
python manage.py runserver &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

# Start frontend
echo "Starting React frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "================================"
echo "Dev Recruit Tracker is running!"
echo "================================"
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to press Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
