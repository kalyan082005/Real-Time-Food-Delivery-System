// API Configuration for Microservices Architecture
const API_CONFIG = {
  // API Gateway URL (single entry point)
  GATEWAY_URL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8088c',
  
  // Service endpoints (routed through API Gateway)
  SERVICES: {
    USER: '/api/users',
    AUTH: '/api/auth',
    RESTAURANT: '/api/restaurants',
    MENU: '/api/menu',
    ORDER: '/api/orders',
    CART: '/api/cart',
    PAYMENT: '/api/payments',
    BILLING: '/api/billing',
    NOTIFICATION: '/api/notifications',
    DELIVERY: '/api/delivery',
    TRACKING: '/api/tracking'
  },
  
  // WebSocket URL for real-time features
  WEBSOCKET_URL: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8088/ws',
  
  // External service configurations
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  
  // Feature flags
  FEATURES: {
    PAYMENT: import.meta.env.VITE_ENABLE_PAYMENT === 'true',
    REAL_TIME_TRACKING: import.meta.env.VITE_ENABLE_REAL_TIME_TRACKING === 'true',
    NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    MICROSERVICES_MONITORING: import.meta.env.VITE_ENABLE_MICROSERVICES_MONITORING === 'true'
  },
  
  // Direct service URLs (for development/debugging)
  DIRECT_SERVICES: {
    USER: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081',
    RESTAURANT: import.meta.env.VITE_RESTAURANT_SERVICE_URL || 'http://localhost:8082',
    ORDER: import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8083',
    PAYMENT: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8084',
    NOTIFICATION: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:8085',
    DELIVERY: import.meta.env.VITE_DELIVERY_SERVICE_URL || 'http://localhost:8086'
  },
  
  // Request timeout settings
  TIMEOUT: {
    DEFAULT: 10000, // 10 seconds
    PAYMENT: 30000, // 30 seconds for payment operations
    UPLOAD: 60000   // 60 seconds for file uploads
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000 // 1 second
  }
};

export default API_CONFIG;