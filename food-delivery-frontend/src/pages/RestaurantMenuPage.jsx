import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRestaurantMenu, addMenuItem } from '../store/slices/menuSlice'

const RestaurantMenuPage = () => {
  const { restaurantId } = useParams()
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.menu)
  const { user } = useSelector((state) => state.auth)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isAvailable: true,
    isVegetarian: false,
    prepTime: '',
    imageUrl: ''
  })

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchRestaurantMenu(restaurantId))
    }
  }, [dispatch, restaurantId])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(addMenuItem({ 
        restaurantId, 
        menuItemData: {
          ...formData,
          price: parseFloat(formData.price),
          prepTime: formData.prepTime ? parseInt(formData.prepTime) : null
        }
      })).unwrap()
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        isAvailable: true,
        isVegetarian: false,
        prepTime: '',
        imageUrl: ''
      })
      setShowAddForm(false)
    } catch (err) {
      console.error('Failed to add menu item:', err)
    }
  }

  if (loading && items.length === 0) {
    return <div className="container mx-auto px-4 py-8">Loading menu...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Restaurant Menu</h1>
        {user && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showAddForm ? 'Cancel' : 'Add Menu Item'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
          <h2 className="text-xl font-bold mb-4">Add New Menu Item</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Category *
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Prep Time (minutes)
                </label>
                <input
                  type="number"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-gray-700 text-sm font-bold">
                  Available
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isVegetarian"
                  checked={formData.isVegetarian}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-gray-700 text-sm font-bold">
                  Vegetarian
                </label>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Add Item
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No menu items available
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <span className="text-lg font-bold text-green-600">
                    ${item.price}
                  </span>
                </div>
                {item.description && (
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                    {item.category}
                  </span>
                  {item.isVegetarian && (
                    <span className="bg-green-200 text-green-700 text-xs px-2 py-1 rounded">
                      Vegetarian
                    </span>
                  )}
                  {!item.isAvailable && (
                    <span className="bg-red-200 text-red-700 text-xs px-2 py-1 rounded">
                      Unavailable
                    </span>
                  )}
                </div>
                {item.prepTime && (
                  <p className="text-gray-500 text-sm">
                    Prep time: {item.prepTime} min
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default RestaurantMenuPage
