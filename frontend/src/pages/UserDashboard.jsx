import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Call logout endpoint if you have one
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberedEmail');

      // Show success message
      toast.success('Logged out successfully', {
        position: "top-center",
        autoClose: 2000,
      });

      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage and redirect even if the server call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberedEmail');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Plantify</h1>
            </div>
            <div className="flex items-center">
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                  <span>{user.username}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-md shadow-xl hidden group-hover:block">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user.username}!</h2>
              
              {/* User Profile Section */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Type</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">My Orders</h4>
                  <p className="text-sm text-gray-500">View and manage your orders</p>
                </div>
                <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Saved Items</h4>
                  <p className="text-sm text-gray-500">Check your saved plants</p>
                </div>
                <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Account Settings</h4>
                  <p className="text-sm text-gray-500">Update your profile information</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard; 