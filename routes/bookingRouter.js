const express = require('express');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.route('/checkout/:tourId').get(bookingController.checkoutSession);

module.exports = router;
