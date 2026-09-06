const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

router.get('/accommodations', catalogController.getAccommodations);
router.get('/transportation', catalogController.getTransportation);

module.exports = router;
