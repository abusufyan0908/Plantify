import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  registerUser,
  loginUser,
  adminLogin,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  verifyToken
} from '../controllers/userController.js';

const userRouter = express.Router();

// Debug middleware for this router
userRouter.use((req, res, next) => {
  console.log(`[User Route] ${req.method} ${req.url}`);
  next();
});

// Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin/login', adminLogin);

// Protected routes
userRouter.get('/verify', protect, verifyToken);

// Admin protected routes
userRouter.get('/', protect, admin, getAllUsers);
userRouter.get('/:id', protect, admin, getUser);
userRouter.put('/:id', protect, admin, updateUser);
userRouter.delete('/:id', protect, admin, deleteUser);

export default userRouter;
