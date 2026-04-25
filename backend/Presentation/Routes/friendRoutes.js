const express = require('express');
const FriendController = require('../Controllers/FriendController');
const authMiddleware = require('../Middlewares/AuthMiddleware');

const router = express.Router();

// Tüm arkadaşlık rotaları kimlik doğrulaması gerektirir
router.use(authMiddleware);

router.get('/', FriendController.getFriends);
router.post('/request', FriendController.sendRequest);
router.post('/respond', FriendController.respondRequest);
router.get('/emergency-contacts', FriendController.getEmergencyContacts);
router.put('/emergency-contacts', FriendController.toggleEmergency);

module.exports = router;
