const { verifyToken } = require('../services/auth');
require('dotenv').config();
let middlewareStatus = process.env.AUTH_MIDDLEWARE;
middlewareStatus = JSON.parse(middlewareStatus);
const authMiddleware = async (req, res, next) => {
    if (middlewareStatus) {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    error: 'No token provided'
                });
            }

            const token = authHeader.split(' ')[1];
            // console.log(token);
            const decoded = verifyToken(token);

            // Add user info to request
            req.user = decoded;

            // Only allow ADMIN role
            if (decoded.role !== 'ADMIN') {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied: Admin only'
                });
            }

            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }
    }
    else {
        next()
    }
};

module.exports = authMiddleware;