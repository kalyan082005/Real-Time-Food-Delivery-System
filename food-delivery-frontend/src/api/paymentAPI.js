// Payment API service for Stripe integration and payment management
import baseAPI, { handleApiResponse, retryRequest } from './baseAPI';
import API_CONFIG from './apiConfig';

export const paymentService = {
  // Create payment intent for Stripe processing
  createPaymentIntent: async (paymentData) => {
    const requestFn = () => baseAPI.post(`${API_CONFIG.SERVICES.PAYMENT}/create-intent`, {
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency || 'USD',
      metadata: paymentData.metadata || {}
    }, {
      timeout: API_CONFIG.TIMEOUT.PAYMENT
    });
    
    const response = await retryRequest(requestFn);
    return handleApiResponse(response);
  },

  // Confirm payment after Stripe processing
  confirmPayment: async (paymentId, paymentIntentId) => {
    const requestFn = () => baseAPI.post(`${API_CONFIG.SERVICES.PAYMENT}/${paymentId}/confirm`, {
      paymentIntentId
    }, {
      timeout: API_CONFIG.TIMEOUT.PAYMENT
    });
    
    const response = await retryRequest(requestFn);
    return handleApiResponse(response);
  },

  // Get user's payment history with pagination
  getPaymentHistory: async (userId, page = 1, limit = 20) => {
    const response = await baseAPI.get(`${API_CONFIG.SERVICES.PAYMENT}/user/${userId}`, {
      params: { page, limit }
    });
    return handleApiResponse(response);
  },

  // Get specific payment details
  getPaymentDetails: async (paymentId) => {
    const response = await baseAPI.get(`${API_CONFIG.SERVICES.PAYMENT}/${paymentId}`);
    return handleApiResponse(response);
  },

  // Process refund
  processRefund: async (refundData) => {
    const requestFn = () => baseAPI.post(`${API_CONFIG.SERVICES.PAYMENT}/refund`, {
      paymentId: refundData.paymentId,
      amount: refundData.amount,
      reason: refundData.reason || 'Customer request'
    }, {
      timeout: API_CONFIG.TIMEOUT.PAYMENT
    });
    
    const response = await retryRequest(requestFn);
    return handleApiResponse(response);
  },

  // Get payment methods for user
  getPaymentMethods: async (userId) => {
    const response = await baseAPI.get(`${API_CONFIG.SERVICES.PAYMENT}/methods/user/${userId}`);
    return handleApiResponse(response);
  },

  // Add new payment method
  addPaymentMethod: async (paymentMethodData) => {
    const response = await baseAPI.post(`${API_CONFIG.SERVICES.PAYMENT}/methods`, {
      type: paymentMethodData.type,
      provider: paymentMethodData.provider || 'STRIPE',
      externalId: paymentMethodData.externalId,
      cardLastFour: paymentMethodData.cardLastFour,
      cardBrand: paymentMethodData.cardBrand,
      cardExpMonth: paymentMethodData.cardExpMonth,
      cardExpYear: paymentMethodData.cardExpYear,
      isDefault: paymentMethodData.isDefault || false
    });
    return handleApiResponse(response);
  },

  // Update payment method
  updatePaymentMethod: async (paymentMethodId, updateData) => {
    const response = await baseAPI.put(`${API_CONFIG.SERVICES.PAYMENT}/methods/${paymentMethodId}`, updateData);
    return handleApiResponse(response);
  },

  // Delete payment method
  deletePaymentMethod: async (paymentMethodId) => {
    const response = await baseAPI.delete(`${API_CONFIG.SERVICES.PAYMENT}/methods/${paymentMethodId}`);
    return handleApiResponse(response);
  },

  // Set default payment method
  setDefaultPaymentMethod: async (paymentMethodId) => {
    const response = await baseAPI.put(`${API_CONFIG.SERVICES.PAYMENT}/methods/${paymentMethodId}/default`);
    return handleApiResponse(response);
  },

  // Get payment statistics for user
  getPaymentStats: async (userId, startDate, endDate) => {
    const response = await baseAPI.get(`${API_CONFIG.SERVICES.PAYMENT}/stats/user/${userId}`, {
      params: { startDate, endDate }
    });
    return handleApiResponse(response);
  },

  // Webhook handler for Stripe events (admin only)
  handleStripeWebhook: async (webhookData) => {
    const response = await baseAPI.post(`${API_CONFIG.SERVICES.PAYMENT}/webhook/stripe`, webhookData, {
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': webhookData.signature
      }
    });
    return handleApiResponse(response);
  },

  // Get payment analytics (admin only)
  getPaymentAnalytics: async (filters = {}) => {
    const response = await baseAPI.get(`${API_CONFIG.SERVICES.PAYMENT}/analytics`, {
      params: filters
    });
    return handleApiResponse(response);
  },

  // Export payment data (admin only)
  exportPaymentData: async (filters = {}) => {
    const response = await baseAPI.get(`${API_CONFIG.SERVICES.PAYMENT}/export`, {
      params: filters,
      responseType: 'blob' // For file download
    });
    return response.data;
  }
};

// Utility functions for payment processing
export const paymentUtils = {
  // Format amount for display
  formatAmount: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Validate payment amount
  validateAmount: (amount) => {
    const numAmount = parseFloat(amount);
    return numAmount > 0 && numAmount <= 999999.99; // Max $999,999.99
  },

  // Get payment status color for UI
  getStatusColor: (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'CANCELLED': 'bg-gray-100 text-gray-800',
      'REFUNDED': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  },

  // Get payment method icon
  getPaymentMethodIcon: (type, brand) => {
    const icons = {
      'CREDIT_CARD': {
        'visa': '💳',
        'mastercard': '💳',
        'amex': '💳',
        'discover': '💳',
        'default': '💳'
      },
      'DIGITAL_WALLET': {
        'apple_pay': '📱',
        'google_pay': '📱',
        'paypal': '🅿️',
        'default': '💰'
      },
      'BANK_ACCOUNT': {
        'default': '🏦'
      }
    };
    
    return icons[type]?.[brand] || icons[type]?.default || '💳';
  }
};