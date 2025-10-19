import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { positionAPI, noteAPI, eventAPI } from '../services/api';
import './PositionDetail.css';

function PositionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [notes, setNotes] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingJD, setFetchingJD] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [noteForm, setNoteForm] = useState({
    process_type: 'general',
    title: '',
    content: '',
  });
  const [eventForm, setEventForm] = useState({
    event_type: 'technical_interview',
    title: '',
    description: '',
    start_datetime: '',
    duration: '',
    meeting_type: 'on-site',
    location: '',
    meeting_link: '',
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [positionRes, notesRes, eventsRes] = await Promise.all([
        positionAPI.getOne(id),
        noteAPI.getAll(id),
        eventAPI.getAll({ position_id: id }),
      ]);

      setPosition(positionRes.data);
      setNotes(notesRes.data.results || notesRes.data);
      setEvents(eventsRes.data.results || eventsRes.data);
    } catch (error) {
      console.error('Error fetching position details:', error);
      alert('Failed to load position');
      navigate('/positions');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchJD = async () => {
    if (!position.recruiting_link) {
      alert('Please add a recruiting link first');
      return;
    }

    try {
      setFetchingJD(true);
      const response = await positionAPI.fetchJD(id);
      setPosition(response.data);
      alert('Job description fetched successfully!');
    } catch (error) {
      console.error('Error fetching JD:', error);
      alert('Failed to fetch job description. Please check the link and try again.');
    } finally {
      setFetchingJD(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await positionAPI.update(id, {
        ...position,
        current_status: newStatus,
      });
      setPosition(response.data);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      await noteAPI.create({
        ...noteForm,
        position: parseInt(id),
      });
      setNoteForm({
        process_type: 'general',
        title: '',
        content: '',
      });
      setShowNoteForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note');
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      await eventAPI.create({
        ...eventForm,
        position: parseInt(id),
      });
      setEventForm({
        event_type: 'technical_interview',
        title: '',
        description: '',
        start_datetime: '',
        end_datetime: '',
        location: '',
        meeting_link: '',
      });
      setShowEventForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Delete this note?')) {
      try {
        await noteAPI.delete(noteId);
        fetchData();
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note');
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Delete this event?')) {
      try {
        await eventAPI.delete(eventId);
        fetchData();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!position) {
    return <div>Position not found</div>;
  }

  return (
    <div className="position-detail">
      <button onClick={() => navigate('/positions')} className="back-btn">
        ← Back to Positions
      </button>

      <div className="detail-header">
        <div>
          <h1>{position.company_name}</h1>
          <h2>{position.position_title}</h2>
        </div>
        <span className={`status-badge status-${position.current_status}`}>
          {position.current_status.replace('_', ' ')}
        </span>
      </div>

      <div className="detail-meta">
        {position.location && <span>📍 {position.location}</span>}
        {position.salary_range && <span>💰 {position.salary_range}</span>}
        <span>📅 Applied: {new Date(position.application_date).toLocaleDateString()}</span>
      </div>

      <div className="status-update-section">
        <h3>Update Status</h3>
        <div className="status-buttons">
          <button onClick={() => handleStatusUpdate('applied')}>Applied</button>
          <button onClick={() => handleStatusUpdate('screening')}>Screening</button>
          <button onClick={() => handleStatusUpdate('coding_test')}>Coding Test</button>
          <button onClick={() => handleStatusUpdate('technical_interview')}>Technical Interview</button>
          <button onClick={() => handleStatusUpdate('cultural_fit')}>Cultural Fit</button>
          <button onClick={() => handleStatusUpdate('final_interview')}>Final Interview</button>
          <button onClick={() => handleStatusUpdate('offer')}>Offer</button>
          <button onClick={() => handleStatusUpdate('rejected')}>Rejected</button>
          <button onClick={() => handleStatusUpdate('accepted')}>Accepted</button>
        </div>
      </div>

      <div className="jd-section">
        <div className="section-header">
          <h3>Job Description</h3>
          {position.recruiting_link && (
            <button onClick={handleFetchJD} disabled={fetchingJD}>
              {fetchingJD ? 'Fetching...' : 'Fetch JD from Link'}
            </button>
          )}
        </div>
        {position.recruiting_link && (
          <p className="recruiting-link">
            <a href={position.recruiting_link} target="_blank" rel="noopener noreferrer">
              View Original Posting →
            </a>
          </p>
        )}
        <div className="jd-content">
          {position.job_description ? (
            <pre>{position.job_description}</pre>
          ) : (
            <p className="empty-text">No job description available</p>
          )}
        </div>
      </div>

      <div className="notes-section">
        <div className="section-header">
          <h3>Notes & Preparation</h3>
          <button onClick={() => setShowNoteForm(!showNoteForm)}>
            {showNoteForm ? 'Cancel' : 'Add Note'}
          </button>
        </div>

        {showNoteForm && (
          <form onSubmit={handleNoteSubmit} className="note-form">
            <select
              value={noteForm.process_type}
              onChange={(e) => setNoteForm({ ...noteForm, process_type: e.target.value })}
            >
              <option value="general">General Notes</option>
              <option value="coding_test">Coding Test</option>
              <option value="technical_interview">Technical Interview</option>
              <option value="cultural_fit">Cultural Fit Interview</option>
              <option value="final_interview">Final Interview</option>
            </select>
            <input
              type="text"
              placeholder="Title"
              value={noteForm.title}
              onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Content"
              value={noteForm.content}
              onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
              required
            />
            <button type="submit">Save Note</button>
          </form>
        )}

        <div className="notes-list">
          {notes.map((note) => (
            <div key={note.id} className="note-card">
              <div className="note-header">
                <span className="note-type">{note.process_type.replace('_', ' ')}</span>
                <button onClick={() => handleDeleteNote(note.id)} className="delete-btn-small">
                  Delete
                </button>
              </div>
              <h4>{note.title}</h4>
              <p>{note.content}</p>
              <span className="note-date">
                {new Date(note.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
          {notes.length === 0 && !showNoteForm && (
            <p className="empty-text">No notes yet</p>
          )}
        </div>
      </div>

      <div className="events-section">
        <div className="section-header">
          <h3>Interview Schedule</h3>
          <button onClick={() => setShowEventForm(!showEventForm)}>
            {showEventForm ? 'Cancel' : 'Add Event'}
          </button>
        </div>

        {showEventForm && (
          <form onSubmit={handleEventSubmit} className="event-form">
            <select
              value={eventForm.event_type}
              onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value })}
            >
              <option value="phone_screen">Phone Screen</option>
              <option value="coding_test">Coding Test</option>
              <option value="technical_interview">Technical Interview</option>
              <option value="cultural_fit">Cultural Fit Interview</option>
              <option value="final_interview">Final Interview</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              placeholder="Title"
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
            />
            <p>Start DateTime</p>
            <input
              type="datetime-local"
              value={eventForm.start_datetime}
              onChange={(e) => setEventForm({ ...eventForm, start_datetime: e.target.value })}
              required
            />
            <p>Duration Minutes</p>
            <input
              type="number"
              placeholder="60"
              value={eventForm.duration}
              onChange={(e) => setEventForm({ ...eventForm, duration: e.target.value })}
              required
            />
            <div className="toggle-container">
              <button
                type="button"
                className={eventForm.meeting_type === 'on-site' ? 'active' : ''}
                onClick={() => setEventForm({ ...eventForm, meeting_type: 'on-site' })}
              >
                On-site
              </button>
              <button
                type="button"
                className={eventForm.meeting_type === 'remote' ? 'active' : ''}
                onClick={() => setEventForm({ ...eventForm, meeting_type: 'remote' })}
              >
                Remote
              </button>
            </div>

            {eventForm.meeting_type === 'on-site' && (
              <div>
                <p>Location</p>
                <input
                  type="text"
                  placeholder="Location"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                />
              </div>
            )}

            {eventForm.meeting_type === 'remote' && (
              <div><p>Meeting Link</p>
                <input
                  type="url"
                  placeholder="Meeting Link"
                  value={eventForm.meeting_link}
                  onChange={(e) => setEventForm({ ...eventForm, meeting_link: e.target.value })}
                />
              </div>
            )}
            <button type="submit">Save Event</button>
          </form>
        )}

        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-detail-card">
              <div className="event-header">
                <span className="event-type-badge">{event.event_type.replace('_', ' ')}</span>
                <button onClick={() => handleDeleteEvent(event.id)} className="delete-btn-small">
                  Delete
                </button>
              </div>
              <h4>{event.title}</h4>
              {event.description && <p>{event.description}</p>}
              <div className="event-meta">
                <span>🗓 {new Date(event.start_datetime).toLocaleString()}</span>
                {event.location && <span>📍 {event.location}</span>}
                {event.meeting_link && (
                  <a href={event.meeting_link} target="_blank" rel="noopener noreferrer">
                    Join Meeting →
                  </a>
                )}
              </div>
            </div>
          ))}
          {events.length === 0 && !showEventForm && (
            <p className="empty-text">No events scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PositionDetail;
