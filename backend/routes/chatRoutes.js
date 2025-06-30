import express from 'express';
import {
  getOrCreateChat,
  sendMessage,
  getMessages,
  markAsRead,
  getUserChats
} from '../controllers/chatController.js';

const router = express.Router();

// Chat routes
router.post('/', getOrCreateChat);
router.post('/:chatId/message', sendMessage);
router.get('/:chatId/messages', getMessages);
router.patch('/:chatId/read', markAsRead);
router.get('/user/:userId', getUserChats);

export default router; 