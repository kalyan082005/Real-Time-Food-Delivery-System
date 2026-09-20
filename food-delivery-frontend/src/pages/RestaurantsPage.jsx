import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Star, Clock, MapPin } from 'lucide-react'
import { getAllRestaurants, searchRestaurants, updateSearchFilters } from '../store/slices/restaurantSlice'

const RestaurantsPage = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { restaurants, isLoading, searchFilters } = useSelector((state) => state.restaurants)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Get search parameters from URL
    const cuisine = searchParams.get('cuisine') || ''
    const query = searchParams.get('q') || ''
    
    // Update search query state
    setSearchQuery(query)
    
    // Update filters and search
    const filters = { cuisine }
    dispatch(updateSearchFilters(filters))
    
    // If cuisine filter exists, search by cuisine, otherwise get all
    if (cuisine) {
      dispatch(searchRestaurants(filters))
    } else {
      dispatch(getAllRestaurants())
    }
  }, [dispatch, searchParams])

  const handleSearch = (e) => {
    e.preventDefault()
    const newParams = new URLSearchParams(searchParams)
    if (searchQuery) {
      newParams.set('q', searchQuery)
    } else {
      newParams.delete('q')
    }
    setSearchParams(newParams)
  }

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...searchFilters, [filterName]: value }
    dispatch(updateSearchFilters(newFilters))
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(filterName, value)
    } else {
      newParams.delete(filterName)
    }
    setSearchParams(newParams)
    
    // Search with new filters or get all if no cuisine
    if (filterName === 'cuisine' && value) {
      dispatch(searchRestaurants(newFilters))
    } else if (filterName === 'cuisine' && !value) {
      dispatch(getAllRestaurants())
    }
  }

  const cuisineOptions = [
    'Italian', 'Chinese', 'Mexican', 'Indian', 'American', 'Thai', 'Japanese', 'Mediterranean'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Restaurants</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </form>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine Type
                  </label>
                  <select
                    value={searchFilters.cuisine}
                    onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Cuisines</option>
                    {cuisineOptions.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={searchFilters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any Price</option>
                    <option value="$">$ - Budget Friendly</option>
                    <option value="$$">$$ - Moderate</option>
                    <option value="$$$">$$$ - Expensive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={searchFilters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurants/${restaurant.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={restaurant.imageUrl || '/api/placeholder/400/200'}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{restaurant.description}</p>
                  
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{restaurant.rating}</span>
                      <span className="text-gray-500">({restaurant.reviewCount || 0})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{restaurant.deliveryTime} min</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{restaurant.distance || '2.5'} km</span>
                    </div>
                    <span className="text-gray-600">
                      Delivery: ${restaurant.deliveryFee}
                    </span>
                  </div>
                  
                  {restaurant.cuisineTypes && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {restaurant.cuisineTypes.slice(0, 2).map((cuisine) => (
                        <span
                          key={cuisine}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && restaurants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or location
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantsPage