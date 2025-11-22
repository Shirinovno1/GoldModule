import axios from 'axios';
import { ThemeConfig } from '../config/theme';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configuration API
export const fetchConfig = async (): Promise<ThemeConfig> => {
  const response = await api.get('/config');
  return response.data;
};

export default api;
