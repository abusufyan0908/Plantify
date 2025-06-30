import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import Title from '../components/Title';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaShippingFast, FaCheckCircle, FaTruck, FaTimesCircle } from 'react-icons/fa';
import { BsHourglassSplit } from 'react-icons/bs';

const Order = () => {
  const { currency } = useContext(ShopContext);
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

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view orders');
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to cancel order');
        navigate('/login');
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrders();
      } else {
        toast.error(response.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-8'>
        <Title text1={'YOUR '} text2={'ORDERS'} />
      </div>
      <div className="max-w-6xl mx-auto px-4">
        {/* Order Tabs */}
        <div className="flex space-x-4 mb-8 border-b pb-4">
          {['all', ...orderStatuses.map(status => status.value)].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 text-sm font-medium capitalize ${
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
          <div className="space-y-8">
            {filterOrders(activeTab).map((order) => (
              <div key={order._id} className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-xl">
                {/* Order Header */}
                <div className="flex flex-wrap justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Order #{order._id.slice(-6)}</h3>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600">{currency}{order.totalAmount.toFixed(2)}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {orderStatuses.find(s => s.value === order.status)?.label}
                    </span>
                  </div>
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

                {/* Order Items */}
                <div className="space-y-4">
                  {order.products.map((item) => (
                    <div key={item._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.productId?.images?.[0] || 'https://via.placeholder.com/150x150?text=No+Image'}
                        alt={item.productId?.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.productId?.name || 'Product Not Found'}
                        </h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium text-emerald-600">
                          {currency}{item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">
                        {currency}{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.address}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}<br />
                    Phone: {order.shippingAddress.phoneNo}
                  </p>
                </div>

                {/* Cancel Button */}
                {order.status === 'pending' && (
                  <div className="mt-6">
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
