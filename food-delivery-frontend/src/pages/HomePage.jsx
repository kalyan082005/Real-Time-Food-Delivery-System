import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Search, MapPin, Clock, Star, ChevronRight, Truck, Shield, Heart } from 'lucide-react'
import { getAllRestaurants } from '../store/slices/restaurantSlice'
import LoadingSpinner from '../components/common/LoadingSpinner'

const HomePage = () => {
  const dispatch = useDispatch()
  const { restaurants, loading } = useSelector((state) => state.restaurants)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Fetch all restaurants on component mount
    dispatch(getAllRestaurants())
  }, [dispatch])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search page with query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  // Popular cuisines data
  const popularCuisines = [
    { name: 'Italian', image: '🍕', count: '120+ restaurants' },
    { name: 'Chinese', image: '🥡', count: '85+ restaurants' },
    { name: 'Mexican', image: '🌮', count: '95+ restaurants' },
    { name: 'Indian', image: '🍛', count: '110+ restaurants' },
    { name: 'American', image: '🍔', count: '150+ restaurants' },
    { name: 'Thai', image: '🍜', count: '65+ restaurants' },
  ]

  // Features data
  const features = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Get your food delivered in 30 minutes or less',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your payments and data are always protected',
    },
    {
      icon: Heart,
      title: 'Quality Food',
      description: 'Only the best restaurants and freshest ingredients',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-primary text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Delicious food,
            <br />
            delivered to your door
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Order from your favorite restaurants and get fresh food delivered fast
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your delivery address"
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for restaurants or dishes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Find Food
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Cuisines */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Popular Cuisines</h2>
            <Link
              to="/restaurants"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularCuisines.map((cuisine, index) => (
              <Link
                key={index}
                to={`/restaurants?cuisine=${encodeURIComponent(cuisine.name)}`}
                className="group text-center p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-3">{cuisine.image}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600">
                  {cuisine.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{cuisine.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Restaurants</h2>
            <Link
              to="/restaurants"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
              <ChevronRight className="h-5 w-5 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {restaurants.slice(0, 8).map((restaurant) => (
                <Link
                  key={restaurant.id}
                  to={`/restaurants/${restaurant.id}`}
                  className="restaurant-card group"
                >
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    <img
                      src={restaurant.imageUrl || '/api/placeholder/300/200'}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 mb-1">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{restaurant.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{restaurant.deliveryTime} min</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Delivery fee: ${restaurant.deliveryFee}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 px-4 bg-gray-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to order?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Join thousands of satisfied customers and get your favorite food delivered
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Sign Up Now
              </Link>
              <Link
                to="/restaurants"
                className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Browse Restaurants
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Welcome back section for authenticated users */}
      {isAuthenticated && (
        <section className="py-16 px-4 bg-primary-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              What would you like to eat today?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/orders"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View My Orders
              </Link>
              <Link
                to="/restaurants"
                className="border border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Order Now
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage