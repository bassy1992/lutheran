#!/bin/bash

echo "================================"
echo "Verifying Church Website Setup"
echo "================================"
echo ""

# Check if backend is running
echo "1. Checking Backend..."
if curl -s http://127.0.0.1:8000/api/events/ > /dev/null 2>&1; then
    echo "   ✅ Backend is running on port 8000"
    
    # Check events count
    EVENT_COUNT=$(curl -s http://127.0.0.1:8000/api/events/ | python3 -c "import sys, json; print(json.load(sys.stdin)['count'])" 2>/dev/null)
    if [ ! -z "$EVENT_COUNT" ]; then
        echo "   ✅ Found $EVENT_COUNT events in database"
    fi
else
    echo "   ❌ Backend is NOT running"
    echo "   Run: cd backend && source venv/bin/activate && python manage.py runserver"
fi

echo ""

# Check church info
echo "2. Checking Church Info API..."
if curl -s http://127.0.0.1:8000/api/church/info/ > /dev/null 2>&1; then
    echo "   ✅ Church Info API is working"
else
    echo "   ❌ Church Info API is NOT working"
fi

echo ""

# Check frontend env file
echo "3. Checking Frontend Configuration..."
if [ -f "front/.env.local" ]; then
    echo "   ✅ .env.local file exists"
    if grep -q "VITE_API_BASE_URL=http://127.0.0.1:8000/api" front/.env.local; then
        echo "   ✅ API URL is configured correctly"
    else
        echo "   ⚠️  API URL might be incorrect"
        echo "   Should be: VITE_API_BASE_URL=http://127.0.0.1:8000/api"
    fi
else
    echo "   ❌ .env.local file NOT found"
fi

echo ""

# Check if frontend is running
echo "4. Checking Frontend..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 3000"
elif curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on port 5173"
else
    echo "   ❌ Frontend is NOT running"
    echo "   Run: cd front && npm run dev"
fi

echo ""
echo "================================"
echo "Summary"
echo "================================"
echo ""
echo "If all checks pass, visit:"
echo "  http://localhost:3000/#/events"
echo "  or"
echo "  http://localhost:5173/#/events"
echo ""
echo "Django Admin:"
echo "  http://127.0.0.1:8000/admin/"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
echo "For debugging, see: TROUBLESHOOTING.md"
echo ""
