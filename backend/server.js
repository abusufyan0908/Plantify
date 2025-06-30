import express from "express";
import cors from "cors";
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoutes.js";
import gardenerRouter from "./routes/gardenerRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import dashboardRouter from './routes/dashboardRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import { authenticateToken } from "./middleware/authMiddleware.js";
import Product from "./models/productModel.js";
import Gardener from "./models/gardenerModel.js";
import Order from "./models/orderModel.js";
import User from "./models/userModel.js";

// File path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();
const port = process.env.PORT || 5000;

// Connect to DB & Cloudinary
connectDB();
connectCloudinary();

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// CORS Configuration (Allow Frontend to Access API)
app.use(cors({
  origin: '*', // Change this to your frontend URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug Middleware (For Development Only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`🔥 ${req.method} ${req.url}`);
    console.log("Body:", req.body);
    next();
  });
}

// ✅ Register API Routes (Ensure Correct Paths)
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/users', userRouter);
app.use('/api/gardener', gardenerRouter);
app.use('/api/chat', chatRouter);
app.use('/api/dashboard', dashboardRouter);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Debug API: Check document counts & collections
app.get('/api/debug/counts', authenticateToken, async (req, res) => {
  try {
    const counts = {
      products: await Product.countDocuments({}),
      gardeners: await Gardener.countDocuments({}),
      orders: await Order.countDocuments({}),
      users: await User.countDocuments({})
    };

    res.json({
      success: true,
      counts,
      collections: Object.keys(mongoose.connection.collections)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ✅ Base API Route (For Testing)
app.get('/', (req, res) => {
  res.json({ message: "API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Cannot ${req.method} ${req.url}` 
  });
});

// ✅ Start Server
app.listen(port, () => console.log(`✅ Server is running on port ${port}`));
