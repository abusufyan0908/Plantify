import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaShippingFast, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';
import { BsHourglassSplit } from 'react-icons/bs';

const Profile = () => {
  const { currency } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const orderStatuses = [
    { value: 'pending', label: 'Order Placed', icon: BsHourglassSplit, color: 'text-yellow-500' },
    { value: 'processing', label: 'Processing', icon: FaBox, color: 'text-blue-500' },
    { value: 'packed', label: 'Packed', icon: FaBox, color: 'text-indigo-500' },
    { value: 'shipped', label: 'Shipped', icon: FaTruck, color: 'text-purple-500' },
    { value: 'delivered', label: 'Delivered', icon: FaCheckCircle, color: 'text-green-500' },
    { value: 'cancelled', label: 'Cancelled', icon: FaTimesCircle, color: 'text-red-500' }
  ];

  const getStatusIndex = (status) => {
    return orderStatuses.findIndex(s => s.value === status);
  };

  const filterOrders = (status) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const [userResponse, ordersResponse] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/verify`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ]);

        if (userResponse.data.success) {
          setUser(userResponse.data.user);
        }

        if (ordersResponse.data.success) {
          setOrders(ordersResponse.data.orders);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-3xl text-emerald-600">
                {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <Title text1={'YOUR '} text2={'ORDERS'} />
          </div>

          {/* Order Tabs */}
          <div className="flex space-x-4 mb-6 border-b pb-4 overflow-x-auto">
            {['all', ...orderStatuses.map(status => status.value)].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-4 text-sm font-medium capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-b-2 border-emerald-500 text-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'all' ? 'All Orders' : orderStatuses.find(s => s.value === tab)?.label}
              </button>
            ))}
          </div>
          
          {filterOrders(activeTab).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No {activeTab !== 'all' ? orderStatuses.find(s => s.value === activeTab)?.label : ''} orders found</p>
              <button
                onClick={() => navigate('/shop')}
                className="mt-4 bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filterOrders(activeTab).map((order) => (
                <div key={order._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order._id.slice(-6)}</h3>
                      <p className="text-sm text-gray-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      {order.paymentDetails && (
                        <p className="text-sm text-gray-500">
                          Payment: {order.paymentDetails.paymentMethod} ({order.paymentDetails.status})
                        </p>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {orderStatuses.find(s => s.value === order.status)?.label}
                    </span>
                  </div>

                  {/* Order Status Timeline */}
                  {order.status !== 'cancelled' && (
                    <div className="mb-6">
                      <div className="relative">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${(getStatusIndex(order.status) / (orderStatuses.length - 2)) * 100}%` }}
                          ></div>
                        </div>
                        <div className="relative flex justify-between">
                          {orderStatuses.filter(status => status.value !== 'cancelled').map((status, index) => {
                            const isActive = getStatusIndex(order.status) >= index;
                            const Icon = status.icon;
                            return (
                              <div key={status.value} className="flex flex-col items-center">
                                <div 
                                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
                                    ${isActive ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <p className={`mt-2 text-xs font-medium ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                                  {status.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {order.products.map((product) => {
                      const productName = product.productId?.name || 'Product';
                      return (
                        <div key={product._id} className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="text-2xl font-bold text-emerald-600">
                              {productName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{productName}</h4>
                            <p className="text-sm text-gray-500">
                              Quantity: {product.quantity}
                            </p>
                            <p className="text-sm font-medium">
                              {currency}{(product.price * product.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-bold text-lg">{currency}{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;