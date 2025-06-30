import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';

const Home = () => {
  const [stats, setStats] = useState({
    products: 0,
    gardeners: 0,
    orders: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [reminder, setReminder] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Current token:', token ? 'Token exists' : 'No token');
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

    
      try {
        const testResponse = await axios.get(`${backendUrl}/api/dashboard/test`);
        console.log('Test endpoint response:', testResponse.data);
      } catch (error) {
        console.error('Test endpoint failed:', error);
      }

      console.log('Making request to:', `${backendUrl}/api/dashboard/stats`);
      console.log('With token:', token);

      const response = await axios.get(`${backendUrl}/api/dashboard/stats`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Stats response:', response);

      if (response.data.success) {
        const newStats = {
          products: response.data.products || 0,
          gardeners: response.data.gardeners || 0,
          orders: response.data.orders || 0,
          users: response.data.users || 0
        };
        console.log('Setting new stats:', newStats);
        setStats(newStats);
      } else {
        console.error('Failed to fetch stats:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching stats:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        headers: error.config?.headers
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = () => {
    if (reminder.trim()) {
      setTasks([...tasks, reminder]);
      setReminder("");
    }
  };

  const statCards = [
    {
      title: "Products",
      value: stats.products,
      icon: (
        <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bgColor: "bg-teal-50",
      link: "/add"
    },
    {
      title: "Gardeners",
      value: stats.gardeners,
      icon: (
        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      bgColor: "bg-purple-50",
      link: "/addgardener"
    },
    {
      title: "Orders",
      value: stats.orders,
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      bgColor: "bg-blue-50",
      link: "/orders"
    },
    {
      title: "Users",
      value: stats.users,
      icon: (
        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      bgColor: "bg-orange-50",
      link: "/users"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Welcome back, Sufi , Shafat and  Muaz ! 👋
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Here's what's happening with your store today.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {loading ? (
            [...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-8 w-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : (
            statCards.map((card, index) => (
              <Link
                to={card.link}
                key={index}
                className={`${card.bgColor} rounded-2xl p-6 transition-transform duration-300 hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    {card.icon}
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-gray-600 mt-1">
                  Total {card.title}
                </p>
              </Link>
            ))
          )}
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* To-Do List Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Tasks</h2>
            <div className="flex mb-4">
              <input
                type="text"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Add a new task"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <button
                onClick={addTask}
                className="ml-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1 text-gray-700">{task}</span>
                  <button
                    onClick={() => setTasks(tasks.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/add" className="p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors">
                <span className="flex items-center text-teal-600 font-medium">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Product
                </span>
              </Link>
              <Link to="/addgardener" className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                <span className="flex items-center text-purple-600 font-medium">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Add Gardener
                </span>
              </Link>
              <Link to="/orders" className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                <span className="flex items-center text-blue-600 font-medium">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View Orders
                </span>
              </Link>
              <Link to="/users" className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                <span className="flex items-center text-orange-600 font-medium">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Manage Users
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
