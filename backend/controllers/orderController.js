import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress, paymentMethod, status } = req.body;
    
    // Debug logs
    console.log('Request body:', req.body);
    console.log('User data in request:', req.user);
    console.log('Creating order with userId:', req.user?._id);

    // Validate user data
    if (!req.user || !req.user._id) {
      console.error('Missing user data:', req.user);
      return res.status(400).json({
        success: false,
        message: "User data not found in request",
        error: "Authentication data missing"
      });
    }

    // Validate required fields
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid products data",
        error: "Products array is required and must not be empty"
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount",
        error: "Total amount must be greater than 0"
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
        error: "Missing shipping address"
      });
    }

    // Create order object with explicit type conversion for userId
    const orderData = {
      userId: req.user._id.toString(), // Ensure it's a string
      products: products.map(item => ({
        productId: item.productId.toString(), // Ensure product IDs are strings
        quantity: Number(item.quantity),
        price: Number(item.price)
      })),
      totalAmount: Number(totalAmount),
      shippingAddress,
      paymentMethod,
      status: status || 'pending'
    };

    console.log('Creating order with data:', orderData);

    // Create and save the order
    const order = new Order(orderData);
    const savedOrder = await order.save();

    console.log('Order saved successfully:', savedOrder);

    // Update product quantities
    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { countInStock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      order: savedOrder,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    // Send more detailed error information
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : undefined
    });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    console.log('Fetching orders for user:', req.user._id);
    
    const orders = await Order.find({ userId: req.user._id })
      .populate({
        path: 'products.productId',
        model: 'Product',
        select: 'name image price' // Select only the fields we need
      })
      .sort({ createdAt: -1 });

    console.log('Found orders:', orders);

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order",
      error: error.message
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel completed order"
      });
    }

    // Restore product quantities
    for (const item of order.products) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { countInStock: item.quantity } }
      );
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: error.message
    });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only."
      });
    }

    const orders = await Order.find()
      .populate({
        path: 'products.productId',
        model: 'Product',
        select: 'name images price'
      })
      .populate({
        path: 'userId',
        model: 'User',
        select: 'username email'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};
