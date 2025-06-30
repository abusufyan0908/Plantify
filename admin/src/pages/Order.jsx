import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaBox, FaTruck, FaCheckCircle, FaUser, FaMapMarkerAlt, FaShoppingBag, FaPhone, FaEnvelope } from 'react-icons/fa';

const Order = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-amber-500', icon: FaClock },
    { value: 'processing', label: 'Processing', color: 'bg-blue-600', icon: FaBox },
    { value: 'packed', label: 'Packed', color: 'bg-indigo-600', icon: FaBox },
    { value: 'shipped', label: 'Shipped', color: 'bg-purple-600', icon: FaTruck },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-600', icon: FaCheckCircle },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-600', icon: FaBox }
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to access admin panel');
        navigate('/login');
        return;
      }

      console.log('Fetching orders with token:', token.substring(0, 10) + '...');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/all`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Orders API Response:', response.data);

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      
      // Handle specific error cases
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        
        if (error.response.status === 401) {
          toast.error('Session expired. Please login again');
          navigate('/login');
          return;
        }
        
        toast.error(error.response.data.message || 'Failed to fetch orders');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        toast.error('No response from server. Please check your connection');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        toast.error('Error setting up request. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders(); // Refresh orders list
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <div className="text-sm text-gray-600">
            Total Orders: <span className="font-semibold text-emerald-600">{orders.length}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              {/* Order Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Order #{order._id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full 
                    ${orderStatuses.find(s => s.value === order.status)?.color || 'bg-gray-500'} text-white`}>
                    {(() => {
                      const status = orderStatuses.find(s => s.value === order.status);
                      const Icon = status?.icon;
                      return (
                        <>
                          {Icon && <Icon className="mr-1.5 h-3.5 w-3.5" />}
                          {order.status}
                        </>
                      );
                    })()}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center mb-2">
                  <FaUser className="text-gray-400 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700">Customer Details</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{order.shippingAddress?.fullName}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaEnvelope className="mr-2" />
                    {order.shippingAddress?.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaPhone className="mr-2" />
                    {order.shippingAddress?.phoneNo}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center mb-2">
                  <FaMapMarkerAlt className="text-gray-400 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700">Shipping Address</h4>
                </div>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
                </p>
              </div>

              {/* Order Items */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center mb-3">
                  <FaShoppingBag className="text-gray-400 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700">Order Items</h4>
                </div>
                <div className="space-y-3">
                  {order.products?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <img 
                        src={item.productId?.images?.[0] || 'https://via.placeholder.com/50x50?text=No+Image'} 
                        alt={item.productId?.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.productId?.name}</p>
                        <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-xs text-gray-600">Rs {item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status Stepper */}
              <div className="p-4 border-b border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Order Status</h4>
                <div className="flex flex-col gap-4">
                  {orderStatuses
                    .filter(status => status.value !== 'cancelled')
                    .map((status, idx) => {
                      const isActive = order.status === status.value;
                      const isCompleted =
                        orderStatuses.findIndex(s => s.value === order.status) > idx;
                      return (
                        <div key={status.value} className="flex items-center gap-3">
                          <div
                            className={`
                              w-5 h-5 flex items-center justify-center
                              ${isActive ? status.color : isCompleted ? 'bg-emerald-400' : 'bg-gray-200'}
                              rounded-full text-white text-xs font-bold
                            `}
                          >
                            <status.icon className="w-3 h-3" />
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              isActive
                                ? 'text-emerald-700'
                                : isCompleted
                                ? 'text-gray-500 line-through'
                                : 'text-gray-400'
                            }`}
                          >
                            {status.label}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600">Total Amount</span>
                  <span className="text-lg font-semibold text-gray-900">Rs {order.totalAmount?.toFixed(2)}</span>
                </div>
                {/* Add heading for status update */}
                <div className="mb-2">
                  <span className="text-sm font-semibold text-gray-700">Update Order Status</span>
                  <p className="text-xs text-gray-500">Select a status below to update this order.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {orderStatuses.map((status) => (
                    order.status !== status.value && status.value !== 'cancelled' && (
                      <button
                        key={status.value}
                        onClick={() => handleStatusUpdate(order._id, status.value)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium text-white
                          ${status.color} hover:opacity-90 transition-all duration-200
                          flex items-center gap-1.5 shadow-sm`}
                      >
                        <status.icon className="h-3.5 w-3.5" />
                        {status.label}
                      </button>
                    )
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
