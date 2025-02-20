const express = require('express');
const router = express.Router();
const sequelize = require('../config/dbConfig');

// Root route
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to User Management API',
        version: '3.1.0'
    });
});

// Health check route
router.get('/health', async (req, res) => {
    try {
        // Check database connection
        await sequelize.authenticate();


        res.json({
            success: true,
            message: 'Service is healthy',
            timestamp: new Date().toISOString(),
            checks: {
                database: 'connected',
                server: 'running'
            }
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            message: 'Service is unhealthy',
            timestamp: new Date().toISOString(),
            checks: {
                database: 'disconnected',
                server: 'running'
            },
            error: error.message
        });
    }
});

module.exports = router; 