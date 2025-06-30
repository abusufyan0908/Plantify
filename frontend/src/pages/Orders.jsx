import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../Context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Title from '../components/Title';

const OrderTimer = ({ createdAt, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const orderTime = new Date(createdAt).getTime();
    const cancelWindow = 15 * 60 * 1000; // 15 minutes in milliseconds
    const expiryTime = orderTime + cancelWindow;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = expiryTime - now;
      
      if (difference <= 0) {
        setIsExpired(true);
        onTimeUp();
        return 0;
      }
      
      return Math.floor(difference / 1000);
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt, onTimeUp]);

  if (isExpired) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-sm text-gray-600">
      Cancel window: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currency } = useContext(ShopContext);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view orders');
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Process orders to add canCancel property
        const processedOrders = response.data.orders.map(order => {
          const orderTime = new Date(order.createdAt).getTime();
          const now = new Date().getTime();
          const timeDifference = now - orderTime;
          const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
          
          // Can cancel if order is less than 15 minutes old and not cancelled or delivered
          const canCancel = timeDifference < fifteenMinutes && 
                          order.status !== 'cancelled' && 
                          order.status !== 'delivered' &&
                          order.status !== 'completed';
          
          return { ...order, canCancel };
        });
        
        setOrders(processedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrders(); // Refresh orders list
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleTimerExpired = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId
          ? { ...order, canCancel: false }
          : order
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] border-t pt-14">
        <div className="text-2xl mb-8">
          <Title text1={'YOUR '} text2={'ORDERS'} />
        </div>
        <div className="max-w-4xl mx-auto">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-sm p-6 mb-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] border-t pt-14">
      <div className="text-2xl mb-8">
        <Title text1={'YOUR '} text2={'ORDERS'} />
      </div>
      <div className="max-w-4xl mx-auto">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order #{order._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <OrderTimer
                    createdAt={order.createdAt}
                    onTimeUp={() => handleTimerExpired(order._id)}
                  />
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-900">
                    {currency} {order.totalAmount}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Items</h4>
                <div className="space-y-2">
                  {order.products.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-900">
                        {currency} {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.state} {order.shippingAddress.zip},{' '}
                  {order.shippingAddress.country}
                </p>
              </div>

              {order.status !== 'cancelled' && order.status !== 'completed' && order.status !== 'delivered' && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={!order.canCancel}
                    className={`px-4 py-2 rounded ${
                      order.canCancel
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {order.canCancel 
                      ? 'Cancel Order'
                      : '15-Minute Cancel Window Expired'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
