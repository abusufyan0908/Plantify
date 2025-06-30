import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

const HeroSection = () => {
  const [stats, setStats] = useState({
    products: 0,
    gardeners: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.products,
      icon: (
        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgColor: "bg-teal-50"
    },
    {
      title: "Total Gardeners",
      value: stats.gardeners,
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: "bg-purple-50"
    },
    {
      title: "Total Orders",
      value: stats.orders,
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      bgColor: "bg-blue-50"
    },
    {
      title: "Total Users",
      value: stats.users,
      icon: (
        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Welcome back, Admin! 👋
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Here's what's happening with your store today.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {loading ? (
            // Loading skeletons
            [...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : (
            // Actual stat cards
            statCards.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} rounded-2xl p-6 transition-transform duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    {card.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                    Last 30 days
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-gray-600 mt-1">
                  {card.title}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 bg-teal-50 rounded-xl text-left hover:bg-teal-100 transition-colors">
              <span className="flex items-center text-teal-600 font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Product
              </span>
            </button>
            <button className="p-4 bg-purple-50 rounded-xl text-left hover:bg-purple-100 transition-colors">
              <span className="flex items-center text-purple-600 font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add New Gardener
              </span>
            </button>
            <button className="p-4 bg-blue-50 rounded-xl text-left hover:bg-blue-100 transition-colors">
              <span className="flex items-center text-blue-600 font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Orders
              </span>
            </button>
            <button className="p-4 bg-orange-50 rounded-xl text-left hover:bg-orange-100 transition-colors">
              <span className="flex items-center text-orange-600 font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage Users
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
