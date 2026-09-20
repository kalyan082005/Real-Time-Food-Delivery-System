import React, { useEffect, useState } from 'react'
import { 
  Users, 
  Store, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  Star,
  AlertTriangle
} from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeOrders: 0,
    averageRating: 0,
    growthRate: 0,
    pendingApprovals: 0
  })

  const [recentActivity, setRecentActivity] = useState([])
  const [topRestaurants, setTopRestaurants] = useState([])

  useEffect(() => {
    // Simulate loading dashboard data
    setStats({
      totalUsers: 12543,
      totalRestaurants: 234,
      totalOrders: 8765,
      totalRevenue: 125430.50,
      activeOrders: 45,
      averageRating: 4.2,
      growthRate: 12.5,
      pendingApprovals: 8
    })

    setRecentActivity([
      { id: 1, type: 'order', message: 'New order #12345 from Pizza Palace', time: '2 minutes ago' },
      { id: 2, type: 'user', message: 'New user registration: john.doe@email.com', time: '5 minutes ago' },
      { id: 3, type: 'restaurant', message: 'Burger King updated their menu', time: '10 minutes ago' },
      { id: 4, type: 'review', message: 'New 5-star review for Sushi Express', time: '15 minutes ago' },
      { id: 5, type: 'payment', message: 'Payment issue reported for order #12340', time: '20 minutes ago' }
    ])

    setTopRestaurants([
      { id: 1, name: 'Pizza Palace', orders: 234, revenue: 12450.00, rating: 4.8 },
      { id: 2, name: 'Burger King', orders: 198, revenue: 9876.50, rating: 4.5 },
      { id: 3, name: 'Sushi Express', orders: 156, revenue: 15678.00, rating: 4.9 },
      { id: 4, name: 'Taco Bell', orders: 143, revenue: 7890.25, rating: 4.3 },
      { id: 5, name: 'Chinese Garden', orders: 128, revenue: 8765.75, rating: 4.6 }
    ])
  }, [])

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'primary' }) => {
    const colorClasses = {
      primary: 'bg-primary-50 text-primary-600',
      green: 'bg-green-50 text-green-600',
      blue: 'bg-blue-50 text-blue-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      red: 'bg-red-50 text-red-600'
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {trendValue}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage your food delivery platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            trend="up"
            trendValue="8.2"
            color="blue"
          />
          <StatCard
            title="Restaurants"
            value={stats.totalRestaurants.toLocaleString()}
            icon={Store}
            trend="up"
            trendValue="3.1"
            color="green"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            icon={ShoppingBag}
            trend="up"
            trendValue="15.3"
            color="primary"
          />
          <StatCard
            title="Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend="up"
            trendValue="12.5"
            color="green"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Orders"
            value={stats.activeOrders}
            icon={Activity}
            color="yellow"
          />
          <StatCard
            title="Avg Rating"
            value={stats.averageRating.toFixed(1)}
            icon={Star}
            color="yellow"
          />
          <StatCard
            title="Growth Rate"
            value={`${stats.growthRate}%`}
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pendingApprovals}
            icon={AlertTriangle}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const getIcon = (type) => {
                  switch (type) {
                    case 'order': return <ShoppingBag className="h-4 w-4 text-blue-600" />
                    case 'user': return <Users className="h-4 w-4 text-green-600" />
                    case 'restaurant': return <Store className="h-4 w-4 text-purple-600" />
                    case 'review': return <Star className="h-4 w-4 text-yellow-600" />
                    case 'payment': return <DollarSign className="h-4 w-4 text-red-600" />
                    default: return <Activity className="h-4 w-4 text-gray-600" />
                  }
                }

                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Restaurants */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Top Restaurants</h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {topRestaurants.map((restaurant, index) => (
                <div key={restaurant.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium text-sm">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {restaurant.name}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{restaurant.orders} orders</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          <span>{restaurant.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${restaurant.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Manage Users</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Store className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Restaurants</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingBag className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Orders</span>
            </button>
            
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <DollarSign className="h-8 w-8 text-yellow-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Payments</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard