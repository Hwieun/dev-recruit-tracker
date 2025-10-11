import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { positionAPI, eventAPI } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [positions, setPositions] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interviewing: 0,
    offer: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [positionsRes, eventsRes] = await Promise.all([
        positionAPI.getAll(),
        eventAPI.getAll({
          start_date: new Date().toISOString(),
        }),
      ]);

      const positionsData = positionsRes.data.results || positionsRes.data;
      setPositions(positionsData);

      // Calculate stats
      const statsData = {
        total: positionsData.length,
        applied: positionsData.filter(p => p.current_status === 'applied').length,
        interviewing: positionsData.filter(p =>
          ['coding_test', 'technical_interview', 'cultural_fit', 'final_interview'].includes(p.current_status)
        ).length,
        offer: positionsData.filter(p => p.current_status === 'offer').length,
      };
      setStats(statsData);

      // Get upcoming events (next 7 days)
      const eventsData = eventsRes.data.results || eventsRes.data;
      const upcoming = eventsData.slice(0, 5);
      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/positions">
          <button>Add New Position</button>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Applications</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Applied</h3>
          <p className="stat-number">{stats.applied}</p>
        </div>
        <div className="stat-card">
          <h3>Interviewing</h3>
          <p className="stat-number">{stats.interviewing}</p>
        </div>
        <div className="stat-card">
          <h3>Offers</h3>
          <p className="stat-number">{stats.offer}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-positions">
          <h2>Recent Applications</h2>
          <div className="position-list">
            {positions.slice(0, 5).map((position) => (
              <Link
                key={position.id}
                to={`/positions/${position.id}`}
                className="position-card"
              >
                <div className="position-header">
                  <h3>{position.company_name}</h3>
                  <span className={`status-badge status-${position.current_status}`}>
                    {position.current_status.replace('_', ' ')}
                  </span>
                </div>
                <p className="position-title">{position.position_title}</p>
                <p className="position-meta">
                  {position.location} • Applied: {new Date(position.application_date).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="upcoming-events">
          <h2>Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="no-events">No upcoming events</p>
          ) : (
            <div className="event-list">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-date">
                    {new Date(event.start_datetime).toLocaleDateString()}
                  </div>
                  <div className="event-details">
                    <h4>{event.title}</h4>
                    <p className="event-type">{event.event_type.replace('_', ' ')}</p>
                    <p className="event-time">
                      {new Date(event.start_datetime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
