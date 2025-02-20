const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const backupController = require('../controllers/backupController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// Upload CSV and store users - use upload middleware
router.post('/upload', authMiddleware, uploadMiddleware, userController.createUsers);
router.get('/users', authMiddleware, userController.getUsers);

// Backup routes
router.get('/backup', authMiddleware, backupController.downloadBackup);
router.post('/restore', authMiddleware, backupController.restoreBackup);

module.exports = router; 