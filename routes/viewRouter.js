const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(authController.isLoggedIn, viewController.getIndex);
router.route('/signup').get(viewController.getSignupForm);
router.route('/login').get(viewController.getLoginForm);
router.route('/me').get(authController.protect, viewController.getAccount);

module.exports = router;
