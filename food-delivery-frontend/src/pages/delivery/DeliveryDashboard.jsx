import React, { useState, useEffect } from 'react'
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Package, 
  Navigation, 
  Phone,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Star
} from 'lucide-react'

const DeliveryDashboard = () => {
  const [isOnline, setIsOnline] = useState(false)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [availableOrders, setAvailableOrders] = useState([])
  const [todayStats, setTodayStats] = useState({
    deliveries: 0,
    earnings: 0,
    rating: 0,
    onlineTime: 0
  })

  useEffect(() => {
    // Simulate loading data
    setAvailableOrders([
      {
        id: 'ORD001',
        restaurant: 'Pizza Palace',
        customer: 'John Doe',
        items: 3,
        distance: '2.5 km',
        estimatedTime: '15 min',
        payment: 25.50,
        tip: 3.00,
        address: '123 Main St, Downtown'
      },
      {
        id: 'ORD002', 
        restaurant: 'Burger King',
        customer: 'Jane Smith',
        items: 2,
        distance: '1.8 km',
        estimatedTime: '12 min',
        payment: 18.75,
        tip: 2.50,
        address: '456 Oak Ave, Midtown'
      }
    ])

    setTodayStats({
      deliveries: 8,
      earnings: 127.50,
      rating: 4.8,
      onlineTime: 6.5
    })
  }, [])

  const handleAcceptOrder = (orderId) => {
    const order = availableOrders.find(o => o.id === orderId)
    setCurrentOrder(order)
    setAvailableOrders(prev => prev.filter(o => o.id !== orderId))
  }

  const handleCompleteDelivery = () => {
    setCurrentOrder(null)
    setTodayStats(prev => ({
      ...prev,
      deliveries: prev.deliveries + 1,
      earnings: prev.earnings + currentOrder.payment + currentOrder.tip
    }))
  }

  const StatusCard = ({ title, value, icon: Icon, color = 'primary' }) => {
    const colorClasses = {
      primary: 'bg-primary-50 text-primary-600',
      green: 'bg-green-50 text-green-600',
      blue: 'bg-blue-50 text-blue-600',
      yellow: 'bg-yellow-50 text-yellow-600'
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Delivery Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your deliveries and earnings</p>
          </div>
          
          {/* Online Status Toggle */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${isOnline ? 'bg-green-600' : 'bg-gray-200'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${isOnline ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatusCard
            title="Deliveries"
            value={todayStats.deliveries}
            icon={Package}
            color="blue"
          />
          <StatusCard
            title="Earnings"
            value={`$${todayStats.earnings.toFixed(2)}`}
            icon={DollarSign}
            color="green"
          />
          <StatusCard
            title="Rating"
            value={todayStats.rating.toFixed(1)}
            icon={Star}
            color="yellow"
          />
          <StatusCard
            title="Online Time"
            value={`${todayStats.onlineTime}h`}
            icon={Clock}
            color="primary"
          />
        </div>

        {/* Current Order */}
        {currentOrder && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Current Delivery</h2>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                In Progress
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-medium">{currentOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Restaurant:</span>
                    <span className="font-medium">{currentOrder.restaurant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{currentOrder.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{currentOrder.items} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-medium">${currentOrder.payment.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tip:</span>
                    <span className="font-medium text-green-600">${currentOrder.tip.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Delivery Info</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delivery Address</p>
                      <p className="text-sm text-gray-600">{currentOrder.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Distance: {currentOrder.distance}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">ETA: {currentOrder.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Navigation className="h-4 w-4" />
                <span>Navigate</span>
              </button>
              <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Call Customer</span>
              </button>
              <button 
                onClick={handleCompleteDelivery}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Complete</span>
              </button>
            </div>
          </div>
        )}

        {/* Available Orders */}
        {!currentOrder && isOnline && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Available Orders</h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Refresh
              </button>
            </div>
            
            {availableOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders available</h3>
                <p className="text-gray-600">
                  New delivery requests will appear here when available
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{order.restaurant}</h3>
                        <p className="text-sm text-gray-600">Order #{order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${(order.payment + order.tip).toFixed(2)}
                        </p>
                        <p className="text-sm text-green-600">
                          +${order.tip.toFixed(2)} tip
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4" />
                        <span>{order.items} items</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Navigation className="h-4 w-4" />
                        <span>{order.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{order.estimatedTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-600">{order.address}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleAcceptOrder(order.id)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Offline State */}
        {!isOnline && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">You're currently offline</h3>
            <p className="text-gray-600 mb-4">
              Turn on your availability to start receiving delivery requests
            </p>
            <button
              onClick={() => setIsOnline(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Go Online
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">42</div>
              <div className="text-sm text-gray-600">Deliveries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$687.50</div>
              <div className="text-sm text-gray-600">Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4.9</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">32h</div>
              <div className="text-sm text-gray-600">Online Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryDashboard