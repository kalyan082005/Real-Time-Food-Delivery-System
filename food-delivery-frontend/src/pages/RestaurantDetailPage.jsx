import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Star, Clock, MapPin, Plus, Minus } from 'lucide-react'
import { getRestaurantDetails, getRestaurantMenu } from '../store/slices/restaurantSlice'
import { addToCart, openCart } from '../store/slices/cartSlice'

const RestaurantDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentRestaurant, currentMenu, isLoading, isMenuLoading } = useSelector((state) => state.restaurants)
  
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    if (id) {
      dispatch(getRestaurantDetails(id))
      dispatch(getRestaurantMenu(id))
    }
  }, [dispatch, id])

  const handleQuantityChange = (itemId, change) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change)
    }))
  }

  const handleAddToCart = (menuItem) => {
    const quantity = quantities[menuItem.id] || 1
    dispatch(addToCart({
      menuItem: {
        ...menuItem,
        restaurantId: currentRestaurant.id,
        restaurantName: currentRestaurant.name
      },
      quantity
    }))
    dispatch(openCart())
    setQuantities(prev => ({ ...prev, [menuItem.id]: 0 }))
  }

  // Group menu items by category
  const menuCategories = currentMenu.reduce((acc, item) => {
    const category = item.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {})

  const categories = ['all', ...Object.keys(menuCategories)]
  const filteredMenu = selectedCategory === 'all' 
    ? currentMenu 
    : menuCategories[selectedCategory] || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!currentRestaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant not found</h2>
          <p className="text-gray-600">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3">
              <img
                src={currentRestaurant.imageUrl || '/api/placeholder/400/300'}
                alt={currentRestaurant.name}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentRestaurant.name}
              </h1>
              <p className="text-gray-600 mb-4">{currentRestaurant.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{currentRestaurant.rating}</span>
                  <span className="text-gray-500">({currentRestaurant.reviewCount || 0} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock className="h-5 w-5" />
                  <span>{currentRestaurant.deliveryTime} min delivery</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{currentRestaurant.distance || '2.5'} km away</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  Delivery: ${currentRestaurant.deliveryFee}
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Min order: ${currentRestaurant.minOrderAmount || 15}
                </span>
                {currentRestaurant.isOpen ? (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Open</span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Closed</span>
                )}
              </div>
              
              {currentRestaurant.cuisineTypes && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentRestaurant.cuisineTypes.map((cuisine) => (
                    <span
                      key={cuisine}
                      className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category === 'all' ? 'All Items' : category}
                    {category !== 'all' && (
                      <span className="ml-2 text-sm text-gray-400">
                        ({menuCategories[category]?.length || 0})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:w-3/4">
            {isMenuLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMenu.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-32 md:h-32 flex-shrink-0">
                        <img
                          src={item.imageUrl || '/api/placeholder/150/150'}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                          <span className="text-lg font-bold text-primary-600">
                            ${item.price}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{item.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {item.isVegetarian && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                Vegetarian
                              </span>
                            )}
                            {item.isVegan && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                Vegan
                              </span>
                            )}
                            {!item.isAvailable && (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                Unavailable
                              </span>
                            )}
                          </div>
                          
                          {item.isAvailable && (
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                  disabled={!quantities[item.id]}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center font-medium">
                                  {quantities[item.id] || 0}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                              >
                                Add to Cart
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isMenuLoading && filteredMenu.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No items found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetailPage