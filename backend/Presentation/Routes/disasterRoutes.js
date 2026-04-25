const express = require('express');
const DisasterController = require('../Controllers/DisasterController');
const authorize = require('../Middlewares/RoleMiddleware');
const Roles = require('../../Domain/Enums/Roles');
// Assume an authMiddleware exists to populate req.user from JWT
const auth = require('../Middlewares/AuthMiddleware'); 

const router = express.Router();

// Only ADMIN or DISASTER_MANAGER can create a disaster
router.post('/', 
    auth, 
    authorize([Roles.ADMIN, Roles.DISASTER_MANAGER]), 
    DisasterController.create
);

// Anyone logged in can see active disasters
router.get('/active', auth, DisasterController.getActive);

module.exports = router;
