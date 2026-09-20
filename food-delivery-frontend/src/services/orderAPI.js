import api from './api';

/**
 * Order API Service
 * Handles all order-related API calls
 */

/**
 * Create a new order
 * @param {Object} orderData - Order details
 * @param {string} orderData.restaurantId - Restaurant ID
 * @param {string} orderData.deliveryAddressId - Delivery address ID
 * @param {Array} orderData.items - Array of order items
 * @param {string} orderData.specialInstructions - Special instructions (optional)
 * @returns {Promise<Object>} Created order
 */
export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

/**
 * Get all orders for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of user orders
 */
export const getUserOrders = async (userId) => {
  const response = await api.get(`/orders/user/${userId}`);
  return response.data;
};

/**
 * Get a specific order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, { status });
  return response.data;
};

/**
 * Cancel an order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Cancelled order
 */
export const cancelOrder = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/status`, { status: 'CANCELLED' });
  return response.data;
};

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};
