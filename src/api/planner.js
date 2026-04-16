import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const plannerAPI = {
  getRoutes: async (data) => {
    const response = await api.post('/planner/routes', data);
    return response.data;
  },
  getAccommodations: async (data) => {
    const response = await api.post('/planner/accommodations', data);
    return response.data;
  },
  getActivities: async (data) => {
    const response = await api.post('/planner/activities', data);
    return response.data;
  },
  finalize: async (data) => {
    const response = await api.post('/planner/finalize', data);
    return response.data;
  },
  searchHotel: async (data) => {
    const response = await api.post('/planner/search-hotel', data);
    return response.data;
  },
  getFeatureData: async (data) => {
    const response = await api.post('/planner/feature', data);
    return response.data;
  },
};

export default plannerAPI;
