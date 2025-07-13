// Ensure HTTPS in production
const DEFAULT_API_URL = 'http://localhost:3000/api/v1';
const ENV_API_URL = import.meta.env.VITE_API_URL;

// Use environment variable if set, otherwise use default
const API_BASE_URL = ENV_API_URL || DEFAULT_API_URL;

// Force HTTPS if not localhost
const FINAL_API_URL = API_BASE_URL.includes('localhost') 
  ? API_BASE_URL 
  : API_BASE_URL.replace('http://', 'https://');

console.log('API URL:', FINAL_API_URL); // Debug log

const api = {
  baseURL: FINAL_API_URL,
  
  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }
};

export default api;