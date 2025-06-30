import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  addGardener, 
  listGardeners, 
  getGardener, 
  updateGardener, 
  updateAvailability,
  addChat,
  getGardenerProfile,
  updateGardenerProfile,
  getGardenerChats,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
  deleteGardener
} from '../controllers/gardenerController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Gardener profile routes
router.get('/profile', protect, getGardenerProfile);
router.put('/profile', protect, upload.fields([
  { name: 'faceImage', maxCount: 1 },
  { name: 'workImages', maxCount: 5 }
]), updateGardenerProfile);

router.get('/', listGardeners);
router.get('/:id', getGardener);
router.put('/:id', upload.fields([
  { name: 'faceImage', maxCount: 1 },
  { name: 'workImages', maxCount: 5 }
]), updateGardener);
router.delete('/:id', protect, isAdmin, deleteGardener);

// New routes for chat and availability
router.patch('/:id/availability', updateAvailability);
router.post('/:id/chat', addChat);

// Chat routes
router.get('/chats', protect, getGardenerChats);
router.get('/chats/:chatId', protect, getChatMessages);
router.post('/chats/:chatId/messages', protect, sendMessage);
router.put('/chats/:chatId/read', protect, markMessagesAsRead);

router.post('/create', protect, upload.fields([
  { name: 'faceImage', maxCount: 1 },
  { name: 'workImages', maxCount: 5 }
]), addGardener);

export default router;
