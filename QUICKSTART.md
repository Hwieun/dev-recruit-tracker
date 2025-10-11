# Quick Start Guide

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ and npm installed
- Terminal/Command Line access

## Installation (First Time Only)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# (Optional) Create admin user
python manage.py createsuperuser
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install
```

## Running the Application

### Option 1: Using the start script (Mac/Linux)

```bash
# From the project root directory
./start.sh
```

### Option 2: Manual start (All platforms)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Access the Application

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8000/api](http://localhost:8000/api)
- **Django Admin:** [http://localhost:8000/admin](http://localhost:8000/admin) (if you created a superuser)

## First Steps

1. **Add your first position:**
   - Click "Positions" in the navigation
   - Click "Add Position"
   - Fill in company name, position title, and other details
   - Click "Create Position"

2. **View position details:**
   - Click on any position card
   - See the full details, job description, notes, and events

3. **Update status:**
   - On the position detail page, use the status buttons to track your progress

4. **Add notes:**
   - Click "Add Note" to create preparation notes for different interview stages

5. **Schedule interviews:**
   - Click "Add Event" to schedule interview sessions
   - View them in the calendar

6. **Auto-fetch job description:**
   - When creating a position, add the recruiting link
   - On the position detail page, click "Fetch JD from Link"
   - The job description will be automatically extracted

## Stopping the Application

- Press `Ctrl+C` in each terminal window
- Or if using the start script, press `Ctrl+C` once

## Troubleshooting

### Port already in use
If you see "port already in use" errors:
- Backend: Change port with `python manage.py runserver 8001`
- Frontend: Edit `vite.config.js` to change the port

### Dependencies not found
- Backend: Make sure virtual environment is activated
- Frontend: Run `npm install` again

### Database errors
- Delete `backend/db.sqlite3` and run `python manage.py migrate` again

### CORS errors
- Make sure both frontend and backend are running
- Check that `CORS_ALLOWED_ORIGINS` in `backend/recruit_tracker/settings.py` includes `http://localhost:5173`

## Next Steps

- Explore the Dashboard for an overview
- Use the Calendar view to manage interview schedules
- Add notes for each interview stage
- Track your application progress

Happy job hunting!
