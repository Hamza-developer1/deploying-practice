// Environment configuration for frontend
window.ENV = {
  API_URL: process.env.VITE_API_URL || 'http://localhost:5001/api',
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_NAME: process.env.VITE_APP_NAME || 'Task Manager',
  VERSION: process.env.VITE_VERSION || '1.0.0'
};