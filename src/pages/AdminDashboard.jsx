import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Blog Management Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Blog Management</h2>
            <p className="text-gray-600 mb-4">Create, edit, and manage blog posts</p>
            <Link 
              to="/admin/blog-generator" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Blogs
            </Link>
          </div>
          
          {/* Destination Management Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Destination Management</h2>
            <p className="text-gray-600 mb-4">Manage destinations, images, and content</p>
            <Link 
              to="/admin/destinations" 
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Manage Destinations
            </Link>
          </div>
          
          {/* User Management Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">User Management</h2>
            <p className="text-gray-600 mb-4">View and manage user accounts</p>
            <button className="inline-block bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
              Coming Soon
            </button>
          </div>
          
          {/* Analytics Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Analytics</h2>
            <p className="text-gray-600 mb-4">View site statistics and user engagement</p>
            <button className="inline-block bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
              Coming Soon
            </button>
          </div>
          
          {/* Content Management Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Content Management</h2>
            <p className="text-gray-600 mb-4">Manage destinations and travel content</p>
            <button className="inline-block bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
              Coming Soon
            </button>
          </div>
          
          {/* Subscription Management Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Subscriptions</h2>
            <p className="text-gray-600 mb-4">Manage subscription plans and user tiers</p>
            <button className="inline-block bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
              Coming Soon
            </button>
          </div>
          
          {/* Settings Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
            <p className="text-gray-600 mb-4">Configure site settings and preferences</p>
            <button className="inline-block bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;