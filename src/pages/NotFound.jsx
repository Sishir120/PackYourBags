import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-2xl font-bold text-gray-900">!</span>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for seems to have wandered off the map.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <p className="text-gray-700 mb-6">
            Don't worry, this happens to the best of travelers. Here are some helpful options:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link 
              to="/" 
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all duration-300"
            >
              <Home className="w-6 h-6 text-purple-600" />
              <span className="font-medium text-purple-700">Return to Homepage</span>
            </Link>
            
            <Link 
              to="/#destinations" 
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl hover:from-blue-200 hover:to-cyan-200 transition-all duration-300"
            >
              <MapPin className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-blue-700">Explore Destinations</span>
            </Link>
            
            <Link 
              to="/#roulette" 
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl hover:from-green-200 hover:to-emerald-200 transition-all duration-300"
            >
              <span className="w-6 h-6 text-green-600 font-bold text-lg"> roulette icon</span>
              <span className="font-medium text-green-700">Try Travel Roulette</span>
            </Link>
            
            <Link 
              to="/subscription" 
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl hover:from-orange-200 hover:to-amber-200 transition-all duration-300"
            >
              <span className="w-6 h-6 text-orange-600 font-bold text-lg">$</span>
              <span className="font-medium text-orange-700">View Subscriptions</span>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full font-semibold hover:bg-gray-900 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <Link 
            to="/ai-chat" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            <span className="w-5 h-5"> chat icon</span>
            Chat with AI Assistant
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;