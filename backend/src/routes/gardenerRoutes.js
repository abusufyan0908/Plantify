import express from 'express';
import { getGardenerProfile, updateGardenerProfile } from '../controllers/gardenerController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get gardener profile
router.get('/profile', authenticateToken, getGardenerProfile);

// Update gardener profile
router.put('/profile', authenticateToken, updateGardenerProfile);

export default router; 