import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('portfolio_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('portfolio_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ============================================
// API MODULES
// ============================================

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const projectsAPI = {
  getAll: (params?: Record<string, string>) =>
    api.get('/projects', { params }),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: FormData) =>
    api.post('/projects', data),
  update: (id: string, data: FormData) =>
    api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const skillsAPI = {
  getAll: () => api.get('/skills'),
  create: (data: object) => api.post('/skills', data),
  update: (id: string, data: object) => api.put(`/skills/${id}`, data),
  delete: (id: string) => api.delete(`/skills/${id}`),
};

export const servicesAPI = {
  getAll: () => api.get('/services'),
  create: (data: FormData) =>
    api.post('/services', data),
  update: (id: string, data: FormData) =>
    api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
};

export const testimonialsAPI = {
  getAll: (active?: boolean) =>
    api.get('/testimonials', { params: active ? { status: 'active' } : {} }),
  create: (data: FormData) =>
    api.post('/testimonials', data),
  update: (id: string, data: FormData) =>
    api.put(`/testimonials/${id}`, data),
  delete: (id: string) => api.delete(`/testimonials/${id}`),
};

export const messagesAPI = {
  getAll: () => api.get('/messages'),
  markRead: (id: string) => api.patch(`/messages/${id}/read`),
  archive: (id: string) => api.patch(`/messages/${id}/archive`),
  delete: (id: string) => api.delete(`/messages/${id}`),
  send: (data: object) => api.post('/messages', data),
};

export const blogAPI = {
  getAll: (params?: Record<string, string>) => api.get('/blog', { params }),
  getById: (id: string) => api.get(`/blog/${id}`),
  create: (data: FormData) =>
    api.post('/blog', data),
  update: (id: string, data: FormData) =>
    api.put(`/blog/${id}`, data),
  delete: (id: string) => api.delete(`/blog/${id}`),
  getCategories: () => api.get('/blog/categories'),
};

export const analyticsAPI = {
  getDashboardStats: () => api.get('/analytics/stats'),
  getVisitorChart: () => api.get('/analytics/visitors'),
  getDeviceChart: () => api.get('/analytics/devices'),
  getBrowserChart: () => api.get('/analytics/browsers'),
  getActivityLogs: () => api.get('/analytics/activity'),
  trackVisit: () => api.post('/analytics/track'),
};

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data: FormData) =>
    api.put('/settings', data),
};

export const mediaAPI = {
  upload: (data: FormData) =>
    api.post('/media/upload', data),
  getAll: () => api.get('/media'),
  delete: (publicId: string) => api.delete(`/media/${publicId}`),
};

export const experienceAPI = {
  getAll: () => api.get('/experience'),
  create: (data: object) => api.post('/experience', data),
  update: (id: string, data: object) => api.put(`/experience/${id}`, data),
  delete: (id: string) => api.delete(`/experience/${id}`),
};

export const languagesAPI = {
  getAll: () => api.get('/languages'),
  create: (data: object) => api.post('/languages', data),
  update: (id: string, data: object) => api.put(`/languages/${id}`, data),
  delete: (id: string) => api.delete(`/languages/${id}`),
};

export const clientLogosAPI = {
  getAll: () => api.get('/client-logos'),
  create: (data: FormData) =>
    api.post('/client-logos', data),
  update: (id: string, data: FormData) =>
    api.put(`/client-logos/${id}`, data),
  delete: (id: string) => api.delete(`/client-logos/${id}`),
};
