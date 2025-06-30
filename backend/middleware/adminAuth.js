import jwt from 'jsonwebtoken';

const adminAuth= (req, res, next) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'Authorization token is required' });
        }

        // Check if the token follows the format "Bearer <token>"
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Malformed token' });
        }

        // Verify the token
        const secretKey = process.env.JWT_SECRET || 'your-secret-key'; // Use your actual secret
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: 'Invalid or expired token' });
            }

            // Attach user data to the request object
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ success: false, message: 'Authentication failed' });
    }
};

export default adminAuth;
