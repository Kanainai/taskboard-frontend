import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTasks = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  return api.get(`/tasks?${params.toString()}`);
};

export const createTask = (data) => {
  return api.post('/tasks', data);
};

export const updateTaskStatus = (id) => {
  return api.patch(`/tasks/${id}/status`);
};

export const deleteTask = (id) => {
  return api.delete(`/tasks/${id}`);
};

export const getDailyReport = (date) => {
  return api.get(`/tasks/report?date=${date}`);
};

export const getOverdueTasks = () => {
  return api.get('/tasks/overdue');
};

export const pingApi = () => {
  return api.get('/ping').catch(() => {});
};
