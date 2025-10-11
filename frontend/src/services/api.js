import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Position endpoints
export const positionAPI = {
  getAll: () => api.get('/positions/'),
  getOne: (id) => api.get(`/positions/${id}/`),
  create: (data) => api.post('/positions/', data),
  update: (id, data) => api.put(`/positions/${id}/`, data),
  delete: (id) => api.delete(`/positions/${id}/`),
  fetchJD: (data) => api.post(`/positions/fetch_jd/`, data),
};

// ProcessNote endpoints
export const noteAPI = {
  getAll: (positionId) => api.get(`/notes/`, { params: { position_id: positionId } }),
  create: (data) => api.post('/notes/', data),
  update: (id, data) => api.put(`/notes/${id}/`, data),
  delete: (id) => api.delete(`/notes/${id}/`),
};

// InterviewEvent endpoints
export const eventAPI = {
  getAll: (params) => api.get('/events/', { params }),
  create: (data) => api.post('/events/', data),
  update: (id, data) => api.put(`/events/${id}/`, data),
  delete: (id) => api.delete(`/events/${id}/`),
};

export default api;

