import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bell, X, Check, Trash2 } from 'lucide-react'
import { 
  markAsRead, 
  markAllAsRead, 
  removeNotification, 
  clearAllNotifications 
} from '../../store/slices/notificationSlice'

const NotificationDropdown = () => {
  const dispatch = useDispatch()
  const { notifications, unreadCount } = useSelector((state) => state.notifications)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleMarkAsRead = (notificationId) => {
    dispatch(markAsRead(notificationId))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
  }

  const handleRemoveNotification = (notificationId) => {
    dispatch(removeNotification(notificationId))
  }

  const handleClearAll = () => {
    dispatch(clearAllNotifications())
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ORDER_UPDATE':
        return '🍽️'
      case 'DELIVERY_UPDATE':
        return '🚚'
      case 'PAYMENT_SUCCESS':
        return '✅'
      case 'PAYMENT_FAILED':
        return '❌'
      case 'PROMOTION':
        return '🎉'
      case 'SYSTEM':
        return '⚙️'
      default:
        return '📢'
    }
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return notificationTime.toLocaleDateString()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No notifications yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  We'll notify you when something important happens
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-1 text-primary-600 hover:text-primary-700"
                                title="Mark as read"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleRemoveNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                              title="Remove notification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Additional notification data */}
                        {notification.orderId && (
                          <div className="mt-2">
                            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              Order #{notification.orderId.slice(-8).toUpperCase()}
                            </span>
                          </div>
                        )}
                        
                        {notification.promoCode && (
                          <div className="mt-2">
                            <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                              Code: {notification.promoCode}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 p-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown