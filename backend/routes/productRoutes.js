import express from 'express';
import { addProduct, listProduct, removeProduct, singleProduct, updateProduct } from '../controllers/productController.js';
import upload from '../middleware/upload.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// ✅ Add Product - Multiple image upload
router.post('/add', adminAuth, upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), addProduct);

// ✅ List All Products
router.get('/', listProduct);

// ✅ Remove Product by ID
router.delete('/remove/:id', adminAuth, removeProduct);

// ✅ Get Single Product by ID - Removed adminAuth to make it public
router.get('/single/:id', singleProduct);

// ✅ Update Product by ID
router.put('/update/:id', adminAuth, upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 }
]), updateProduct);

export default router;
