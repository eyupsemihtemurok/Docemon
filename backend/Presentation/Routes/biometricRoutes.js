const express = require('express');
const multer = require('multer');
const BiometricController = require('../Controllers/BiometricController');
const authMiddleware = require('../Middlewares/AuthMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public - Kayıt anında
router.post('/register', upload.single('image'), BiometricController.register);

// Protected - Saha görevlisi veya Operatör
router.post('/rescue-photo', authMiddleware, upload.single('image'), BiometricController.rescuePhoto);
router.post('/operator-approve', authMiddleware, BiometricController.operatorApprove);
router.get('/alerts', authMiddleware, BiometricController.getAlerts);

module.exports = router;
