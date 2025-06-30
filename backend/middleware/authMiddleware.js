import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted token:', token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token not found'
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      console.log('Decoded token data:', decoded);

      // Verify that the user exists in the database
      try {
        const user = await User.findById(decoded.userId);
        if (!user) {
          console.error('User not found for ID:', decoded.userId);
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        // Set both the decoded object and ensure _id is set for mongoose
        req.user = {
          ...decoded,
          _id: user._id // Use the actual MongoDB _id
        };
        
        console.log('Final req.user object:', req.user);
        next();
      } catch (error) {
        console.error('Error finding user:', error);
        return res.status(500).json({
          success: false,
          message: 'Error verifying user'
        });
      }
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

export const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Not authorized as admin'
      });
    }
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking admin status'
    });
  }
};

export const protect = authenticateToken;