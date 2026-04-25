const express = require('express');
const GeographyController = require('../Controllers/GeographyController');

const router = express.Router();

router.get('/provinces', GeographyController.getProvinces);
router.get('/provinces/:id/districts', GeographyController.getDistricts);

module.exports = router;
