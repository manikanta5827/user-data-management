const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const backupController = require('../controllers/backupController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Upload CSV and store users - use upload middleware
router.post('/upload', uploadMiddleware, userController.createUsers);
router.get('/users', userController.getUsers);

// Backup routes
router.get('/backup', backupController.downloadBackup);
router.post('/restore', backupController.restoreBackup);

module.exports = router; 