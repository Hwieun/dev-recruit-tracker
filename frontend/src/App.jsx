import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PositionList from './pages/PositionList';
import PositionDetail from './pages/PositionDetail';
import CalendarView from './pages/CalendarView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <h1 className="nav-title">Dev Recruit Tracker</h1>
            <div className="nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/positions">Positions</Link>
              <Link to="/calendar">Calendar</Link>
            </div>
          </div>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/positions" element={<PositionList />} />
            <Route path="/positions/:id" element={<PositionDetail />} />
            <Route path="/calendar" element={<CalendarView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
