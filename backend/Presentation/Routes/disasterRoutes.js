const express = require('express');
const DisasterController = require('../Controllers/DisasterController');
const authorize = require('../Middlewares/RoleMiddleware');
const Roles = require('../../Domain/Enums/Roles');
const auth = require('../Middlewares/AuthMiddleware');

const router = express.Router();

// Only ADMIN or DISASTER_MANAGER can create a disaster
router.post('/',
    auth,
    authorize([Roles.ADMIN, Roles.DISASTER_MANAGER]),
    DisasterController.create
);

// Public: anyone can see active disasters (no auth required for map display)
router.get('/active', DisasterController.getActive);

module.exports = router;
