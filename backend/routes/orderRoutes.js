import express from 'express';
import { createOrder, getUserOrders, updateOrderStatus, cancelOrder, getAllOrders } from '../controllers/orderController.js';
import { authenticateToken, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes - require authentication
router.use(authenticateToken);

// Create new order
router.post('/', createOrder);

// Get user's orders
router.get('/my-orders', getUserOrders);

// Get all orders (admin only)
router.get('/all', admin, getAllOrders);

// Update order status
router.put('/:orderId/status', updateOrderStatus);

// Cancel order
router.put('/:orderId/cancel', cancelOrder);

export default router;
