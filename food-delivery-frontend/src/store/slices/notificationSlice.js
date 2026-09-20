import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  notifications: [],         // Array of notifications
  unreadCount: 0,           // Count of unread notifications
  isConnected: false,       // WebSocket connection status
  preferences: {            // User notification preferences
    orderUpdates: true,
    promotions: true,
    emailNotifications: true,
    pushNotifications: true
  }
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Add new notification
    addNotification: (state, action) => {
      const notification = {
        id: Date.now().toString(), // Simple ID generation
        timestamp: new Date().toISOString(),
        isRead: false,
        ...action.payload
      }
      
      // Add to beginning of array (newest first)
      state.notifications.unshift(notification)
      
      // Increment unread count
      state.unreadCount += 1
      
      // Keep only last 50 notifications to prevent memory issues
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    
    // Mark notification as read
    markAsRead: (state, action) => {
      const notificationId = action.payload
      const notification = state.notifications.find(n => n.id === notificationId)
      
      if (notification && !notification.isRead) {
        notification.isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    
    // Mark all notifications as read
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true
      })
      state.unreadCount = 0
    },
    
    // Remove notification
    removeNotification: (state, action) => {
      const notificationId = action.payload
      const notificationIndex = state.notifications.findIndex(n => n.id === notificationId)
      
      if (notificationIndex >= 0) {
        const notification = state.notifications[notificationIndex]
        
        // Decrease unread count if notification was unread
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
        
        // Remove notification
        state.notifications.splice(notificationIndex, 1)
      }
    },
    
    // Clear all notifications
    clearAllNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
    
    // Set WebSocket connection status
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload
    },
    
    // Update notification preferences
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload }
    },
    
    // Add order update notification
    addOrderUpdateNotification: (state, action) => {
      const { orderId, status, message, restaurantName } = action.payload
      
      const notification = {
        id: `order-${orderId}-${Date.now()}`,
        type: 'ORDER_UPDATE',
        title: 'Order Update',
        message: message || `Your order from ${restaurantName} is now ${status.toLowerCase()}`,
        orderId,
        status,
        restaurantName,
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      // Add to beginning of array
      state.notifications.unshift(notification)
      state.unreadCount += 1
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    
    // Add delivery update notification
    addDeliveryUpdateNotification: (state, action) => {
      const { orderId, message, estimatedArrival } = action.payload
      
      const notification = {
        id: `delivery-${orderId}-${Date.now()}`,
        type: 'DELIVERY_UPDATE',
        title: 'Delivery Update',
        message,
        orderId,
        estimatedArrival,
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      state.notifications.unshift(notification)
      state.unreadCount += 1
      
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    
    // Add promotion notification
    addPromotionNotification: (state, action) => {
      const { title, message, promoCode, expiryDate } = action.payload
      
      const notification = {
        id: `promo-${Date.now()}`,
        type: 'PROMOTION',
        title,
        message,
        promoCode,
        expiryDate,
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      state.notifications.unshift(notification)
      state.unreadCount += 1
      
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    
    // Add system notification
    addSystemNotification: (state, action) => {
      const { title, message, severity = 'info' } = action.payload
      
      const notification = {
        id: `system-${Date.now()}`,
        type: 'SYSTEM',
        title,
        message,
        severity, // 'info', 'warning', 'error', 'success'
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      state.notifications.unshift(notification)
      state.unreadCount += 1
      
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    
    // Handle order notification (for WebSocket integration)
    handleOrderNotification: (state, action) => {
      const { orderId, status, restaurantName, estimatedTime } = action.payload
      
      let title = ''
      let message = ''
      
      switch (status) {
        case 'CONFIRMED':
          title = 'Order Confirmed!'
          message = `Your order from ${restaurantName} has been confirmed. Estimated delivery: ${estimatedTime}`
          break
        case 'PREPARING':
          title = 'Order Being Prepared'
          message = `${restaurantName} is now preparing your order`
          break
        case 'READY':
          title = 'Order Ready for Pickup'
          message = `Your order from ${restaurantName} is ready and waiting for pickup`
          break
        case 'PICKED_UP':
          title = 'Order Picked Up'
          message = `Your order is on its way! Track your delivery partner's location`
          break
        case 'DELIVERED':
          title = 'Order Delivered!'
          message = `Your order from ${restaurantName} has been delivered. Enjoy your meal!`
          break
        case 'CANCELLED':
          title = 'Order Cancelled'
          message = `Your order from ${restaurantName} has been cancelled`
          break
        default:
          title = 'Order Update'
          message = `Your order status has been updated to ${status}`
      }
      
      const notification = {
        id: `order-${orderId}-${Date.now()}`,
        type: 'ORDER_UPDATE',
        title,
        message,
        orderId,
        status,
        restaurantName,
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      state.notifications.unshift(notification)
      state.unreadCount += 1
      
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    
    // Handle payment notification (for WebSocket integration)
    handlePaymentNotification: (state, action) => {
      const { success, orderId, amount, message } = action.payload
      
      const notification = {
        id: `payment-${orderId}-${Date.now()}`,
        type: success ? 'PAYMENT_SUCCESS' : 'PAYMENT_FAILED',
        title: success ? 'Payment Successful' : 'Payment Failed',
        message: success 
          ? `Payment of $${amount} processed successfully`
          : message || 'Payment processing failed. Please try again.',
        orderId,
        amount,
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      state.notifications.unshift(notification)
      state.unreadCount += 1
      
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    
    // Handle system notification (for WebSocket integration)
    handleSystemNotification: (state, action) => {
      const { title, message, type = 'SYSTEM_MAINTENANCE' } = action.payload
      
      const notification = {
        id: `system-${Date.now()}`,
        type,
        title,
        message,
        timestamp: new Date().toISOString(),
        isRead: false
      }
      
      state.notifications.unshift(notification)
      state.unreadCount += 1
      
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    }
  }
})

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  setConnectionStatus,
  updatePreferences,
  addOrderUpdateNotification,
  addDeliveryUpdateNotification,
  addPromotionNotification,
  addSystemNotification,
  handleOrderNotification,
  handlePaymentNotification,
  handleSystemNotification
} = notificationSlice.actions

export default notificationSlice.reducer