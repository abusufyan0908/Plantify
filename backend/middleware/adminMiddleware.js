import adminAuth from './adminAuth.js';

export const isAdmin = (req, res, next) => {
    // First run the adminAuth middleware
    adminAuth(req, res, () => {
        // Check if the user is an admin
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
        }
    });
}; 