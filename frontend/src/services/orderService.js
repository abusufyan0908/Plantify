import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const orderService = {
  createOrder: async (orderData, token) => {
    try {
      // Log the request details
      console.log('Creating order with URL:', `${API_URL}/api/orders`);
      console.log('Order data:', orderData);

      // Transform the order data to match backend expectations
      const transformedOrderData = {
        products: orderData.orderItems.map(item => ({
          productId: item.product,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: orderData.totalAmount,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        status: orderData.orderStatus
      };

      const response = await axios.post(`${API_URL}/api/orders`, transformedOrderData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Log successful response
      console.log('Server response:', response.data);

      return {
        success: true,
        data: response.data,
        message: 'Order created successfully'
      };
    } catch (error) {
      // Enhanced error logging
      const errorDetails = {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      };
      console.error('Order service error details:', errorDetails);
      
      // Return detailed error information
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Failed to create order',
        error: error.response?.data?.error || error.message
      };
    }
  },

  getOrders: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch orders'
      };
    }
  }
}; 