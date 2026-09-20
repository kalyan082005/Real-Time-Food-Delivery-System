import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold">FoodDelivery</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your favorite food delivered fast, fresh, and with a smile. 
              Connecting you with the best restaurants in your area.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/restaurants" className="text-gray-400 hover:text-white transition-colors">
                  Browse Restaurants
                </Link>
              </li>
              <li>
                <Link to="/cuisines" className="text-gray-400 hover:text-white transition-colors">
                  Cuisines
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-gray-400 hover:text-white transition-colors">
                  Offers & Deals
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Business */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Business</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/restaurant/register" className="text-gray-400 hover:text-white transition-colors">
                  Partner with Us
                </Link>
              </li>
              <li>
                <Link to="/delivery/register" className="text-gray-400 hover:text-white transition-colors">
                  Become a Delivery Partner
                </Link>
              </li>
              <li>
                <Link to="/business/solutions" className="text-gray-400 hover:text-white transition-colors">
                  Business Solutions
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="text-gray-400 hover:text-white transition-colors">
                  Advertise with Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-500" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-500" />
                <span className="text-gray-400">support@fooddelivery.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary-500 mt-0.5" />
                <span className="text-gray-400">
                  123 Food Street<br />
                  Delivery City, DC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 FoodDelivery. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer