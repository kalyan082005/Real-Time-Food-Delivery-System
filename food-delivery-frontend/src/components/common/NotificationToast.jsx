import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const NotificationToast = () => {
  const { notifications, isConnected } = useSelector((state) => state.notifications)
  const [lastNotificationId, setLastNotificationId] = useState(null)

  // Show toast for new notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0]
      
      // Only show toast for new notifications
      if (latestNotification.id !== lastNotificationId && !latestNotification.isRead) {
        showNotificationToast(latestNotification)
        setLastNotificationId(latestNotification.id)
      }
    }
  }, [notifications, lastNotificationId])

  // Show connection status toast
  useEffect(() => {
    if (isConnected === false) {
      toast.error('Connection lost. Trying to reconnect...', {
        id: 'connection-lost',
        duration: Infinity,
        icon: '🔄',
      })
    } else if (isConnected === true) {
      toast.dismiss('connection-lost')
      toast.success('Connected', {
        duration: 2000,
        icon: '✅',
      })
    }
  }, [isConnected])

  const showNotificationToast = (notification) => {
    const { type, title, message } = notification

    // Determine icon and style based on notification type
    let icon = <Info className="h-5 w-5" />
    let bgColor = 'bg-blue-50'
    let textColor = 'text-blue-900'
    let borderColor = 'border-blue-200'

    switch (type) {
      case 'ORDER_CONFIRMED':
      case 'ORDER_DELIVERED':
      case 'PAYMENT_SUCCESS':
        icon = <CheckCircle className="h-5 w-5 text-green-600" />
        bgColor = 'bg-green-50'
        textColor = 'text-green-900'
        borderColor = 'border-green-200'
        break
      case 'ORDER_CANCELLED':
      case 'PAYMENT_FAILED':
        icon = <AlertCircle className="h-5 w-5 text-red-600" />
        bgColor = 'bg-red-50'
        textColor = 'text-red-900'
        borderColor = 'border-red-200'
        break
      case 'ORDER_PREPARING':
      case 'ORDER_READY':
      case 'ORDER_PICKED_UP':
        icon = <AlertTriangle className="h-5 w-5 text-orange-600" />
        bgColor = 'bg-orange-50'
        textColor = 'text-orange-900'
        borderColor = 'border-orange-200'
        break
      default:
        icon = <Info className="h-5 w-5 text-blue-600" />
    }

    // Custom toast component
    const CustomToast = ({ t, onDismiss }) => (
      <div className={`
        max-w-md w-full ${bgColor} ${borderColor} border rounded-lg shadow-lg p-4
        ${t.visible ? 'animate-fade-in' : 'animate-fade-out'}
      `}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${textColor}`}>
              {title}
            </p>
            {message && (
              <p className={`mt-1 text-sm ${textColor} opacity-80`}>
                {message}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={onDismiss}
              className={`inline-flex rounded-md p-1.5 ${textColor} hover:bg-opacity-20 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )

    // Show the toast
    toast.custom((t) => (
      <CustomToast 
        t={t} 
        onDismiss={() => toast.dismiss(t.id)} 
      />
    ), {
      duration: 5000,
      position: 'top-right',
    })
  }

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
        },
      }}
      containerStyle={{
        top: 80, // Account for header height
      }}
    />
  )
}

export default NotificationToast