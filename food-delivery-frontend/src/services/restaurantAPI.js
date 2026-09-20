import api from './api'

const restaurantAPI = {
  // Get all restaurants
  getAllRestaurants: () => {
    return api.get('/restaurants')
  },

  // Search restaurants by cuisine
  searchRestaurants: (searchParams) => {
    if (searchParams && searchParams.cuisine) {
      return api.get(`/restaurants/search?cuisine=${searchParams.cuisine}`)
    }
    return api.get('/restaurants')
  },

  // Get restaurant by ID
  getRestaurantById: (restaurantId) => {
    return api.get(`/restaurants/${restaurantId}`)
  },

  // Create restaurant (requires JWT token)
  createRestaurant: (restaurantData) => {
    return api.post('/restaurants', {
      name: restaurantData.name,
      address: restaurantData.address,
      cuisineType: restaurantData.cuisineType,
      ownerId: restaurantData.ownerId
    })
  },

  // Get restaurant menu
  getRestaurantMenu: (restaurantId) => {
    return api.get(`/restaurants/${restaurantId}/menu`)
  },

  // Add menu item (requires JWT token)
  addMenuItem: (restaurantId, menuItemData) => {
    return api.post(`/restaurants/${restaurantId}/menu`, {
      name: menuItemData.name,
      description: menuItemData.description,
      price: menuItemData.price,
      category: menuItemData.category,
      isAvailable: menuItemData.isAvailable,
      isVegetarian: menuItemData.isVegetarian,
      prepTime: menuItemData.prepTime,
      imageUrl: menuItemData.imageUrl
    })
  }
}

export default restaurantAPI
