import React, { useState, useEffect } from 'react'
import { 
  Package, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Star,
  Plus,
  Edit,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Bell
} from 'lucide-react'

const RestaurantDashboard = () => {
  const [activeOrders, setActiveOrders] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [todayStats, setTodayStats] = useState({
    orders: 0,
    revenue: 0,
    rating: 0,
    customers: 0
  })
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setActiveOrders([
      {
        id: 'ORD001',
        customer: 'John Doe',
        items: [
          { name: 'Margherita Pizza', quantity: 1, price: 12.99 },
          { name: 'Caesar Salad', quantity: 1, price: 8.99 }
        ],
        total: 21.98,
        status: 'preparing',
        orderTime: '2:30 PM',
        estimatedTime: '15 min'
      },
      {
        id: 'ORD002',
        customer: 'Jane Smith',
        items: [
          { name: 'Pepperoni Pizza', quantity: 2, price: 14.99 }
        ],
        total: 29.98,
        status: 'ready',
        orderTime: '2:25 PM',
        estimatedTime: 'Ready'
      }
    ])

    setMenuItems([
      {
        id: 1,
        name: 'Margherita Pizza',
        price: 12.99,
        category: 'Pizza',
        available: true,
        description: 'Fresh tomatoes, mozzarella, basil',
        preparationTime: 15
      },
      {
        id: 2,
        name: 'Pepperoni Pizza',
        price: 14.99,
        category: 'Pizza',
        available: true,
        description: 'Pepperoni, mozzarella, tomato sauce',
        preparationTime: 15
      },
      {
        id: 3,
        name: 'Caesar Salad',
        price: 8.99,
        category: 'Salads',
        available: false,
        description: 'Romaine lettuce, parmesan, croutons',
        preparationTime: 5
      }
    ])

    setTodayStats({
      orders: 24,
      revenue: 487.50,
      rating: 4.6,
      customers: 18
    })
  }, [])

  const handleOrderStatusUpdate = (orderId, newStatus) => {
    setActiveOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  const handleMenuItemToggle = (itemId) => {
    setMenuItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, available: !item.available } : item
      )
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'picked_up': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your orders and menu</p>
          </div>
          
          {/* Restaurant Status Toggle */}
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">
              {isOnline ? 'Open' : 'Closed'}
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
            title="Orders Today"
            value={todayStats.orders}
            icon={Package}
            color="blue"
          />
          <StatusCard
            title="Revenue"
            value={`$${todayStats.revenue.toFixed(2)}`}
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
            title="Customers"
            value={todayStats.customers}
            icon={Users}
            color="primary"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Orders */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Active Orders</h2>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  {activeOrders.length}
                </span>
              </div>
            </div>
            
            {activeOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active orders</h3>
                <p className="text-gray-600">New orders will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">${order.total.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{order.orderTime}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                      
                      <div className="flex space-x-2">
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleOrderStatusUpdate(order.id, 'ready')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                          >
                            Mark Ready
                          </button>
                        )}
                        {order.status === 'ready' && (
                          <button
                            onClick={() => handleOrderStatusUpdate(order.id, 'picked_up')}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            Picked Up
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Menu Management */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Menu Items</h2>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {menuItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm font-medium text-gray-900">${item.price}</span>
                          <span className="text-xs text-gray-500">{item.preparationTime} min</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleMenuItemToggle(item.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.available 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}
                      title={item.available ? 'Available' : 'Unavailable'}
                    >
                      {item.available ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week's Performance</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">156</div>
              <div className="text-sm text-gray-600">Total Orders</div>
              <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$2,847.50</div>
              <div className="text-sm text-gray-600">Revenue</div>
              <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8%
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">4.7</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
              <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.2
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">18 min</div>
              <div className="text-sm text-gray-600">Avg Prep Time</div>
              <div className="text-xs text-red-600 flex items-center justify-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                +2 min
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDashboard