import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
export const SERVER_BASE = API_BASE_URL.replace(/\/api\/?$/, '');

const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const resolveImage = (url) => {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  return `${SERVER_BASE}${url}`;
};

export const postsAPI = {
  getAll: async () => (await axios.get(`${API_BASE_URL}/posts`)).data,
  getById: async (id) => (await axios.get(`${API_BASE_URL}/posts/${id}`)).data,
  getByUser: async (userId) => (await axios.get(`${API_BASE_URL}/posts/user/${userId}`)).data,
  getByIsland: async (islandId) => (await axios.get(`${API_BASE_URL}/posts/island/${islandId}`)).data,
  create: async ({ image, caption, island }) => {
    const fd = new FormData();
    fd.append('image', image);
    if (caption) fd.append('caption', caption);
    if (island) fd.append('island', island);
    const res = await axios.post(`${API_BASE_URL}/posts`, fd, {
      headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  remove: async (id) => (await axios.delete(`${API_BASE_URL}/posts/${id}`, { headers: authHeader() })).data,
  toggleLike: async (id) => (await axios.post(`${API_BASE_URL}/posts/${id}/like`, {}, { headers: authHeader() })).data,
  addComment: async (id, text) => (await axios.post(`${API_BASE_URL}/posts/${id}/comment`, { text }, { headers: authHeader() })).data,
  deleteComment: async (id, commentId) => (await axios.delete(`${API_BASE_URL}/posts/${id}/comment/${commentId}`, { headers: authHeader() })).data,
  addReply: async (id, commentId, text) => (await axios.post(`${API_BASE_URL}/posts/${id}/comment/${commentId}/reply`, { text }, { headers: authHeader() })).data,
  deleteReply: async (id, commentId, replyId) => (await axios.delete(`${API_BASE_URL}/posts/${id}/comment/${commentId}/reply/${replyId}`, { headers: authHeader() })).data,
};

export const usersAPI = {
  toggleFollow: async (id) => (await axios.post(`${API_BASE_URL}/users/${id}/follow`, {}, { headers: authHeader() })).data,
  uploadAvatar: async (file) => {
    const fd = new FormData();
    fd.append('avatar', file);
    return (await axios.post(`${API_BASE_URL}/users/avatar`, fd, {
      headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' },
    })).data;
  },
};
