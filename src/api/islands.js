import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const islandsAPI = {
  getAllIslands: async (params = {}) => {
    try {
      const response = await api.get('/islands', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching islands:', error);
      throw error;
    }
  },

  getIslandById: async (id) => {
    try {
      const response = await api.get(`/islands/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching island:', error);
      throw error;
    }
  },

  searchIslands: async (searchQuery) => {
    try {
      const response = await api.get('/islands', {
        params: { search: searchQuery }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching islands:', error);
      throw error;
    }
  },

  filterByGroup: async (group) => {
    try {
      const response = await api.get('/islands', {
        params: { group }
      });
      return response.data;
    } catch (error) {
      console.error('Error filtering islands:', error);
      throw error;
    }
  },

  filterByVibe: async (vibe) => {
    try {
      const response = await api.get('/islands', {
        params: { vibe }
      });
      return response.data;
    } catch (error) {
      console.error('Error filtering islands by vibe:', error);
      throw error;
    }
  },
};

export default api;
