import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { eventAPI, positionAPI } from '../services/api';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarView.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarView() {
  const [events, setEvents] = useState([]);
  const [positions, setPositions] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, positionsRes] = await Promise.all([
        eventAPI.getAll(),
        positionAPI.getAll(),
      ]);

      const eventsData = eventsRes.data.results || eventsRes.data;
      const positionsData = positionsRes.data.results || positionsRes.data;

      // Create position lookup
      const positionLookup = {};
      positionsData.forEach(pos => {
        positionLookup[pos.id] = pos;
      });
      setPositions(positionLookup);

      // Transform events for calendar
      const calendarEvents = eventsData.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_datetime),
        end: new Date(event.end_datetime),
        resource: event,
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const eventStyleGetter = (event) => {
    const eventType = event.resource.event_type;
    let backgroundColor = '#646cff';

    switch (eventType) {
      case 'phone_screen':
        backgroundColor = '#0066cc';
        break;
      case 'coding_test':
        backgroundColor = '#7b1fa2';
        break;
      case 'technical_interview':
        backgroundColor = '#2e7d32';
        break;
      case 'cultural_fit':
        backgroundColor = '#00695c';
        break;
      case 'final_interview':
        backgroundColor = '#c2185b';
        break;
      default:
        backgroundColor = '#646cff';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0',
        display: 'block',
      }
    };
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h1>Interview Calendar</h1>
        <div className="legend">
          <span className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#0066cc' }}></span>
            Phone Screen
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#7b1fa2' }}></span>
            Coding Test
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#2e7d32' }}></span>
            Technical
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#00695c' }}></span>
            Cultural Fit
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#c2185b' }}></span>
            Final
          </span>
        </div>
      </div>

      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'day']}
          defaultView="week"
        />
      </div>

      {selectedEvent && (
        <div className="event-modal" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="event-modal-header">
              <h2>{selectedEvent.title}</h2>
              <button onClick={() => setSelectedEvent(null)}>×</button>
            </div>
            <div className="event-modal-body">
              <p>
                <strong>Type:</strong>{' '}
                {selectedEvent.resource.event_type.replace('_', ' ')}
              </p>
              {selectedEvent.resource.description && (
                <p>
                  <strong>Description:</strong><br />
                  {selectedEvent.resource.description}
                </p>
              )}
              <p>
                <strong>Start:</strong>{' '}
                {new Date(selectedEvent.resource.start_datetime).toLocaleString()}
              </p>
              <p>
                <strong>End:</strong>{' '}
                {new Date(selectedEvent.resource.end_datetime).toLocaleString()}
              </p>
              {selectedEvent.resource.location && (
                <p>
                  <strong>Location:</strong> {selectedEvent.resource.location}
                </p>
              )}
              {selectedEvent.resource.meeting_link && (
                <p>
                  <strong>Meeting Link:</strong>{' '}
                  <a
                    href={selectedEvent.resource.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Meeting
                  </a>
                </p>
              )}
              {positions[selectedEvent.resource.position] && (
                <p>
                  <strong>Position:</strong>{' '}
                  {positions[selectedEvent.resource.position].company_name} -{' '}
                  {positions[selectedEvent.resource.position].position_title}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarView;
