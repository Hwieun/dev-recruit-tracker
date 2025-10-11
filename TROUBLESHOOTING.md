# Troubleshooting Guide

## White Screen Issue

If you see a white screen when accessing http://localhost:5173/, follow these steps:

### 1. Check Browser Console

Open your browser's Developer Tools (F12 or Cmd+Option+I on Mac) and look at the Console tab for errors.

### 2. Common Issues and Fixes

#### Issue: Missing Dependencies
```bash
cd frontend
npm install
```

#### Issue: Port Already in Use
```bash
# Kill existing processes
lsof -ti:5173 | xargs kill -9  # Kill frontend
lsof -ti:8000 | xargs kill -9  # Kill backend
```

#### Issue: Backend Not Running
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

Check if you see: `Starting development server at http://127.0.0.1:8000/`

#### Issue: CORS Errors
Make sure backend/recruit_tracker/settings.py has:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### 3. Step-by-Step Debugging

**Step 1: Test Backend**
```bash
curl http://localhost:8000/api/positions/
```

Expected output:
```json
{"count":0,"next":null,"previous":null,"results":[]}
```

**Step 2: Test Frontend Dev Server**
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v7.1.9  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Step 3: Check for JavaScript Errors**

Open http://localhost:5173 and check the browser console (F12).

Common errors:
- **"Cannot read property of undefined"** - Check component state initialization
- **"Failed to fetch"** - Backend not running or CORS issue
- **"Unexpected token <"** - Check import paths

### 4. Verify File Changes

If you recently updated files, make sure:

1. No syntax errors in JSX files
2. All imports are correct
3. CSS variables are defined in App.css
4. formData state includes all required fields

### 5. Fresh Start

If nothing works, try a complete restart:

```bash
# Stop all servers
pkill -f "python manage.py runserver"
pkill -f "vite"

# Navigate to project root
cd /Users/hwieun/dev-recruit-tracker

# Start backend
cd backend
source venv/bin/activate
python manage.py runserver &

# Wait a moment
sleep 2

# Start frontend
cd ../frontend
npm run dev
```

### 6. Check Node.js Version

You're currently using Node.js 20.18.1. While Vite prefers 20.19+, it should still work. If you see issues, consider upgrading:

```bash
# Check version
node --version

# If needed, upgrade Node.js
# Use nvm or download from nodejs.org
```

### 7. Recent Code Changes Fix

I just fixed an issue where `job_description` wasn't initialized in the formData state. This should resolve the white screen issue.

The fix was in [PositionList.jsx](frontend/src/pages/PositionList.jsx):

```javascript
const [formData, setFormData] = useState({
  company_name: '',
  position_title: '',
  recruiting_link: '',
  location: '',
  salary_range: '',
  current_status: 'applied',
  job_description: '',  // ← Added this
});
```

### 8. Check Network Tab

In browser DevTools, go to Network tab and refresh. Look for:

- **index.html** - Should return 200 OK
- **main.jsx** or **App.jsx** - Should return 200 OK
- **/api/positions/** - Should return 200 OK

### 9. Test with Simple HTML

Create a test file to verify the backend:

```html
<!DOCTYPE html>
<html>
<body>
<h1>API Test</h1>
<div id="result">Loading...</div>
<script>
fetch('http://localhost:8000/api/positions/')
  .then(r => r.json())
  .then(data => {
    document.getElementById('result').innerHTML =
      '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
  })
  .catch(err => {
    document.getElementById('result').innerHTML = 'Error: ' + err;
  });
</script>
</body>
</html>
```

Save this as `test.html` and open it in your browser.

### 10. Check Vite Config

Make sure [vite.config.js](frontend/vite.config.js) exists and is configured correctly.

## Still Having Issues?

### Collect Debug Information

Run these commands and share the output:

```bash
# Backend status
curl http://localhost:8000/api/positions/

# Frontend status
curl -I http://localhost:5173/

# Check processes
lsof -i :8000
lsof -i :5173

# Node version
node --version
npm --version

# Python version
python --version
```

### Common Error Messages

| Error | Solution |
|-------|----------|
| "That port is already in use" | Kill the process using `lsof -ti:PORT \| xargs kill -9` |
| "Module not found" | Run `npm install` in frontend |
| "Connection refused" | Backend not running, start with `python manage.py runserver` |
| "CORS policy" | Check CORS_ALLOWED_ORIGINS in settings.py |
| "Unexpected token <" | Import path error, check file paths |
| White screen, no errors | Check browser console, might be React error boundary |

### Reset Everything

As a last resort:

```bash
# Stop all servers
pkill -f "python manage.py runserver"
pkill -f "vite"

# Clean frontend
cd frontend
rm -rf node_modules
npm install

# Clean backend (optional)
cd ../backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate

# Restart
cd ..
./start.sh
```

---

## Success Indicators

When everything is working, you should see:

1. **Backend**: http://localhost:8000/api/positions/ returns JSON
2. **Frontend**: http://localhost:5173 shows the application
3. **Browser Console**: No red errors
4. **Network Tab**: All requests return 200 OK

## Need More Help?

Check the main [README.md](README.md) or [QUICKSTART.md](QUICKSTART.md) for setup instructions.
