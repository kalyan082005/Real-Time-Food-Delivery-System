// Base API service for microservices communication through API Gateway
import axios from 'axios';
import API_CONFIG from './apiConfig';

const baseAPI = axios.create({
  baseURL: API_CONFIG.GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT.DEFAULT,
});

// Request interceptor to add authentication token
baseAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
baseAPI.interceptors.response.use(
  (response) => {
    // Log response time for performance monitoring
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    console.log(`API Call: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.warn('Authentication failed - redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
          
        case 403:
          // Forbidden - insufficient permissions
          console.warn('Access forbidden - insufficient permissions');
          break;
          
        case 404:
          // Not found
          console.warn('Resource not found:', error.config.url);
          break;
          
        case 429:
          // Rate limit exceeded
          console.warn('Rate limit exceeded - please try again later');
          break;
          
        case 500:
          // Internal server error
          console.error('Internal server error:', data?.message || 'Unknown error');
          break;
          
        case 503:
          // Service unavailable
          console.error('Service temporarily unavailable');
          break;
          
        default:
          console.error(`API Error ${status}:`, data?.message || error.message);
      }
    } else if (error.request) {
      // Network error - no response received
      console.error('Network error - no response received:', error.message);
    } else {
      // Request setup error
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Utility function for retry logic
export const retryRequest = async (requestFn, maxAttempts = API_CONFIG.RETRY.MAX_ATTEMPTS) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 429) {
        throw error;
      }
      
      if (attempt < maxAttempts) {
        const delay = API_CONFIG.RETRY.DELAY * attempt; // Exponential backoff
        console.log(`Request failed, retrying in ${delay}ms... (attempt ${attempt}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

// Utility function for handling API responses
export const handleApiResponse = (response) => {
  if (response.data.success) {
    return response.data;
  } else {
    throw new Error(response.data.message || 'API request failed');
  }
};

export default baseAPI;