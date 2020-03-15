const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(authController.isLoggedIn, viewController.getViews);
router.route('/login').get(viewController.getLoginForm);

module.exports = router;
