# Dev Recruit Tracker

A comprehensive web application for managing developer job applications during hiring season. Track your recruitment progress, manage interview schedules, and organize preparation notes all in one place.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Installation & Running

**Option 1: Quick Start Script (Mac/Linux)**
```bash
./start.sh
```

**Option 2: Manual Start**

In one terminal (Backend):
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python manage.py runserver
```

In another terminal (Frontend):
```bash
cd frontend
npm run dev
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Main Application** | http://localhost:5173 | React frontend - Your main interface |
| **API Endpoints** | http://localhost:8000/api | Django REST API |
| **Django Admin** | http://localhost:8000/admin | Admin interface (requires superuser) |
| **API Documentation** | See [API_EXAMPLES.md](API_EXAMPLES.md) | Complete API reference |

### First Time Setup

If this is your first time running the project, you need to install dependencies:

**Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Optional, for admin access
```

**Frontend:**
```bash
cd frontend
npm install
```

## Features

### 1. Dashboard
- Overview of all applications at a glance
- Statistics showing total applications, applied, interviewing, and offers
- Recent applications list
- Upcoming interview events

### 2. Position Management
- Add, view, and manage job applications
- Track positions by company and role
- Update application status through the recruitment pipeline
- Delete applications

### 3. Position Detail View
- Complete job description display
- Auto-fetch JD from recruiting links
- Progress tracking with status updates
- Notes section for each interview stage (coding test, technical interview, etc.)
- Interview schedule management
- Quick access to recruiting links

### 4. Calendar View
- Visual calendar showing all interview events
- Color-coded by interview type
- Month, week, and day views
- Event details on click

### 5. Auto JD Collection
- Automatically extract job descriptions from recruiting links
- One-click fetch from position detail page
- Supports most job posting websites

## Tech Stack

**Frontend:**
- React 18
- Vite
- React Router
- Axios
- React Big Calendar
- date-fns

**Backend:**
- Django 4.2
- Django REST Framework
- SQLite (easily upgradable to PostgreSQL)
- BeautifulSoup4 for web scraping

## 📁 Project Structure

```
dev-recruit-tracker/
├── README.md                   # This file - Main documentation
├── QUICKSTART.md              # Quick start guide
├── API_EXAMPLES.md            # API usage examples
├── start.sh                   # Convenience startup script
├── .gitignore                 # Git ignore rules
│
├── backend/                   # Django REST Framework Backend
│   ├── applications/          # Main Django app
│   │   ├── models.py         # Data models: Position, ProcessNote, InterviewEvent
│   │   ├── serializers.py    # DRF serializers for API responses
│   │   ├── views.py          # API viewsets and endpoints
│   │   ├── utils.py          # Utility functions (JD extraction)
│   │   ├── urls.py           # API route definitions
│   │   └── admin.py          # Django admin configuration
│   ├── recruit_tracker/       # Django project settings
│   │   ├── settings.py       # Project configuration (CORS, apps, etc.)
│   │   └── urls.py           # Main URL routing
│   ├── manage.py              # Django management script
│   ├── requirements.txt       # Python dependencies
│   ├── db.sqlite3            # SQLite database (created after migration)
│   └── venv/                 # Python virtual environment
│
└── frontend/                  # React + Vite Frontend
    ├── src/
    │   ├── pages/            # Page components
    │   │   ├── Dashboard.jsx         # Main dashboard with stats
    │   │   ├── PositionList.jsx      # Position management
    │   │   ├── PositionDetail.jsx    # Detailed position view
    │   │   └── CalendarView.jsx      # Interview calendar
    │   ├── services/
    │   │   └── api.js        # Axios API client
    │   ├── App.jsx           # Main app component with routing
    │   ├── App.css           # Global styles
    │   ├── main.jsx          # React entry point
    │   └── index.css         # Base CSS reset
    ├── package.json          # Node dependencies
    └── vite.config.js        # Vite configuration
```

## 💡 How to Use

### Getting Started

1. **Start both servers** (see Quick Start above)
2. **Open your browser** to http://localhost:5173
3. You'll see the main dashboard

### Adding a Position

1. Click "Positions" in the navigation
2. Click "Add Position"
3. Fill in the company name, position title, and optionally:
   - Recruiting link (for auto JD extraction)
   - Location
   - Salary range
   - Current status

### Managing Recruitment Progress

1. Click on any position card to view details
2. Update status using the status buttons
3. Add notes for different interview stages
4. Schedule interview events with time and location
5. Fetch job description automatically from the recruiting link

### Viewing the Calendar

1. Click "Calendar" in the navigation
2. Switch between month, week, and day views
3. Click on any event to see details
4. Events are color-coded by type

## 🔌 API Endpoints

All API endpoints are available at `http://localhost:8000/api/`

### Positions API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/positions/` | List all positions |
| POST | `/api/positions/` | Create a new position |
| GET | `/api/positions/{id}/` | Get position details |
| PUT | `/api/positions/{id}/` | Update a position |
| DELETE | `/api/positions/{id}/` | Delete a position |
| POST | `/api/positions/{id}/fetch_jd/` | Auto-fetch job description from link |

### Notes API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes/?position_id={id}` | List notes for a position |
| POST | `/api/notes/` | Create a new note |
| PUT | `/api/notes/{id}/` | Update a note |
| DELETE | `/api/notes/{id}/` | Delete a note |

### Events API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events/?position_id={id}` | List events for a position |
| POST | `/api/events/` | Create a new event |
| PUT | `/api/events/{id}/` | Update an event |
| DELETE | `/api/events/{id}/` | Delete an event |

**For detailed API examples with curl commands, see [API_EXAMPLES.md](API_EXAMPLES.md)**

## 🗄️ Database Schema

### Position Model
- `company_name` - Company name
- `position_title` - Job title
- `job_description` - Full job description (can be auto-fetched)
- `recruiting_link` - URL to job posting
- `current_status` - Current application status
- `salary_range` - Expected salary range
- `location` - Job location
- `application_date` - When you applied

### ProcessNote Model
- `position` - Foreign key to Position
- `process_type` - Type of interview/process
- `title` - Note title
- `content` - Note content

### InterviewEvent Model
- `position` - Foreign key to Position
- `event_type` - Type of interview
- `title` - Event title
- `description` - Event details
- `start_datetime` - Event start time
- `end_datetime` - Event end time
- `location` - Meeting location
- `meeting_link` - Video call link

## 🛠️ Tech Stack Details

### Backend Dependencies
```
Django==4.2.7
djangorestframework==3.14.0
django-cors-headers==4.3.1
requests==2.31.0
beautifulsoup4==4.12.2
python-dateutil==2.8.2
```

### Frontend Dependencies
```
react: ^18.x
react-router-dom: ^6.x
axios: Latest
react-big-calendar: Latest
date-fns: Latest
```

## 🚧 Development Notes

This is an **MVP (Minimum Viable Product)** designed for rapid prototyping during hiring season.

### For Production Use, Consider:
- User authentication and authorization
- PostgreSQL instead of SQLite
- Comprehensive input validation
- Error logging and monitoring
- Unit and integration tests
- Environment variable configuration
- Rate limiting and security headers
- Docker containerization
- CI/CD pipeline setup

## 📝 Additional Resources

- **[QUICKSTART.md](QUICKSTART.md)** - Detailed setup instructions
- **[API_EXAMPLES.md](API_EXAMPLES.md)** - Complete API reference with examples
- **Django Admin** - Access at http://localhost:8000/admin (create superuser first)

## 🤝 Contributing

This is a personal project built for managing developer job applications. Feel free to:
- Fork and customize for your needs
- Report issues or bugs
- Suggest enhancements
- Use it as a learning resource

## 📄 License

MIT License - Free to use for your job search!

---

**Happy Job Hunting! 🎯**

Made with ❤️ for developers navigating the recruitment process.
