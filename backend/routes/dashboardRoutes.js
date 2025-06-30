import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import Product from '../models/productModel.js';
import Gardener from '../models/gardenerModel.js';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

const router = express.Router();

// Test Route
router.get('/test', (req, res) => {
  res.json({ message: 'Dashboard route is working' });
});

// Fetch Dashboard Stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [products, gardeners, orders, users] = await Promise.all([
      Product.countDocuments({}),
      Gardener.countDocuments({}),
      Order.countDocuments({}),
      User.countDocuments({})
    ]);

    res.json({
      success: true,
      products,
      gardeners,
      orders,
      users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard statistics',
      error: error.message 
    });
  }
});

export default router;
