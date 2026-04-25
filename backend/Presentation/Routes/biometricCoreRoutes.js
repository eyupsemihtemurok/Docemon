const express = require('express');
const BiometricController = require('../Controllers/BiometricController');

const router = express.Router();

router.post('/register', BiometricController.uploadImage(), BiometricController.register);
router.post('/rescue-photo', BiometricController.uploadImage(), BiometricController.rescuePhoto);
router.post('/operator-approve', BiometricController.operatorApprove);
router.get('/alerts', BiometricController.getAlerts);
router.get('/pending-verifications', BiometricController.getPendingVerifications);

module.exports = router;
